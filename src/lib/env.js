/**
 * Strict Runtime Environment Validation
 * Fails fast if critical deployment configurations are missing.
 */

const requiredVars = [
  'VITE_SUPABASE_URL',
  'VITE_SUPABASE_ANON_KEY',
];

export const validateEnv = () => {
  const missing = [];

  for (const v of requiredVars) {
    if (!import.meta.env[v]) {
      missing.push(v);
    }
  }

  if (missing.length > 0) {
    if (import.meta.env.PROD) {
      throw new Error(`CRITICAL: Missing required environment variables in production: ${missing.join(', ')}`);
    } else {
      console.warn(`WARNING: Missing environment variables for local dev: ${missing.join(', ')}. Falling back to mocks if available.`);
    }
  }
};

export const env = {
  supabaseUrl: import.meta.env.VITE_SUPABASE_URL || 'https://mock-supabase-url.supabase.co',
  supabaseAnonKey: import.meta.env.VITE_SUPABASE_ANON_KEY || 'mock-anon-key',
  sentryDsn: import.meta.env.VITE_SENTRY_DSN || '',
  isProd: import.meta.env.PROD,
  mode: import.meta.env.MODE, // 'development' | 'production' | 'test'
};
