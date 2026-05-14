#!/bin/sh
# Script de démarrage Railway — appliqué à chaque déploiement

set -e

echo "→ Génération de l'APP_KEY si absente"
if [ -z "$APP_KEY" ]; then
  php artisan key:generate --no-interaction --force --show
fi

echo "→ Migrations BDD"
php artisan migrate --force

echo "→ Cache config (re-cache après lecture des variables d'env Railway)"
php artisan config:cache
php artisan route:cache

# storage:link uniquement si le filesystem disk est local (sans S3/R2)
if [ "$FILESYSTEM_DISK" = "public" ] || [ -z "$FILESYSTEM_DISK" ]; then
  echo "→ Storage link"
  php artisan storage:link || true
fi

echo "→ Démarrage du serveur sur 0.0.0.0:$PORT"
exec php artisan serve --host=0.0.0.0 --port=$PORT
