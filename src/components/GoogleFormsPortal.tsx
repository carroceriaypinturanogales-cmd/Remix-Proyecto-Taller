import { useState, useEffect } from 'react';
import {
  FileText,
  PlusCircle,
  ExternalLink,
  CheckCircle2,
  RefreshCw,
  LogOut,
  ClipboardList,
  Sparkles,
  Car,
  AlertCircle,
  ChevronRight,
  Eye,
  X,
  Share2,
} from 'lucide-react';
import { User } from 'firebase/auth';
import {
  initFormsAuth,
  googleFormsSignIn,
  formsSignOut,
  listGoogleForms,
  getGoogleForm,
  getGoogleFormResponses,
  createWorkshopForm,
  GoogleFormMetadata,
  GoogleFormResponse,
} from '../lib/googleFormsService';

interface GoogleFormsPortalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function GoogleFormsPortal({ isOpen, onClose }: GoogleFormsPortalProps) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [authChecking, setAuthChecking] = useState(true);
  const [formsList, setFormsList] = useState<{ id: string; name: string; modifiedTime?: string }[]>([]);
  const [selectedForm, setSelectedForm] = useState<GoogleFormMetadata | null>(null);
  const [responses, setResponses] = useState<GoogleFormResponse[]>([]);
  const [loadingResponses, setLoadingResponses] = useState(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [confirmDialog, setConfirmDialog] = useState<{
    title: string;
    description: string;
    action: () => Promise<void>;
  } | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  useEffect(() => {
    const unsubscribe = initFormsAuth(
      (currentUser, accessToken) => {
        setUser(currentUser);
        setToken(accessToken);
        setAuthChecking(false);
        loadUserForms(accessToken);
      },
      () => {
        setUser(null);
        setToken(null);
        setAuthChecking(false);
      }
    );
    return () => unsubscribe();
  }, []);

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 4500);
  };

  const handleSignIn = async () => {
    setLoading(true);
    try {
      const result = await googleFormsSignIn();
      if (result) {
        setUser(result.user);
        setToken(result.accessToken);
        showNotification('success', `Sesión iniciada como ${result.user.email}`);
        await loadUserForms(result.accessToken);
      }
    } catch (err: any) {
      showNotification('error', err?.message || 'Error al conectar con Google Forms');
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    await formsSignOut();
    setUser(null);
    setToken(null);
    setFormsList([]);
    setSelectedForm(null);
    setResponses([]);
    showNotification('success', 'Sesión cerrada exitosamente');
  };

  const loadUserForms = async (accessToken: string) => {
    setLoading(true);
    try {
      const forms = await listGoogleForms(accessToken);
      setFormsList(forms);
    } catch (err: any) {
      console.error(err);
      showNotification('error', 'No se pudieron cargar los formularios de Google Drive');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectForm = async (formId: string) => {
    if (!token) return;
    setLoadingResponses(true);
    try {
      const meta = await getGoogleForm(formId, token);
      setSelectedForm(meta);
      const resps = await getGoogleFormResponses(formId, token);
      setResponses(resps);
    } catch (err: any) {
      showNotification('error', 'Error al leer detalles o respuestas del formulario');
    } finally {
      setLoadingResponses(false);
    }
  };

  const triggerCreateForm = (type: 'inspeccion' | 'satisfaccion') => {
    const isInspection = type === 'inspeccion';
    setConfirmDialog({
      title: isInspection
        ? '¿Crear Formulario de Inspección de Entrada?'
        : '¿Crear Formulario de Encuesta de Satisfacción?',
      description: isInspection
        ? 'Se creará un nuevo formulario oficial en tu Google Drive con preguntas de recepción: datos de cliente, vehículo, placas/VIN, nivel de combustible y checklist de daños.'
        : 'Se creará un nuevo formulario en tu Google Drive para evaluar el acabado de pintura, puntualidad y satisfacción del cliente.',
      action: async () => {
        if (!token) return;
        setLoading(true);
        try {
          const newForm = await createWorkshopForm(type, token);
          showNotification('success', `Formulario "${newForm.info.title}" creado con éxito en Google Drive`);
          await loadUserForms(token);
          setSelectedForm(newForm);
          setResponses([]);
        } catch (err: any) {
          showNotification('error', err?.message || 'Error al generar el formulario');
        } finally {
          setLoading(false);
          setConfirmDialog(null);
        }
      },
    });
  };

  const copyShareLink = (url?: string) => {
    if (!url) return;
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-5xl bg-[#0f1219] border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header Bar */}
        <div className="p-4 sm:p-6 border-b border-white/10 bg-[#141923] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                  Google Forms para Taller
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 text-[10px] font-semibold border border-purple-500/30">
                  Workspace API
                </span>
              </div>
              <p className="text-xs text-neutral-400">
                Inspecciones de recepción, checklists de daños y encuestas de entrega
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {user && (
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#1b212f] border border-white/10 text-xs text-neutral-300">
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                <span className="max-w-[160px] truncate">{user.email}</span>
                <button
                  onClick={handleSignOut}
                  title="Cerrar sesión"
                  className="ml-1 text-neutral-400 hover:text-rose-400 transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
            <button
              onClick={onClose}
              className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Notification Toast */}
        {notification && (
          <div
            className={`px-4 py-2.5 text-xs font-semibold flex items-center justify-between border-b ${
              notification.type === 'success'
                ? 'bg-emerald-950/80 text-emerald-200 border-emerald-800'
                : 'bg-rose-950/80 text-rose-200 border-rose-800'
            }`}
          >
            <div className="flex items-center gap-2">
              {notification.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              ) : (
                <AlertCircle className="w-4 h-4 text-rose-400" />
              )}
              <span>{notification.message}</span>
            </div>
            <button onClick={() => setNotification(null)} className="text-xs opacity-70 hover:opacity-100">
              ✕
            </button>
          </div>
        )}

        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          
          {/* If NOT Authenticated: Official Styled Google Sign In Button */}
          {!user && (
            <div className="py-12 px-4 text-center max-w-md mx-auto space-y-5">
              <div className="w-16 h-16 rounded-2xl bg-purple-500/10 border border-purple-500/20 mx-auto flex items-center justify-center text-purple-400">
                <FileText className="w-8 h-8" />
              </div>
              <div className="space-y-1.5">
                <h4 className="text-xl font-bold text-white">Conecta tu cuenta de Google Workspace</h4>
                <p className="text-xs text-neutral-400 leading-relaxed">
                  Permite crear automáticamente formularios de inspección de autos en tu Google Drive y consultar las respuestas en tiempo real.
                </p>
              </div>

              {/* Official Google Sign In Button Style */}
              <div className="pt-2 flex justify-center">
                <button
                  onClick={handleSignIn}
                  disabled={loading || authChecking}
                  className="inline-flex items-center gap-3 px-6 py-3 rounded-xl bg-white hover:bg-neutral-100 text-neutral-800 font-bold text-xs sm:text-sm shadow-md transition-all duration-200 hover:scale-[1.02] cursor-pointer disabled:opacity-50"
                >
                  <svg className="w-5 h-5" viewBox="0 0 48 48">
                    <path
                      fill="#EA4335"
                      d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
                    />
                    <path
                      fill="#4285F4"
                      d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
                    />
                    <path
                      fill="#34A853"
                      d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
                    />
                  </svg>
                  <span>{loading ? 'Conectando...' : 'Iniciar sesión con Google'}</span>
                </button>
              </div>
            </div>
          )}

          {/* Authenticated Dashboard */}
          {user && (
            <div className="space-y-6">
              
              {/* Actions Grid: Generate Pre-built Workshop Forms */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* 1. Checklist de Recepción */}
                <div className="p-4 sm:p-5 rounded-xl bg-[#141923] border border-white/10 hover:border-purple-500/40 transition-all space-y-3 relative overflow-hidden group">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                        <Car className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-bold text-white text-sm sm:text-base">
                          Hoja de Inspección y Recepción
                        </h4>
                        <span className="text-[10px] text-amber-400 font-semibold uppercase tracking-wider">
                          Para técnicos en taller
                        </span>
                      </div>
                    </div>
                  </div>
                  <p className="text-xs text-neutral-400 leading-relaxed">
                    Registra datos del auto, VIN, kilometraje, nivel de combustible y checklist de daños o pertenencias antes de ingresar a hojalatería o pintura.
                  </p>
                  <button
                    onClick={() => triggerCreateForm('inspeccion')}
                    disabled={loading}
                    className="w-full py-2.5 px-4 rounded-lg bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
                  >
                    <PlusCircle className="w-4 h-4" />
                    <span>Crear Formulario de Inspección en Google Drive</span>
                  </button>
                </div>

                {/* 2. Encuesta de Calidad */}
                <div className="p-4 sm:p-5 rounded-xl bg-[#141923] border border-white/10 hover:border-purple-500/40 transition-all space-y-3 relative overflow-hidden group">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
                        <Sparkles className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-bold text-white text-sm sm:text-base">
                          Encuesta de Calidad y Entrega
                        </h4>
                        <span className="text-[10px] text-purple-400 font-semibold uppercase tracking-wider">
                          Para clientes al entregar
                        </span>
                      </div>
                    </div>
                  </div>
                  <p className="text-xs text-neutral-400 leading-relaxed">
                    Recoge la opinión del cliente sobre el acabado de la pintura, el pulido, puntualidad y atención brindada en Nogales, Sonora.
                  </p>
                  <button
                    onClick={() => triggerCreateForm('satisfaccion')}
                    disabled={loading}
                    className="w-full py-2.5 px-4 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
                  >
                    <PlusCircle className="w-4 h-4" />
                    <span>Crear Encuesta de Calidad en Google Drive</span>
                  </button>
                </div>

              </div>

              {/* Existing Forms List & Responses Viewer */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                
                {/* Form List Sidebar (4 cols) */}
                <div className="lg:col-span-4 bg-[#141923] border border-white/10 rounded-xl p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs font-bold text-white">
                      <ClipboardList className="w-4 h-4 text-purple-400" />
                      <span>Formularios en tu Drive ({formsList.length})</span>
                    </div>
                    {token && (
                      <button
                        onClick={() => loadUserForms(token)}
                        className="text-neutral-400 hover:text-white transition-colors"
                        title="Actualizar lista"
                      >
                        <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
                      </button>
                    )}
                  </div>

                  {formsList.length === 0 ? (
                    <div className="py-8 text-center text-xs text-neutral-500">
                      No hay formularios detectados. Haz clic arriba para crear tu primer formulario de inspección.
                    </div>
                  ) : (
                    <div className="space-y-1.5 max-h-[380px] overflow-y-auto pr-1">
                      {formsList.map((form) => (
                        <button
                          key={form.id}
                          onClick={() => handleSelectForm(form.id)}
                          className={`w-full text-left p-3 rounded-lg border transition-all flex items-center justify-between text-xs cursor-pointer ${
                            selectedForm?.formId === form.id
                              ? 'bg-purple-950/40 border-purple-500/50 text-white font-semibold'
                              : 'bg-[#1a202c] border-white/5 text-neutral-300 hover:border-white/20'
                          }`}
                        >
                          <div className="truncate pr-2">
                            <div className="truncate">{form.name}</div>
                            {form.modifiedTime && (
                              <div className="text-[10px] text-neutral-500">
                                {new Date(form.modifiedTime).toLocaleDateString()}
                              </div>
                            )}
                          </div>
                          <ChevronRight className="w-4 h-4 shrink-0 text-neutral-500" />
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Form Inspector & Submissions (8 cols) */}
                <div className="lg:col-span-8 bg-[#141923] border border-white/10 rounded-xl p-4 sm:p-5 space-y-4">
                  {selectedForm ? (
                    <div className="space-y-4">
                      
                      {/* Form Details Banner */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl bg-[#1b2230] border border-white/10">
                        <div className="space-y-1">
                          <h4 className="text-base font-bold text-white leading-tight">
                            {selectedForm.info.title}
                          </h4>
                          <div className="text-xs text-neutral-400">
                            ID: <span className="font-mono text-neutral-300">{selectedForm.formId}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          {selectedForm.responderUri && (
                            <>
                              <button
                                onClick={() => copyShareLink(selectedForm.responderUri)}
                                className="px-3 py-1.5 rounded-lg bg-[#283247] hover:bg-[#34405c] text-neutral-200 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                              >
                                <Share2 className="w-3.5 h-3.5" />
                                <span>{copiedLink ? '¡Copiado!' : 'Compartir'}</span>
                              </button>
                              <a
                                href={selectedForm.responderUri}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-3.5 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center gap-1.5 transition-colors shadow-sm"
                              >
                                <span>Llenar Formulario</span>
                                <ExternalLink className="w-3.5 h-3.5" />
                              </a>
                            </>
                          )}
                        </div>
                      </div>

                      {/* Responses Section */}
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold uppercase tracking-wider text-neutral-300">
                              Respuestas Recibidas
                            </span>
                            <span className="px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 text-xs font-bold">
                              {responses.length}
                            </span>
                          </div>

                          {token && (
                            <button
                              onClick={() => handleSelectForm(selectedForm.formId)}
                              disabled={loadingResponses}
                              className="text-xs text-neutral-400 hover:text-white flex items-center gap-1 transition-colors"
                            >
                              <RefreshCw className={`w-3 h-3 ${loadingResponses ? 'animate-spin' : ''}`} />
                              <span>Actualizar respuestas</span>
                            </button>
                          )}
                        </div>

                        {loadingResponses ? (
                          <div className="py-12 text-center text-xs text-neutral-400">
                            Cargando respuestas de Google Forms...
                          </div>
                        ) : responses.length === 0 ? (
                          <div className="py-12 px-4 text-center rounded-xl bg-[#181e2b] border border-dashed border-white/10 space-y-2">
                            <div className="text-xs text-neutral-400">
                              Aún no hay respuestas enviadas para este formulario.
                            </div>
                            <div className="text-[11px] text-neutral-500">
                              Comparte el enlace con tus clientes o técnicos para que registren la inspección desde su celular.
                            </div>
                          </div>
                        ) : (
                          <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1">
                            {responses.map((resp, idx) => (
                              <div
                                key={resp.responseId || idx}
                                className="p-3.5 rounded-xl bg-[#181e2b] border border-white/5 space-y-2"
                              >
                                <div className="flex items-center justify-between text-[11px] text-neutral-400 pb-1.5 border-b border-white/5">
                                  <span className="font-semibold text-neutral-300">
                                    Respuesta #{responses.length - idx}
                                  </span>
                                  <span>{new Date(resp.lastSubmittedTime || resp.createTime).toLocaleString()}</span>
                                </div>

                                <div className="space-y-1.5 pt-1 text-xs">
                                  {resp.answers &&
                                    Object.entries(resp.answers).map(([qId, ans]) => {
                                      const matchingItem = selectedForm.items?.find(
                                        (i) => i.questionItem?.question.questionId === qId
                                      );
                                      const label = matchingItem?.title || `Pregunta (${qId.substring(0, 8)})`;
                                      const answerText =
                                        ans.textAnswers?.answers?.map((a) => a.value).join(', ') || 'Sin respuesta';

                                      return (
                                        <div key={qId} className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-2">
                                          <span className="text-neutral-400 shrink-0 font-medium sm:w-1/3 truncate">
                                            {label}:
                                          </span>
                                          <span className="text-white font-semibold flex-1">
                                            {answerText}
                                          </span>
                                        </div>
                                      );
                                    })}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                    </div>
                  ) : (
                    <div className="py-16 text-center text-xs text-neutral-400 space-y-2">
                      <Eye className="w-8 h-8 text-neutral-500 mx-auto" />
                      <p>Selecciona un formulario de la lista izquierda para ver sus detalles y respuestas.</p>
                    </div>
                  )}
                </div>

              </div>

            </div>
          )}

        </div>

        {/* Mandatory User Confirmation Dialog for Destructive or Mutating Actions */}
        {confirmDialog && (
          <div className="absolute inset-0 z-50 bg-black/85 flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-[#161c28] border border-white/15 rounded-2xl p-6 space-y-4 shadow-2xl">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
                <FileText className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h4 className="text-base font-bold text-white">{confirmDialog.title}</h4>
                <p className="text-xs text-neutral-300 leading-relaxed">{confirmDialog.description}</p>
              </div>
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  onClick={() => setConfirmDialog(null)}
                  className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-neutral-300 text-xs font-semibold transition-colors cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  onClick={confirmDialog.action}
                  className="px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition-all shadow-md cursor-pointer"
                >
                  Confirmar y Crear en Drive
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
