import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { GoogleAnalytics } from "@/app/components/GoogleAnalytics";
import { getAbsoluteSiteUrl } from "@/lib/services";
import { cn } from "@/lib/utils";
import { Toaster } from "sonner";
import BottomNav from "@/app/components/site/BottomNav";

const inter = Inter({subsets:['latin'],variable:'--font-sans'});

const siteUrl = getAbsoluteSiteUrl("/");

function safeMetadataBaseUrl(url: string): URL {
  try {
    return new URL(url);
  } catch {
    return new URL("http://localhost:3000");
  }
}

export const metadata: Metadata = {
  metadataBase: safeMetadataBaseUrl(siteUrl),
  title: {
    default: "SakhiHome - Trusted Maid Services in South Mumbai",
    template: `%s | SakhiHome`,
  },
  description:
    "Verified maids & home help in South Mumbai: house cleaning, cooking, babysitting, elder care & full‑ or part‑time placements. SakhiHome — book trusted helpers today.",
  openGraph: {
    type: "website",
    locale: "en_IN",
    siteName: "SakhiHome",
    title: "SakhiHome - Trusted Maid & Home Services in South Mumbai",
    description:
      "Verified maids & home help in South Mumbai: cleaning, cooking, babysitting & elder care. Book trusted placements with SakhiHome.",
    url: siteUrl,
  },
  twitter: {
    card: "summary_large_image",
    title: "SakhiHome - Trusted Maid & Home Services in South Mumbai",
    description:
      "Verified maids & home help in South Mumbai: cleaning, cooking, babysitting & elder care. Book with SakhiHome.",
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
        <GoogleAnalytics />
        {children}
        <BottomNav />
        <Toaster richColors position="top-center" />
      </body>
    </html>
  );
}
