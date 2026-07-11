import { Redirect } from "wouter";

export function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Redirect to="/admin/login" />;
  }

  return <>{children}</>;
}