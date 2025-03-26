export const FALCONER_ENDPOINT = "https://falconer.haqq.network" as const;

// List of allowed origins for CORS (Cross-Origin Resource Sharing)
// This list specifies which domains are permitted to make requests to our API
// - http://localhost:3000: Allows for local development
// - https://old-haqq-stuff.vercel.app: Demo frontend
// - https://new.haqq.network: New main production domain
export const ALLOWED_ORIGINS = [
  "http://localhost:3000",
  "https://old-haqq-stuff.vercel.app",
  "https://www.haqq.network",
];
