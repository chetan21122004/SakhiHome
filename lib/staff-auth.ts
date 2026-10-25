/** Sole bootstrap admin; only this email may hold the Admin role in staff_access. */
export const PRIMARY_ADMIN_EMAIL = "chetan44rt@gmail.com";

export function normalizeStaffEmail(email: string) {
  return email.trim().toLowerCase();
}

export function isPrimaryAdminEmail(email: string) {
  return normalizeStaffEmail(email) === PRIMARY_ADMIN_EMAIL;
}
