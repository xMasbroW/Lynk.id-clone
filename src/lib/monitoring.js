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

/**
 * Capture execution metrics specific to automation/jobs
 */
export const captureExecutionMetric = (metricName, value, tags = {}) => {
  if (env.isProd && env.sentryDsn) {
    // Note: In a full setup, this might use Sentry Metrics API if enabled,
    // or send to Datadog/Prometheus.
    // We log it as a structured message for basic observability
    Sentry.withScope((scope) => {
      Object.keys(tags).forEach(key => scope.setTag(key, tags[key]));
      Sentry.captureMessage(`Metric: ${metricName} = ${value}`, 'info');
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
