/**
 * Global Configuration and Runtime Feature Toggle Registry.
 * Allows safe governance and quick operational kill switches in production.
 */
export const platformConfig = {
  // Operational Kill Switches
  features: {
    enableRegistration: import.meta.env.VITE_ENABLE_REGISTRATION !== 'false',
    enableBilling: import.meta.env.VITE_ENABLE_BILLING === 'true',
    enableCustomAvatars: true, // Can be toggled if storage abuse happens
    enablePublicSearch: false // Not yet implemented, toggle when ready
  },

  // Platform Limits
  limits: {
    maxAvatarSizeBytes: 5 * 1024 * 1024,
    maxBioLength: 160,
  },

  // Versioning and Compatibility
  version: '1.0.0',
};
