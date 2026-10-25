"use client";
import { useState, type FormEvent } from "react";
import BrandLogo from "@/components/brand-logo";
import { getSupabase, supabaseConfigured } from "@/lib/supabase-client";
import { normalizeStaffEmail } from "@/lib/staff-auth";

export default function StaffLogin({
  denied,
  onSignOut,
}: {
  denied?: boolean;
  onSignOut: () => void;
}) {
  const [signup, setSignup] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setMessage("");
    const values = new FormData(event.currentTarget);
    const credentials = {
      email: String(values.get("email")).trim(),
      password: String(values.get("password")),
    };
    try {
      const email = normalizeStaffEmail(credentials.email);
      if (signup) {
        const allowed = await getSupabase().rpc("staff_registration_allowed", {
          target_email: email,
        });
        if (allowed.error) throw allowed.error;
        if (!allowed.data) {
          throw new Error(
            "This email is not approved for registration. Ask your SakhiHome admin to add you in Workspace first.",
          );
        }
      }
      const response = signup
        ? await getSupabase().auth.signUp({
            email,
            password: credentials.password,
            options: { emailRedirectTo: `${window.location.origin}/admin` },
          })
        : await getSupabase().auth.signInWithPassword({
            email,
            password: credentials.password,
          });
      if (response.error) throw response.error;
      if (signup && !response.data.session) {
        setMessage(
          "Account created. If sign-in fails, ask your admin to disable email confirmation in Supabase Auth settings, or run scripts/bootstrap-admin.mjs.",
        );
      }
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
        <h1>
          {denied
            ? "Staff access required"
            : signup
              ? "Create your staff account"
              : "Welcome back"}
        </h1>
        <p>
          {denied
            ? "This account has no active staff access. Ask your SakhiHome admin to add your email."
            : signup
              ? "Create your account only if your email was added in Workspace. The admin account uses chetan44rt@gmail.com."
              : "Sign in to manage SakhiHome profiles and placements. Only approved staff emails can access records."}
        </p>
        {!supabaseConfigured ? (
          <p role="alert">Supabase configuration is missing.</p>
        ) : denied ? (
          <button className="rg-btn primary" onClick={onSignOut}>
            Sign out
          </button>
        ) : (
          <form onSubmit={submit}>
            <label className="rg-field">
              <span>Email</span>
              <input name="email" type="email" autoComplete="email" required />
            </label>
            <label className="rg-field">
              <span>Password</span>
              <input
                name="password"
                type="password"
                minLength={6}
                autoComplete={signup ? "new-password" : "current-password"}
                required
              />
            </label>
            <button className="rg-btn primary" disabled={busy}>
              {busy ? "Please wait…" : signup ? "Create account" : "Sign in"}
            </button>
            <button
              type="button"
              className="rg-text-btn"
              onClick={() => {
                setSignup(!signup);
                setMessage("");
              }}
            >
              {signup
                ? "Already have an account? Sign in"
                : "First time? Create your account"}
            </button>
          </form>
        )}
        {message && (
          <p className="rg-login-message" role="status">
            {message}
          </p>
        )}
      </section>
    </main>
  );
}
