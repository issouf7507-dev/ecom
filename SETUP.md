# 🚀 Guide de Configuration - Better Auth + Prisma

## Prérequis

- Node.js 18+ et pnpm installés
- PostgreSQL installé et en cours d'exécution

## Installation

### 1. Installer les dépendances

```bash
pnpm install
```

### 2. Configuration de la base de données

1. Créer un fichier `.env` à la racine du projet :

```env
# Database
DATABASE_URL="mysql://user:password@localhost:3306/ecom"

# Better Auth
BETTER_AUTH_SECRET="votre-cle-secrete-minimum-32-caracteres-aleatoires"
BETTER_AUTH_URL="http://localhost:3000"

# Public (pour le client)
NEXT_PUBLIC_BETTER_AUTH_URL="http://localhost:3000"

# WhatsApp (commande depuis le panier → envoi sur WhatsApp)
NEXT_PUBLIC_WHATSAPP_NUMBER="33612345678"
```

**Important :** 
- Remplacez `user`, `password`, et `localhost:5432` par vos informations PostgreSQL
- Générez une clé secrète sécurisée pour `BETTER_AUTH_SECRET` (minimum 32 caractères)
- Vous pouvez utiliser : `openssl rand -base64 32`

### 3. Générer le client Prisma

```bash
pnpm db:generate
```

### 4. Créer la base de données et appliquer le schéma

```bash
# Option 1: Push le schéma (développement)
pnpm db:push

# Option 2: Créer une migration (production)
pnpm db:migrate
```

### 5. Créer des utilisateurs avec le seeder

Un script de seed est déjà configuré pour créer des utilisateurs de test. Il utilise Better Auth pour hasher les mots de passe correctement :

```bash
pnpm db:seed
```

Ce script crée :
- **Admin** : `admin@example.com` / `admin123`
- **Customer** : `customer@example.com` / `customer123`

**Important** : Le seeder utilise Better Auth pour hasher les mots de passe avec `scrypt` (l'algorithme par défaut de Better Auth), garantissant que les utilisateurs créés peuvent se connecter via l'interface de login.

**Note** : Si vous préférez créer manuellement, vous pouvez utiliser Prisma Studio :

```bash
pnpm db:studio
```

Mais assurez-vous d'utiliser Better Auth pour hasher les mots de passe, sinon la connexion ne fonctionnera pas.

## Structure des Modèles Prisma

Le schéma Prisma inclut tous les modèles nécessaires pour l'e-commerce :

### Authentification
- `User` - Utilisateurs avec rôles (CUSTOMER, ADMIN, MANAGER, STAFF)
- `Session` - Sessions Better Auth
- `Account` - Comptes OAuth
- `Verification` - Vérifications email

### Produits
- `Product` - Produits avec variantes, images, stock
- `Category` - Catégories hiérarchiques
- `ProductImage` - Images produits
- `ProductVariant` - Variantes produits (taille, couleur, etc.)

### Commandes
- `Order` - Commandes avec statuts
- `OrderItem` - Items de commande
- `Payment` - Paiements
- `Address` - Adresses de livraison/facturation

### Panier
- `Cart` - Panier utilisateur
- `CartItem` - Items du panier

### Marketing
- `Campaign` - Campagnes Email/SMS/WhatsApp
- `CampaignProduct` - Produits dans les campagnes
- `Coupon` - Codes promo

### Autres
- `Review` - Avis produits
- `Inventory` - Historique des mouvements de stock
- `StoreSettings` - Paramètres de la boutique

## Utilisation

### Authentification côté client

```typescript
import { useAuth } from "@/hooks/useAuth";

function MyComponent() {
  const { user, isAuthenticated, isAdmin } = useAuth();
  
  if (!isAuthenticated) {
    return <div>Non connecté</div>;
  }
  
  return <div>Bonjour {user?.name}</div>;
}
```

### Authentification côté serveur

```typescript
import { auth } from "@/lib/auth";

export async function getServerSideProps() {
  const session = await auth.api.getSession({
    headers: request.headers,
  });
  
  if (!session) {
    return { redirect: { destination: "/login" } };
  }
  
  return { props: { user: session.user } };
}
```

### Déconnexion

```typescript
import { signOut } from "@/lib/auth-client";

await signOut();
```

## Scripts Disponibles

- `pnpm db:generate` - Génère le client Prisma
- `pnpm db:push` - Push le schéma vers la DB (dev)
- `pnpm db:migrate` - Crée une migration (prod)
- `pnpm db:studio` - Ouvre Prisma Studio (GUI)
- `pnpm db:seed` - Exécute le script de seed

## Prochaines Étapes

1. ✅ Configuration de la base de données
2. ✅ Génération du client Prisma
3. ✅ Application du schéma
4. ⚠️ Créer un utilisateur admin
5. ⚠️ Tester l'authentification
6. ⚠️ Connecter les pages du dashboard à Prisma

## Notes Importantes

- Le middleware protège les routes du dashboard
- Utilisez `useAuth()` dans les composants clients
- Pour les Server Components, utilisez `auth.api.getSession()`
- Les mots de passe sont hashés automatiquement par Better Auth
- Les sessions expirent après 7 jours par défaut
