// Mock authentication service - DEPRECATED AND DISABLED
// Real Supabase authentication is now properly configured
// This file is kept for reference only

export const mockAuth = {
  isEnabled: false, // Permanently disabled
  
  // Mock data removed for security
};

// Always use real Supabase auth
export const shouldUseMockAuth = () => {
  return false; // Always return false - use real auth only
};
