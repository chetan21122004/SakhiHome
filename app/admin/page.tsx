import type { Metadata } from "next";
import RegistryDashboard from "./registry-dashboard";
import "./registry.css";

export const metadata: Metadata = {
  title: "Team workspace",
  robots: { index: false, follow: false },
};
export default function AdminPage() {
  return <RegistryDashboard />;
}
