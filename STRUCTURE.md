# Structure du Projet E-Commerce

## 📁 Organisation des dossiers

```
ecom/
├── app/                          # Pages Next.js (App Router)
│   ├── products/                 # Pages produits
│   │   ├── [id]/                # Page détail produit
│   │   └── page.tsx             # Liste des produits
│   ├── cart/                    # Page panier
│   │   └── page.tsx
│   ├── checkout/                # Page checkout
│   │   └── page.tsx
│   ├── account/                 # Pages compte utilisateur
│   │   ├── orders/             # Commandes
│   │   └── profile/            # Profil
│   ├── admin/                   # Pages admin (si nécessaire)
│   ├── layout.tsx              # Layout principal
│   └── page.tsx                # Page d'accueil
│
├── components/                   # Composants React
│   ├── ui/                      # Composants UI réutilisables
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Modal.tsx
│   │   └── ...
│   ├── layout/                  # Composants de layout
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   └── Sidebar.tsx
│   ├── product/                 # Composants produits
│   │   ├── ProductCard.tsx
│   │   ├── ProductList.tsx
│   │   ├── ProductDetail.tsx
│   │   └── ProductFilters.tsx
│   ├── cart/                    # Composants panier
│   │   ├── CartItem.tsx
│   │   └── CartSummary.tsx
│   ├── checkout/                # Composants checkout
│   │   ├── CheckoutForm.tsx
│   │   └── PaymentForm.tsx
│   └── forms/                   # Formulaires
│       ├── ContactForm.tsx
│       └── NewsletterForm.tsx
│
├── lib/                         # Bibliothèques et utilitaires
│   ├── api/                     # Appels API
│   │   ├── products.ts
│   │   ├── orders.ts
│   │   ├── auth.ts
│   │   └── ...
│   ├── utils/                   # Fonctions utilitaires
│   │   ├── index.ts
│   │   ├── format.ts
│   │   └── validation.ts
│   └── validations/             # Schémas de validation (Zod)
│       ├── product.ts
│       ├── order.ts
│       └── ...
│
├── hooks/                       # Hooks React personnalisés
│   ├── useCart.ts
│   ├── useProducts.ts
│   ├── useAuth.ts
│   └── ...
│
├── contexts/                    # Contextes React
│   ├── CartContext.tsx
│   ├── AuthContext.tsx
│   └── ThemeContext.tsx
│
├── types/                       # Types TypeScript
│   ├── index.ts
│   ├── product.ts
│   ├── order.ts
│   └── ...
│
├── stores/                      # State management (Zustand/Redux si nécessaire)
│   └── ...
│
├── data/                        # Données statiques/mock
│   ├── products.json
│   └── categories.json
│
├── config/                      # Configuration
│   ├── constants.ts
│   └── env.ts
│
├── public/                      # Fichiers statiques
│   ├── images/                  # Images produits
│   ├── icons/                   # Icônes
│   └── ...
│
└── [fichiers racine]           # Config Next.js, package.json, etc.
```

## 🎯 Fonctionnalités principales

### Pages
- **Accueil** (`app/page.tsx`) : Page d'accueil avec produits en vedette
- **Produits** (`app/products/`) : Liste et détails des produits
- **Panier** (`app/cart/`) : Gestion du panier
- **Checkout** (`app/checkout/`) : Processus de commande
- **Compte** (`app/account/`) : Gestion du compte utilisateur

### Composants
- **Layout** : Header, Footer pour la navigation
- **Product** : Affichage des produits (cartes, listes, détails)
- **Cart** : Gestion du panier
- **Checkout** : Formulaire de commande

### Services
- **API** : Appels API pour produits, commandes, authentification
- **Utils** : Fonctions utilitaires (formatage, validation)
- **Validations** : Schémas Zod pour la validation

### State Management
- **Contextes** : CartContext pour le panier
- **Hooks** : useCart, useProducts pour la logique métier

## 🚀 Prochaines étapes

1. **Installer les dépendances manquantes** :
   ```bash
   pnpm add clsx tailwind-merge zod
   ```

2. **Configurer le CartProvider** dans `app/layout.tsx`

3. **Implémenter les appels API** réels dans `lib/api/`

4. **Ajouter la gestion d'authentification** si nécessaire

5. **Configurer la base de données** (Prisma, Supabase, etc.)

6. **Ajouter les tests** (Jest, Vitest, etc.)

7. **Configurer le déploiement** (Vercel, etc.)

