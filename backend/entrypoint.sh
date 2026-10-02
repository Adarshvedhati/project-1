#!/bin/sh
# Container start-up: migrate, bootstrap admin / demo data, then run the server.
set -e

python manage.py migrate --noinput
python manage.py ensure_admin

if [ "${SEED_DEMO_DATA:-false}" = "true" ]; then
  if [ "${SEED_DEMO_USERS:-false}" = "true" ]; then
    python manage.py seed_demo --demo-users
  else
    python manage.py seed_demo
  fi
fi

exec "$@"
