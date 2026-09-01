export const API_URL = (
  (import.meta.env.VITE_API_URL as string) || "http://localhost:4000/api"
).replace(/\/$/, "");

export const SITE_URL = (
  (import.meta.env.VITE_SITE_URL as string) || "https://ibill.ae"
).replace(/\/$/, "");
