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
import ShareLinksPanel from "@/app/components/share/ShareLinksPanel";
import {
  GALLERY_DOC_CATEGORIES,
  VERIFICATION_DOC_TYPES,
  isVerificationDocName,
} from "@/lib/document-categories";
import {
  areaOptions,
  blankWorker,
  serviceOptions,
  type Worker,
} from "@/lib/registry";
import "./field.css";

const DOC_TYPES = [...VERIFICATION_DOC_TYPES];
const STATUS_OPTIONS: Worker["status"][] = ["Available", "Placed", "On leave"];
const STEP_LABELS = ["Contact", "Work", "Family", "Photo & docs"];

function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0])
    .join("")
    .toUpperCase();
}

function docStatus(worker: Worker, name: string) {
  const doc = worker.documents.find((d) => d.name === name);
  return doc?.path ? doc.file || "Uploaded" : "Not uploaded";
}

export default function FieldApp() {
  const [session, setSession] = useState<AdminSessionInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [search, setSearch] = useState("");
  const [viewing, setViewing] = useState<Worker | null>(null);
  const [editing, setEditing] = useState<Worker | null>(null);
  const [step, setStep] = useState(0);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [beforeSave, setBeforeSave] = useState<Worker | null>(null);
  const [galleryCategory, setGalleryCategory] = useState<string>(
    GALLERY_DOC_CATEGORIES[0],
  );
  const [galleryNote, setGalleryNote] = useState("");

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
    setViewing(null);
    setBeforeSave(null);
    setEditing(blankWorker());
    setStep(0);
  }

  function openView(w: Worker) {
    setEditing(null);
    setViewing(w);
  }

  function openEdit(w: Worker) {
    setViewing(null);
    setBeforeSave(w);
    setEditing({ ...w, documents: w.documents.map((d) => ({ ...d })) });
    setStep(0);
  }

  function closeEditor() {
    setEditing(null);
    setBeforeSave(null);
    setStep(0);
  }

  function goNext() {
    if (!editing) return;
    if (step === 0) {
      if (!editing.name.trim()) {
        toast.error("Enter full name.");
        return;
      }
      if (editing.phone.replace(/\D/g, "").length < 10) {
        toast.error("Enter a valid 10-digit phone number.");
        return;
      }
    }
    if (step === 1 && !editing.services.length) {
      toast.error("Select at least one service.");
      return;
    }
    setStep((s) => s + 1);
  }

  function galleryDocs(w: Worker) {
    return w.documents.filter((d) => !isVerificationDocName(d.name));
  }

  async function attachGalleryFile(file: File) {
    if (!editing) return;
    const category = galleryCategory;
    const note =
      galleryCategory === "Other" ? galleryNote.trim() : galleryNote.trim();
    setUploading(true);
    try {
      const uploaded = await uploadAdminFile(editing.id, file, false);
      const id = crypto.randomUUID();
      setEditing((w) =>
        w
          ? {
              ...w,
              documents: [
                ...w.documents,
                {
                  id,
                  name: category,
                  note: note || undefined,
                  file: file.name,
                  path: uploaded.path,
                  bucket: uploaded.bucket,
                  reviewed: false,
                },
              ],
              verification: "Pending",
            }
          : w,
      );
      setGalleryNote("");
      toast.success("Document added to gallery");
    } catch (e) {
      toast.error(String((e as Error).message));
    } finally {
      setUploading(false);
    }
  }

  function removeGalleryDoc(docId: string) {
    if (!editing) return;
    setEditing({
      ...editing,
      documents: editing.documents.filter((d) => d.id !== docId),
    });
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
                    id: crypto.randomUUID(),
                    name: documentName,
                    file: file.name,
                    path: uploaded.path,
                    bucket: uploaded.bucket,
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
      toast.success(documentName ? `${documentName} uploaded` : "Photo uploaded");
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
      const copy = { ...editing, schedule: "", salary: editing.salary || "" };
      delete copy.photoUrl;
      const storedBefore = beforeSave
        ? { ...beforeSave, photoUrl: undefined }
        : null;
      await saveRegistryChanges(
        [{ table: "maids", before: storedBefore, after: copy }],
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

  if (viewing) {
    return (
      <div className="field-root">
        <header className="field-header">
          <div>
            <h1>Profile</h1>
            <small>{viewing.id}</small>
          </div>
          <button
            type="button"
            className="field-btn"
            onClick={() => setViewing(null)}
          >
            Back
          </button>
        </header>
        <main className="field-main">
          <div className="field-panel field-profile-view">
            <div className="field-profile-hero">
              <div className="field-avatar field-avatar-lg">
                {viewing.photoUrl ? (
                  <Image
                    src={viewing.photoUrl}
                    alt=""
                    width={72}
                    height={72}
                    unoptimized
                  />
                ) : (
                  initials(viewing.name)
                )}
              </div>
              <h2 className="field-profile-name">{viewing.name}</h2>
              <p className="field-profile-phone">{viewing.phone}</p>
              <div className="field-profile-badges">
                <span className="field-badge">{viewing.status}</span>
                <span className="field-badge">{viewing.verification}</span>
              </div>
            </div>
            <dl className="field-dl">
              <dt>Area</dt>
              <dd>{viewing.area}</dd>
              <dt>Services</dt>
              <dd>{viewing.services.join(" · ") || "—"}</dd>
              <dt>Experience</dt>
              <dd>{viewing.experience} years</dd>
              <dt>Languages</dt>
              <dd>{viewing.languages || "—"}</dd>
              <dt>Address</dt>
              <dd>{viewing.address || "—"}</dd>
              <dt>Emergency</dt>
              <dd>{viewing.emergency || "—"}</dd>
            </dl>
            <h3 className="field-section-title">Documents</h3>
            <ul className="field-doc-list">
              {DOC_TYPES.map((name) => {
                const ok = viewing.documents.some((d) => d.name === name && d.path);
                return (
                  <li key={name} className={ok ? "done" : ""}>
                    {name}
                    <span>{ok ? "Uploaded" : "Missing"}</span>
                  </li>
                );
              })}
            </ul>
            {galleryDocs(viewing).length > 0 && (
              <>
                <h3 className="field-section-title">More documents</h3>
                <ul className="field-doc-list">
                  {galleryDocs(viewing).map((d) => (
                    <li key={d.id ?? d.file} className="done">
                      {d.name}
                      {d.note ? ` — ${d.note}` : ""}
                      <span>{d.file}</span>
                    </li>
                  ))}
                </ul>
              </>
            )}
            <ShareLinksPanel maidId={viewing.id} className="field-share-block" />
            <button
              type="button"
              className="field-btn primary field-full"
              onClick={() => openEdit(viewing)}
            >
              Edit profile
            </button>
          </div>
        </main>
      </div>
    );
  }

  if (editing) {
    return (
      <div className="field-root">
        <header className="field-header">
          <div>
            <h1>{beforeSave ? "Edit maid" : "New maid"}</h1>
            <small>
              {STEP_LABELS[step]} · Step {step + 1} of {STEP_LABELS.length}
            </small>
          </div>
          <button type="button" className="field-btn" onClick={closeEditor}>
            Cancel
          </button>
        </header>
        <main className="field-main">
          <div className="field-steps" aria-hidden>
            {STEP_LABELS.map((_, i) => (
              <div
                key={i}
                className={`field-step-dot ${i <= step ? "active" : ""}`}
              />
            ))}
          </div>
          <div className="field-panel">
            {step === 0 && (
              <>
                <p className="field-hint">Start with name and mobile number.</p>
                <label className="field-label">Full name *</label>
                <input
                  className="field-input"
                  autoFocus
                  value={editing.name}
                  onChange={(e) =>
                    setEditing({ ...editing, name: e.target.value })
                  }
                />
                <label className="field-label">Phone *</label>
                <input
                  className="field-input"
                  type="tel"
                  inputMode="tel"
                  placeholder="10-digit mobile"
                  value={editing.phone}
                  onChange={(e) =>
                    setEditing({ ...editing, phone: e.target.value })
                  }
                />
              </>
            )}
            {step === 1 && (
              <>
                <label className="field-label">Work area</label>
                <select
                  className="field-input"
                  value={editing.area}
                  onChange={(e) =>
                    setEditing({ ...editing, area: e.target.value })
                  }
                >
                  {areaOptions.map((a) => (
                    <option key={a}>{a}</option>
                  ))}
                </select>
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
                <label className="field-label">Languages</label>
                <input
                  className="field-input"
                  value={editing.languages}
                  onChange={(e) =>
                    setEditing({ ...editing, languages: e.target.value })
                  }
                />
                <label className="field-label">Status</label>
                <select
                  className="field-input"
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
                  className="field-input"
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
                <p className="field-hint">
                  Upload photo and all three verification documents (PDF or
                  image).
                </p>
                <div className="field-photo-block">
                  <div className="field-avatar field-avatar-lg">
                    {editing.photoUrl ? (
                      <Image
                        src={editing.photoUrl}
                        alt=""
                        width={72}
                        height={72}
                        unoptimized
                      />
                    ) : (
                      initials(editing.name || "?")
                    )}
                  </div>
                  <label className="field-btn primary">
                    {uploading ? "Uploading…" : "Maid photo"}
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
                <h3 className="field-section-title">Required documents</h3>
                {DOC_TYPES.map((name) => {
                  const doc = editing.documents.find((d) => d.name === name);
                  const done = Boolean(doc?.path);
                  return (
                    <div
                      className={`field-doc field-doc-card ${done ? "done" : ""}`}
                      key={name}
                    >
                      <div>
                        <strong>{name}</strong>
                        <small>{docStatus(editing, name)}</small>
                      </div>
                      <label className="field-btn">
                        {done ? "Replace" : "Upload"}
                        <input
                          type="file"
                          className="sr-only"
                          accept=".pdf,.jpg,.jpeg,.png,.webp,image/*,application/pdf"
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
                <h3 className="field-section-title">More documents</h3>
                <p className="field-hint">
                  Optional extra files with a category and note.
                </p>
                <label className="field-label">Category</label>
                <select
                  className="field-input"
                  value={galleryCategory}
                  onChange={(e) => setGalleryCategory(e.target.value)}
                >
                  {GALLERY_DOC_CATEGORIES.map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
                <label className="field-label">Note (optional)</label>
                <input
                  className="field-input"
                  value={galleryNote}
                  placeholder={
                    galleryCategory === "Other"
                      ? "Describe this document"
                      : "e.g. employer name"
                  }
                  onChange={(e) => setGalleryNote(e.target.value)}
                />
                <label className="field-btn" style={{ marginTop: "0.5rem" }}>
                  {uploading ? "Uploading…" : "Add document"}
                  <input
                    type="file"
                    className="sr-only"
                    accept=".pdf,.jpg,.jpeg,.png,.webp,image/*,application/pdf"
                    disabled={uploading}
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      if (f) void attachGalleryFile(f);
                      e.target.value = "";
                    }}
                  />
                </label>
                {galleryDocs(editing).map((d) => (
                  <div className="field-doc field-doc-card done" key={d.id}>
                    <div>
                      <strong>{d.name}</strong>
                      {d.note && <small>{d.note}</small>}
                      <small>{d.file}</small>
                    </div>
                    <button
                      type="button"
                      className="field-btn"
                      onClick={() => d.id && removeGalleryDoc(d.id)}
                    >
                      Remove
                    </button>
                  </div>
                ))}
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
              {step < STEP_LABELS.length - 1 ? (
                <button
                  type="button"
                  className="field-btn primary"
                  onClick={goNext}
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
                  {saving ? "Saving…" : "Save profile"}
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
          <h1>Maid profiles</h1>
          <small>Tap a name to view · {session.email}</small>
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
          placeholder="Search name or phone…"
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
              onClick={() => openView(w)}
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
                  {w.phone}
                  {w.area ? ` · ${w.area}` : ""}
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
