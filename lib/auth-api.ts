import { auth } from "@/lib/auth";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

/**
 * Récupère la session côté serveur (API Route) à partir des headers de la requête.
 * Retourne null si non connecté.
 */
export async function getSession(request: NextRequest) {
  const session = await auth.api.getSession({
    headers: request.headers,
  });
  return session ?? null;
}

/**
 * Vérifie que la requête est authentifiée avec un rôle ADMIN ou MANAGER.
 * À appeler au début des handlers des routes API réservées aux admins.
 * Retourne une Response 401 à renvoyer si non autorisé, sinon null (on peut continuer).
 */
export async function requireAdminSession(
  request: NextRequest,
): Promise<NextResponse | null> {
  const session = await getSession(request);

  if (!session?.user) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }

  const role = (session.user as { role?: string }).role;
  if (role !== "ADMIN" && role !== "MANAGER") {
    return NextResponse.json(
      { error: "Accès réservé aux administrateurs" },
      { status: 403 },
    );
  }

  return null;
}
