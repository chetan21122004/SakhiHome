import { randomBytes } from "node:crypto";
import type { Enquiry } from "./enquiries";
import {
  generateClientPin,
  hashClientPin,
  normalizePhone,
} from "./client-pin";
import {
  type ClientRecord,
  type ClientSource,
  type ClientStatus,
  isStaleLead,
} from "./client-types";

export type {
  ClientListItem,
  ClientRecord,
  ClientSource,
  ClientStatus,
} from "./client-types";
export { clientLoginUrl, isStaleLead } from "./client-types";

export function newClientId() {
  return `CLI-${crypto.randomUUID()}`;
}

export function newPortalToken() {
  return randomBytes(32).toString("base64url");
}

export function rowToClient(row: {
  id: string;
  name: string;
  phone: string;
  phone_normalized: string;
  area: string;
  service: string;
  message: string;
  source: string;
  enquiry_id: string | null;
  status: string;
  portal_token: string;
  portal_enabled: boolean;
  serious_client: boolean;
  staff_last_touched_at: string | null;
  notes: string;
  created_at: string;
  updated_at: string;
  pin_rotated_at: string | null;
}): ClientRecord {
  return {
    id: row.id,
    name: row.name,
    phone: row.phone,
    phoneNormalized: row.phone_normalized,
    area: row.area,
    service: row.service,
    message: row.message,
    source: row.source as ClientSource,
    enquiryId: row.enquiry_id,
    status: row.status as ClientStatus,
    portalToken: row.portal_token,
    portalEnabled: row.portal_enabled,
    seriousClient: row.serious_client,
    staffLastTouchedAt: row.staff_last_touched_at,
    notes: row.notes,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    pinRotatedAt: row.pin_rotated_at,
  };
}

export function clientInsertFromEnquiry(
  enquiry: Enquiry,
  existingId?: string,
): {
  id: string;
  row: {
    id: string;
    name: string;
    phone: string;
    phone_normalized: string;
    area: string;
    service: string;
    message: string;
    source: string;
    enquiry_id: string;
    status: string;
    portal_token: string;
    portal_enabled: boolean;
    serious_client: boolean;
    access_pin_hash: string;
    pin_rotated_at: string;
    staff_last_touched_at: null;
    notes: string;
  };
  pin: string;
} {
  const id = existingId ?? newClientId();
  const pin = generateClientPin();
  const phoneNorm = normalizePhone(enquiry.phone);
  return {
    id,
    pin,
    row: {
      id,
      name: enquiry.name,
      phone: enquiry.phone,
      phone_normalized: phoneNorm,
      area: enquiry.area,
      service: enquiry.service,
      message: enquiry.message ?? "",
      source: "enquiry",
      enquiry_id: enquiry.id,
      status: "lead",
      portal_token: newPortalToken(),
      portal_enabled: false,
      serious_client: false,
      access_pin_hash: hashClientPin(pin),
      pin_rotated_at: new Date().toISOString(),
      staff_last_touched_at: null,
      notes: "",
    },
  };
}

export function manualClientRow(input: {
  name: string;
  phone: string;
  area?: string;
  service?: string;
  message?: string;
  notes?: string;
}) {
  const id = newClientId();
  const pin = generateClientPin();
  return {
    id,
    pin,
    row: {
      id,
      name: input.name.trim(),
      phone: input.phone.trim(),
      phone_normalized: normalizePhone(input.phone),
      area: input.area?.trim() ?? "",
      service: input.service?.trim() ?? "",
      message: input.message?.trim() ?? "",
      source: "manual",
      enquiry_id: null,
      status: "lead",
      portal_token: newPortalToken(),
      portal_enabled: false,
      serious_client: false,
      access_pin_hash: hashClientPin(pin),
      pin_rotated_at: new Date().toISOString(),
      staff_last_touched_at: new Date().toISOString(),
      notes: input.notes?.trim() ?? "",
    },
  };
}
