#!/usr/bin/env sh
# Restore a backup made by ops/backup.sh. DESTRUCTIVE: replaces the target database contents.
# Usage: CONFIRM=yes ops/restore.sh backups/medhavya-<timestamp>.sql.gz
set -eu
FILE="${1:?backup file}"; [ "${CONFIRM:-}" = "yes" ] || { echo "Set CONFIRM=yes to overwrite the target database."; exit 1; }
if [ -n "${DOCKER_CONTAINER:-}" ]; then
  gunzip -c "$FILE" | docker exec -i "$DOCKER_CONTAINER" psql -U "${PGUSER:-medhavya}" -d "${PGDATABASE:-medhavya}" -v ON_ERROR_STOP=1
else
  : "${DATABASE_URL:?set DATABASE_URL}"
  gunzip -c "$FILE" | psql "$DATABASE_URL" -v ON_ERROR_STOP=1
fi
echo "Restore complete from $FILE"
