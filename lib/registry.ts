"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import {
  adminLogout,
  downloadAdminFile,
  fetchAdminSession,
  fetchRegistry,
  removeAdminFiles,
  saveRegistryChanges,
  uploadAdminFile,
  type AdminSessionInfo,
} from "./admin-api";

export type Worker = {
  id: string;
  name: string;
  phone: string;
  area: string;
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
];
export const areaOptions = [
  "Hinjewadi Phase 1",
  "Hinjewadi Phase 2",
  "Hinjewadi Phase 3",
  "Wakad",
  "Baner",
  "Marunji",
  "Megapolis",
  "Other",
];
export function blankWorker(): Worker {
  return {
    id: `SK-${crypto.randomUUID()}`,
    name: "",
    phone: "",
    area: "Wakad",
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

type Staff = { email: string; role: "Admin" | "Coordinator"; enabled: boolean };

const entities = {
  workers: "maids",
  households: "households",
  applications: "applications",
  placements: "placements",
} as const;

function storedRecord(record: Worker | Household | Application | Placement) {
  const copy = { ...record } as Worker;
  delete copy.photoUrl;
  return copy;
}

export function useRegistry() {
  const [data, setData] = useState<Registry>(emptyRegistry);
  const [session, setSession] = useState<AdminSessionInfo | null>(null);
  const [staff, setStaff] = useState<Staff | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const current = useRef(data);
  const generation = useRef(0);
  const mutating = useRef(false);
  const sessionRef = useRef<AdminSessionInfo | null>(null);

  const refresh = useCallback(async (nextSession?: AdminSessionInfo | null) => {
    const selected =
      nextSession === undefined ? sessionRef.current : nextSession;
    const ticket = ++generation.current;
    sessionRef.current = selected;
    setSession(selected);
    setError("");
    try {
      if (!selected) {
        setData(emptyRegistry);
        current.current = emptyRegistry;
        setStaff(null);
        return;
      }
      setStaff({
        email: selected.email,
        role: selected.role,
        enabled: true,
      });
      const next = await fetchRegistry();
      if (ticket !== generation.current) return;
      current.current = next;
      setData(next);
    } catch (cause) {
      if (ticket === generation.current) {
        setError(
          cause instanceof Error
            ? cause.message
            : String(
                (cause as { message?: string }).message ||
                  "Unable to load records",
              ),
        );
      }
    } finally {
      if (ticket === generation.current) setLoading(false);
    }
  }, []);

  useEffect(() => {
    let alive = true;
    void (async () => {
      try {
        const info = await fetchAdminSession();
        if (alive) await refresh(info);
      } catch (cause) {
        if (alive) {
          setError(String(cause));
          setLoading(false);
        }
      }
    })();
    const onFocus = () => {
      if (alive && !mutating.current && sessionRef.current) void refresh();
    };
    window.addEventListener("focus", onFocus);
    const interval = setInterval(onFocus, 12 * 60 * 1000);
    return () => {
      alive = false;
      window.removeEventListener("focus", onFocus);
      clearInterval(interval);
    };
  }, [refresh]);

  async function update(change: (previous: Registry) => Registry) {
    if (mutating.current) return false;
    mutating.current = true;
    setSaving(true);
    try {
      const before = current.current;
      const after = change(before);
      const changes: { table: string; before: unknown; after: unknown }[] = [];
      for (const field of Object.keys(entities) as (keyof typeof entities)[]) {
        for (const record of after[field]) {
          const old = before[field].find((row) => row.id === record.id);
          const stored = storedRecord(record);
          const previous = old ? storedRecord(old) : null;
          if (JSON.stringify(previous) !== JSON.stringify(stored))
            changes.push({
              table: entities[field],
              before: previous,
              after: stored,
            });
        }
      }
      const messages = after.activity.filter(
        (message) => !before.activity.includes(message),
      );
      await saveRegistryChanges(changes, messages);
      await refresh();
      return true;
    } catch (cause) {
      toast.error(String((cause as { message?: string }).message || cause));
      await refresh();
      return false;
    } finally {
      mutating.current = false;
      setSaving(false);
    }
  }

  async function signOut() {
    await adminLogout();
    await refresh(null);
  }

  return {
    data,
    update,
    loading,
    saving,
    error,
    session,
    staff,
    refresh,
    signOut,
  };
}

export async function submitApplication(application: Application) {
  const { createClient } = await import("@supabase/supabase-js");
  type Database = import("./database.types").Database;
  const sb = createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false,
      },
    },
  );
  const { error } = await sb
    .from("applications")
    .insert({ id: application.id, payload: application });
  if (error)
    throw new Error(
      error.code === "23505"
        ? "An application with this phone number is already awaiting review. Please contact SakhiHome."
        : "Could not send your application. Please try again or contact SakhiHome.",
    );
}

export async function uploadFile(workerId: string, file: File, photo: boolean) {
  const allowed = photo
    ? ["image/jpeg", "image/png", "image/webp"]
    : ["image/jpeg", "image/png", "image/webp", "application/pdf"];
  const limit = photo ? 5 : 10;
  if (!allowed.includes(file.type))
    throw new Error(
      photo
        ? "Choose a JPEG, PNG or WebP photo"
        : "Choose a PDF, JPEG, PNG or WebP document",
    );
  if (file.size > limit * 1024 * 1024 || file.size === 0)
    throw new Error(`File must be between 1 byte and ${limit} MB`);
  const result = await uploadAdminFile(workerId, file, photo);
  return {
    bucket: result.bucket,
    path: result.path,
    signedUrl: result.signedUrl,
  };
}

export async function openDocument(path: string, filename?: string) {
  const blob = await downloadAdminFile(path);
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename || path.split("/").pop() || "document";
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 10000);
}

export async function removeUploadedFiles(
  files: { bucket: string; path: string }[],
) {
  await removeAdminFiles(files);
}
