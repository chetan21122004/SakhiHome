import type { Json } from "./database.types";
import { getServiceSupabase } from "./supabase-service";
import type {
  Application,
  Household,
  Placement,
  Registry,
  Worker,
} from "./registry";

const tables = ["maids", "households", "applications", "placements"] as const;

async function loadTable(table: (typeof tables)[number]) {
  const sb = getServiceSupabase();
  const rows: { payload: unknown }[] = [];
  for (let offset = 0; ; offset += 1000) {
    const result = await sb
      .from(table)
      .select("payload")
      .order("updated_at", { ascending: false })
      .range(offset, offset + 999);
    if (result.error) throw result.error;
    rows.push(...result.data);
    if (result.data.length < 1000) break;
  }
  return rows;
}

export async function loadWorkersForAdmin(): Promise<Worker[]> {
  const sb = getServiceSupabase();
  const rows = await loadTable("maids");
  const workers = rows.map((r) => r.payload as Worker);
  const paths = workers.flatMap((w) => (w.photoPath ? [w.photoPath] : []));
  for (let i = 0; i < paths.length; i += 100) {
    const signed = await sb.storage
      .from("maid-photos")
      .createSignedUrls(paths.slice(i, i + 100), 900);
    if (signed.error) throw signed.error;
    for (const image of signed.data ?? []) {
      const worker = workers.find((w) => w.photoPath === image.path);
      if (worker && image.signedUrl) worker.photoUrl = image.signedUrl;
    }
  }
  return workers;
}

export async function loadRegistryForAdmin(): Promise<Registry> {
  const sb = getServiceSupabase();
  const results = await Promise.all(tables.map(loadTable));
  const workers = results[0].map((r) => r.payload as Worker);
  const paths = workers.flatMap((w) => (w.photoPath ? [w.photoPath] : []));
  for (let i = 0; i < paths.length; i += 100) {
    const signed = await sb.storage
      .from("maid-photos")
      .createSignedUrls(paths.slice(i, i + 100), 900);
    if (signed.error) throw signed.error;
    for (const image of signed.data ?? []) {
      const worker = workers.find((w) => w.photoPath === image.path);
      if (worker && image.signedUrl) worker.photoUrl = image.signedUrl;
    }
  }
  const next: Registry = {
    workers,
    households: results[1].map((r) => r.payload as Household),
    applications: results[2].map((r) => r.payload as Application),
    placements: results[3].map((r) => r.payload as Placement),
    activity: [],
  };
  const activity = await sb
    .from("registry_activity")
    .select("message")
    .order("created_at", { ascending: false })
    .limit(8);
  if (activity.error) throw activity.error;
  next.activity = activity.data.map((a) => a.message);
  return next;
}

export async function persistRegistryChanges(
  changes: { table: string; before: unknown; after: unknown }[],
  messages: string[],
) {
  const sb = getServiceSupabase();
  const { error } = await sb.rpc("save_registry_changes", {
    changes: changes as Json,
    messages,
  });
  if (error) throw error;
}
