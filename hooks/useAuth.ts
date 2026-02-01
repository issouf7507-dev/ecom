"use client";

import { useSession } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export function useAuth(requireAuth = false) {
  const { data: session, isPending } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (!isPending && requireAuth && !session) {
      router.push("/login");
    }
  }, [session, isPending, requireAuth, router]);

  return {
    session,
    user: session?.user,
    isPending,
    isAuthenticated: !!session,
    isAdmin: session?.user?.role === "ADMIN" || session?.user?.role === "MANAGER",
  };
}
