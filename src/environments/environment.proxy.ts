// Use this environment when using Angular proxy (development only)
// This bypasses CORS by proxying requests through Angular dev server
export const environment = {
  production: false,
  apiBaseUrl: '/auth',  // Relative URL - will be proxied
  societyBaseUrl: '/society/api/societies',
  residentBaseUrl: '/resident/api/residents',
  complaintBaseUrl: '/complaint/api/complaints',
  visitorBaseUrl: '/visitor/api/visitors'
};

