"use client";

import {
  digitsOnlyIndianMobile,
  INDIAN_MOBILE_PATTERN,
} from "@/lib/india-contact";

type Props = {
  value: string;
  onChange: (digits: string) => void;
  required?: boolean;
  readOnly?: boolean;
  disabled?: boolean;
  className?: string;
  id?: string;
  name?: string;
  autoComplete?: string;
};

export default function IndianMobileInput({
  value,
  onChange,
  required,
  readOnly,
  disabled,
  className,
  id,
  name,
  autoComplete = "tel-national",
}: Props) {
  return (
    <input
      id={id}
      name={name}
      type="tel"
      inputMode="numeric"
      autoComplete={autoComplete}
      maxLength={10}
      pattern={INDIAN_MOBILE_PATTERN}
      title="10-digit Indian mobile number"
      placeholder="10-digit mobile"
      required={required}
      readOnly={readOnly}
      disabled={disabled}
      className={className}
      value={digitsOnlyIndianMobile(value)}
      onChange={(e) => onChange(digitsOnlyIndianMobile(e.target.value))}
    />
  );
}
