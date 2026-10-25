export const VERIFICATION_DOC_TYPES = [
  "Identity proof",
  "Address proof",
  "Police verification",
] as const;

export const GALLERY_DOC_CATEGORIES = [
  "Reference letter",
  "Experience certificate",
  "Bank passbook",
  "Other",
] as const;

export const ALL_DOC_CATEGORIES = [
  ...VERIFICATION_DOC_TYPES,
  ...GALLERY_DOC_CATEGORIES,
] as const;

export type DocCategory = (typeof ALL_DOC_CATEGORIES)[number];

export function isVerificationDocName(name: string): boolean {
  return (VERIFICATION_DOC_TYPES as readonly string[]).includes(name);
}
