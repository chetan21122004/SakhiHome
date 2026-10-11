import type { Metadata } from "next";
import RegistrationForm from "./registration-form";
import "../admin/registry.css";

export const metadata: Metadata = {
  title: "Join our network",
  robots: { index: false, follow: false },
};
export default function RegisterPage() {
  return <RegistrationForm />;
}
