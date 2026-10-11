import Image from "next/image";
import Link from "next/link";
import logoMark from "@/public/assets/logo_only.png";
import logoWordmark from "@/public/assets/logo_text.png";

export default function BrandLogo({ caption }: { caption: string }) {
  return (
    <Link href="/" className="rg-brand rg-brand-assets" aria-label="SakhiHome Services — home">
      <Image src={logoMark} alt="" className="rg-logo-mark" sizes="72px" />
      <span className="rg-logo-lockup">
        <Image src={logoWordmark} alt="SakhiHome Services" className="rg-logo-wordmark" sizes="(max-width: 640px) 150px, 190px" />
        <small>{caption}</small>
      </span>
    </Link>
  );
}
