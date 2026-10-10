import { Navigate, useLocation } from "@tanstack/react-router";
import type { ReactNode } from "react";

import { useAuth } from "../useAuth";
import { Loading } from "./Loading";

export function RequireAuth({ children }: { children: ReactNode }) {
  const { session, isLoading } = useAuth();
  const location = useLocation();
  if (isLoading) return <Loading />;
  if (!session) {
    return <Navigate to="/sign-in" search={{ redirect: location.href }} replace />;
  }
  return <>{children}</>;
}
