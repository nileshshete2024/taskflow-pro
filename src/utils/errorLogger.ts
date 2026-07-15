/**
 * Error logging and monitoring service
 * Provides centralized error handling for the application
 */

export type ErrorContext = {
  component?: string;
  action?: string;
  userId?: string;
  timestamp?: string;
  metadata?: Record<string, unknown>;
};

/**
 * Custom error class with context information
 */
export class AppError extends Error {
  constructor(
    message: string,
    public readonly code: string = 'UNKNOWN_ERROR',
    public readonly context?: ErrorContext
  ) {
    super(message);
    this.name = 'AppError';
  }
}

/**
 * Error logger service for centralized error handling
 * Can be extended to integrate with services like Sentry, LogRocket, etc.
 */
export const errorLogger = {
  /**
   * Log an error with context information
   */
  logError: (error: Error | AppError, context?: ErrorContext): void => {
    const timestamp = new Date().toISOString();
    const errorContext = {
      ...context,
      timestamp,
    };

    const errorMessage = `[${errorContext.component || 'APP'}] ${error.message}`;

    if (error instanceof AppError) {
      console.error(errorMessage, {
        code: error.code,
        context: errorContext,
        stack: error.stack,
      });
    } else {
      console.error(errorMessage, {
        context: errorContext,
        stack: error.stack,
      });
    }

    // TODO: Integrate with error tracking service (Sentry, LogRocket, etc.)
    // sentry.captureException(error, { extra: errorContext });
  },

  /**
   * Log a warning message
   */
  logWarning: (message: string, context?: ErrorContext): void => {
    const timestamp = new Date().toISOString();
    console.warn(`[${context?.component || 'APP'}] ${message}`, {
      ...context,
      timestamp,
    });
  },

  /**
   * Log informational message
   */
  logInfo: (message: string, context?: ErrorContext): void => {
    const timestamp = new Date().toISOString();
    console.info(`[${context?.component || 'APP'}] ${message}`, {
      ...context,
      timestamp,
    });
  },

  /**
   * Safe error handler that prevents errors from breaking the app
   */
  safeExecute: async <T>(
    fn: () => Promise<T> | T,
    errorMessage: string = 'Operation failed',
    context?: ErrorContext
  ): Promise<T | null> => {
    try {
      return await Promise.resolve(fn());
    } catch (error) {
      const logError =
        error instanceof Error
          ? new Error(`${errorMessage}: ${error.message}`)
          : new Error(`${errorMessage}: ${String(error)}`);

      errorLogger.logError(logError, { ...context, action: 'safeExecute' });
      return null;
    }
  },
};
