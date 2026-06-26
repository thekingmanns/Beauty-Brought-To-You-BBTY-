import { initializeApp } from "firebase/app";
import { initializeFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import firebaseConfig from "../../firebase-applet-config.json";

let app: any = null;
let db: any = null;
let auth: any = null;
let isFirebaseSupported = false;

try {
  app = initializeApp(firebaseConfig);
  if (app) {
    db = initializeFirestore(app, {
      ignoreUndefinedProperties: true
    }, firebaseConfig.firestoreDatabaseId || "(default)");
    auth = getAuth(app);
    isFirebaseSupported = !!db;
  }
} catch (e) {
  console.warn("Firebase initialization skipped or failed in sandbox iframe environment:", e);
}

export { db, auth, isFirebaseSupported };

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
  }
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth?.currentUser?.uid || null,
      email: auth?.currentUser?.email || null,
      emailVerified: auth?.currentUser?.emailVerified || null,
      isAnonymous: auth?.currentUser?.isAnonymous || null,
      tenantId: auth?.currentUser?.tenantId || null,
      providerInfo: auth?.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  console.warn('Firestore Operation Warn/Error handler invoked (graceful fallback):', JSON.stringify(errInfo));
}