import {
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
  User,
} from 'firebase/auth';
import { auth } from './firebase';

export const FORMS_SCOPES = [
  'https://www.googleapis.com/auth/forms.body',
  'https://www.googleapis.com/auth/forms.body.readonly',
  'https://www.googleapis.com/auth/forms.responses.readonly',
  'https://www.googleapis.com/auth/drive.file',
  'https://www.googleapis.com/auth/drive.readonly',
];

const formsProvider = new GoogleAuthProvider();
FORMS_SCOPES.forEach((scope) => formsProvider.addScope(scope));

// In-memory access token cache (CRITICAL: never persist in localStorage/sessionStorage)
let cachedAccessToken: string | null = null;
let isSigningIn = false;

export const initFormsAuth = (
  onAuthSuccess?: (user: User, token: string) => void,
  onAuthFailure?: () => void
) => {
  return onAuthStateChanged(auth, async (user: User | null) => {
    if (user) {
      if (cachedAccessToken) {
        if (onAuthSuccess) onAuthSuccess(user, cachedAccessToken);
      } else if (!isSigningIn) {
        cachedAccessToken = null;
        if (onAuthFailure) onAuthFailure();
      }
    } else {
      cachedAccessToken = null;
      if (onAuthFailure) onAuthFailure();
    }
  });
};

export const googleFormsSignIn = async (): Promise<{
  user: User;
  accessToken: string;
} | null> => {
  try {
    isSigningIn = true;
    const result = await signInWithPopup(auth, formsProvider);
    const credential = GoogleAuthProvider.credentialFromResult(result);
    if (!credential?.accessToken) {
      throw new Error('No se obtuvo el token de acceso de Google');
    }
    cachedAccessToken = credential.accessToken;
    return { user: result.user, accessToken: cachedAccessToken };
  } catch (error) {
    console.error('Error al iniciar sesión con Google Forms:', error);
    throw error;
  } finally {
    isSigningIn = false;
  }
};

export const getFormsAccessToken = async (): Promise<string | null> => {
  return cachedAccessToken;
};

export const formsSignOut = async () => {
  await auth.signOut();
  cachedAccessToken = null;
};

// Interface definitions
export interface GoogleFormItem {
  itemId: string;
  title: string;
  description?: string;
  questionItem?: {
    question: {
      questionId: string;
      required?: boolean;
      textQuestion?: Record<string, unknown>;
      choiceQuestion?: {
        type: string;
        options: { value: string }[];
      };
      scaleQuestion?: {
        low: number;
        high: number;
        lowLabel?: string;
        highLabel?: string;
      };
    };
  };
}

export interface GoogleFormMetadata {
  formId: string;
  info: {
    title: string;
    documentTitle?: string;
    description?: string;
  };
  responderUri?: string;
  items?: GoogleFormItem[];
}

export interface GoogleFormResponse {
  responseId: string;
  createTime: string;
  lastSubmittedTime: string;
  answers?: Record<
    string,
    {
      questionId: string;
      textAnswers?: {
        answers: { value: string }[];
      };
    }
  >;
}

// 1. List user forms from Google Drive
export async function listGoogleForms(token: string): Promise<{ id: string; name: string; modifiedTime?: string }[]> {
  const query = encodeURIComponent("mimeType='application/vnd.google-apps.form' and trashed=false");
  const res = await fetch(
    `https://www.googleapis.com/drive/v3/files?q=${query}&fields=files(id,name,modifiedTime)&pageSize=20&orderBy=modifiedTime desc`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Error al listar formularios: ${res.status} ${errorText}`);
  }
  const data = await res.json();
  return data.files || [];
}

// 2. Get Form details by ID
export async function getGoogleForm(formId: string, token: string): Promise<GoogleFormMetadata> {
  const safeFormId = encodeURIComponent(formId.trim());
  const res = await fetch(`https://forms.googleapis.com/v1/forms/${safeFormId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Error al obtener formulario: ${res.status} ${errText}`);
  }
  return res.json();
}

