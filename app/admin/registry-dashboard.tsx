"use client";

import { useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import BrandLogo from "@/components/brand-logo";
import Image from "next/image";
import StaffLogin from "./staff-login";
import StaffWorkspace from "./staff-workspace";
import EnquiriesPanel from "./enquiries-panel";
import { fetchAdminEnquiries, fetchAdminSession } from "@/lib/admin-api";
import {
  ArrowDownToLine,
  ArrowRight,
  BriefcaseBusiness,
  CalendarDays,
  Check,
  ChevronRight,
  ClipboardList,
  FileCheck2,
  HeartHandshake,
  House,
  LayoutDashboard,
  Leaf,
  ListFilter,
  Mail,
  MapPin,
  Plus,
  Search,
  Settings2,
  ShieldCheck,
  Sparkles,
  Users,
  UserRound,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import ClientsPanel from "./clients-panel";
import GrantToClientModal from "@/app/components/admin/GrantToClientModal";
import {
  GALLERY_DOC_CATEGORIES,
  isVerificationDocName,
} from "@/lib/document-categories";
import IndianMobileInput from "@/components/indian-mobile-input";
import {
  digitsOnlyField,
  indianMobileValidationMessage,
  isValidIndianMobile,
} from "@/lib/india-contact";
import { workerProfileCompletion } from "@/lib/worker-profile-completion";
import {
  areaOptions,
  blankWorker,
  formatWorkerAreas,
  normalizeWorker,
  workerAreas,
  workerDisplayRef,
  serviceOptions,
  useRegistry,
  uploadFile,
  openDocument,
  removeUploadedFiles,
  type Worker,
  type Household,
  type Placement,
} from "@/lib/registry";

const sections = [
  { name: "Overview", icon: LayoutDashboard },
  { name: "Maid profiles", icon: Users },
  { name: "Applications", icon: ClipboardList },
  { name: "Enquiries", icon: Mail },
  { name: "Clients", icon: UserRound },
  { name: "Verification", icon: ShieldCheck },
  { name: "Households", icon: House },
  { name: "Placements", icon: BriefcaseBusiness },
  { name: "Workspace", icon: Settings2 },
];
const colors = ["peach", "sage", "lilac", "sand"];
const profileTabs = [
  "Professional",
  "Personal & family",
  "Documents",
  "History",
] as const;
type ProfileTab = (typeof profileTabs)[number];
function initials(name: string) {
  return name
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0])
    .join("");
}
function WorkerAvatar({
  worker,
  color,
  size = "md",
}: {
  worker: Worker;
  color: string;
  size?: "md" | "lg";
}) {
  const [failed, setFailed] = useState("");
  const dim = size === "lg" ? 96 : 72;
  return (
    <div className={`rg-avatar ${color}${size === "lg" ? " lg" : ""}`}>
      {worker.photoUrl && failed !== worker.photoUrl ? (
        <Image
          src={worker.photoUrl}
          unoptimized
          width={dim}
          height={dim}
          alt={`Photo of ${worker.name}`}
          onError={() => setFailed(worker.photoUrl!)}
        />
      ) : (
        initials(worker.name)
      )}
    </div>
  );
}
function ProfileStat({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon?: ReactNode;
}) {
  const text = value?.trim() ? value : "—";
  return (
    <div className="rg-profile-stat">
      {icon ? <span className="rg-profile-stat-icon">{icon}</span> : null}
      <div>
        <span className="rg-profile-stat-label">{label}</span>
        <strong className="rg-profile-stat-value">{text}</strong>
      </div>
    </div>
  );
}
function Badge({
  children,
  tone = "neutral",
}: {
  children: ReactNode;
  tone?: string;
}) {
  return <span className={`rg-badge ${tone}`}>{children}</span>;
}
function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="rg-field">
      <span>{label}</span>
      {children}
    </label>
  );
}
function ProfileCompletionBar({ worker }: { worker: Worker }) {
  const { percent, missing } = workerProfileCompletion(worker);
  return (
    <div className="rg-profile-complete">
      <div className="rg-profile-complete-head">
        <span>Profile completeness</span>
        <strong>{percent}%</strong>
      </div>
      <div
        className="rg-profile-complete-track"
        role="progressbar"
        aria-valuenow={percent}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`Profile ${percent}% complete`}
      >
        <div
          className="rg-profile-complete-fill"
          style={{ width: `${percent}%` }}
        />
      </div>
      {percent < 100 && missing.length > 0 && (
        <p className="rg-profile-complete-missing">
          Still needed: {missing.slice(0, 4).join(", ")}
          {missing.length > 4 ? ` +${missing.length - 4} more` : ""}
        </p>
      )}
    </div>
  );
}
function applyAdminWorkerDefaults(
  snapshot: Worker,
  adminRole: "Admin" | "Coordinator",
): Worker {
  if (adminRole !== "Admin") return snapshot;
  return { ...snapshot, verification: "Verified" };
}
function Panel({
  title,
  subtitle,
  children,
  action,
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
  action?: ReactNode;
}) {
  return (
    <section className="rg-panel">
      <div className="rg-panel-heading">
        <div>
          <h2>{title}</h2>
          {subtitle && <p>{subtitle}</p>}
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}

export default function RegistryDashboard() {
  const router = useRouter();
  const {
    data,
    update,
    loading,
    saving,
    error,
    session,
    staff,
    refresh,
    signOut,
  } = useRegistry();
  const role = staff?.role || "Coordinator";
  useEffect(() => {
    if (staff?.role === "Coordinator") {
      router.replace("/field");
    }
  }, [staff?.role, router]);
  const [uploading, setUploading] = useState(false);
  const [galleryCategory, setGalleryCategory] = useState<string>(
    GALLERY_DOC_CATEGORIES[0],
  );
  const [galleryNote, setGalleryNote] = useState("");
  const uploads = useRef<{ bucket: string; path: string }[]>([]);
  const [section, setSection] = useState("Overview");
  const [search, setSearch] = useState("");
  const [area, setArea] = useState("All areas");
  const [status, setStatus] = useState("All statuses");
  const [service, setService] = useState("All services");
  const [worker, setWorker] = useState<Worker | null>(null);
  const [editing, setEditing] = useState(false);
  const [profileTab, setProfileTab] = useState<ProfileTab>("Professional");
  const [household, setHousehold] = useState<Household | null>(null);
  const [placementOpen, setPlacementOpen] = useState(false);
  const [view, setView] = useState("cards");
  const [newEnquiries, setNewEnquiries] = useState(0);
  const [maidSelectMode, setMaidSelectMode] = useState(false);
  const [selectedMaidIds, setSelectedMaidIds] = useState<string[]>([]);
  const [grantModalOpen, setGrantModalOpen] = useState(false);
  useEffect(() => {
    if (!staff) {
      setNewEnquiries(0);
      return;
    }
    void fetchAdminEnquiries()
      .then((rows) =>
        setNewEnquiries(rows.filter((r) => r.status === "New").length),
      )
      .catch(() => setNewEnquiries(0));
  }, [staff, data.activity]);
  const visible = data.workers.filter(
    (w) =>
      (section === "Verification" ? w.verification === "Pending" : true) &&
      (status === "All statuses"
        ? w.status !== "Archived"
        : w.status === status) &&
      (area === "All areas" || workerAreas(w).includes(area)) &&
      (service === "All services" || w.services.includes(service)) &&
      `${w.name} ${w.id} ${w.phone} ${formatWorkerAreas(workerAreas(w))}`
        .toLowerCase()
        .includes(search.toLowerCase()),
  );
  const active = data.workers.filter((w) => w.status !== "Archived");
  const pending = active.filter((w) => w.verification === "Pending");
  const applications = data.applications.filter((a) => a.status === "New");
  function navigate(next: string) {
    setSection(next);
    setSearch("");
    setStatus("All statuses");
    setArea("All areas");
    setService("All services");
  }
  function openProfile(value: Worker, edit = false) {
    const copy = normalizeWorker({
      ...value,
      documents: value.documents.map((d) => ({ ...d })),
    });
    setWorker(copy);
    setEditing(edit);
    setProfileTab("Professional");
  }
  function toggleWorkerArea(areaName: string, checked: boolean) {
    setWorker((w) => {
      if (!w) return w;
      const current = workerAreas(w);
      const next = checked
        ? [...new Set([...current, areaName])]
        : current.filter((a) => a !== areaName);
      if (!next.length) {
        toast.error("Select at least one operating area");
        return w;
      }
      return {
        ...w,
        areas: next,
        area: formatWorkerAreas(next),
      };
    });
  }
  function validateWorkerForSave(current: Worker): string | null {
    if (!current.name.trim() || !current.services.length) {
      return "Enter a name and at least one service";
    }
    if (!isValidIndianMobile(current.phone)) {
      return indianMobileValidationMessage();
    }
    if (!workerAreas(current).length) {
      return "Select at least one operating area";
    }
    if (
      role !== "Admin" &&
      current.verification === "Verified" &&
      !["Identity proof", "Address proof", "Police verification"].every(
        (name) => current.documents.some((d) => d.name === name && d.reviewed),
      )
    ) {
      return "Review all three documents before marking the profile verified";
    }
    return null;
  }

  async function restoreArchivedWorker() {
    if (!worker || worker.status !== "Archived") return;
    const restored = applyAdminWorkerDefaults(
      normalizeWorker({ ...worker, status: "Available" }),
      role,
    );
    if (
      !(await update((d) => ({
        ...d,
        workers: d.workers.map((w) =>
          w.id === restored.id ? restored : w,
        ),
        activity: [
          `${restored.name} restored from archive`,
          ...d.activity,
        ].slice(0, 8),
      })))
    )
      return;
    setWorker(restored);
    toast.success("Profile restored — now Available");
  }

  async function persistWorker(options?: { close?: boolean; goNext?: boolean }) {
    if (!worker || uploading || saving) return false;
    let snapshot = normalizeWorker(worker);
    snapshot = applyAdminWorkerDefaults(snapshot, role);
    const validationError = validateWorkerForSave(snapshot);
    if (validationError) {
      toast.error(validationError);
      return false;
    }
    setWorker(snapshot);
    if (
      !(await update((d) => ({
        ...d,
        workers: d.workers.some((w) => w.id === snapshot.id)
          ? d.workers.map((w) => (w.id === snapshot.id ? snapshot : w))
          : [snapshot, ...d.workers],
        activity: [`${snapshot.name}’s profile saved`, ...d.activity].slice(0, 8),
      })))
    )
      return false;
    const used = new Set(
      [snapshot.photoPath, ...snapshot.documents.map((d) => d.path)].filter(
        Boolean,
      ),
    );
    const original = data.workers.find((w) => w.id === snapshot.id);
    const obsolete = [
      ...uploads.current,
      ...(original?.photoPath
        ? [{ bucket: "maid-photos", path: original.photoPath }]
        : []),
      ...(original?.documents.flatMap((d) =>
        d.path ? [{ bucket: "maid-documents", path: d.path }] : [],
      ) || []),
    ].filter((file) => !used.has(file.path));
    uploads.current = [];
    for (const file of obsolete) void removeUploadedFiles([file]);

    if (options?.goNext) {
      const index = profileTabs.indexOf(profileTab);
      if (index >= 0 && index < profileTabs.length - 1) {
        setProfileTab(profileTabs[index + 1]);
      }
      toast.success("Saved — continue on the next section");
    } else if (options?.close) {
      setWorker(null);
      toast.success("Profile saved");
    } else {
      toast.success("Saved");
    }
    return true;
  }

  async function saveWorker(event: FormEvent) {
    event.preventDefault();
    await persistWorker();
  }
  function changeWorker<K extends keyof Worker>(field: K, value: Worker[K]) {
    setWorker((w) => (w ? { ...w, [field]: value } : w));
  }
  async function reviewApplication(id: string, approve: boolean) {
    const application = data.applications.find((a) => a.id === id);
    if (!application || application.status !== "New") return;
    if (
      !(await update((d) => ({
        ...d,
        applications: d.applications.map((a) =>
          a.id === id ? { ...a, status: approve ? "Approved" : "Declined" } : a,
        ),
        workers: approve
          ? [
              applyAdminWorkerDefaults(
                {
                  ...blankWorker(),
                  applicationId: application.id,
                  name: application.name,
                  phone: application.phone,
                  area: application.area,
                  areas: application.area ? [application.area] : [],
                  services: application.services,
                  schedule: application.schedule || "",
                  languages: application.language,
                },
                role,
              ),
              ...d.workers,
            ]
          : d.workers,
        activity: [
          `${application.name}’s application ${approve ? "approved" : "declined"}`,
          ...d.activity,
        ].slice(0, 8),
      })))
    )
      return;
    toast.success(
      approve
        ? role === "Admin"
          ? "Profile created and marked verified"
          : "Profile created · verification pending"
        : "Application declined",
    );
  }
  function exportProfiles() {
    const text = [
      "ID,Name,Area,Services,Status,Verification",
      ...visible.map((w) =>
        [
          w.id,
          w.name,
          formatWorkerAreas(workerAreas(w)),
          w.services.join(" / "),
          w.status,
          w.verification,
        ]
          .map((v) => `"${v.replaceAll('"', '""')}"`)
          .join(","),
      ),
    ].join("\n");
    const url = URL.createObjectURL(
      new Blob([text], { type: "text/csv;charset=utf-8" }),
    );
    const a = document.createElement("a");
    a.href = url;
    a.download = "sakhihome-profiles.csv";
    a.click();
    URL.revokeObjectURL(url);
  }
  async function saveHousehold(e: FormEvent) {
    e.preventDefault();
    if (!household) return;
    if (!isValidIndianMobile(household.phone)) {
      toast.error(indianMobileValidationMessage());
      return;
    }
    if (
      !(await update((d) => ({
        ...d,
        households: d.households.some((h) => h.id === household.id)
          ? d.households.map((h) => (h.id === household.id ? household : h))
          : [...d.households, household],
      })))
    )
      return;
    setHousehold(null);
    toast.success("Household saved");
  }
  async function createPlacement(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const values = Object.fromEntries(new FormData(e.currentTarget));
    const next: Placement = {
      id: `PL-${Date.now()}`,
      workerId: String(values.workerId),
      householdId: String(values.householdId),
      service: String(values.service),
      days: String(values.days),
      from: String(values.from),
      to: String(values.to),
      salary: String(values.salary),
      start: String(values.start),
      status: "Active",
    };
    if (next.from >= next.to) {
      toast.error("End time must be after start time");
      return;
    }
    const overlaps = data.placements.some(
      (p) =>
        p.workerId === next.workerId &&
        p.status === "Active" &&
        p.days.split(",").some((day) =>
          next.days
            .split(",")
            .map((d) => d.trim())
            .includes(day.trim()),
        ) &&
        p.from < next.to &&
        next.from < p.to,
    );
    if (overlaps) {
      toast.error("This maid already has a placement during those hours");
      return;
    }
    if (
      !(await update((d) => ({
        ...d,
        placements: [next, ...d.placements],
        workers: d.workers.map((w) =>
          w.id === next.workerId ? { ...w, status: "Placed" } : w,
        ),
        activity: [
          "A new household placement was created",
          ...d.activity,
        ].slice(0, 8),
      })))
    )
      return;
    setPlacementOpen(false);
    toast.success("Placement created");
  }
  async function endPlacement(id: string) {
    if (
      !(await update((d) => {
        const selected = d.placements.find((p) => p.id === id);
        const placements = d.placements.map((p) =>
          p.id === id ? { ...p, status: "Ended" as const } : p,
        );
        return {
          ...d,
          placements,
          workers: d.workers.map((w) =>
            w.id === selected?.workerId &&
            !placements.some(
              (p) => p.workerId === w.id && p.status === "Active",
            )
              ? { ...w, status: "Available" }
              : w,
          ),
        };
      }))
    )
      return;
    toast.success("Placement ended; history retained");
  }
  function closeProfile() {
    const abandoned = uploads.current;
    uploads.current = [];
    for (const file of abandoned)
      void removeUploadedFiles([file]);
    setWorker(null);
  }
  async function attachFile(file: File, documentName?: string) {
    if (!worker || uploading || saving) return;
    setUploading(true);
    try {
      const uploaded = await uploadFile(worker.id, file, !documentName);
      uploads.current.push(uploaded);
      if (documentName) {
        changeWorker("documents", [
          ...worker.documents.filter((d) => d.name !== documentName),
          {
            name: documentName,
            file: file.name,
            path: uploaded.path,
            reviewed: false,
          },
        ]);
        if (role !== "Admin") changeWorker("verification", "Pending");
      } else {
        setWorker((w) =>
          w
            ? {
                ...w,
                photoPath: uploaded.path,
                photoUrl: uploaded.signedUrl,
              }
            : w,
        );
      }
      toast.success(
        documentName
          ? role === "Admin"
            ? "Document uploaded. Save the profile to keep it."
            : "Document uploaded. Review it before verification."
          : "Photo uploaded. Save the profile to keep it.",
      );
    } catch (cause) {
      toast.error(String((cause as Error).message));
    } finally {
      setUploading(false);
    }
  }
  async function attachGalleryFile(file: File) {
    if (!worker || uploading || saving) return;
    setUploading(true);
    try {
      const uploaded = await uploadFile(worker.id, file, false);
      uploads.current.push(uploaded);
      const id = crypto.randomUUID();
      const note = galleryNote.trim();
      changeWorker("documents", [
        ...worker.documents,
        {
          id,
          name: galleryCategory,
          note: note || undefined,
          file: file.name,
          path: uploaded.path,
          reviewed: false,
        },
      ]);
      if (role !== "Admin") changeWorker("verification", "Pending");
      setGalleryNote("");
      toast.success("Gallery document uploaded");
    } catch (cause) {
      toast.error(String((cause as Error).message));
    } finally {
      setUploading(false);
    }
  }
  const profileCards = (
    <>
      {visible.length ? (
        <div className={`rg-profiles ${view === "list" ? "rg-list" : ""}`}>
          {visible.map((w, i) => {
            const completion = workerProfileCompletion(w);
            return (
            <button
              className="rg-profile"
              key={w.id}
              onClick={() => {
                if (maidSelectMode && section === "Maid profiles") {
                  setSelectedMaidIds((ids) =>
                    ids.includes(w.id)
                      ? ids.filter((x) => x !== w.id)
                      : [...ids, w.id],
                  );
                  return;
                }
                openProfile(w);
              }}
            >
              {maidSelectMode && section === "Maid profiles" && (
                <input
                  type="checkbox"
                  checked={selectedMaidIds.includes(w.id)}
                  readOnly
                  style={{ position: "absolute", top: 8, right: 8 }}
                />
              )}
              <div className="rg-profile-top">
                <WorkerAvatar worker={w} color={colors[i % 4]} />
                <Badge
                  tone={
                    w.status === "Available"
                      ? "green"
                      : w.status === "Placed"
                        ? "blue"
                        : "neutral"
                  }
                >
                  <span className="rg-dot" />
                  {w.status}
                </Badge>
              </div>
              <div>
                <h3>{w.name}</h3>
                <p className="rg-id">
                  {workerDisplayRef(w.id)} <span>·</span> {w.experience} years
                  experience
                </p>
              </div>
              <p className="rg-location">
                <MapPin size={14} />
                {formatWorkerAreas(workerAreas(w))}
              </p>
              <div className="rg-tags">
                {w.services.map((s) => (
                  <span key={s}>{s}</span>
                ))}
              </div>
              <div className="rg-profile-card-complete">
                <span>
                  <span>Profile</span>
                  <strong>{completion.percent}%</strong>
                </span>
                <div className="rg-profile-complete-track">
                  <div
                    className="rg-profile-complete-fill"
                    style={{ width: `${completion.percent}%` }}
                  />
                </div>
              </div>
              <div className="rg-profile-bottom">
                <span
                  className={
                    w.verification === "Verified" ? "rg-verified" : "rg-pending"
                  }
                >
                  <ShieldCheck size={15} />
                  {w.verification === "Verified"
                    ? "Verified profile"
                    : "Verification pending"}
                </span>
                <ChevronRight size={17} />
              </div>
            </button>
            );
          })}
        </div>
      ) : (
        <div className="rg-empty">
          <Search />
          <h3>No profiles found</h3>
          <p>Try another name or clear the filters.</p>
          <button
            className="rg-btn"
            onClick={() => {
              setSearch("");
              setArea("All areas");
              setStatus("All statuses");
              setService("All services");
            }}
          >
            Clear filters
          </button>
        </div>
      )}
    </>
  );

  if (loading)
    return (
      <main className="rg-login">
        <p role="status">Loading SakhiHome workspace…</p>
      </main>
    );
  if (!session || !staff)
    return (
      <>
        <StaffLogin
          onLoggedIn={() =>
            void fetchAdminSession().then((info) => refresh(info))
          }
        />
        {error && (
          <p role="alert" className="rg-login-message">
            {error}
          </p>
        )}
      </>
    );
  return (
    <div className="rg-app">
      <aside className="rg-sidebar">
        <BrandLogo />
        <div className="rg-side-label">MANAGE YOUR NETWORK</div>
        <nav aria-label="Workspace navigation">
          {sections.map(({ name, icon: Icon }) => (
            <button
              key={name}
              className={section === name ? "active" : ""}
              onClick={() => navigate(name)}
              aria-current={section === name ? "page" : undefined}
            >
              <Icon size={19} />
              <span>{name}</span>
              {name === "Applications" && applications.length > 0 && (
                <b>{applications.length}</b>
              )}
              {name === "Enquiries" && newEnquiries > 0 && (
                <b>{newEnquiries}</b>
              )}
              {section === name && <ChevronRight size={15} />}
            </button>
          ))}
        </nav>
        <div className="rg-sidebar-note">
          <Leaf size={26} />
          <h3>Good work. Better lives.</h3>
          <p>Every profile is a step toward a meaningful opportunity.</p>
          <Link href="/register">
            Open registration <ArrowRight size={15} />
          </Link>
        </div>
        <div className="rg-account">
          <div className="rg-account-avatar">SH</div>
          <div>
            <strong>SakhiHome team</strong>
            <span>{role} · Staff workspace</span>
          </div>
        </div>
      </aside>
      <div className="rg-main">
        <header className="rg-topbar">
          <div className="rg-breadcrumb">
            Workspace <ChevronRight size={14} />
            <strong>{section}</strong>
          </div>
          <div className="rg-top-actions">
            <Badge tone="amber">
              <span className="rg-dot" />
              Connected
            </Badge>
            <Link href="/field" className="rg-registration-link">
              Field app <ArrowRight size={15} />
            </Link>
            <Link href="/register" className="rg-registration-link">
              Registration form <ArrowRight size={15} />
            </Link>
            <button className="rg-text-btn" onClick={() => void signOut()}>
              Sign out
            </button>
          </div>
        </header>
        <main className="rg-content">
          <div className="rg-page-heading">
            <div>
              <p className="rg-eyebrow">YOUR PEOPLE. YOUR COMMUNITY.</p>
              <h1>
                {section === "Overview"
                  ? "A little care. A lot of possibility."
                  : section}
              </h1>
              <p>
                {section === "Overview"
                  ? "Everything you need to grow and care for your SakhiHome network."
                  : section === "Maid profiles"
                    ? "Know your people. Find the right fit for every home."
                    : section === "Applications"
                      ? "Welcome new professionals into your network."
                      : section === "Enquiries"
                        ? "Follow up on families who reached out from the website."
                        : section === "Clients"
                          ? "Manage families, portal access, and profile grants. Records are never deleted."
                          : section === "Verification"
                        ? "Review documents and build trust, one profile at a time."
                        : section === "Households"
                          ? "The homes and families your network supports."
                          : section === "Placements"
                            ? "Connect the right professional with the right household."
                            : "Manage staff access and your workspace."}
              </p>
            </div>
            {section !== "Clients" && (
              <button
                className="rg-btn primary"
                onClick={() =>
                  section === "Households"
                    ? setHousehold({
                        id: `HH-${Date.now()}`,
                        name: "",
                        phone: "",
                        area: "Wakad",
                        address: "",
                        service: "Cleaning",
                      })
                    : section === "Placements"
                      ? setPlacementOpen(true)
                      : openProfile(
                          applyAdminWorkerDefaults(blankWorker(), role),
                          true,
                        )
                }
              >
                <Plus size={17} />
                {section === "Households"
                  ? "Add household"
                  : section === "Placements"
                    ? "New placement"
                    : "Add maid profile"}
              </button>
            )}
          </div>
          {error && (
            <div className="rg-error" role="alert">
              {error}
              <button className="rg-btn small" onClick={() => void refresh()}>
                Retry
              </button>
            </div>
          )}
          {saving && <p role="status">Saving changes…</p>}
          <div className="rg-demo-note">
            <Sparkles size={15} />
            <span>
              Profiles, photos, and documents are stored securely in SakhiHome’s
              database.
            </span>
          </div>
          {section === "Overview" && (
            <>
              <div className="rg-stats">
                {[
                  {
                    label: "Registered professionals",
                    value: active.length,
                    icon: Users,
                    note: "Your growing SakhiHome network",
                    tone: "sage",
                  },
                  {
                    label: "Available for work",
                    value: active.filter((w) => w.status === "Available")
                      .length,
                    icon: HeartHandshake,
                    note: "Ready for their next opportunity",
                    tone: "peach",
                  },
                  {
                    label: "Active placements",
                    value: data.placements.filter((p) => p.status === "Active")
                      .length,
                    icon: BriefcaseBusiness,
                    note: "Supporting homes every day",
                    tone: "lilac",
                  },
                  {
                    label: "Awaiting verification",
                    value: pending.length,
                    icon: FileCheck2,
                    note: "A little attention goes a long way",
                    tone: "sand",
                  },
                ].map((s) => (
                  <div className="rg-stat" key={s.label}>
                    <div>
                      <p>{s.label}</p>
                      <strong>{String(s.value).padStart(2, "0")}</strong>
                      <small>{s.note}</small>
                    </div>
                    <span className={`rg-stat-icon ${s.tone}`}>
                      <s.icon size={22} />
                    </span>
                  </div>
                ))}
              </div>
              <div className="rg-overview-grid">
                <section className="rg-welcome">
                  <div>
                    <Badge tone="light">A NETWORK BUILT ON TRUST</Badge>
                    <h2>
                      More than a profile.
                      <br />A person with potential.
                    </h2>
                    <p>
                      Keep skills, availability, and important details
                      together—so the next great match is always within reach.
                    </p>
                    <button
                      className="rg-btn white"
                      onClick={() => navigate("Maid profiles")}
                    >
                      Explore your network <ArrowRight size={16} />
                    </button>
                  </div>
                  <div className="rg-plant" aria-hidden="true">
                    <span className="rg-plant-orbit" />
                    <Leaf size={100} strokeWidth={1} />
                    <div className="rg-floating-heart">
                      <HeartHandshake size={30} />
                    </div>
                    <span className="rg-plant-caption">Growing together</span>
                  </div>
                </section>
                <Panel
                  title="Needs your attention"
                  subtitle="A few small steps to keep things moving"
                >
                  <button
                    className="rg-attention"
                    onClick={() => navigate("Applications")}
                  >
                    <span className="rg-small-icon peach">
                      <ClipboardList size={19} />
                    </span>
                    <span>
                      <strong>{applications.length} new applications</strong>
                      <small>Meet your newest applicants</small>
                    </span>
                    <ChevronRight size={18} />
                  </button>
                  <button
                    className="rg-attention"
                    onClick={() => navigate("Verification")}
                  >
                    <span className="rg-small-icon sand">
                      <ShieldCheck size={19} />
                    </span>
                    <span>
                      <strong>{pending.length} profiles to verify</strong>
                      <small>Review their supporting documents</small>
                    </span>
                    <ChevronRight size={18} />
                  </button>
                  <Link className="rg-attention" href="/register">
                    <span className="rg-small-icon sage">
                      <Plus size={19} />
                    </span>
                    <span>
                      <strong>Grow your community</strong>
                      <small>Preview the application form</small>
                    </span>
                    <ChevronRight size={18} />
                  </Link>
                </Panel>
              </div>
              <div className="rg-section-title">
                <div>
                  <h2>Meet your professionals</h2>
                  <p>A few familiar faces from your network</p>
                </div>
                <button
                  className="rg-text-btn"
                  onClick={() => navigate("Maid profiles")}
                >
                  View all profiles <ArrowRight size={16} />
                </button>
              </div>
              <div className="rg-profiles rg-preview-cards">
                {active.slice(0, 4).map((w, i) => (
                  <button
                    key={w.id}
                    className="rg-mini-profile"
                    onClick={() => openProfile(w)}
                  >
                    <WorkerAvatar worker={w} color={colors[i]} />
                    <h3>{w.name}</h3>
                    <p>{w.services.join(" · ")}</p>
                    <span>
                      <MapPin size={13} />
                      {formatWorkerAreas(workerAreas(w))}
                    </span>
                    <Badge tone={w.status === "Available" ? "green" : "blue"}>
                      {w.status}
                    </Badge>
                  </button>
                ))}
              </div>
              <Panel
                title="Recent activity"
                subtitle="The latest from your team"
              >
                {data.activity.slice(0, 4).map((a, i) => (
                  <div className="rg-activity" key={`${i}-${a}`}>
                    <span className="rg-activity-dot" />
                    <span>{a}</span>
                    <small>Recent update</small>
                  </div>
                ))}
              </Panel>
            </>
          )}
          {(section === "Maid profiles" || section === "Verification") && (
            <>
              <div className="rg-directory-tabs">
                <button
                  onClick={() => setStatus("All statuses")}
                  className={status === "All statuses" ? "active" : ""}
                >
                  All professionals <span>{active.length}</span>
                </button>
                <button
                  onClick={() => setStatus("Available")}
                  className={status === "Available" ? "active" : ""}
                >
                  Available
                </button>
                <button
                  onClick={() => setStatus("Placed")}
                  className={status === "Placed" ? "active" : ""}
                >
                  Placed
                </button>
                <button
                  onClick={() => setStatus("Archived")}
                  className={status === "Archived" ? "active" : ""}
                >
                  Archived
                </button>
              </div>
              <div className="rg-filterbar">
                <label className="rg-search">
                  <Search size={17} />
                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search name, ID, phone or area…"
                    aria-label="Search profiles"
                  />
                </label>
                <select
                  value={area}
                  onChange={(e) => setArea(e.target.value)}
                  aria-label="Filter by area"
                >
                  <option>All areas</option>
                  {areaOptions.map((a) => (
                    <option key={a}>{a}</option>
                  ))}
                </select>
                <select
                  value={service}
                  onChange={(e) => setService(e.target.value)}
                  aria-label="Filter by service"
                >
                  <option>All services</option>
                  {serviceOptions.map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                </select>
                {section === "Maid profiles" && (
                  <>
                    <button
                      type="button"
                      className="rg-btn"
                      onClick={() => {
                        setMaidSelectMode((m) => !m);
                        setSelectedMaidIds([]);
                      }}
                    >
                      {maidSelectMode ? "Cancel select" : "Select maids"}
                    </button>
                    {maidSelectMode && selectedMaidIds.length > 0 && (
                      <button
                        type="button"
                        className="rg-btn primary"
                        onClick={() => setGrantModalOpen(true)}
                      >
                        Grant to client ({selectedMaidIds.length})
                      </button>
                    )}
                  </>
                )}
                <button className="rg-btn" onClick={exportProfiles}>
                  <ArrowDownToLine size={16} />
                  Export
                </button>
                <button
                  className="rg-icon-btn"
                  onClick={() => setView(view === "cards" ? "list" : "cards")}
                  aria-label="Toggle list and card view"
                >
                  <ListFilter size={19} />
                </button>
              </div>
              <p className="rg-results">
                Showing {visible.length} professionals{" "}
                {section === "Verification" && "awaiting verification"}
              </p>
              {profileCards}
            </>
          )}
          {section === "Applications" && (
            <Panel
              title="Application inbox"
              subtitle="Approve an application to create a profile. Verification comes next."
            >
              <div className="rg-table-wrap">
                <table className="rg-table">
                  <thead>
                    <tr>
                      <th>Applicant</th>
                      <th>Area & skills</th>
                      <th>Language</th>
                      <th>Status</th>
                      <th>Review</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.applications.map((a) => (
                      <tr key={a.id}>
                        <td>
                          <strong>{a.name}</strong>
                          <small>
                            {a.phone} · {a.id}
                          </small>
                        </td>
                        <td>
                          {a.area}
                          <small>{a.services.join(" · ")}</small>
                        </td>
                        <td>{a.language}</td>
                        <td>
                          <Badge
                            tone={
                              a.status === "New"
                                ? "amber"
                                : a.status === "Approved"
                                  ? "green"
                                  : "neutral"
                            }
                          >
                            {a.status}
                          </Badge>
                        </td>
                        <td>
                          {a.status === "New" ? (
                            <div className="rg-inline-actions">
                              <button
                                className="rg-btn primary small"
                                onClick={() => reviewApplication(a.id, true)}
                              >
                                <Check size={14} />
                                Approve
                              </button>
                              <button
                                className="rg-btn small"
                                onClick={() => reviewApplication(a.id, false)}
                              >
                                Decline
                              </button>
                            </div>
                          ) : (
                            <span className="rg-subtle">Reviewed</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="rg-panel-footer">
                <Link href="/register" className="rg-text-btn">
                  Preview registration form <ArrowRight size={16} />
                </Link>
              </div>
            </Panel>
          )}
          {section === "Enquiries" && <EnquiriesPanel />}
          {section === "Clients" && (
            <ClientsPanel role={role === "Admin" ? "Admin" : "Coordinator"} />
          )}
          {section === "Households" && (
            <div className="rg-households">
              {data.households.map((h) => (
                <button
                  key={h.id}
                  className="rg-household"
                  onClick={() => setHousehold(h)}
                >
                  <span className="rg-small-icon sage">
                    <House size={24} />
                  </span>
                  <h3>{h.name}</h3>
                  <p>
                    <MapPin size={14} />
                    {h.area}
                  </p>
                  <p>{h.address}</p>
                  <div className="rg-household-footer">
                    <Badge>{h.service}</Badge>
                    <span>
                      {
                        data.placements.filter(
                          (p) =>
                            p.householdId === h.id && p.status === "Active",
                        ).length
                      }{" "}
                      active placements <ChevronRight size={15} />
                    </span>
                  </div>
                </button>
              ))}
            </div>
          )}
          {section === "Placements" && (
            <Panel
              title="Placement register"
              subtitle="Work schedules, household matches, and retained placement history."
            >
              <div className="rg-table-wrap">
                <table className="rg-table">
                  <thead>
                    <tr>
                      <th>Professional / household</th>
                      <th>Service & schedule</th>
                      <th>Monthly pay</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.placements.map((p) => (
                      <tr key={p.id}>
                        <td>
                          <strong>
                            {
                              data.workers.find((w) => w.id === p.workerId)
                                ?.name
                            }
                          </strong>
                          <small>
                            {
                              data.households.find(
                                (h) => h.id === p.householdId,
                              )?.name
                            }
                          </small>
                        </td>
                        <td>
                          {p.service}
                          <small>
                            {p.from}–{p.to} · {p.days}
                          </small>
                          <small>Started {p.start}</small>
                        </td>
                        <td>₹{Number(p.salary).toLocaleString("en-IN")}</td>
                        <td>
                          <Badge
                            tone={p.status === "Active" ? "green" : "neutral"}
                          >
                            {p.status}
                          </Badge>
                        </td>
                        <td>
                          {p.status === "Active" && (
                            <button
                              className="rg-btn small"
                              onClick={() => endPlacement(p.id)}
                            >
                              End placement
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {!data.placements.length && (
                <div className="rg-empty">
                  No placements yet. Create your first household match.
                </div>
              )}
            </Panel>
          )}
          {section === "Workspace" && (
            <StaffWorkspace
              role={role}
              email={staff?.email || ""}
              onSignOut={signOut}
              onRefresh={() => void refresh()}
            />
          )}
          <footer className="rg-footer">
            <span>
              <HeartHandshake size={14} />
              Made for people. Managed with care.
            </span>
            <span>SakhiHome · Team workspace</span>
          </footer>
        </main>
      </div>
      <Dialog
        open={!!worker}
        onOpenChange={(open) => {
          if (!open && !saving && !uploading) closeProfile();
        }}
      >
        <DialogContent className="rg-modal rg-profile-modal">
          <DialogTitle className={editing ? undefined : "sr-only"}>
            {editing
              ? data.workers.some((w) => w.id === worker?.id)
                ? "Edit maid profile"
                : "Register a professional"
              : worker?.name || "Professional profile"}
          </DialogTitle>
          <DialogDescription className={editing ? undefined : "sr-only"}>
            {editing
              ? "Build a complete private staff record. Changes are saved to SakhiHome’s database."
              : `Staff profile for ${worker?.name || "professional"}`}
          </DialogDescription>
          {worker && (
            <>
              {!editing ? (
                <header className="rg-profile-hero">
                  <WorkerAvatar worker={worker} color="sage" size="lg" />
                  <div className="rg-profile-hero-main">
                    <div className="rg-profile-hero-row">
                      <div>
                        <h2 className="rg-profile-title">
                          {worker.name || "Unnamed professional"}
                        </h2>
                        <p className="rg-profile-meta">
                          <MapPin size={14} aria-hidden />
                          {formatWorkerAreas(workerAreas(worker))}
                          {worker.experience > 0
                            ? ` · ${worker.experience} years experience`
                            : ""}
                        </p>
                        {worker.phone ? (
                          <p className="rg-profile-phone">{worker.phone}</p>
                        ) : null}
                      </div>
                      <button
                        type="button"
                        className="rg-btn primary"
                        onClick={() => setEditing(true)}
                      >
                        Edit profile
                      </button>
                    </div>
                    <div className="rg-profile-badges">
                      <Badge
                        tone={
                          worker.status === "Available"
                            ? "green"
                            : worker.status === "Placed"
                              ? "blue"
                              : "neutral"
                        }
                      >
                        {worker.status}
                      </Badge>
                      <Badge
                        tone={
                          worker.verification === "Verified" ? "green" : "amber"
                        }
                      >
                        {worker.verification}
                      </Badge>
                    </div>
                    <p className="rg-profile-ref" title={worker.id}>
                      Ref {workerDisplayRef(worker.id)}
                      <span>Internal record · used for uploads</span>
                    </p>
                    <ProfileCompletionBar worker={worker} />
                  </div>
                </header>
              ) : (
                <header className="rg-profile-edit-banner">
                  <WorkerAvatar worker={worker} color="sage" />
                  <div className="rg-profile-edit-banner-body">
                    <h2 className="rg-profile-title">
                      {data.workers.some((w) => w.id === worker.id)
                        ? "Edit profile"
                        : "New professional"}
                    </h2>
                    <p className="rg-profile-meta">
                      Ref {workerDisplayRef(worker.id)}
                      {role === "Admin" ? " · Saves as verified" : ""}
                    </p>
                    <ProfileCompletionBar worker={worker} />
                  </div>
                </header>
              )}
              <div className="rg-detail-tabs rg-profile-tabs">
                {profileTabs.map((t) => (
                  <button
                    type="button"
                    className={profileTab === t ? "active" : ""}
                    key={t}
                    onClick={() => setProfileTab(t)}
                  >
                    {t}
                  </button>
                ))}
              </div>
              {editing && (
                <div className="rg-photo-editor">
                  <WorkerAvatar worker={worker} color="sage" />
                  <label className="rg-btn">
                    {uploading
                      ? "Uploading…"
                      : worker.photoPath
                        ? "Replace photo"
                        : "Upload maid photo"}
                    <input
                      className="sr-only"
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      disabled={uploading || saving}
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) void attachFile(file);
                        e.target.value = "";
                      }}
                    />
                  </label>
                  <small>JPEG, PNG or WebP · Up to 5 MB</small>
                </div>
              )}
              <form onSubmit={saveWorker}>
                {editing && (
                  <div className="rg-form-grid">
                    <Field label="Full name *">
                      <input
                        required
                        value={worker.name}
                        onChange={(e) => changeWorker("name", e.target.value)}
                      />
                    </Field>
                    <Field label="Mobile (10 digits) *">
                      <IndianMobileInput
                        required
                        value={worker.phone}
                        onChange={(digits) => changeWorker("phone", digits)}
                      />
                    </Field>
                  </div>
                )}
                {profileTab === "Professional" && !editing && (
                  <div className="rg-profile-view">
                    <div className="rg-profile-stat-grid">
                      <ProfileStat
                        label="Operating areas"
                        value={formatWorkerAreas(workerAreas(worker))}
                      />
                      <ProfileStat
                        label="Experience"
                        value={
                          worker.experience
                            ? `${worker.experience} years`
                            : "Not set"
                        }
                      />
                      <ProfileStat
                        label="Expected pay"
                        value={
                          worker.salary
                            ? /^\d+$/.test(worker.salary.trim())
                              ? `₹${Number(worker.salary).toLocaleString("en-IN")}/mo`
                              : worker.salary
                            : ""
                        }
                      />
                      <ProfileStat label="Languages" value={worker.languages} />
                      <ProfileStat label="Work timings" value={worker.schedule} />
                      <ProfileStat label="Availability" value={worker.status} />
                    </div>
                    <section className="rg-profile-section">
                      <h3>Services</h3>
                      <div className="rg-profile-pills">
                        {worker.services.length
                          ? worker.services.map((s) => (
                              <span key={s}>{s}</span>
                            ))
                          : <span className="rg-profile-muted">None listed</span>}
                      </div>
                    </section>
                    {worker.notes.trim() ? (
                      <section className="rg-profile-section">
                        <h3>Staff notes</h3>
                        <p className="rg-profile-notes">{worker.notes}</p>
                      </section>
                    ) : null}
                  </div>
                )}
                {profileTab === "Professional" && editing && (
                  <div className="rg-form-grid">
                    <div className="rg-full">
                      <span className="rg-field-label">Operating areas *</span>
                      <div className="rg-checks">
                        {areaOptions.map((a) => (
                          <label key={a}>
                            <input
                              type="checkbox"
                              checked={workerAreas(worker).includes(a)}
                              onChange={(e) =>
                                toggleWorkerArea(a, e.target.checked)
                              }
                            />
                            {a}
                          </label>
                        ))}
                      </div>
                    </div>
                    <Field label="Experience (years)">
                      <input
                        type="text"
                        inputMode="numeric"
                        placeholder="e.g. 5"
                        value={
                          worker.experience > 0
                            ? String(worker.experience)
                            : ""
                        }
                        onChange={(e) => {
                          const raw = digitsOnlyField(e.target.value, 2);
                          changeWorker(
                            "experience",
                            raw === "" ? 0 : Math.min(60, parseInt(raw, 10)),
                          );
                        }}
                      />
                    </Field>
                    <Field label="Expected monthly pay (₹)">
                      <input
                        type="text"
                        inputMode="numeric"
                        placeholder="e.g. 15000"
                        value={worker.salary}
                        onChange={(e) =>
                          changeWorker(
                            "salary",
                            digitsOnlyField(e.target.value, 7),
                          )
                        }
                      />
                    </Field>
                    <Field label="Languages">
                      <input
                        readOnly={!editing}
                        value={worker.languages}
                        onChange={(e) =>
                          changeWorker("languages", e.target.value)
                        }
                      />
                    </Field>
                    <Field label="Preferred work timings">
                      <input
                        placeholder="e.g. 7 AM – 10 AM"
                        readOnly={!editing}
                        value={worker.schedule}
                        onChange={(e) =>
                          changeWorker("schedule", e.target.value)
                        }
                      />
                    </Field>
                    <Field label="Availability">
                      <select
                        disabled={!editing}
                        value={worker.status}
                        onChange={(e) =>
                          changeWorker(
                            "status",
                            e.target.value as Worker["status"],
                          )
                        }
                      >
                        <option value="Available">Available</option>
                        <option value="Placed">Placed</option>
                        <option value="On leave">On leave</option>
                        <option value="Archived">Archived</option>
                      </select>
                    </Field>
                    <div className="rg-full">
                      <span className="rg-field-label">Services</span>
                      <div className="rg-checks">
                        {serviceOptions.map((s) => (
                          <label key={s}>
                            <input
                              type="checkbox"
                              disabled={!editing}
                              checked={worker.services.includes(s)}
                              onChange={(e) =>
                                changeWorker(
                                  "services",
                                  e.target.checked
                                    ? [...worker.services, s]
                                    : worker.services.filter((v) => v !== s),
                                )
                              }
                            />
                            {s}
                          </label>
                        ))}
                      </div>
                    </div>
                    <Field label="Staff notes">
                      <textarea
                        readOnly={!editing}
                        value={worker.notes}
                        onChange={(e) => changeWorker("notes", e.target.value)}
                      />
                    </Field>
                  </div>
                )}
                {profileTab === "Personal & family" && !editing && (
                  <div className="rg-profile-view">
                    <div className="rg-profile-stat-grid rg-profile-stat-grid--single">
                      <ProfileStat label="Current address" value={worker.address} />
                      <ProfileStat
                        label="Marital status"
                        value={worker.maritalStatus || "Not provided"}
                      />
                      <ProfileStat
                        label="Spouse / guardian"
                        value={worker.guardian}
                      />
                      <ProfileStat
                        label="Dependants"
                        value={worker.dependants}
                      />
                      <ProfileStat
                        label="Emergency contact"
                        value={worker.emergency}
                      />
                    </div>
                    <div className="rg-private-note">
                      <ShieldCheck size={18} />
                      Private staff record — not shown on client basic previews.
                    </div>
                  </div>
                )}
                {profileTab === "Personal & family" && editing && (
                  <div className="rg-form-grid">
                    <Field label="Current address">
                      <textarea
                        readOnly={!editing}
                        value={worker.address}
                        onChange={(e) =>
                          changeWorker("address", e.target.value)
                        }
                      />
                    </Field>
                    <Field label="Marital status (optional)">
                      <select
                        disabled={!editing}
                        value={worker.maritalStatus}
                        onChange={(e) =>
                          changeWorker("maritalStatus", e.target.value)
                        }
                      >
                        <option value="">Not provided</option>
                        <option>Single</option>
                        <option>Married</option>
                        <option>Other</option>
                        <option>Prefer not to say</option>
                      </select>
                    </Field>
                    <Field label="Spouse / guardian (optional)">
                      <input
                        readOnly={!editing}
                        value={worker.guardian}
                        onChange={(e) =>
                          changeWorker("guardian", e.target.value)
                        }
                      />
                    </Field>
                    <Field label="Number of dependants (optional)">
                      <input
                        type="text"
                        inputMode="numeric"
                        placeholder="0"
                        readOnly={!editing}
                        value={worker.dependants}
                        onChange={(e) =>
                          changeWorker(
                            "dependants",
                            digitsOnlyField(e.target.value, 2),
                          )
                        }
                      />
                    </Field>
                    <Field label="Emergency contact (name & phone)">
                      <input
                        readOnly={!editing}
                        value={worker.emergency}
                        onChange={(e) =>
                          changeWorker("emergency", e.target.value)
                        }
                      />
                    </Field>
                    <div className="rg-private-note">
                      <ShieldCheck size={18} />
                      Family and contact information belongs in the private
                      staff record.
                    </div>
                  </div>
                )}
                {profileTab === "Documents" && (
                  <div className="rg-profile-docs">
                    <p className="rg-settings-copy">
                      Upload private verification documents. JPEG, PNG, WebP or
                      PDF, up to 10 MB each. Download and review before marking
                      them verified.
                    </p>
                    {[
                      "Identity proof",
                      "Address proof",
                      "Police verification",
                    ].map((name) => {
                      const doc = worker.documents.find((d) => d.name === name);
                      return (
                        <div className="rg-document" key={name}>
                          <FileCheck2 size={22} />
                          <div>
                            <strong>{name}</strong>
                            <small>{doc?.file || "No document selected"}</small>
                          </div>
                          {editing ? (
                            <label className="rg-btn small">
                              Upload document
                              <input
                                className="sr-only"
                                type="file"
                                accept=".pdf,.jpg,.jpeg,.png,.webp"
                                disabled={uploading || saving}
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file) void attachFile(file, name);
                                  e.target.value = "";
                                }}
                              />
                            </label>
                          ) : (
                            <Badge tone={doc?.reviewed ? "green" : "amber"}>
                              {doc?.reviewed ? "Reviewed" : "Pending"}
                            </Badge>
                          )}
                          {doc?.path && (
                            <button
                              type="button"
                              className="rg-btn small"
                              onClick={() =>
                                void openDocument(doc.path!, doc.file).catch(
                                  (e) => toast.error(e.message),
                                )
                              }
                            >
                              Download
                            </button>
                          )}
                          {editing && doc && (
                            <label className="rg-review-check">
                              <input
                                type="checkbox"
                                checked={doc.reviewed}
                                onChange={(e) =>
                                  changeWorker(
                                    "documents",
                                    worker.documents.map((d) =>
                                      d.name === name
                                        ? { ...d, reviewed: e.target.checked }
                                        : d,
                                    ),
                                  )
                                }
                              />
                              Reviewed
                            </label>
                          )}
                        </div>
                      );
                    })}
                    <h3 className="rg-section-label" style={{ marginTop: "1.5rem" }}>
                      Additional documents
                    </h3>
                    <p className="rg-settings-copy">
                      Extra files with category and optional note (gallery).
                    </p>
                    {worker.documents
                      .filter((d) => !isVerificationDocName(d.name))
                      .map((doc) => (
                        <div className="rg-document" key={doc.id ?? doc.file}>
                          <FileCheck2 size={22} />
                          <div>
                            <strong>{doc.name}</strong>
                            {doc.note && <small>{doc.note}</small>}
                            <small>{doc.file}</small>
                          </div>
                          {doc?.path && (
                            <button
                              type="button"
                              className="rg-btn small"
                              onClick={() =>
                                void openDocument(doc.path!, doc.file).catch(
                                  (e) => toast.error(e.message),
                                )
                              }
                            >
                              Download
                            </button>
                          )}
                          {editing && doc.id && (
                            <button
                              type="button"
                              className="rg-btn small"
                              onClick={() =>
                                changeWorker(
                                  "documents",
                                  worker.documents.filter((d) => d.id !== doc.id),
                                )
                              }
                            >
                              Remove
                            </button>
                          )}
                        </div>
                      ))}
                    {editing && (
                      <div className="rg-form-grid" style={{ marginTop: "1rem" }}>
                        <Field label="Category">
                          <select
                            value={galleryCategory}
                            onChange={(e) => setGalleryCategory(e.target.value)}
                          >
                            {GALLERY_DOC_CATEGORIES.map((c) => (
                              <option key={c}>{c}</option>
                            ))}
                          </select>
                        </Field>
                        <Field label="Note (optional)">
                          <input
                            value={galleryNote}
                            onChange={(e) => setGalleryNote(e.target.value)}
                          />
                        </Field>
                        <label className="rg-btn small">
                          Add gallery file
                          <input
                            className="sr-only"
                            type="file"
                            accept=".pdf,.jpg,.jpeg,.png,.webp"
                            disabled={uploading || saving}
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) void attachGalleryFile(file);
                              e.target.value = "";
                            }}
                          />
                        </label>
                      </div>
                    )}
                    <div className="rg-panel-footer">
                      {editing ? (
                        role === "Admin" ? (
                          <p className="rg-settings-copy">
                            Admin profiles are saved as{" "}
                            <strong>Verified</strong> without a separate
                            verification step. Upload documents when you have
                            them.
                          </p>
                        ) : (
                          <Field label="Overall verification">
                            <select
                              value={worker.verification}
                              onChange={(e) =>
                                changeWorker(
                                  "verification",
                                  e.target.value as Worker["verification"],
                                )
                              }
                            >
                              <option>Pending</option>
                              <option
                                disabled={
                                  !worker.documents.some(
                                    (d) =>
                                      d.name === "Identity proof" && d.reviewed,
                                  ) ||
                                  !worker.documents.some(
                                    (d) =>
                                      d.name === "Address proof" && d.reviewed,
                                  ) ||
                                  !worker.documents.some(
                                    (d) =>
                                      d.name === "Police verification" &&
                                      d.reviewed,
                                  )
                                }
                              >
                                Verified
                              </option>
                            </select>
                          </Field>
                        )
                      ) : (
                        <Badge
                          tone={
                            worker.verification === "Verified"
                              ? "green"
                              : "amber"
                          }
                        >
                          {worker.verification}
                        </Badge>
                      )}
                    </div>
                  </div>
                )}
                {profileTab === "History" && (
                  <div className="rg-profile-history">
                    {data.placements
                      .filter((p) => p.workerId === worker.id)
                      .map((p) => (
                        <div className="rg-document" key={p.id}>
                          <CalendarDays size={22} />
                          <div>
                            <strong>
                              {
                                data.households.find(
                                  (h) => h.id === p.householdId,
                                )?.name
                              }
                            </strong>
                            <small>
                              {p.service} · {p.from}–{p.to} · Started {p.start}
                            </small>
                          </div>
                          <Badge
                            tone={p.status === "Active" ? "green" : "neutral"}
                          >
                            {p.status}
                          </Badge>
                        </div>
                      ))}
                    {!data.placements.some((p) => p.workerId === worker.id) && (
                      <div className="rg-empty">No placement history yet.</div>
                    )}
                  </div>
                )}
                <div className="rg-modal-footer rg-profile-footer">
                  {!editing && role === "Admin" && worker.status === "Archived" && (
                    <button
                      type="button"
                      className="rg-btn primary"
                      onClick={() => void restoreArchivedWorker()}
                    >
                      Restore to Available
                    </button>
                  )}
                  {!editing &&
                    role === "Admin" &&
                    worker.status !== "Archived" && (
                      <button
                        type="button"
                        className="rg-text-btn danger"
                        disabled={data.placements.some(
                          (p) =>
                            p.workerId === worker.id && p.status === "Active",
                        )}
                        onClick={async () => {
                          if (
                            !(await update((d) => ({
                              ...d,
                              workers: d.workers.map((w) =>
                                w.id === worker.id
                                  ? { ...w, status: "Archived" }
                                  : w,
                              ),
                            })))
                          )
                            return;
                          setWorker(null);
                          toast.success("Profile archived");
                        }}
                      >
                        Archive profile
                      </button>
                    )}
                  <div className="rg-profile-footer-actions">
                    <button
                      type="button"
                      className="rg-btn"
                      onClick={closeProfile}
                      disabled={saving || uploading}
                    >
                      Close
                    </button>
                    {editing && (
                      <>
                        <button
                          type="submit"
                          className="rg-btn"
                          disabled={saving || uploading}
                        >
                          {saving ? "Saving…" : "Save"}
                        </button>
                        {profileTab !== "History" ? (
                          <button
                            type="button"
                            className="rg-btn primary"
                            disabled={saving || uploading}
                            onClick={() => void persistWorker({ goNext: true })}
                          >
                            {saving ? "Saving…" : "Save & next"}
                            <ChevronRight size={16} />
                          </button>
                        ) : (
                          <button
                            type="button"
                            className="rg-btn primary"
                            disabled={saving || uploading}
                            onClick={() => void persistWorker({ close: true })}
                          >
                            Save & close
                            <Check size={16} />
                          </button>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </form>
            </>
          )}
        </DialogContent>
      </Dialog>
      <Dialog
        open={!!household}
        onOpenChange={(open) => {
          if (!open) setHousehold(null);
        }}
      >
        <DialogContent className="rg-modal">
          <DialogTitle>Household details</DialogTitle>
          <DialogDescription>
            Sample household information for placement planning.
          </DialogDescription>
          {household && (
            <form onSubmit={saveHousehold}>
              <div className="rg-form-grid">
                {(
                  [
                    ["name", "Household name *"],
                    ["phone", "Phone *"],
                    ["address", "Address"],
                  ] as const
                ).map(([key, label]) => (
                  <Field key={key} label={label}>
                    {key === "phone" ? (
                      <IndianMobileInput
                        required
                        value={household.phone}
                        onChange={(digits) =>
                          setHousehold({ ...household, phone: digits })
                        }
                      />
                    ) : (
                      <input
                        required={key !== "address"}
                        type="text"
                        value={household[key]}
                        onChange={(e) =>
                          setHousehold({ ...household, [key]: e.target.value })
                        }
                      />
                    )}
                  </Field>
                ))}
                <Field label="Area">
                  <select
                    value={household.area}
                    onChange={(e) =>
                      setHousehold({ ...household, area: e.target.value })
                    }
                  >
                    {areaOptions.map((a) => (
                      <option key={a}>{a}</option>
                    ))}
                  </select>
                </Field>
                <Field label="Required service">
                  <select
                    value={household.service}
                    onChange={(e) =>
                      setHousehold({ ...household, service: e.target.value })
                    }
                  >
                    {serviceOptions.map((s) => (
                      <option key={s}>{s}</option>
                    ))}
                  </select>
                </Field>
              </div>
              <div className="rg-modal-footer">
                <button
                  className="rg-btn primary"
                  type="submit"
                  disabled={saving || uploading}
                >
                  Save household
                </button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>
      <Dialog open={placementOpen} onOpenChange={setPlacementOpen}>
        <DialogContent className="rg-modal">
          <DialogTitle>Create a placement</DialogTitle>
          <DialogDescription>
            Match a verified professional with a household. Overlapping
            schedules are checked.
          </DialogDescription>
          <form onSubmit={createPlacement}>
            <div className="rg-form-grid">
              <Field label="Professional *">
                <select name="workerId" required>
                  <option value="">Select professional</option>
                  {active
                    .filter(
                      (w) =>
                        w.verification === "Verified" &&
                        w.status !== "On leave",
                    )
                    .map((w) => (
                      <option key={w.id} value={w.id}>
                        {w.name} · {formatWorkerAreas(workerAreas(w))}
                      </option>
                    ))}
                </select>
              </Field>
              <Field label="Household *">
                <select name="householdId" required>
                  <option value="">Select household</option>
                  {data.households.map((h) => (
                    <option key={h.id} value={h.id}>
                      {h.name}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Service">
                <select name="service">
                  {serviceOptions.map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                </select>
              </Field>
              <Field label="Working days">
                <select name="days">
                  <option>Mon, Tue, Wed, Thu, Fri, Sat</option>
                  <option>Mon, Tue, Wed, Thu, Fri</option>
                  <option>Mon, Tue, Wed, Thu, Fri, Sat, Sun</option>
                  <option>Sat, Sun</option>
                </select>
              </Field>
              <Field label="From *">
                <input name="from" type="time" required />
              </Field>
              <Field label="To *">
                <input name="to" type="time" required />
              </Field>
              <Field label="Monthly pay (₹) *">
                <input name="salary" type="number" min="1" required />
              </Field>
              <Field label="Start date *">
                <input name="start" type="date" required />
              </Field>
            </div>
            <div className="rg-modal-footer">
              <button
                className="rg-btn primary"
                type="submit"
                disabled={saving || uploading}
              >
                Create placement <ArrowRight size={16} />
              </button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
      <GrantToClientModal
        maidIds={selectedMaidIds}
        open={grantModalOpen}
        onClose={() => setGrantModalOpen(false)}
        onDone={() => {
          setSelectedMaidIds([]);
          setMaidSelectMode(false);
        }}
      />
    </div>
  );
}
