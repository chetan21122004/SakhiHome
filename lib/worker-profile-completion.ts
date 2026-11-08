import { isValidIndianMobile } from "./india-contact";
import type { Worker } from "./registry-data";
import { workerAreas } from "./registry-data";

export type ProfileCompletion = {
  percent: number;
  missing: string[];
};

const REQUIRED_DOCS = [
  "Identity proof",
  "Address proof",
  "Police verification",
] as const;

export function workerProfileCompletion(worker: Worker): ProfileCompletion {
  const checks: { points: number; ok: boolean; label: string }[] = [
    { points: 12, ok: worker.name.trim().length > 0, label: "Full name" },
    {
      points: 12,
      ok: isValidIndianMobile(worker.phone),
      label: "Mobile number",
    },
    {
      points: 10,
      ok: workerAreas(worker).length > 0,
      label: "Operating areas",
    },
    {
      points: 10,
      ok: worker.services.length > 0,
      label: "Services",
    },
    { points: 6, ok: worker.experience > 0, label: "Experience" },
    { points: 6, ok: Boolean(worker.salary?.trim()), label: "Expected pay" },
    { points: 5, ok: Boolean(worker.languages?.trim()), label: "Languages" },
    { points: 5, ok: Boolean(worker.schedule?.trim()), label: "Work timings" },
    { points: 10, ok: Boolean(worker.photoPath), label: "Profile photo" },
    { points: 8, ok: Boolean(worker.address?.trim()), label: "Address" },
    {
      points: 6,
      ok: Boolean(worker.emergency?.trim()),
      label: "Emergency contact",
    },
    {
      points: 10,
      ok: REQUIRED_DOCS.every((name) =>
        worker.documents.some((d) => d.name === name && d.path),
      ),
      label: "Verification documents",
    },
  ];

  const total = checks.reduce((sum, c) => sum + c.points, 0);
  const earned = checks.filter((c) => c.ok).reduce((sum, c) => sum + c.points, 0);
  const percent = Math.round((earned / total) * 100);
  const missing = checks.filter((c) => !c.ok).map((c) => c.label);

  return { percent, missing };
}
