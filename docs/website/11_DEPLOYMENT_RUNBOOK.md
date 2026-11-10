# 11. Deployment, Operations and Recovery Runbook (Phase 10)

Date: 2026-11-10. This document holds everything that can be prepared without company decisions.
Items marked **Decision needed** cannot be completed until the company chooses.

## 1. What is ready

| Item | Where | Status |
| --- | --- | --- |
| Production image (Next.js standalone, non-root, health check) | `Dockerfile`, `.dockerignore` | Written. Not built in CI yet |
| Health endpoint (`200 ok` / `503 degraded`, no internals exposed) | `GET /api/health` | Done, tested |
| Continuous integration (migrate, typecheck, lint, unit, build, e2e on PostgreSQL 16) | `.github/workflows/ci.yml` | Written; runs on first push to GitHub |
| Database backup and restore | `ops/backup.sh`, `ops/restore.sh` | Done; restore verified into a scratch database (10 products, 10 industries) |
| Shared rate limit across instances | `src/lib/shared-rate-limit.ts`, table `rate_limit_hits` | Done, verified (5 accepted, 6th returns 429) |
| Schema migrations | `migrations/`, `npm run cms:migrate` | Done |
| Content publishing | `npm run cms:publish` + `DEPLOY_HOOK_URL` | Done |

## 2. Release steps (any host that runs a container or Node 24)

1. Provision PostgreSQL 16 and set `DATABASE_URL` (use TLS: `?sslmode=require`).
2. Set secrets: `PAYLOAD_SECRET` (32+ random bytes), `NEXT_PUBLIC_SITE_URL`, `SITE_INDEXABLE=true` (production domain only), lead notification variables.
3. `npm ci && npm run cms:migrate` against the production database.
4. Create the first Super Admin at `/admin` immediately after the first deploy (the first account created gets that role). Do this before announcing the URL.
5. `npm run cms:seed` (first release only), review the content in `/admin`, then `npm run cms:publish`, commit the snapshot and build.
6. Build and run: `docker build -t medhavya-website .` then run with the environment above, or `npm run build && npm start`.
7. Point the monitor at `/api/health`.

## 3. Content change flow

Editor saves a Draft, requests review. A Reviewer approves (Published). Then `npm run cms:publish`, commit `src/content/cms-snapshot.json` and rebuild. With `DEPLOY_HOOK_URL` set, the CMS calls the host's deploy hook after each change to live content, so the last two steps can be automated by a CI job that runs `cms:publish` before the build.

## 4. Backups and recovery

- Daily: `DATABASE_URL=... ops/backup.sh /secure/path` (keeps the newest 14). Backups contain personal data from leads: encrypt at rest and restrict access.
- Restore: `CONFIRM=yes DATABASE_URL=... ops/restore.sh <file>`. This replaces the database contents.
- Test a restore every quarter. Record the measured time as your actual RTO.
- Proposed targets for approval (ADR-007): RPO 24 h (daily dump) or 5 min with managed point-in-time recovery; RTO 4 h.

## 5. Monitoring checklist

- Uptime: `/api/health` every minute, alert after 2 failures.
- Logs: structured JSON with request IDs; events to alert on are `lead.submit.failed`, `lead.notification.failed` and `rate_limit.store_failed`.
- Database: disk usage, connection count, backup age (alert if older than 26 h).
- Certificates and domain renewal dates.

## 6. Decision needed (cannot be completed without the company)

1. Domain name, DNS provider and TLS approach.
2. Hosting provider and region, and the data residency requirement for lead data (India DPDP considerations).
3. Backup RPO/RTO approval and where backups are stored.
4. Email/CRM provider for lead notifications (a webhook adapter exists), and an analytics provider.
5. Who holds the first Super Admin account.
6. Legal review of Privacy, Terms, Cookies and Accessibility pages; real product facts; contact details (see the implementation report).
