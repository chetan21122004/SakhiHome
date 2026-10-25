import type { Worker } from "./registry";

type Change = { table: string; before: unknown; after: unknown };

export function filterRegistryChangesForRole(
  role: "Admin" | "Coordinator",
  changes: Change[],
): Change[] {
  if (role === "Admin") return changes;

  const maidOnly = changes.filter((c) => c.table === "maids");
  if (maidOnly.length !== changes.length) {
    throw new Error("Coordinators can only update maid profiles.");
  }

  return maidOnly.map((c) => {
    const after = { ...(c.after as Worker) };
    const before = c.before as Worker | null;

    if (after.status === "Archived") {
      after.status = before?.status ?? "Available";
    }
    if (after.verification === "Verified") {
      after.verification = before?.verification ?? "Pending";
    }

    for (const doc of after.documents ?? []) {
      doc.reviewed = false;
    }

    return { ...c, after };
  });
}
