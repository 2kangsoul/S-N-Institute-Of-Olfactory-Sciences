import type { ReactNode } from "react";
import AuthLayout from "@/src/layout/AuthLayout";

export default function OrderLayout({ children }: { children: ReactNode }) {
  return <AuthLayout>{children}</AuthLayout>;
}