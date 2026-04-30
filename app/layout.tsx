import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { getAbsoluteSiteUrl } from "@/lib/services";
import { cn } from "@/lib/utils";
import { Toaster } from "sonner";
import BottomNav from "@/app/components/site/BottomNav";

const inter = Inter({subsets:['latin'],variable:'--font-sans'});

const siteUrl = getAbsoluteSiteUrl("/");

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "SakhiHome - Trusted Maid Services in Hinjewadi IT Park, Pune",
    template: `%s | SakhiHome`,
  },
  description:
    "Verified maids & home help in Pune: house cleaning, cooking, babysitting, elder care & full‑ or part‑time placements. SakhiHome -book trusted helpers today.",
  openGraph: {
    type: "website",
    locale: "en_IN",
    siteName: "SakhiHome",
    title: "SakhiHome – Trusted Maid & Home Services in Pune",
    description:
      "Verified maids & home help in Pune: cleaning, cooking, babysitting & elder care. Book trusted placements with SakhiHome.",
    url: siteUrl,
  },
  twitter: {
    card: "summary_large_image",
    title: "SakhiHome – Trusted Maid & Home Services in Pune",
    description:
      "Verified maids & home help in Pune: cleaning, cooking, babysitting & elder care. Book with SakhiHome.",
  },
  icons: {
    icon: [{ url: "/favicon.ico", type: "image/x-icon" }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn("h-full", "antialiased", "font-sans", inter.variable)}
    >
      <body className="min-h-full flex flex-col pb-[calc(env(safe-area-inset-bottom)+4.5rem)] md:pb-0">
        {children}
        <BottomNav />
        <Toaster richColors position="top-center" />
      </body>
    </html>
  );
}
