#!/bin/sh
{
  echo HOSTNAME="$APP_HOSTNAME";
  echo PORT="$APP_PORT";
  echo PROTOCOL="$APP_PROTOCOL";
  echo REVERSE_PROXY_PORT="$APP_REVERSE_PROXY_PORT";

  echo CORS_ALLOWED_ORIGINS="$CORS_ALLOWED_ORIGINS"

  echo DATABASE_NAME="$DATABASE_NAME"
  echo DATABASE_USER="$DATABASE_USER"
  echo DATABASE_PASSWORD="$DATABASE_PASSWORD"
  echo DATABASE_HOST="$DATABASE_HOST"
  echo DATABASE_PORT="$DATABASE_PORT"
  echo DATABASE_ADAPTER="$DATABASE_ADAPTER"

  echo AUTH_SALT_ROUNDS="$AUTH_SALT_ROUNDS"
  echo AUTH_JWT_SECRET="$AUTH_JWT_SECRET"
  echo AUTH_JWT_ISSUER="$AUTH_JWT_ISSUER"
  echo AUTH_JWT_COOKIE_NAME="$AUTH_JWT_COOKIE_NAME"
  echo AUTH_JWT_COOKIE_SECRET="$AUTH_JWT_COOKIE_SECRET"

  echo STORAGE_PROVIDER="$STORAGE_PROVIDER"
  echo STORAGE_PATH="$STORAGE_PATH"
  echo STORAGE_PROXY="$STORAGE_PROXY"
  echo STORAGE_PROXY_PRIVATE_KEY="$STORAGE_PROXY_PRIVATE_KEY"

  echo ENABLE_DEFAULT_SCHEMA="$ENABLE_DEFAULT_SCHEMA"

  echo STORE_PROVIDER="$STORE_PROVIDER"
  echo STORE_TTL="$STORE_TTL"

  echo CYPRESS_USERNAME="$CYPRESS_USERNAME"
  echo CYPRESS_PASSWORD="$CYPRESS_PASSWORD"
} >> .env
