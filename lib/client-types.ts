import { getAbsoluteSiteUrl } from "./services";

export type ClientStatus = "lead" | "active" | "closed";
export type ClientSource = "enquiry" | "manual";

export type ClientRecord = {
  id: string;
  name: string;
  phone: string;
  phoneNormalized: string;
  area: string;
  service: string;
  message: string;
  source: ClientSource;
  enquiryId: string | null;
  status: ClientStatus;
  portalToken: string;
  portalEnabled: boolean;
  seriousClient: boolean;
  staffLastTouchedAt: string | null;
  notes: string;
  createdAt: string;
  updatedAt: string;
  pinRotatedAt: string | null;
};

export type ClientListItem = ClientRecord & {
  isStaleLead: boolean;
  activeGrantCount: number;
};

export function clientLoginUrl(portalToken: string) {
  return getAbsoluteSiteUrl(
    `/client/login?t=${encodeURIComponent(portalToken)}`,
  );
}

export function isStaleLead(client: ClientRecord): boolean {
  if (client.status !== "lead" || client.staffLastTouchedAt) return false;
  const created = new Date(client.createdAt).getTime();
  const week = 7 * 24 * 60 * 60 * 1000;
  return Date.now() - created > week;
}
