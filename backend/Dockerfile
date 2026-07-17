# Image backend Lartiska — remplace nixpacks (Railway détecte ce Dockerfile
# automatiquement). Raison du changement : impossible de charger l'extension
# GD via nixpacks avec nixPkgs figé (php84Extensions.gd présent dans le store
# mais jamais chargé) → l'upload d'images plantait en prod.
# Ici : PHP officiel + GD compilé avec JPEG/WebP/FreeType. Déterministe.
FROM php:8.4-cli

# Dépendances système + extensions PHP requises :
#  - gd (jpeg/webp/freetype) : ré-encodage des images uploadées (ImageProcessor)
#  - pdo_mysql : base Railway MySQL
#  - zip : composer + dompdf
#  - bcmath, exif : Laravel / métadonnées
RUN apt-get update && apt-get install -y --no-install-recommends \
        git unzip \
        libzip-dev libpng-dev libjpeg62-turbo-dev libwebp-dev libfreetype6-dev \
    && docker-php-ext-configure gd --with-jpeg --with-webp --with-freetype \
    && docker-php-ext-install -j"$(nproc)" gd zip pdo_mysql bcmath exif \
    && rm -rf /var/lib/apt/lists/*

COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /app

# Couche dépendances (cache Docker : ne se reconstruit que si le lock change).
# --no-scripts : artisan n'est pas encore copié ; le PackageManifest de
# Laravel se régénère tout seul au premier boot (bootstrap/cache writable).
COPY composer.json composer.lock ./
RUN composer install --no-dev --no-scripts --optimize-autoloader \
        --no-interaction --prefer-dist

COPY . .
RUN composer dump-autoload --optimize --no-scripts \
    && chmod +x railway-start.sh

# Railway injecte PORT ; railway-start.sh fait le reste
# (dossiers storage, migrate --force, config:cache, artisan serve).
CMD ["sh", "./railway-start.sh"]
