"use client";
import { useState, type FormEvent } from "react";
import BrandLogo from "@/components/brand-logo";
import { adminLogin } from "@/lib/admin-api";
import { PRIMARY_ADMIN_EMAIL } from "@/lib/staff-auth";

export default function StaffLogin({
  onLoggedIn,
  title = "Admin sign in",
}: {
  onLoggedIn: () => void;
  title?: string;
}) {
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setMessage("");
    const values = new FormData(event.currentTarget);
    const email = String(values.get("email")).trim();
    const password = String(values.get("password"));
    try {
      await adminLogin(email, password);
      onLoggedIn();
    } catch (error) {
      setMessage(String((error as Error).message));
    } finally {
      setBusy(false);
    }
  }
  return (
    <main className="rg-login">
      <section className="rg-register-card">
        <BrandLogo caption="TEAM WORKSPACE" />
        <h1>{title}</h1>
        <p>
          Email and password from staff_access (admin creates coordinator
          accounts in Workspace).
        </p>
        <form onSubmit={submit}>
          <label className="rg-field">
            <span>Email</span>
            <input
              name="email"
              type="email"
              autoComplete="email"
              defaultValue={PRIMARY_ADMIN_EMAIL}
              required
            />
          </label>
          <label className="rg-field">
            <span>Password</span>
            <input
              name="password"
              type="password"
              minLength={6}
              autoComplete="current-password"
              required
            />
          </label>
          <button className="rg-btn primary" disabled={busy}>
            {busy ? "Please wait…" : "Sign in"}
          </button>
        </form>
        {message && (
          <p className="rg-login-message" role="alert">
            {message}
          </p>
        )}
      </section>
    </main>
  );
}
