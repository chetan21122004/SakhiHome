/** Indian mobile: 10 digits, starts with 6–9 (no country code in storage). */
export const INDIAN_MOBILE_PATTERN = "[6-9][0-9]{9}";

export function digitsOnlyIndianMobile(value: string): string {
  let digits = value.replace(/\D/g, "");
  if (digits.length > 10 && digits.startsWith("91")) {
    digits = digits.slice(-10);
  }
  return digits.slice(0, 10);
}

export function isValidIndianMobile(phone: string): boolean {
  const digits = digitsOnlyIndianMobile(phone);
  return /^[6-9]\d{9}$/.test(digits);
}

export function formatIndianMobileForStorage(phone: string): string {
  return digitsOnlyIndianMobile(phone);
}

export function indianMobileValidationMessage(): string {
  return "Enter a valid 10-digit Indian mobile number (starts with 6, 7, 8, or 9).";
}

/** Allow only digits in numeric profile fields (experience years, etc.). */
export function digitsOnlyField(value: string, maxLen = 3): string {
  return value.replace(/\D/g, "").slice(0, maxLen);
}
