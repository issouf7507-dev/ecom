import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Routes protégées du dashboard
  // Note: La vérification de session se fera côté client avec useAuth
  // ou via un composant serveur dans chaque page
  if (
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/ajouter-produits") ||
    pathname.startsWith("/produits-listes") ||
    pathname.startsWith("/categories") ||
    pathname.startsWith("/nouvelles-arrivees") ||
    pathname.startsWith("/produits-a-venir") ||
    pathname.startsWith("/commandes") ||
    pathname.startsWith("/clients") ||
    pathname.startsWith("/analytics") ||
    pathname.startsWith("/campagnes") ||
    pathname.startsWith("/settings")
  ) {
    // Pour l'instant, on laisse passer
    // La protection sera gérée dans les composants avec useAuth
    // ou via des Server Components qui vérifient la session
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/ajouter-produits/:path*",
    "/produits-listes/:path*",
    "/categories/:path*",

    "/produits-a-venir/:path*",
    "/commandes/:path*",
    "/clients/:path*",
    "/analytics/:path*",
    "/campagnes/:path*",
    "/settings/:path*",
  ],
};
