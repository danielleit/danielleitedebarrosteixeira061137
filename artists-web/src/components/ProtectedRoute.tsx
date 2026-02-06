"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { authFacade } from "@/state/auth/auth.facade";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      const snapshot = authFacade.snapshot;
      
      if (!snapshot.isAuthenticated) {
        router.replace("/login");
        return;
      }
      
      setIsChecking(false);
    };

    checkAuth();
  }, [router]);

  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F9FAFB]">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-[#FFBB38]"></div>
          <p className="text-gray-600">Verificando autenticação...</p>
        </div>
      </div>
    );
  }

  return <div>{children}</div>;
}