// 3. Get Form Responses
export async function getGoogleFormResponses(
  formId: string,
  token: string
): Promise<GoogleFormResponse[]> {
  const safeFormId = encodeURIComponent(formId.trim());
  const res = await fetch(`https://forms.googleapis.com/v1/forms/${safeFormId}/responses`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Error al leer respuestas: ${res.status} ${errText}`);
  }
  const data = await res.json();
  return data.responses || [];
}

// 4. Create a Workshop Form (e.g. Check-in inspection or Satisfaction Survey)
export async function createWorkshopForm(
  formType: 'inspeccion' | 'satisfaccion',
  token: string
): Promise<GoogleFormMetadata> {
  const title =
    formType === 'inspeccion'
      ? 'Inspección de Recepción y Hoja de Inventario - Carrocería y Pintura Nogales'
      : 'Encuesta de Calidad y Entrega - Carrocería y Pintura Nogales';

  const docTitle =
    formType === 'inspeccion'
      ? 'Checklist Recepción Taller Nogales'
      : 'Control Calidad Entrega Nogales';

  // Step 1: Create empty form
  const createRes = await fetch('https://forms.googleapis.com/v1/forms', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      info: {
        title,
        documentTitle: docTitle,
      },
    }),
  });

  if (!createRes.ok) {
    const errText = await createRes.text();
    throw new Error(`Error creando formulario: ${createRes.status} ${errText}`);
  }

  const newForm: GoogleFormMetadata = await createRes.json();
  const safeFormId = encodeURIComponent(newForm.formId);

  // Step 2: Batch update with workshop specific questions
  const items =
    formType === 'inspeccion'
      ? [
          {
            title: 'Nombre Completo del Propietario / Cliente',
            required: true,
            type: 'text',
          },
          {
            title: 'Teléfono o WhatsApp de Contacto',
            required: true,
            type: 'text',
          },
          {
            title: 'Vehículo (Marca, Modelo, Año y Color)',
            required: true,
            type: 'text',
          },
          {
            title: 'Placas o Número de Serie (VIN)',
            required: false,
            type: 'text',
          },
          {
            title: 'Kilometraje al Ingresar',
            required: false,
            type: 'text',
          },
          {
            title: 'Nivel de Combustible al Recibir',
            required: true,
            type: 'choice',
            options: ['1/4 Tanque', '1/2 Tanque', '3/4 Tanque', 'Tanque Lleno', 'Reserva'],
          },
          {
            title: 'Pertenencias u Objetos Dejados en el Auto',
            required: false,
            type: 'text',
          },
          {
            title: 'Detalle de Golpes o Daños Previos al Ingreso',
            required: true,
            type: 'text',
          },
          {
            title: 'Servicio Solicitado en Taller',
            required: true,
            type: 'choice',
            options: [
              'Hojalatería y Enderezado',
              'Pintura General en Horno',
              'Pintura de Piezas Específicas',
              'Detallado Cerámico Genesis',
              'Pulido y Abrillantado',
            ],
          },
        ]
      : [
          {
            title: 'Nombre del Cliente',
            required: true,
            type: 'text',
          },
          {
            title: 'Vehículo Reparado / Detallado',
            required: true,
            type: 'text',
          },
          {
            title: '¿Cómo califica el acabado de pintura o detallado?',
            required: true,
            type: 'choice',
            options: ['Excelente (10/10)', 'Muy Bueno', 'Bueno', 'Regular', 'Requiere Ajuste'],
          },
          {
            title: 'Puntualidad en el tiempo de entrega acordado',
            required: true,
            type: 'choice',
            options: ['A tiempo', 'Antes de lo esperado', 'Con ligero retraso acordado'],
          },
          {
            title: 'Atención y trato del personal en Los Encinos, Nogales',
            required: true,
            type: 'choice',
            options: ['Excelente trato', 'Buen trato', 'Aceptable'],
          },
          {
            title: 'Comentarios o Sugerencias para el Taller',
            required: false,
            type: 'text',
          },
        ];

  const requests = items.map((item, idx) => {
    if (item.type === 'choice' && item.options) {
      return {
        createItem: {
          item: {
            title: item.title,
            questionItem: {
              question: {
                required: item.required,
                choiceQuestion: {
                  type: 'RADIO',
                  options: item.options.map((opt) => ({ value: opt })),
                },
              },
            },
          },
          location: { index: idx },
        },
      };
    } else {
      return {
        createItem: {
          item: {
            title: item.title,
            questionItem: {
              question: {
                required: item.required,
                textQuestion: {},
              },
            },
          },
          location: { index: idx },
        },
      };
    }
  });

  const batchRes = await fetch(
    `https://forms.googleapis.com/v1/forms/${safeFormId}:batchUpdate`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ requests }),
    }
  );

  if (!batchRes.ok) {
    console.warn('Formulario creado pero ocurrió error al agregar preguntas iniciales.');
  }

  return getGoogleForm(newForm.formId, token);
}
