/**
 * Centralized logging abstraction (Sentry/LogRocket ready).
 * Use this instead of direct console.log/console.error in production.
 */

const isProd = import.meta.env.PROD;

const generateTraceId = () => {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
};

export const logger = {
  info: (message, meta = {}) => {
    const traceId = meta.traceId || generateTraceId();
    if (!isProd) {
      console.log(`[INFO][${traceId}] ${message}`, { ...meta, traceId });
    }
    // TODO: Ship to Datadog/Axiom in production
  },
  warn: (message, meta = {}) => {
    const traceId = meta.traceId || generateTraceId();
    if (!isProd) {
      console.warn(`[WARN][${traceId}] ${message}`, { ...meta, traceId });
    } else {
      import('./monitoring').then(({ captureMessage }) => {
        captureMessage(message, { ...meta, traceId, level: 'warning' });
      }).catch(() => {});
    }
  },
  error: (error, context = {}) => {
    const traceId = context.traceId || generateTraceId();

    // Normalize error object for serialization
    const errorDetails = error instanceof Error ? {
      message: error.message,
      stack: error.stack,
      name: error.name
    } : error;

    if (!isProd) {
      console.error(`[ERROR][${traceId}]`, errorDetails, { ...context, traceId });
    } else {
      import('./monitoring').then(({ captureException }) => {
        captureException(error instanceof Error ? error : new Error(String(error)), { ...context, traceId });
      }).catch(() => {});
    }
  }
};
