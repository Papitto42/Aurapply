// API Configuration
// Uses environment variable in production, falls back to localhost in development

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001';

// Helper function to build full URL
const url = (path) => `${API_BASE_URL}${path}`;

export const API_ENDPOINTS = {
  // Auth
  LOGIN: url('/api/auth/login'),
  REGISTER: url('/api/auth/register'),
  
  // Dashboard
  HISTORY: url('/api/history'),
  CONFIG: url('/api/config'),
  
  // User
  USER_PROFILE: url('/api/user/profile'),
  UPLOAD_AVATAR: url('/api/upload/avatar'),
  
  // Jobs
  ANALYZE_JOBS: url('/api/analyze-jobs'),
  APPLY_JOB: url('/api/apply'),
  
  // Uploads
  UPLOAD_CV: url('/api/upload/resume'),
  UPLOAD_COVER_LETTER: url('/api/upload/coverletter'),
  
  // Emails
  EMAILS: url('/api/emails'),
  CHECK_EMAILS: url('/api/emails/check'),
  MARK_EMAIL_READ: (messageId) => url(`/api/emails/${messageId}/read`),
  
  // File URLs
  getFileUrl: (filePath) => filePath ? (filePath.startsWith('http') ? filePath : `${API_BASE_URL}/${filePath}`) : '#',
};

export default API_BASE_URL;

