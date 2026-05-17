#!/bin/sh
# Script de démarrage Railway — appliqué à chaque déploiement
set -e

echo "→ Création des dossiers storage (filesystem Railway éphémère)"
mkdir -p storage/framework/cache/data
mkdir -p storage/framework/sessions
mkdir -p storage/framework/views
mkdir -p storage/logs
mkdir -p bootstrap/cache

echo "→ Nettoyage des caches périmés du build (peuvent contenir des env vars vides)"
php artisan config:clear || true
php artisan route:clear || true
php artisan view:clear || true
php artisan cache:clear || true

echo "→ Génération de l'APP_KEY si absente"
if [ -z "$APP_KEY" ]; then
  php artisan key:generate --no-interaction --force
fi

echo "→ Migrations BDD"
php artisan migrate --force

echo "→ Re-cache avec les vraies variables d'env Railway"
php artisan config:cache
php artisan route:cache

# storage:link uniquement si le filesystem disk est local (sans S3/R2)
if [ "$FILESYSTEM_DISK" = "public" ] || [ -z "$FILESYSTEM_DISK" ]; then
  echo "→ Storage link"
  php artisan storage:link || true
fi

echo "→ Démarrage du serveur sur 0.0.0.0:$PORT"
exec php artisan serve --host=0.0.0.0 --port=$PORT
