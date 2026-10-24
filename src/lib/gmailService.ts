import { GoogleAuthProvider, signInWithPopup, User } from 'firebase/auth';
import { auth } from './firebase';

export const GMAIL_SCOPES = [
  'https://www.googleapis.com/auth/gmail.readonly',
  'https://www.googleapis.com/auth/gmail.send',
  'https://www.googleapis.com/auth/gmail.compose',
  'https://www.googleapis.com/auth/gmail.modify',
  'https://www.googleapis.com/auth/forms.body',
  'https://www.googleapis.com/auth/forms.body.readonly',
  'https://www.googleapis.com/auth/forms.responses.readonly',
  'https://www.googleapis.com/auth/drive.file',
  'https://www.googleapis.com/auth/drive.readonly',
];

const gmailProvider = new GoogleAuthProvider();
GMAIL_SCOPES.forEach((scope) => gmailProvider.addScope(scope));

// In-memory token cache (never stored in localStorage/sessionStorage)
let cachedGmailToken: string | null = null;
let isSigningIn = false;

export async function signInWithGoogleWorkspace(): Promise<{ user: User; accessToken: string }> {
  isSigningIn = true;
  try {
    const result = await signInWithPopup(auth, gmailProvider);
    const credential = GoogleAuthProvider.credentialFromResult(result);
    if (!credential?.accessToken) {
      throw new Error('No se pudo obtener el token de acceso de Google');
    }
    cachedGmailToken = credential.accessToken;
    return { user: result.user, accessToken: cachedGmailToken };
  } finally {
    isSigningIn = false;
  }
}

export function getCachedWorkspaceToken(): string | null {
  return cachedGmailToken;
}

export interface GmailMessageSummary {
  id: string;
  threadId: string;
  subject: string;
  from: string;
  to: string;
  date: string;
  snippet: string;
}

// 1. List workshop messages (e.g. from customers or contact requests)
export async function listGmailMessages(token: string, maxResults = 15): Promise<GmailMessageSummary[]> {
  const res = await fetch(
    `https://gmail.googleapis.com/gmail/v1/users/me/messages?maxResults=${maxResults}&q=`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Error al listar correos: ${res.status} ${errText}`);
  }
  const data = await res.json();
  const messages = data.messages || [];

  // Fetch summary headers for top messages
  const summaries: GmailMessageSummary[] = [];
  for (const m of messages.slice(0, 10)) {
    try {
      const detailRes = await fetch(
        `https://gmail.googleapis.com/gmail/v1/users/me/messages/${encodeURIComponent(m.id)}?format=metadata&metadataHeaders=Subject&metadataHeaders=From&metadataHeaders=To&metadataHeaders=Date`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (detailRes.ok) {
        const detail = await detailRes.json();
        const headers: Record<string, string> = {};
        detail.payload?.headers?.forEach((h: { name: string; value: string }) => {
          headers[h.name.toLowerCase()] = h.value;
        });

        summaries.push({
          id: detail.id,
          threadId: detail.threadId,
          snippet: detail.snippet || '',
          subject: headers['subject'] || '(Sin asunto)',
          from: headers['from'] || 'Desconocido',
          to: headers['to'] || '',
          date: headers['date'] || '',
        });
      }
    } catch (e) {
      console.warn('Error fetching message detail', e);
    }
  }

  return summaries;
}

// Helper to encode utf-8 string to base64url for Gmail API
function base64UrlEncode(str: string) {
  const bytes = new TextEncoder().encode(str);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

// 2. Send email via Gmail API
export async function sendGmailMessage(
  token: string,
  to: string,
  subject: string,
  bodyText: string
): Promise<{ id: string }> {
  // Construct RFC 2822 email message
  const rawEmail = [
    `To: ${to.trim()}`,
    `Subject: =?utf-8?B?${btoa(unescape(encodeURIComponent(subject)))}?=`,
    'Content-Type: text/plain; charset=utf-8',
    'MIME-Version: 1.0',
    '',
    bodyText,
  ].join('\r\n');

  const encodedMessage = base64UrlEncode(rawEmail);

  const res = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages/send', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ raw: encodedMessage }),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Error al enviar correo por Gmail: ${res.status} ${errText}`);
  }

  return res.json();
}
