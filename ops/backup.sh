#!/usr/bin/env sh
# Logical backup of the CMS database (content, users, leads). Usage: ops/backup.sh [output-dir]
# Needs pg_dump on PATH, or set DOCKER_CONTAINER=medhavya-db to dump through Docker.
# Backups contain personal data (leads): store them encrypted and restrict access.
set -eu
OUT="${1:-backups}"; mkdir -p "$OUT"
FILE="$OUT/medhavya-$(date -u +%Y%m%dT%H%M%SZ).sql.gz"
if [ -n "${DOCKER_CONTAINER:-}" ]; then
  docker exec "$DOCKER_CONTAINER" pg_dump -U "${PGUSER:-medhavya}" -d "${PGDATABASE:-medhavya}" --no-owner --clean --if-exists | gzip > "$FILE"
else
  : "${DATABASE_URL:?set DATABASE_URL}"
  pg_dump "$DATABASE_URL" --no-owner --clean --if-exists | gzip > "$FILE"
fi
echo "Backup written: $FILE"
# Retention: keep the newest ${KEEP:-14} files.
ls -1t "$OUT"/medhavya-*.sql.gz | tail -n +"$(( ${KEEP:-14} + 1 ))" | xargs -r rm -f
