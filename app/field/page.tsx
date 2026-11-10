import type { Metadata } from "next";
import "@/app/admin/registry.css";
import FieldApp from "./field-app";

export const metadata: Metadata = {
  title: "Field workspace · SakhiHome",
  description: "Onboard and manage maid profiles in the field.",
  robots: { index: false, follow: false },
};

export default function FieldPage() {
  return <FieldApp />;
}
