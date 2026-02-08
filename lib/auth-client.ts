import { createAuthClient } from "better-auth/react";
import { inferAdditionalFields } from "better-auth/client/plugins";
import type { auth } from "@/lib/auth";

function getAuthBaseURL() {
  if (process.env.NEXT_PUBLIC_BETTER_AUTH_URL)
    return process.env.NEXT_PUBLIC_BETTER_AUTH_URL;
  if (typeof window !== "undefined") return window.location.origin;
  return "http://localhost:3000";
}

export const authClient = createAuthClient({
  baseURL: getAuthBaseURL(),
  basePath: "/api/auth",
  plugins: [inferAdditionalFields<typeof auth>()],
});

export const { signIn, signUp, signOut, useSession } = authClient;
