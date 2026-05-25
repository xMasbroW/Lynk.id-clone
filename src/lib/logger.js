/**
 * Centralized logging abstraction (Sentry/LogRocket ready).
 * Use this instead of direct console.log/console.error in production.
 */

const isProd = import.meta.env.PROD;

export const logger = {
  info: (message, meta = {}) => {
    if (!isProd) {
      console.log(`[INFO] ${message}`, meta);
    }
  },
  warn: (message, meta = {}) => {
    if (!isProd) {
      console.warn(`[WARN] ${message}`, meta);
    }
    // TODO: Connect to observability tool (e.g. Sentry.captureMessage)
  },
  error: (error, context = {}) => {
    if (!isProd) {
      console.error(`[ERROR]`, error, context);
    }
    // TODO: Connect to observability tool (e.g. Sentry.captureException)
  }
};
