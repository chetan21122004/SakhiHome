"use client";
import { useEffect, useState, type FormEvent } from "react";
import { getSupabase } from "@/lib/supabase-client";
import { toast } from "sonner";
type Staff = { email: string; role: string; enabled: boolean };
export default function StaffWorkspace({
  role,
  email,
  onSignOut,
  onRefresh,
}: {
  role: string;
  email: string;
  onSignOut: () => Promise<void>;
  onRefresh: () => void;
}) {
  const [team, setTeam] = useState<Staff[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  async function load() {
    const result = await getSupabase()
      .from("staff_access")
      .select("email,role,enabled")
      .order("created_at");
    if (result.error) setError(result.error.message);
    else setTeam(result.data);
  }
  useEffect(() => {
    let alive = true;
    void getSupabase()
      .from("staff_access")
      .select("email,role,enabled")
      .order("created_at")
      .then((result) => {
        if (alive) {
          if (result.error) setError(result.error.message);
          else setTeam(result.data);
        }
      });
    return () => {
      alive = false;
    };
  }, []);
  async function add(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const values = new FormData(event.currentTarget);
    const form = event.currentTarget;
    setBusy(true);
    const result = await getSupabase()
      .from("staff_access")
      .insert({
        email: String(values.get("email")).trim().toLowerCase(),
        role: String(values.get("role")),
      });
    setBusy(false);
    if (result.error) toast.error(result.error.message);
    else {
      form.reset();
      toast.success(
        "Staff access added. They can create their account on the login page.",
      );
      await load();
    }
  }
  async function toggle(member: Staff) {
    setBusy(true);
    const result = await getSupabase()
      .from("staff_access")
      .update({ enabled: !member.enabled })
      .eq("email", member.email);
    setBusy(false);
    if (result.error) toast.error(result.error.message);
    else await load();
  }
  return (
    <section className="rg-panel">
      <h2>Team access</h2>
      <p className="rg-settings-copy">
        Signed in as {email} · {role}. Database access is restricted to approved
        staff. Photos and verification documents are private.
      </p>
      {error && <p role="alert">{error}</p>}
      <div className="rg-table-wrap">
        <table className="rg-table">
          <thead>
            <tr>
              <th>Email</th>
              <th>Role</th>
              <th>Access</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {team.map((member) => (
              <tr key={member.email}>
                <td>{member.email}</td>
                <td>{member.role}</td>
                <td>{member.enabled ? "Active" : "Disabled"}</td>
                <td>
                  {role === "Admin" && member.email !== email && (
                    <button
                      className="rg-btn small"
                      disabled={busy}
                      onClick={() => void toggle(member)}
                    >
                      {member.enabled ? "Disable" : "Enable"}
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {role === "Admin" && (
        <form onSubmit={add} className="rg-form-grid">
          <label className="rg-field">
            <span>Staff email</span>
            <input name="email" type="email" required />
          </label>
          <label className="rg-field">
            <span>Role</span>
            <select name="role" defaultValue="Coordinator">
              <option value="Coordinator">Coordinator</option>
            </select>
          </label>
          <button className="rg-btn primary" disabled={busy}>
            Add staff access
          </button>
        </form>
      )}
      <div className="rg-inline-actions">
        <button className="rg-btn" onClick={onRefresh}>
          Refresh records
        </button>
        <button className="rg-btn" onClick={() => void onSignOut()}>
          Sign out
        </button>
      </div>
    </section>
  );
}
