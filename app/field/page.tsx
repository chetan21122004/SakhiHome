import type { Metadata } from "next";
import FieldApp from "./field-app";

export const metadata: Metadata = {
  title: "Field onboarding",
  robots: { index: false, follow: false },
};

export default function FieldPage() {
  return <FieldApp />;
}
