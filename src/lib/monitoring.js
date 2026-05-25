import * as Sentry from '@sentry/react';
import { env } from './env';

export const initMonitoring = () => {
  if (env.isProd && env.sentryDsn) {
    Sentry.init({
      dsn: env.sentryDsn,
      integrations: [
        Sentry.browserTracingIntegration(),
        Sentry.replayIntegration({
          maskAllText: true,
          blockAllMedia: true,
        }),
      ],
      // Performance Monitoring
      tracesSampleRate: 0.1, // Capture 10% of transactions in prod
      // Session Replay
      replaysSessionSampleRate: 0.01,
      replaysOnErrorSampleRate: 1.0,
    });
    console.log('[Monitoring] Sentry initialized');
  }
};

export const captureException = (error, context = {}) => {
  if (env.isProd && env.sentryDsn) {
    Sentry.withScope((scope) => {
      Object.keys(context).forEach(key => {
        scope.setExtra(key, context[key]);
      });
      Sentry.captureException(error);
    });
  }
};

export const captureMessage = (message, context = {}) => {
  if (env.isProd && env.sentryDsn) {
    Sentry.withScope((scope) => {
      Object.keys(context).forEach(key => {
        scope.setExtra(key, context[key]);
      });
      Sentry.captureMessage(message);
    });
  }
};

export const setUserContext = (user) => {
  if (env.isProd && env.sentryDsn && user) {
    Sentry.setUser({
      id: user.id,
      email: user.email,
    });
  } else if (env.isProd && env.sentryDsn) {
    Sentry.setUser(null);
  }
};
