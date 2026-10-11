"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { toast } from "sonner";
import { getSupabase } from "./supabase-client";
import type { Database, Json } from "./database.types";

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
  documents: { name: string; file: string; path?: string; reviewed: boolean }[];
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
async function loadRows(
  table: "maids" | "households" | "applications" | "placements",
) {
  const rows: { payload: unknown }[] = [];
  for (let offset = 0; ; offset += 1000) {
    const result = await getSupabase()
      .from(table)
      .select("payload")
      .order("updated_at", { ascending: false })
      .range(offset, offset + 999);
    if (result.error) throw result.error;
    rows.push(...result.data);
    if (result.data.length < 1000) return rows;
  }
}
export function useRegistry() {
  const [data, setData] = useState<Registry>(emptyRegistry);
  const [session, setSession] = useState<Session | null>(null);
  const [staff, setStaff] = useState<Staff | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const current = useRef(data);
  const generation = useRef(0);
  const mutating = useRef(false);
  const sessionRef = useRef<Session | null>(null);
  const invalidateRequests = useCallback(() => { generation.current++; }, []);
  const refresh = useCallback(async (nextSession?: Session | null) => {
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
      const access = await getSupabase()
        .from("staff_access")
        .select("email,role,enabled")
        .eq("email", selected.user.email?.toLowerCase() || "")
        .maybeSingle();
      if (access.error) throw access.error;
      if (!access.data?.enabled) {
        setStaff(null);
        setData(emptyRegistry);
        current.current = emptyRegistry;
        return;
      }
      if (ticket !== generation.current) return;
      setStaff(access.data as Staff);
      const results = await Promise.all(Object.values(entities).map(loadRows));
      const next: Registry = {
        workers: results[0].map((r) => r.payload as Worker),
        households: results[1].map((r) => r.payload as Household),
        applications: results[2].map((r) => r.payload as Application),
        placements: results[3].map((r) => r.payload as Placement),
        activity: [],
      };
      const paths = next.workers.flatMap((w) =>
        w.photoPath ? [w.photoPath] : [],
      );
      for (let i = 0; i < paths.length; i += 100) {
        const signed = await getSupabase()
          .storage.from("maid-photos")
          .createSignedUrls(paths.slice(i, i + 100), 900);
        if (signed.error) throw signed.error;
        for (const image of signed.data || []) {
          const worker = next.workers.find((w) => w.photoPath === image.path);
          if (worker && image.signedUrl) worker.photoUrl = image.signedUrl;
        }
      }
      const activity = await getSupabase()
        .from("registry_activity")
        .select("message")
        .order("created_at", { ascending: false })
        .limit(8);
      if (activity.error) throw activity.error;
      next.activity = activity.data.map((a) => a.message);
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
    try {
      const sb = getSupabase();
      const { data: subscription } = sb.auth.onAuthStateChange(
        (_event, next) => {
          setTimeout(() => {
            if (alive) void refresh(next);
          }, 0);
        },
      );
      const onFocus = () => {
        if (alive && !mutating.current) void refresh();
      };
      window.addEventListener("focus", onFocus);
      const interval = setInterval(onFocus, 12 * 60 * 1000);
      return () => {
        alive = false;
        invalidateRequests();
        subscription.subscription.unsubscribe();
        window.removeEventListener("focus", onFocus);
        clearInterval(interval);
      };
    } catch (cause) {
      queueMicrotask(() => {
        if (alive) {
          setError(String(cause));
          setLoading(false);
        }
      });
    }
    return () => {
      alive = false;
    };
  }, [refresh, invalidateRequests]);
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
      const response = await getSupabase().rpc("save_registry_changes", {
        changes: changes as Json,
        messages,
      });
      if (response.error) throw response.error;
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
    const result = await getSupabase().auth.signOut();
    if (result.error) toast.error(result.error.message);
    else await refresh(null);
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
  // A separate anonymous client prevents a logged-in non-staff session from
  // changing the public application's access model.
  const { createClient } = await import("@supabase/supabase-js");
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
  const extension = {
    "image/jpeg": "jpg",
    "image/png": "png",
    "image/webp": "webp",
    "application/pdf": "pdf",
  }[file.type];
  const path = `${workerId}/${crypto.randomUUID()}.${extension}`;
  const bucket = photo ? "maid-photos" : "maid-documents";
  const { error } = await getSupabase()
    .storage.from(bucket)
    .upload(path, file, { contentType: file.type, upsert: false });
  if (error) throw error;
  return { bucket, path };
}
export async function openDocument(path: string, filename?: string) {
  const response = await getSupabase()
    .storage.from("maid-documents")
    .download(path);
  if (response.error) throw response.error;
  const url = URL.createObjectURL(response.data);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename || path.split("/").pop() || "document";
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 10000);
}
