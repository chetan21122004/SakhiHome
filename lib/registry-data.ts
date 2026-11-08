/** Shared registry types and pure helpers (safe for server and client). */

export type Worker = {
  id: string;
  name: string;
  phone: string;
  /** Comma-separated display; kept in sync with `areas`. */
  area: string;
  /** Operating / service areas (one or more). */
  areas?: string[];
  services: string[];
  experience: number;
  salary: string;
  languages: string;
  schedule: string;
  status: "Available" | "Placed" | "On leave" | "Archived";
  verification: "Verified" | "Pending";
  address: string;
  maritalStatus: string;
  guardian: string;
  dependants: string;
  emergency: string;
  notes: string;
  photoPath?: string;
  applicationId?: string;
  photoUrl?: string;
  documents: {
    id?: string;
    name: string;
    note?: string;
    file: string;
    path?: string;
    bucket?: string;
    reviewed: boolean;
  }[];
};

export type Application = {
  id: string;
  name: string;
  phone: string;
  area: string;
  services: string[];
  language: string;
  schedule?: string;
  consent?: boolean;
  status: "New" | "Approved" | "Declined";
};

export type Household = {
  id: string;
  name: string;
  phone: string;
  area: string;
  address: string;
  service: string;
};

export type Placement = {
  id: string;
  workerId: string;
  householdId: string;
  service: string;
  days: string;
  from: string;
  to: string;
  salary: string;
  start: string;
  status: "Active" | "Ended";
};

export type Registry = {
  workers: Worker[];
  applications: Application[];
  households: Household[];
  placements: Placement[];
  activity: string[];
};

export const serviceOptions = [
  "Cleaning",
  "Cooking",
  "Childcare",
  "Elder care",
  "Full-time help",
] as const;

export const areaOptions = [
  "Hinjewadi Phase 1",
  "Hinjewadi Phase 2",
  "Hinjewadi Phase 3",
  "Wakad",
  "Baner",
  "Marunji",
  "Megapolis",
  "Other",
] as const;

export function workerDisplayRef(id: string): string {
  const body = id.startsWith("SK-") ? id.slice(3) : id;
  const segment = body.split("-")[0]?.slice(0, 8) ?? body.slice(0, 8);
  return segment ? `SK-${segment.toUpperCase()}` : id;
}

export function workerAreas(
  worker: Pick<Worker, "area" | "areas">,
): string[] {
  if (worker.areas?.length) {
    return worker.areas.map((a) => a.trim()).filter(Boolean);
  }
  const raw = worker.area?.trim();
  if (!raw) return [];
  if (raw.includes(",")) {
    return raw
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
  }
  return [raw];
}

export function formatWorkerAreas(areas: string[]): string {
  return areas.join(", ");
}

export function normalizeWorker(worker: Worker): Worker {
  const areas = [...new Set(workerAreas(worker))];
  return {
    ...worker,
    areas,
    area: formatWorkerAreas(areas),
    phone: worker.phone.replace(/\D/g, "").slice(-10),
  };
}

export function blankWorker(): Worker {
  return {
    id: `SK-${crypto.randomUUID()}`,
    name: "",
    phone: "",
    area: "Wakad",
    areas: ["Wakad"],
    services: ["Cleaning"],
    experience: 0,
    salary: "",
    languages: "Marathi, Hindi",
    schedule: "",
    status: "Available",
    verification: "Pending",
    address: "",
    maritalStatus: "",
    guardian: "",
    dependants: "",
    emergency: "",
    notes: "",
    documents: [],
  };
}

export const emptyRegistry: Registry = {
  workers: [],
  applications: [],
  households: [],
  placements: [],
  activity: [],
};
