import Link from "next/link";

export default function LegacySharePage() {
  return (
    <div className="mx-auto max-w-md px-4 py-20 text-center">
      <h1 className="text-xl font-semibold">Sign in to view profiles</h1>
      <p className="mt-2 text-muted-foreground">
        Maid profiles are only available through your SakhiHome client portal
        after login.
      </p>
      <Link
        href="/client/login"
        className="mt-6 inline-block rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground"
      >
        Client login
      </Link>
    </div>
  );
}
