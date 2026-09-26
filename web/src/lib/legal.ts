/** Legal document version ids stored on consent at register. */
export const LEGAL_VERSIONS = {
  terms: "terms-1.0",
  privacy: "privacy-1.0",
  cookies: "cookies-1.0",
} as const;

export type LegalDoc = keyof typeof LEGAL_VERSIONS;
