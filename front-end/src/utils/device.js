/**
 * Utility to extract client device metadata for user session and login tracking.
 */
export function getDeviceMetadata() {
  return {
    userAgent: navigator.userAgent, 
    platform: navigator.userAgentData?.platform || navigator.platform, 
    language: navigator.language,
    screenResolution: `${screen.width}x${screen.height}`,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    connectionType: navigator.connection?.effectiveType || 'unknown'
  };
}
