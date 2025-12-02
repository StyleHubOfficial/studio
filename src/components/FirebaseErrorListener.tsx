
'use client';

import { useEffect } from 'react';

import { useToast } from '@/hooks/use-toast';
import { errorEmitter } from '@/firebase/error-emitter';

export default function FirebaseErrorListener() {
  const { toast } = useToast();

  useEffect(() => {
    const handlePermissionError = (error: any) => {
      console.error('Firestore Permission Error:', error);

      toast({
        variant: 'destructive',
        title: 'Permission Denied',
        description:
          error.message || 'You do not have permission to perform this action.',
      });

      // Instead of throwing, we are using the toast to display the error.
      // This prevents the Next.js error overlay from appearing for permission errors.
    };

    errorEmitter.on('permission-error', handlePermissionError);

    return () => {
      errorEmitter.off('permission-error', handlePermissionError);
    };
  }, [toast]);

  return null;
}
