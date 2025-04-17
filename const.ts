export const FALCONER_ENDPOINT = "https://falconer.haqq.network" as const;

// List of allowed origins for CORS (Cross-Origin Resource Sharing)
// This list specifies which domains are permitted to make requests to our API
export const ALLOWED_ORIGINS = [
  "http://localhost:3000",
  "http://localhost:4321",
  "https://old-haqq-stuff.vercel.app",
  "https://www.haqq.network",
  "https://haqq.network",
  "https://deenar.com",
  "https://deen-landing.vercel.app",
];
