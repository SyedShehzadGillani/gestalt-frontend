import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Loader2, ShieldAlert } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface ProtectedHQRouteProps {
  children: React.ReactNode;
}

export function ProtectedHQRoute({ children }: ProtectedHQRouteProps) {
  // Authentication temporarily disabled - allow all access
  return <>{children}</>;
}
