import { initializeApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  User,
} from 'firebase/auth';
import {
  getFirestore,
  doc,
  collection,
  setDoc,
  getDocs,
  onSnapshot,
  query,
  where,
  orderBy,
  updateDoc,
  serverTimestamp,
  getDocFromServer,
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

// Initialize Firebase App
const app = initializeApp(firebaseConfig);

// Initialize Firestore with specific database ID (CRITICAL REQUIREMENT)
const rawConfig = firebaseConfig as unknown as { firestoreDatabaseId?: string };
const firestoreDatabaseId =
  rawConfig.firestoreDatabaseId ||
  'ai-studio-remixremixremixp-2f705343-c737-41b5-bf0c-61e86a186964';
export const db = getFirestore(app, firestoreDatabaseId);

// Initialize Auth
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// Test Connection on initial boot as required by Firebase skill
async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn('Firebase client is offline or initializing.');
    }
  }
}
testConnection();

// Structured Firestore Error Handling as mandated by Firebase skill
export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(
  error: unknown,
  operationType: OperationType,
  path: string | null
): never {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo:
        auth.currentUser?.providerData?.map((p) => ({
          providerId: p.providerId,
          email: p.email,
        })) || [],
    },
    operationType,
    path,
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Data Types
export interface StoredQuote {
  id: string;
  clientName: string;
  clientPhone: string;
  clientEmail?: string;
  vehicleMake: string;
  vehicleModel: string;
  vehicleYear: string;
  serviceType: string;
  description: string;
  estimatedRange: string;
  status: 'recibida' | 'en_revision' | 'presupuestada' | 'en_taller' | 'entregada';
  userId: string;
  adminNotes?: string;
  createdAt: any;
  updatedAt: any;
}

export interface StoredReview {
  id: string;
  authorName: string;
  rating: number;
  comment: string;
  vehicle?: string;
  userId: string;
  createdAt: any;
}

// Google Auth Helpers
export async function loginWithGoogle(): Promise<User> {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (err) {
    console.error('Google Sign In error:', err);
    throw err;
  }
}

export async function logoutUser(): Promise<void> {
  await signOut(auth);
}

// Quotes Service
export async function saveQuote(quote: Omit<StoredQuote, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
  const quoteId = 'cot-' + Date.now().toString(36) + '-' + Math.random().toString(36).substring(2, 6);
  const path = `quotes/${quoteId}`;
  try {
    const quoteRef = doc(db, 'quotes', quoteId);
    await setDoc(quoteRef, {
      ...quote,
      id: quoteId,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return quoteId;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}

export function subscribeToQuotes(onData: (quotes: StoredQuote[]) => void, onError?: (err: Error) => void) {
  if (!auth.currentUser) {
    onData([]);
    return () => {};
  }
  const path = 'quotes';
  const isAdminUser = auth.currentUser.email === 'carroceriaypinturanogales@gmail.com';
  const q = isAdminUser
    ? query(collection(db, path), orderBy('createdAt', 'desc'))
    : query(collection(db, path), where('userId', '==', auth.currentUser.uid), orderBy('createdAt', 'desc'));

  return onSnapshot(
    q,
    (snapshot) => {
      const items: StoredQuote[] = [];
      snapshot.forEach((docSnap) => {
        items.push(docSnap.data() as StoredQuote);
      });
      onData(items);
    },
    (error) => {
      handleFirestoreError(error, OperationType.LIST, path);
      onError?.(error instanceof Error ? error : new Error(String(error)));
    }
  );
}

export async function updateQuoteStatus(quoteId: string, newStatus: StoredQuote['status'], adminNotes?: string) {
  const path = `quotes/${quoteId}`;
  try {
    const quoteRef = doc(db, 'quotes', quoteId);
    const updatePayload: Record<string, any> = {
      status: newStatus,
      updatedAt: serverTimestamp(),
    };
    if (adminNotes !== undefined) {
      updatePayload.adminNotes = adminNotes;
    }
    await updateDoc(quoteRef, updatePayload);
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

// Reviews Service
export async function addReview(review: Omit<StoredReview, 'id' | 'createdAt'>): Promise<string> {
  const reviewId = 'rev-' + Date.now().toString(36);
  const path = `reviews/${reviewId}`;
  try {
    const revRef = doc(db, 'reviews', reviewId);
    await setDoc(revRef, {
      ...review,
      id: reviewId,
      createdAt: serverTimestamp(),
    });
    return reviewId;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}

export function subscribeToReviews(onData: (reviews: StoredReview[]) => void, onError?: (err: Error) => void) {
  const path = 'reviews';
  const q = query(collection(db, path), orderBy('createdAt', 'desc'));
  return onSnapshot(
    q,
    (snapshot) => {
      const items: StoredReview[] = [];
      snapshot.forEach((docSnap) => {
        items.push(docSnap.data() as StoredReview);
      });
      onData(items);
    },
    (error) => {
      handleFirestoreError(error, OperationType.LIST, path);
      onError?.(error instanceof Error ? error : new Error(String(error)));
    }
  );
}
