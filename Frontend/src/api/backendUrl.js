// Deployed backend (Vercel project). Used when VITE_BACKEND_URL is not set at
// build time, so the production site still reaches the API.
const DEFAULT_PRODUCTION_BACKEND_URL = "https://superteachertoc-backend.vercel.app"

const configuredBackendUrl =
  import.meta.env.VITE_BACKEND_URL?.trim() ||
  (import.meta.env.DEV ? "http://localhost:5000" : DEFAULT_PRODUCTION_BACKEND_URL)

export const backendUrl = configuredBackendUrl
  .replace(/\/+$/, '')
  .replace(/\/api$/, '') // tolerate a URL entered with a trailing /api
