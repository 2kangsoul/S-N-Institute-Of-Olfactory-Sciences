import AuthLayout from "@/src/layout/AuthLayout";

export default function ProductsAuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AuthLayout>{children}</AuthLayout>;
}
