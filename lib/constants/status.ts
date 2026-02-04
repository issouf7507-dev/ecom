/**
 * Valeurs de statut partagées entre client et serveur.
 * À ne pas importer depuis @prisma/client dans le code côté client (hooks, pages "use client")
 * car cela inclut Prisma dans le bundle navigateur et casse le build.
 */
export const Status = {
  ACTIVE: "ACTIVE",
  INACTIVE: "INACTIVE",
  ARCHIVED: "ARCHIVED",
  DRAFT: "DRAFT",
} as const;

export type Status = (typeof Status)[keyof typeof Status];
