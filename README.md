# 🛒 Site E-Commerce

Un site e-commerce moderne construit avec Next.js 16, TypeScript, et Tailwind CSS.

## 🚀 Démarrage rapide

### Installation des dépendances

```bash
pnpm install
```

### Lancer le serveur de développement

```bash
pnpm dev
```

Ouvrez [http://localhost:3000](http://localhost:3000) dans votre navigateur pour voir le résultat.

## 📁 Structure du projet

Consultez le fichier [STRUCTURE.md](./STRUCTURE.md) pour une documentation détaillée de l'organisation des dossiers.

### Organisation principale

- **`app/`** - Pages Next.js (App Router)
  - `products/` - Pages produits (liste et détail)
  - `cart/` - Page panier
  - `checkout/` - Page checkout
  - `account/` - Pages compte utilisateur

- **`components/`** - Composants React réutilisables
  - `ui/` - Composants UI de base
  - `layout/` - Header, Footer
  - `product/` - Composants produits
  - `cart/` - Composants panier

- **`lib/`** - Bibliothèques et utilitaires
  - `api/` - Appels API
  - `utils/` - Fonctions utilitaires
  - `validations/` - Schémas de validation (Zod)

- **`hooks/`** - Hooks React personnalisés
- **`contexts/`** - Contextes React (CartContext, etc.)
- **`types/`** - Types TypeScript
- **`config/`** - Configuration et constantes

## ✨ Fonctionnalités

- ✅ Gestion du panier avec localStorage
- ✅ Pages produits (liste et détail)
- ✅ Page checkout
- ✅ Structure modulaire et scalable
- ✅ TypeScript pour la sécurité des types
- ✅ Tailwind CSS pour le styling

## 🔧 Technologies utilisées

- **Next.js 16** - Framework React
- **TypeScript** - Typage statique
- **Tailwind CSS** - Framework CSS
- **Zod** - Validation de schémas
- **React Context** - Gestion d'état

## 📝 Prochaines étapes

1. Implémenter les appels API réels dans `lib/api/`
2. Ajouter l'authentification utilisateur
3. Configurer la base de données
4. Ajouter les tests
5. Configurer le déploiement

## 📚 Documentation

Pour plus d'informations sur Next.js, consultez :
- [Documentation Next.js](https://nextjs.org/docs)
- [Apprendre Next.js](https://nextjs.org/learn)

## 🚀 Déploiement

Le moyen le plus simple de déployer votre application Next.js est d'utiliser [Vercel](https://vercel.com/new).
