/**
 * Configuration PM2 pour lancer l'application Next.js en production sur le serveur.
 *
 * Prérequis sur le serveur:
 * 1. Node.js installé (v18+ recommandé)
 * 2. PM2 installé globalement: npm install -g pm2
 * 3. Build effectué: pnpm build (ou npm run build)
 *
 * Commandes utiles:
 * - Démarrer:    pm2 start ecosystem.config.js
 * - Arrêter:     pm2 stop ecom
 * - Redémarrer:  pm2 restart ecom
 * - Logs:        pm2 logs ecom
 * - Statut:      pm2 status
 * - Au démarrage du serveur: pm2 startup puis pm2 save
 */

module.exports = {
  apps: [
    {
      name: "ecom",
      script: "node_modules/next/dist/bin/next",
      args: "start",
      cwd: __dirname,
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: "1G",
      env: {
        NODE_ENV: "production",
      },
      env_production: {
        NODE_ENV: "production",
      },
      // Optionnel: décommenter et créer le dossier "logs" pour des fichiers de log dédiés
      // error_file: "./logs/pm2-error.log",
      // out_file: "./logs/pm2-out.log",
      merge_logs: true,
      time: true,
    },
  ],
};
