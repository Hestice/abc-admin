import { toast } from '@/hooks/use-toast';
import { ApiError } from '@/utils/add-patient';

export function handleQueryError(error: unknown): void {
  if (error instanceof ApiError) {
    // Handle API errors with status codes
    if (error.status === 401 || error.status === 403) {
      // Authentication errors - redirect handled by middleware
      toast({
        title: 'Authentication Error',
        description: 'Please log in again to continue.',
        variant: 'destructive',
      });
    } else {
      // Other API errors
      toast({
        title: 'Error',
        description: error.message || 'An error occurred',
        variant: 'destructive',
      });
    }
  } else if (error instanceof Error) {
    // Generic errors
    toast({
      title: 'Error',
      description: error.message || 'An unexpected error occurred',
      variant: 'destructive',
    });
  } else {
    // Unknown errors
    toast({
      title: 'Error',
      description: 'An unexpected error occurred',
      variant: 'destructive',
    });
  }
}

export function getErrorMessage(error: unknown): string {
  if (error instanceof ApiError) {
    return error.message;
  } else if (error instanceof Error) {
    return error.message;
  }
  return 'An unexpected error occurred';
}
