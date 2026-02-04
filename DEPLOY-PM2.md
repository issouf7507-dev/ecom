# Déployer l’app sur le serveur avec PM2

Ce guide décrit comment lancer l’application Next.js en production avec **PM2** sur ton serveur.

---

## 1. Sur ton serveur : installer Node.js et PM2

```bash
# Node.js (exemple avec nvm)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
source ~/.bashrc   # ou ~/.zshrc
nvm install 20
nvm use 20

# PM2 (gestionnaire de processus)
npm install -g pm2
```

---

## 2. Envoyer le projet sur le serveur

Depuis ta machine, par exemple avec **rsync** ou **scp** :

```bash
# Exemple rsync (remplace user et ton-serveur)
rsync -avz --exclude node_modules --exclude .next --exclude .git . user@ton-serveur:/var/www/ecom
```

Ou cloner le dépôt Git directement sur le serveur.

---

## 3. Sur le serveur : installer les deps et build

```bash
cd /var/www/ecom   # ou le chemin où est le projet

# Variables d'environnement (obligatoire pour la prod)
cp .env.example .env
# Édite .env avec tes vraies valeurs : DATABASE_URL, BETTER_AUTH_SECRET, etc.

# Dépendances
pnpm install --frozen-lockfile
# ou: npm ci

# Générer le client Prisma
pnpm db:generate
# ou: npx prisma generate

# Build Next.js
pnpm build
# ou: npm run build
```

---

## 4. Démarrer l’app avec PM2

```bash
# Démarrer avec le fichier ecosystem.config.js
pm2 start ecosystem.config.js

# Vérifier que l’app tourne
pm2 status
pm2 logs ecom
```

L’app écoute par défaut sur le port **3000** (`http://localhost:3000`).

---

## 5. (Recommandé) Démarrer PM2 au boot du serveur

Pour que l’app redémarre après un reboot du serveur :

```bash
# Génère la commande à exécuter pour ton OS
pm2 startup

# Exécute la commande affichée par pm2 startup (souvent en sudo)

# Enregistre la liste des process actuels
pm2 save
```

Après un redémarrage, PM2 relancera automatiquement `ecom`.

---

## Commandes PM2 utiles

| Commande | Description |
|----------|-------------|
| `pm2 start ecosystem.config.js` | Démarrer l’app |
| `pm2 stop ecom` | Arrêter l’app |
| `pm2 restart ecom` | Redémarrer (après un nouveau build par ex.) |
| `pm2 reload ecom` | Rechargement sans coupure (0-downtime) |
| `pm2 logs ecom` | Voir les logs en direct |
| `pm2 status` | Liste des apps gérées par PM2 |
| `pm2 monit` | Monitoring CPU / RAM en temps réel |
| `pm2 delete ecom` | Supprimer l’app de PM2 |

---

## Exposer l’app avec Nginx (reverse proxy)

Pour utiliser un nom de domaine et HTTPS, place Nginx devant Next.js :

```nginx
# /etc/nginx/sites-available/ecom
server {
    listen 80;
    server_name ton-domaine.com;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Puis :

```bash
sudo ln -s /etc/nginx/sites-available/ecom /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

Pour HTTPS, utilise **Certbot** : `sudo certbot --nginx -d ton-domaine.com`.

---

## Après une mise à jour du code

```bash
cd /var/www/ecom
git pull
pnpm install
pnpm db:generate
pnpm build
pm2 restart ecom
```

Tu peux automatiser ces étapes avec un script ou un pipeline CI/CD.
