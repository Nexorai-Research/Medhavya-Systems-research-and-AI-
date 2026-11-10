import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

/** Shared sliding-window rate limit store (one row per accepted request). Keys are hashed client addresses. */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE IF NOT EXISTS "rate_limit_hits" (
    "id" bigserial PRIMARY KEY,
    "key" varchar NOT NULL,
    "hit_at" timestamp(3) with time zone DEFAULT now() NOT NULL
   );
   CREATE INDEX IF NOT EXISTS "rate_limit_hits_key_hit_at_idx" ON "rate_limit_hits" ("key", "hit_at");`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`DROP TABLE IF EXISTS "rate_limit_hits";`)
}
