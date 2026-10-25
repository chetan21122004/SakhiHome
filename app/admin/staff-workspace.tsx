"use client";
import { useEffect, useState, type FormEvent } from "react";
import { toast } from "sonner";
import {
  addStaffAccess,
  fetchStaffAccess,
  toggleStaffAccess,
} from "@/lib/admin-api";

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
    try {
      setTeam(await fetchStaffAccess());
      setError("");
    } catch (cause) {
      setError(String((cause as Error).message));
    }
  }

  useEffect(() => {
    void load();
  }, []);

  async function add(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const values = new FormData(event.currentTarget);
    const form = event.currentTarget;
    setBusy(true);
    try {
      await addStaffAccess(
        String(values.get("email")).trim().toLowerCase(),
        String(values.get("role")),
      );
      form.reset();
      toast.success("Coordinator access added.");
      await load();
    } catch (cause) {
      toast.error(String((cause as Error).message));
    } finally {
      setBusy(false);
    }
  }

  async function toggle(member: Staff) {
    setBusy(true);
    try {
      await toggleStaffAccess(member.email, !member.enabled);
      await load();
    } catch (cause) {
      toast.error(String((cause as Error).message));
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="rg-panel">
      <h2>Team access</h2>
      <p className="rg-settings-copy">
        Signed in as {email} · {role}. Coordinator emails are kept for your
        records; admin login uses the single password configured on the server.
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
            Add coordinator
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
