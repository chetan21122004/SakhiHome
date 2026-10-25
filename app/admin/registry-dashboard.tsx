"use client";

import { useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";
import Link from "next/link";
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
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import {
  areaOptions,
  blankWorker,
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
  { name: "Verification", icon: ShieldCheck },
  { name: "Households", icon: House },
  { name: "Placements", icon: BriefcaseBusiness },
  { name: "Workspace", icon: Settings2 },
];
const colors = ["peach", "sage", "lilac", "sand"];
function initials(name: string) {
  return name
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0])
    .join("");
}
function WorkerAvatar({ worker, color }: { worker: Worker; color: string }) {
  const [failed, setFailed] = useState("");
  return (
    <div className={`rg-avatar ${color}`}>
      {worker.photoUrl && failed !== worker.photoUrl ? (
        <Image
          src={worker.photoUrl}
          unoptimized
          width={72}
          height={72}
          alt={`Photo of ${worker.name}`}
          onError={() => setFailed(worker.photoUrl!)}
        />
      ) : (
        initials(worker.name)
      )}
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
  const [uploading, setUploading] = useState(false);
  const uploads = useRef<{ bucket: string; path: string }[]>([]);
  const [section, setSection] = useState("Overview");
  const [search, setSearch] = useState("");
  const [area, setArea] = useState("All areas");
  const [status, setStatus] = useState("All statuses");
  const [service, setService] = useState("All services");
  const [worker, setWorker] = useState<Worker | null>(null);
  const [editing, setEditing] = useState(false);
  const [profileTab, setProfileTab] = useState("Professional");
  const [household, setHousehold] = useState<Household | null>(null);
  const [placementOpen, setPlacementOpen] = useState(false);
  const [view, setView] = useState("cards");
  const [newEnquiries, setNewEnquiries] = useState(0);
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
      (area === "All areas" || w.area === area) &&
      (service === "All services" || w.services.includes(service)) &&
      `${w.name} ${w.id} ${w.phone} ${w.area}`
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
    setWorker({ ...value, documents: value.documents.map((d) => ({ ...d })) });
    setEditing(edit);
    setProfileTab("Professional");
  }
  async function saveWorker(event: FormEvent) {
    event.preventDefault();
    if (!worker || uploading || saving) return;
    if (
      !worker.name.trim() ||
      worker.phone.replace(/\D/g, "").length < 10 ||
      !worker.services.length
    ) {
      toast.error("Enter a name, valid phone number, and at least one service");
      return;
    }
    if (
      worker.verification === "Verified" &&
      !["Identity proof", "Address proof", "Police verification"].every(
        (name) => worker.documents.some((d) => d.name === name && d.reviewed),
      )
    ) {
      toast.error(
        "Review all three documents before marking the profile verified",
      );
      return;
    }
    if (
      !(await update((d) => ({
        ...d,
        workers: d.workers.some((w) => w.id === worker.id)
          ? d.workers.map((w) => (w.id === worker.id ? worker : w))
          : [worker, ...d.workers],
        activity: [`${worker.name}’s profile saved`, ...d.activity].slice(0, 8),
      })))
    )
      return;
    const used = new Set(
      [worker.photoPath, ...worker.documents.map((d) => d.path)].filter(
        Boolean,
      ),
    );
    const original = data.workers.find((w) => w.id === worker.id);
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
    for (const file of obsolete)
      void removeUploadedFiles([file]);
    setWorker(null);
    toast.success("Profile saved");
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
              {
                ...blankWorker(),
                applicationId: application.id,
                name: application.name,
                phone: application.phone,
                area: application.area,
                services: application.services,
                schedule: application.schedule || "",
                languages: application.language,
              },
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
        ? "Profile created · verification pending"
        : "Application declined",
    );
  }
  function exportProfiles() {
    const text = [
      "ID,Name,Area,Services,Status,Verification",
      ...visible.map((w) =>
        [w.id, w.name, w.area, w.services.join(" / "), w.status, w.verification]
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
        changeWorker("verification", "Pending");
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
          ? "Document uploaded. Review it before verification."
          : "Photo uploaded. Save the profile to keep it.",
      );
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
          {visible.map((w, i) => (
            <button
              className="rg-profile"
              key={w.id}
              onClick={() => openProfile(w)}
            >
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
                  {w.id} <span>·</span> {w.experience} years experience
                </p>
              </div>
              <p className="rg-location">
                <MapPin size={14} />
                {w.area}
              </p>
              <div className="rg-tags">
                {w.services.map((s) => (
                  <span key={s}>{s}</span>
                ))}
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
          ))}
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
        <BrandLogo caption="TEAM WORKSPACE" />
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
                        : section === "Verification"
                        ? "Review documents and build trust, one profile at a time."
                        : section === "Households"
                          ? "The homes and families your network supports."
                          : section === "Placements"
                            ? "Connect the right professional with the right household."
                            : "Manage staff access and your workspace."}
              </p>
            </div>
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
                    : openProfile(blankWorker(), true)
              }
            >
              <Plus size={17} />
              {section === "Households"
                ? "Add household"
                : section === "Placements"
                  ? "New placement"
                  : "Add maid profile"}
            </button>
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
                      {w.area}
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
          <DialogTitle>
            {editing
              ? data.workers.some((w) => w.id === worker?.id)
                ? "Edit maid profile"
                : "Register a professional"
              : worker?.name}
          </DialogTitle>
          <DialogDescription>
            {editing
              ? "Build a complete private staff record. Changes are saved to SakhiHome’s database."
              : `${worker?.id} · Professional profile`}
          </DialogDescription>
          {worker && (
            <>
              {!editing && (
                <div className="rg-detail-header">
                  <WorkerAvatar worker={worker} color="sage" />
                  <div>
                    <h2>{worker.name}</h2>
                    <p>
                      {worker.area} · {worker.experience} years experience
                    </p>
                    <p>{worker.phone}</p>
                    <div className="rg-tags">
                      <Badge tone="green">{worker.status}</Badge>
                      <Badge
                        tone={
                          worker.verification === "Verified" ? "green" : "amber"
                        }
                      >
                        {worker.verification}
                      </Badge>
                    </div>
                  </div>
                  <button className="rg-btn" onClick={() => setEditing(true)}>
                    Edit profile
                  </button>
                </div>
              )}
              <div className="rg-detail-tabs">
                {[
                  "Professional",
                  "Personal & family",
                  "Documents",
                  "History",
                ].map((t) => (
                  <button
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
                    <Field label="Phone *">
                      <input
                        required
                        type="tel"
                        pattern="[0-9+ ()-]{10,16}"
                        value={worker.phone}
                        onChange={(e) => changeWorker("phone", e.target.value)}
                      />
                    </Field>
                  </div>
                )}
                {profileTab === "Professional" && (
                  <div className="rg-form-grid">
                    <Field label="Service area">
                      <select
                        disabled={!editing}
                        value={worker.area}
                        onChange={(e) => changeWorker("area", e.target.value)}
                      >
                        {areaOptions.map((a) => (
                          <option key={a}>{a}</option>
                        ))}
                      </select>
                    </Field>
                    <Field label="Experience (years)">
                      <input
                        type="number"
                        min="0"
                        max="60"
                        readOnly={!editing}
                        value={worker.experience}
                        onChange={(e) =>
                          changeWorker("experience", Number(e.target.value))
                        }
                      />
                    </Field>
                    <Field label="Expected monthly pay (₹)">
                      <input
                        type="number"
                        min="0"
                        readOnly={!editing}
                        value={worker.salary}
                        onChange={(e) => changeWorker("salary", e.target.value)}
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
                        <option>Available</option>
                        <option>Placed</option>
                        <option>On leave</option>
                        {worker.status === "Archived" && (
                          <option>Archived</option>
                        )}
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
                {profileTab === "Personal & family" && (
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
                        type="number"
                        min="0"
                        readOnly={!editing}
                        value={worker.dependants}
                        onChange={(e) =>
                          changeWorker("dependants", e.target.value)
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
                  <div>
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
                    <div className="rg-panel-footer">
                      {editing ? (
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
                  <div>
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
                <div className="rg-modal-footer">
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
                  <button
                    type="button"
                    className="rg-btn"
                    onClick={closeProfile}
                    disabled={saving || uploading}
                  >
                    Close
                  </button>
                  {editing && (
                    <button
                      type="submit"
                      className="rg-btn primary"
                      disabled={saving || uploading}
                    >
                      Save profile <Check size={16} />
                    </button>
                  )}
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
                    <input
                      required={key !== "address"}
                      type={key === "phone" ? "tel" : "text"}
                      value={household[key]}
                      onChange={(e) =>
                        setHousehold({ ...household, [key]: e.target.value })
                      }
                    />
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
                        {w.name} · {w.area}
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
    </div>
  );
}
