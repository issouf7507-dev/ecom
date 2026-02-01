# 🔐 Authentification avec Better Auth

## Configuration Complète

### Fichiers Créés

1. **`prisma/schema.prisma`** - Schéma complet avec tous les modèles e-commerce
2. **`lib/auth.ts`** - Configuration Better Auth serveur
3. **`lib/auth-client.ts`** - Client Better Auth pour React
4. **`lib/prisma.ts`** - Client Prisma singleton
5. **`app/api/auth/[...all]/route.ts`** - Route API pour Better Auth
6. **`hooks/useAuth.ts`** - Hook React pour l'authentification
7. **`middleware.ts`** - Protection des routes (basique)

### Modèles Prisma Créés

#### Authentification
- ✅ `User` - Utilisateurs avec rôles (CUSTOMER, ADMIN, MANAGER, STAFF)
- ✅ `Session` - Sessions Better Auth
- ✅ `Account` - Comptes OAuth (pour futures intégrations)
- ✅ `Verification` - Vérifications email

#### E-Commerce
- ✅ `Product` - Produits complets
- ✅ `Category` - Catégories hiérarchiques
- ✅ `Order` - Commandes
- ✅ `Cart` - Panier
- ✅ `Review` - Avis
- ✅ `Coupon` - Codes promo
- ✅ `Campaign` - Campagnes marketing
- ✅ `Inventory` - Gestion des stocks
- ✅ Et plus...

## Prochaines Étapes

1. **Configurer `.env`** :
   ```env
   DATABASE_URL="postgresql://..."
   BETTER_AUTH_SECRET="..."
   BETTER_AUTH_URL="http://localhost:3000"
   NEXT_PUBLIC_BETTER_AUTH_URL="http://localhost:3000"
   ```

2. **Générer Prisma Client** :
   ```bash
   pnpm db:generate
   ```

3. **Créer la base de données** :
   ```bash
   pnpm db:push
   ```

4. **Créer un utilisateur admin** (via Prisma Studio ou seed)

5. **Tester l'authentification** :
   - Aller sur `/login`
   - Créer un compte ou se connecter
   - Vérifier la redirection

## Utilisation dans les Composants

### Client Component
```tsx
"use client";
import { useAuth } from "@/hooks/useAuth";

export function MyComponent() {
  const { user, isAuthenticated, isAdmin } = useAuth();
  
  if (!isAuthenticated) return <div>Non connecté</div>;
  
  return <div>Bonjour {user?.name}</div>;
}
```

### Server Component
```tsx
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export default async function ServerPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  
  if (!session) {
    redirect("/login");
  }
  
  return <div>Bonjour {session.user.name}</div>;
}
```

## Protection des Routes Dashboard

Le middleware protège automatiquement les routes commençant par :
- `/dashboard`
- `/ajouter-produits`
- `/produits-listes`
- `/categories`
- `/commandes`
- `/clients`
- `/analytics`
- `/campagnes`
- `/settings`

Pour une protection plus fine, utilisez `useAuth()` dans chaque page.
