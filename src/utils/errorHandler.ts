import { Alert } from 'react-native';

export class AppError extends Error {
  public code: string;
  public fatal: boolean;

  constructor(message: string, code: string = 'UNKNOWN_ERROR', fatal: boolean = false) {
    super(message);
    this.name = 'AppError';
    this.code = code;
    this.fatal = fatal;
  }
}

export const handleError = (error: any, context?: string) => {
  console.error(`[${context || 'Error'}]`, error);

  const message = error instanceof Error ? error.message : String(error);
  
  // Show user-friendly alert for certain errors
  if (error?.fatal) {
    Alert.alert(
      "System Error",
      "A critical error occurred. Please restart the app. If the issue persists, you may need to clear your data.",
      [{ text: "OK" }]
    );
  } else {
    // Optional: Toast or silent logging
  }

  return {
    message,
    code: error?.code || 'UNKNOWN',
    context
  };
};

export const wrapAsync = <T>(
  promise: Promise<T>, 
  context?: string, 
  fallback?: T
): Promise<T | undefined> => {
  return promise.catch((err) => {
    handleError(err, context);
    return fallback;
  });
};
