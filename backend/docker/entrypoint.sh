#!/usr/bin/env sh
set -e

mkdir -p \
  storage/framework/cache/data \
  storage/framework/sessions \
  storage/framework/views \
  storage/logs \
  bootstrap/cache \
  public/uploads/products \
  public/uploads/categories \
  public/uploads/site \
  public/uploads/datasheets

chmod -R 775 storage bootstrap/cache public/uploads

if [ "${DB_CONNECTION:-sqlite}" = "sqlite" ] && [ ! -f "database/database.sqlite" ]; then
  touch database/database.sqlite
fi

echo "Running database migrations..."
php artisan migrate --force

USER_COUNT=$(php -r '
require "vendor/autoload.php";
$app = require "bootstrap/app.php";
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();
echo \App\Models\User::count();
' 2>/dev/null || echo "0")

if [ "$USER_COUNT" = "0" ]; then
  echo "Database is empty. Seeding demo data..."
  php artisan db:seed --force
else
  echo "Database already has $USER_COUNT user(s). Skipping seed."
fi

php artisan optimize:clear
php artisan config:cache
php artisan route:cache

echo "Starting Laravel server on port ${PORT:-8000}..."
exec php artisan serve --host=0.0.0.0 --port="${PORT:-8000}"
