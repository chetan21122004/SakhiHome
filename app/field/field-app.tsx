"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { toast } from "sonner";
import {
  adminLogout,
  fetchAdminSession,
  fetchMaids,
  saveRegistryChanges,
  uploadAdminFile,
  type AdminSessionInfo,
} from "@/lib/admin-api";
import StaffLogin from "@/app/admin/staff-login";
import {
  areaOptions,
  blankWorker,
  serviceOptions,
  type Worker,
} from "@/lib/registry";
import "./field.css";

const DOC_TYPES = ["Identity proof", "Address proof", "Police verification"];
const STATUS_OPTIONS: Worker["status"][] = ["Available", "Placed", "On leave"];

function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0])
    .join("")
    .toUpperCase();
}

export default function FieldApp() {
  const [session, setSession] = useState<AdminSessionInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState<Worker | null>(null);
  const [step, setStep] = useState(0);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [beforeSave, setBeforeSave] = useState<Worker | null>(null);

  const refreshSession = useCallback(async () => {
    setLoading(true);
    try {
      const info = await fetchAdminSession();
      setSession(info);
      if (info) {
        const list = await fetchMaids();
        setWorkers(list.filter((w) => w.status !== "Archived"));
      } else {
        setWorkers([]);
      }
    } catch (e) {
      toast.error(String((e as Error).message));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refreshSession();
  }, [refreshSession]);

  const visible = useMemo(() => {
    const q = search.toLowerCase();
    return workers.filter(
      (w) =>
        !q ||
        `${w.name} ${w.phone} ${w.area} ${w.id}`.toLowerCase().includes(q),
    );
  }, [workers, search]);

  function openNew() {
    const w = blankWorker();
    setBeforeSave(null);
    setEditing(w);
    setStep(0);
  }

  function openEdit(w: Worker) {
    setBeforeSave(w);
    setEditing({ ...w, documents: w.documents.map((d) => ({ ...d })) });
    setStep(0);
  }

  function closeEditor() {
    setEditing(null);
    setBeforeSave(null);
    setStep(0);
  }

  async function attachFile(file: File, documentName?: string) {
    if (!editing) return;
    setUploading(true);
    try {
      const uploaded = await uploadAdminFile(editing.id, file, !documentName);
      if (documentName) {
        setEditing((w) =>
          w
            ? {
                ...w,
                documents: [
                  ...w.documents.filter((d) => d.name !== documentName),
                  {
                    name: documentName,
                    file: file.name,
                    path: uploaded.path,
                    reviewed: false,
                  },
                ],
                verification: "Pending",
              }
            : w,
        );
      } else {
        setEditing((w) =>
          w
            ? {
                ...w,
                photoPath: uploaded.path,
                photoUrl: uploaded.signedUrl,
              }
            : w,
        );
      }
    } catch (e) {
      toast.error(String((e as Error).message));
    } finally {
      setUploading(false);
    }
  }

  async function saveMaid() {
    if (!editing) return;
    if (!editing.name.trim() || editing.phone.replace(/\D/g, "").length < 10) {
      toast.error("Name and valid phone are required.");
      return;
    }
    if (!editing.services.length) {
      toast.error("Select at least one service.");
      return;
    }
    setSaving(true);
    try {
      const copy = { ...editing };
      delete copy.photoUrl;
      const storedBefore = beforeSave
        ? { ...beforeSave, photoUrl: undefined }
        : null;
      await saveRegistryChanges(
        [
          {
            table: "maids",
            before: storedBefore,
            after: copy,
          },
        ],
        [
          beforeSave
            ? `${copy.name} profile updated (field)`
            : `${copy.name} onboarded (field)`,
        ],
      );
      toast.success(beforeSave ? "Profile saved" : "Maid added");
      closeEditor();
      await refreshSession();
    } catch (e) {
      toast.error(String((e as Error).message));
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="field-root field-main">
        <p>Loading…</p>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="field-root">
        <StaffLogin
          title="Field sign in"
          onLoggedIn={() => void refreshSession()}
        />
      </div>
    );
  }

  if (editing) {
    return (
      <div className="field-root">
        <header className="field-header">
          <div>
            <h1>{beforeSave ? "Edit maid" : "New maid"}</h1>
            <small>Step {step + 1} of 4</small>
          </div>
          <button type="button" className="field-btn" onClick={closeEditor}>
            Cancel
          </button>
        </header>
        <main className="field-main">
          <div className="field-steps" aria-hidden>
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                className={`field-step-dot ${i <= step ? "active" : ""}`}
              />
            ))}
          </div>
          <div className="field-panel">
            {step === 0 && (
              <>
                <label className="field-label">Full name *</label>
                <input
                  className="field-input"
                  value={editing.name}
                  onChange={(e) =>
                    setEditing({ ...editing, name: e.target.value })
                  }
                />
                <label className="field-label">Phone *</label>
                <input
                  className="field-input"
                  type="tel"
                  value={editing.phone}
                  onChange={(e) =>
                    setEditing({ ...editing, phone: e.target.value })
                  }
                />
                <label className="field-label">Area</label>
                <select
                  value={editing.area}
                  onChange={(e) =>
                    setEditing({ ...editing, area: e.target.value })
                  }
                >
                  {areaOptions.map((a) => (
                    <option key={a}>{a}</option>
                  ))}
                </select>
              </>
            )}
            {step === 1 && (
              <>
                <label className="field-label">Services *</label>
                <div className="field-checks">
                  {serviceOptions.map((s) => (
                    <label key={s}>
                      <input
                        type="checkbox"
                        checked={editing.services.includes(s)}
                        onChange={(e) =>
                          setEditing({
                            ...editing,
                            services: e.target.checked
                              ? [...editing.services, s]
                              : editing.services.filter((x) => x !== s),
                          })
                        }
                      />
                      {s}
                    </label>
                  ))}
                </div>
                <label className="field-label">Experience (years)</label>
                <input
                  className="field-input"
                  type="number"
                  min={0}
                  max={60}
                  value={editing.experience}
                  onChange={(e) =>
                    setEditing({
                      ...editing,
                      experience: Number(e.target.value),
                    })
                  }
                />
                <label className="field-label">Monthly pay (₹)</label>
                <input
                  className="field-input"
                  value={editing.salary}
                  onChange={(e) =>
                    setEditing({ ...editing, salary: e.target.value })
                  }
                />
                <label className="field-label">Languages</label>
                <input
                  className="field-input"
                  value={editing.languages}
                  onChange={(e) =>
                    setEditing({ ...editing, languages: e.target.value })
                  }
                />
                <label className="field-label">Work timings</label>
                <input
                  className="field-input"
                  value={editing.schedule}
                  onChange={(e) =>
                    setEditing({ ...editing, schedule: e.target.value })
                  }
                />
                <label className="field-label">Status</label>
                <select
                  value={editing.status}
                  onChange={(e) =>
                    setEditing({
                      ...editing,
                      status: e.target.value as Worker["status"],
                    })
                  }
                >
                  {STATUS_OPTIONS.map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                </select>
              </>
            )}
            {step === 2 && (
              <>
                <label className="field-label">Address</label>
                <textarea
                  className="field-input"
                  rows={3}
                  value={editing.address}
                  onChange={(e) =>
                    setEditing({ ...editing, address: e.target.value })
                  }
                />
                <label className="field-label">Marital status</label>
                <select
                  value={editing.maritalStatus}
                  onChange={(e) =>
                    setEditing({ ...editing, maritalStatus: e.target.value })
                  }
                >
                  <option value="">Not provided</option>
                  <option>Single</option>
                  <option>Married</option>
                  <option>Other</option>
                </select>
                <label className="field-label">Guardian / spouse</label>
                <input
                  className="field-input"
                  value={editing.guardian}
                  onChange={(e) =>
                    setEditing({ ...editing, guardian: e.target.value })
                  }
                />
                <label className="field-label">Dependants</label>
                <input
                  className="field-input"
                  value={editing.dependants}
                  onChange={(e) =>
                    setEditing({ ...editing, dependants: e.target.value })
                  }
                />
                <label className="field-label">Emergency contact</label>
                <input
                  className="field-input"
                  value={editing.emergency}
                  onChange={(e) =>
                    setEditing({ ...editing, emergency: e.target.value })
                  }
                />
                <label className="field-label">Notes</label>
                <textarea
                  className="field-input"
                  rows={2}
                  value={editing.notes}
                  onChange={(e) =>
                    setEditing({ ...editing, notes: e.target.value })
                  }
                />
              </>
            )}
            {step === 3 && (
              <>
                <div style={{ textAlign: "center", marginBottom: "1rem" }}>
                  <div className="field-avatar" style={{ margin: "0 auto" }}>
                    {editing.photoUrl ? (
                      <Image
                        src={editing.photoUrl}
                        alt=""
                        width={48}
                        height={48}
                        unoptimized
                      />
                    ) : (
                      initials(editing.name || "?")
                    )}
                  </div>
                  <label className="field-btn primary" style={{ display: "inline-block", marginTop: "0.75rem" }}>
                    {uploading ? "Uploading…" : "Upload photo"}
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      className="sr-only"
                      disabled={uploading}
                      onChange={(e) => {
                        const f = e.target.files?.[0];
                        if (f) void attachFile(f);
                        e.target.value = "";
                      }}
                    />
                  </label>
                </div>
                {DOC_TYPES.map((name) => {
                  const doc = editing.documents.find((d) => d.name === name);
                  return (
                    <div className="field-doc" key={name}>
                      <div>
                        <strong>{name}</strong>
                        <br />
                        <small>{doc?.file || "Not uploaded"}</small>
                      </div>
                      <label className="field-btn">
                        Upload
                        <input
                          type="file"
                          className="sr-only"
                          accept=".pdf,.jpg,.jpeg,.png,.webp"
                          disabled={uploading}
                          onChange={(e) => {
                            const f = e.target.files?.[0];
                            if (f) void attachFile(f, name);
                            e.target.value = "";
                          }}
                        />
                      </label>
                    </div>
                  );
                })}
                <p style={{ fontSize: "0.8rem", color: "#64748b" }}>
                  Admin verifies documents in the full workspace. You cannot
                  delete profiles from here.
                </p>
              </>
            )}
            <div className="field-actions">
              {step > 0 && (
                <button
                  type="button"
                  className="field-btn"
                  onClick={() => setStep((s) => s - 1)}
                >
                  Back
                </button>
              )}
              {step < 3 ? (
                <button
                  type="button"
                  className="field-btn primary"
                  onClick={() => setStep((s) => s + 1)}
                >
                  Next
                </button>
              ) : (
                <button
                  type="button"
                  className="field-btn primary"
                  disabled={saving || uploading}
                  onClick={() => void saveMaid()}
                >
                  {saving ? "Saving…" : "Save maid"}
                </button>
              )}
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="field-root">
      <header className="field-header">
        <div>
          <h1>Maid onboarding</h1>
          <small>{session.email}</small>
        </div>
        <button
          type="button"
          className="field-btn"
          onClick={() => void adminLogout().then(refreshSession)}
        >
          Sign out
        </button>
      </header>
      <main className="field-main">
        <input
          className="field-search"
          placeholder="Search name, phone, area…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        {visible.length === 0 ? (
          <div className="field-empty">No maids yet. Tap Add maid below.</div>
        ) : (
          visible.map((w) => (
            <button
              type="button"
              key={w.id}
              className="field-card"
              onClick={() => openEdit(w)}
            >
              <div className="field-avatar">
                {w.photoUrl ? (
                  <Image
                    src={w.photoUrl}
                    alt=""
                    width={48}
                    height={48}
                    unoptimized
                  />
                ) : (
                  initials(w.name)
                )}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <strong>{w.name}</strong>
                <div style={{ fontSize: "0.85rem", color: "#64748b" }}>
                  {w.area} · {w.phone}
                </div>
                <span className="field-badge">{w.status}</span>
              </div>
            </button>
          ))
        )}
      </main>
      <button type="button" className="field-fab" onClick={openNew}>
        + Add maid
      </button>
    </div>
  );
}
