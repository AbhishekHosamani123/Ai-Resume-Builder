// Base URL of the backend API.
// - Set VITE_API_BASE_URL to point at a separately hosted backend.
// - In a production build without it, the API is assumed to be served from the
//   same origin (this is how the Vercel deployment works: /api/* is handled by
//   the serverless function).
// - Locally without an env var, fall back to the dev server on port 4000.
export const BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  (import.meta.env.PROD ? '' : 'http://localhost:4000')

// ROUTES USED FOR FRONTEND
export const API_PATHS = {
  AUTH: {
    REGISTER: '/api/auth/register',
    LOGIN: '/api/auth/login',
    GET_PROFILE: '/api/auth/profile',
  },
  RESUME: {
    CREATE: '/api/resume',
    GET_ALL: '/api/resume',
    GET_BY_ID: (id) => `/api/resume/${id}`,
    UPDATE: (id) => `/api/resume/${id}`,
    DELETE: (id) => `/api/resume/${id}`,
    UPLOAD_IMAGES: (id) => `/api/resume/${id}/upload-images`,
  },
  image: {
    UPLOAD_IMAGES: '/api/auth/upload-image',
  },
}
