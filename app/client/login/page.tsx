"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { Suspense, useState } from "react";
import Link from "next/link";
import IndianMobileInput from "@/components/indian-mobile-input";
import {
  indianMobileValidationMessage,
  isValidIndianMobile,
} from "@/lib/india-contact";

function LoginForm() {
  const params = useSearchParams();
  const router = useRouter();
  const portalToken = params.get("t") ?? "";
  const [phone, setPhone] = useState("");
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!isValidIndianMobile(phone)) {
      setError(indianMobileValidationMessage());
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/client/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, pin, portalToken: portalToken || undefined }),
        credentials: "include",
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error ?? "Login failed");
        return;
      }
      router.replace("/client");
    } catch {
      setError("Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-md px-4 py-16">
      <h1 className="font-display text-2xl font-bold">View your shortlist</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Enter the mobile number and PIN shared by SakhiHome.
      </p>
      <form onSubmit={submit} className="mt-8 space-y-4">
        <label className="block text-sm font-medium">
          Mobile number
          <IndianMobileInput
            className="mt-1 w-full rounded-lg border px-3 py-2"
            required
            value={phone}
            onChange={setPhone}
          />
        </label>
        <label className="block text-sm font-medium">
          Access PIN
          <input
            className="mt-1 w-full rounded-lg border px-3 py-2"
            type="password"
            inputMode="numeric"
            required
            value={pin}
            onChange={(e) => setPin(e.target.value)}
          />
        </label>
        {error && <p className="text-sm text-destructive">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-full bg-primary py-3 text-sm font-semibold text-primary-foreground disabled:opacity-60"
        >
          {loading ? "Signing in…" : "Sign in"}
        </button>
      </form>
      <Link href="/" className="mt-6 inline-block text-sm text-primary">
        Back to SakhiHome
      </Link>
    </div>
  );
}

export default function ClientLoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
