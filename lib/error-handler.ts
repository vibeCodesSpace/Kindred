import { toast } from 'sonner';

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
    userId: string | undefined;
    email: string | null | undefined;
    emailVerified: boolean | undefined;
    isAnonymous: boolean | undefined;
    tenantId: string | null | undefined;
    providerInfo: {
      providerId: string;
      displayName: string | null;
      email: string | null;
      photoUrl: string | null;
    }[];
  }
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null, user?: any) {
  const message = error instanceof Error ? error.message : String(error);
  
  const errInfo: FirestoreErrorInfo = {
    error: message,
    authInfo: {
      userId: user?.id || user?.uid || 'Not logged in',
      email: user?.email || null,
      emailVerified: user?.email_verified || false,
      isAnonymous: user?.is_anonymous || false,
      tenantId: null,
      providerInfo: []
    },
    operationType,
    path
  };

  console.error('Firestore Error: ', JSON.stringify(errInfo));

  if (message.includes('permission-denied') || message.includes('Missing or insufficient permissions')) {
    toast.error('Access Denied', {
      description: 'You do not have permission to perform this action. Please sign in or check your access level.',
    });
  } else {
    toast.error('Database Error', {
      description: 'Something went wrong while accessing the database. Please try again later.',
    });
  }

  // Rethrow for ErrorBoundary if it's a critical failure
  throw new Error(JSON.stringify(errInfo));
}
