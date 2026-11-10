import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_users_roles" AS ENUM('super-admin', 'content-admin', 'editor', 'reviewer', 'sales', 'analyst');
  CREATE TYPE "public"."enum_product_categories_publication" AS ENUM('Draft', 'In Review', 'Published', 'Archived');
  CREATE TYPE "public"."enum_product_categories_icon" AS ENUM('agriculture', 'retail', 'ai', 'finance', 'enterprise', 'education', 'healthcare', 'other');
  CREATE TYPE "public"."enum__product_categories_v_version_publication" AS ENUM('Draft', 'In Review', 'Published', 'Archived');
  CREATE TYPE "public"."enum__product_categories_v_version_icon" AS ENUM('agriculture', 'retail', 'ai', 'finance', 'enterprise', 'education', 'healthcare', 'other');
  CREATE TYPE "public"."enum_products_publication" AS ENUM('Draft', 'In Review', 'Published', 'Archived');
  CREATE TYPE "public"."enum_products_lifecycle" AS ENUM('Research', 'In Development', 'Private Pilot', 'Beta', 'Generally Available', 'Deprecated', 'Retired');
  CREATE TYPE "public"."enum__products_v_version_publication" AS ENUM('Draft', 'In Review', 'Published', 'Archived');
  CREATE TYPE "public"."enum__products_v_version_lifecycle" AS ENUM('Research', 'In Development', 'Private Pilot', 'Beta', 'Generally Available', 'Deprecated', 'Retired');
  CREATE TYPE "public"."enum_industries_publication" AS ENUM('Draft', 'In Review', 'Published', 'Archived');
  CREATE TYPE "public"."enum__industries_v_version_publication" AS ENUM('Draft', 'In Review', 'Published', 'Archived');
  CREATE TYPE "public"."enum_enterprise_services_publication" AS ENUM('Draft', 'In Review', 'Published', 'Archived');
  CREATE TYPE "public"."enum__enterprise_services_v_version_publication" AS ENUM('Draft', 'In Review', 'Published', 'Archived');
  CREATE TYPE "public"."enum_resources_publication" AS ENUM('Draft', 'In Review', 'Published', 'Archived');
  CREATE TYPE "public"."enum_resources_type" AS ENUM('Article', 'Guide', 'Insight');
  CREATE TYPE "public"."enum__resources_v_version_publication" AS ENUM('Draft', 'In Review', 'Published', 'Archived');
  CREATE TYPE "public"."enum__resources_v_version_type" AS ENUM('Article', 'Guide', 'Insight');
  CREATE TYPE "public"."enum_leads_status" AS ENUM('New', 'Contacted', 'Qualified', 'Disqualified', 'Converted');
  CREATE TYPE "public"."enum_leads_enquiry_type" AS ENUM('ProductDemo', 'EnterpriseConsultation', 'General', 'Sales', 'Service', 'Partnership', 'Support', 'Career');
  CREATE TABLE "users_roles" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_users_roles",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "users_sessions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"created_at" timestamp(3) with time zone,
  	"expires_at" timestamp(3) with time zone NOT NULL
  );
  
  CREATE TABLE "users" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"email" varchar NOT NULL,
  	"reset_password_token" varchar,
  	"reset_password_expiration" timestamp(3) with time zone,
  	"salt" varchar,
  	"hash" varchar,
  	"reset_password_requested_at" timestamp(3) with time zone,
  	"login_attempts" numeric DEFAULT 0,
  	"lock_until" timestamp(3) with time zone
  );
  
  CREATE TABLE "product_categories" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"slug" varchar NOT NULL,
  	"publication" "enum_product_categories_publication" DEFAULT 'Draft' NOT NULL,
  	"name" varchar NOT NULL,
  	"short_name" varchar NOT NULL,
  	"tagline" varchar NOT NULL,
  	"description" varchar NOT NULL,
  	"icon" "enum_product_categories_icon" NOT NULL,
  	"display_order" numeric DEFAULT 1 NOT NULL,
  	"seo_title" varchar NOT NULL,
  	"seo_description" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "product_categories_texts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "_product_categories_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_slug" varchar NOT NULL,
  	"version_publication" "enum__product_categories_v_version_publication" DEFAULT 'Draft' NOT NULL,
  	"version_name" varchar NOT NULL,
  	"version_short_name" varchar NOT NULL,
  	"version_tagline" varchar NOT NULL,
  	"version_description" varchar NOT NULL,
  	"version_icon" "enum__product_categories_v_version_icon" NOT NULL,
  	"version_display_order" numeric DEFAULT 1 NOT NULL,
  	"version_seo_title" varchar NOT NULL,
  	"version_seo_description" varchar NOT NULL,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "_product_categories_v_texts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "products_features" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"description" varchar NOT NULL
  );
  
  CREATE TABLE "products_use_cases" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL
  );
  
  CREATE TABLE "products_faqs" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"question" varchar NOT NULL,
  	"answer" varchar NOT NULL
  );
  
  CREATE TABLE "products" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"slug" varchar NOT NULL,
  	"publication" "enum_products_publication" DEFAULT 'Draft' NOT NULL,
  	"name" varchar NOT NULL,
  	"category_slug" varchar NOT NULL,
  	"summary" varchar NOT NULL,
  	"description" varchar NOT NULL,
  	"lifecycle" "enum_products_lifecycle" DEFAULT 'In Development' NOT NULL,
  	"is_demo" boolean DEFAULT true,
  	"featured" boolean DEFAULT false,
  	"problem" varchar,
  	"support" varchar,
  	"mockup" jsonb NOT NULL,
  	"governance_owner" varchar NOT NULL,
  	"governance_reviewer" varchar NOT NULL,
  	"governance_last_reviewed" varchar NOT NULL,
  	"governance_evidence_source" varchar NOT NULL,
  	"seo_title" varchar NOT NULL,
  	"seo_description" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "products_texts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "_products_v_version_features" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"description" varchar NOT NULL,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_products_v_version_use_cases" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_products_v_version_faqs" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"question" varchar NOT NULL,
  	"answer" varchar NOT NULL,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_products_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_slug" varchar NOT NULL,
  	"version_publication" "enum__products_v_version_publication" DEFAULT 'Draft' NOT NULL,
  	"version_name" varchar NOT NULL,
  	"version_category_slug" varchar NOT NULL,
  	"version_summary" varchar NOT NULL,
  	"version_description" varchar NOT NULL,
  	"version_lifecycle" "enum__products_v_version_lifecycle" DEFAULT 'In Development' NOT NULL,
  	"version_is_demo" boolean DEFAULT true,
  	"version_featured" boolean DEFAULT false,
  	"version_problem" varchar,
  	"version_support" varchar,
  	"version_mockup" jsonb NOT NULL,
  	"version_governance_owner" varchar NOT NULL,
  	"version_governance_reviewer" varchar NOT NULL,
  	"version_governance_last_reviewed" varchar NOT NULL,
  	"version_governance_evidence_source" varchar NOT NULL,
  	"version_seo_title" varchar NOT NULL,
  	"version_seo_description" varchar NOT NULL,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "_products_v_texts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "industries" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"slug" varchar NOT NULL,
  	"publication" "enum_industries_publication" DEFAULT 'Draft' NOT NULL,
  	"name" varchar NOT NULL,
  	"description" varchar NOT NULL,
  	"seo_title" varchar NOT NULL,
  	"seo_description" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "industries_texts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "_industries_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_slug" varchar NOT NULL,
  	"version_publication" "enum__industries_v_version_publication" DEFAULT 'Draft' NOT NULL,
  	"version_name" varchar NOT NULL,
  	"version_description" varchar NOT NULL,
  	"version_seo_title" varchar NOT NULL,
  	"version_seo_description" varchar NOT NULL,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "_industries_v_texts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "enterprise_services" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"slug" varchar NOT NULL,
  	"publication" "enum_enterprise_services_publication" DEFAULT 'Draft' NOT NULL,
  	"name" varchar NOT NULL,
  	"summary" varchar NOT NULL,
  	"seo_title" varchar NOT NULL,
  	"seo_description" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "enterprise_services_texts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "_enterprise_services_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_slug" varchar NOT NULL,
  	"version_publication" "enum__enterprise_services_v_version_publication" DEFAULT 'Draft' NOT NULL,
  	"version_name" varchar NOT NULL,
  	"version_summary" varchar NOT NULL,
  	"version_seo_title" varchar NOT NULL,
  	"version_seo_description" varchar NOT NULL,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "_enterprise_services_v_texts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "resources_body" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar
  );
  
  CREATE TABLE "resources" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"slug" varchar NOT NULL,
  	"publication" "enum_resources_publication" DEFAULT 'Draft' NOT NULL,
  	"title" varchar NOT NULL,
  	"type" "enum_resources_type" NOT NULL,
  	"author" varchar NOT NULL,
  	"excerpt" varchar NOT NULL,
  	"published_at" varchar NOT NULL,
  	"reading_minutes" numeric DEFAULT 4 NOT NULL,
  	"is_demo" boolean DEFAULT true,
  	"seo_title" varchar NOT NULL,
  	"seo_description" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "resources_texts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "_resources_v_version_body" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_resources_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_slug" varchar NOT NULL,
  	"version_publication" "enum__resources_v_version_publication" DEFAULT 'Draft' NOT NULL,
  	"version_title" varchar NOT NULL,
  	"version_type" "enum__resources_v_version_type" NOT NULL,
  	"version_author" varchar NOT NULL,
  	"version_excerpt" varchar NOT NULL,
  	"version_published_at" varchar NOT NULL,
  	"version_reading_minutes" numeric DEFAULT 4 NOT NULL,
  	"version_is_demo" boolean DEFAULT true,
  	"version_seo_title" varchar NOT NULL,
  	"version_seo_description" varchar NOT NULL,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "_resources_v_texts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "leads" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"reference" varchar NOT NULL,
  	"status" "enum_leads_status" DEFAULT 'New' NOT NULL,
  	"assigned_to_id" integer,
  	"enquiry_type" "enum_leads_enquiry_type" NOT NULL,
  	"name" varchar NOT NULL,
  	"email" varchar NOT NULL,
  	"phone" varchar,
  	"country_code" varchar,
  	"organization" varchar,
  	"message" varchar NOT NULL,
  	"product_slug" varchar,
  	"category_slug" varchar,
  	"preferred_contact_time" varchar,
  	"source" varchar,
  	"campaign" varchar,
  	"consent_privacy_acknowledged_at" timestamp(3) with time zone NOT NULL,
  	"consent_marketing_opt_in" boolean DEFAULT false,
  	"fingerprint" varchar NOT NULL,
  	"internal_notes" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_kv" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar NOT NULL,
  	"data" jsonb NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"global_slug" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer,
  	"product_categories_id" integer,
  	"products_id" integer,
  	"industries_id" integer,
  	"enterprise_services_id" integer,
  	"resources_id" integer,
  	"leads_id" integer
  );
  
  CREATE TABLE "payload_preferences" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar,
  	"value" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_preferences_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer
  );
  
  CREATE TABLE "payload_migrations" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"batch" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  ALTER TABLE "users_roles" ADD CONSTRAINT "users_roles_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "users_sessions" ADD CONSTRAINT "users_sessions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "product_categories_texts" ADD CONSTRAINT "product_categories_texts_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."product_categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_product_categories_v" ADD CONSTRAINT "_product_categories_v_parent_id_product_categories_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."product_categories"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_product_categories_v_texts" ADD CONSTRAINT "_product_categories_v_texts_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_product_categories_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "products_features" ADD CONSTRAINT "products_features_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "products_use_cases" ADD CONSTRAINT "products_use_cases_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "products_faqs" ADD CONSTRAINT "products_faqs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "products_texts" ADD CONSTRAINT "products_texts_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_products_v_version_features" ADD CONSTRAINT "_products_v_version_features_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_products_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_products_v_version_use_cases" ADD CONSTRAINT "_products_v_version_use_cases_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_products_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_products_v_version_faqs" ADD CONSTRAINT "_products_v_version_faqs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_products_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_products_v" ADD CONSTRAINT "_products_v_parent_id_products_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."products"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_products_v_texts" ADD CONSTRAINT "_products_v_texts_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_products_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "industries_texts" ADD CONSTRAINT "industries_texts_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."industries"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_industries_v" ADD CONSTRAINT "_industries_v_parent_id_industries_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."industries"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_industries_v_texts" ADD CONSTRAINT "_industries_v_texts_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_industries_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "enterprise_services_texts" ADD CONSTRAINT "enterprise_services_texts_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."enterprise_services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_enterprise_services_v" ADD CONSTRAINT "_enterprise_services_v_parent_id_enterprise_services_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."enterprise_services"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_enterprise_services_v_texts" ADD CONSTRAINT "_enterprise_services_v_texts_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_enterprise_services_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "resources_body" ADD CONSTRAINT "resources_body_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."resources"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "resources_texts" ADD CONSTRAINT "resources_texts_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."resources"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_resources_v_version_body" ADD CONSTRAINT "_resources_v_version_body_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_resources_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_resources_v" ADD CONSTRAINT "_resources_v_parent_id_resources_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."resources"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_resources_v_texts" ADD CONSTRAINT "_resources_v_texts_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_resources_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "leads" ADD CONSTRAINT "leads_assigned_to_id_users_id_fk" FOREIGN KEY ("assigned_to_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_locked_documents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_product_categories_fk" FOREIGN KEY ("product_categories_id") REFERENCES "public"."product_categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_products_fk" FOREIGN KEY ("products_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_industries_fk" FOREIGN KEY ("industries_id") REFERENCES "public"."industries"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_enterprise_services_fk" FOREIGN KEY ("enterprise_services_id") REFERENCES "public"."enterprise_services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_resources_fk" FOREIGN KEY ("resources_id") REFERENCES "public"."resources"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_leads_fk" FOREIGN KEY ("leads_id") REFERENCES "public"."leads"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_preferences"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "users_roles_order_idx" ON "users_roles" USING btree ("order");
  CREATE INDEX "users_roles_parent_idx" ON "users_roles" USING btree ("parent_id");
  CREATE INDEX "users_sessions_order_idx" ON "users_sessions" USING btree ("_order");
  CREATE INDEX "users_sessions_parent_id_idx" ON "users_sessions" USING btree ("_parent_id");
  CREATE INDEX "users_updated_at_idx" ON "users" USING btree ("updated_at");
  CREATE INDEX "users_created_at_idx" ON "users" USING btree ("created_at");
  CREATE UNIQUE INDEX "users_email_idx" ON "users" USING btree ("email");
  CREATE UNIQUE INDEX "product_categories_slug_idx" ON "product_categories" USING btree ("slug");
  CREATE INDEX "product_categories_publication_idx" ON "product_categories" USING btree ("publication");
  CREATE INDEX "product_categories_updated_at_idx" ON "product_categories" USING btree ("updated_at");
  CREATE INDEX "product_categories_created_at_idx" ON "product_categories" USING btree ("created_at");
  CREATE INDEX "product_categories_texts_order_parent" ON "product_categories_texts" USING btree ("order","parent_id");
  CREATE INDEX "_product_categories_v_parent_idx" ON "_product_categories_v" USING btree ("parent_id");
  CREATE INDEX "_product_categories_v_version_version_slug_idx" ON "_product_categories_v" USING btree ("version_slug");
  CREATE INDEX "_product_categories_v_version_version_publication_idx" ON "_product_categories_v" USING btree ("version_publication");
  CREATE INDEX "_product_categories_v_version_version_updated_at_idx" ON "_product_categories_v" USING btree ("version_updated_at");
  CREATE INDEX "_product_categories_v_version_version_created_at_idx" ON "_product_categories_v" USING btree ("version_created_at");
  CREATE INDEX "_product_categories_v_created_at_idx" ON "_product_categories_v" USING btree ("created_at");
  CREATE INDEX "_product_categories_v_updated_at_idx" ON "_product_categories_v" USING btree ("updated_at");
  CREATE INDEX "_product_categories_v_texts_order_parent" ON "_product_categories_v_texts" USING btree ("order","parent_id");
  CREATE INDEX "products_features_order_idx" ON "products_features" USING btree ("_order");
  CREATE INDEX "products_features_parent_id_idx" ON "products_features" USING btree ("_parent_id");
  CREATE INDEX "products_use_cases_order_idx" ON "products_use_cases" USING btree ("_order");
  CREATE INDEX "products_use_cases_parent_id_idx" ON "products_use_cases" USING btree ("_parent_id");
  CREATE INDEX "products_faqs_order_idx" ON "products_faqs" USING btree ("_order");
  CREATE INDEX "products_faqs_parent_id_idx" ON "products_faqs" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "products_slug_idx" ON "products" USING btree ("slug");
  CREATE INDEX "products_publication_idx" ON "products" USING btree ("publication");
  CREATE INDEX "products_category_slug_idx" ON "products" USING btree ("category_slug");
  CREATE INDEX "products_updated_at_idx" ON "products" USING btree ("updated_at");
  CREATE INDEX "products_created_at_idx" ON "products" USING btree ("created_at");
  CREATE INDEX "products_texts_order_parent" ON "products_texts" USING btree ("order","parent_id");
  CREATE INDEX "_products_v_version_features_order_idx" ON "_products_v_version_features" USING btree ("_order");
  CREATE INDEX "_products_v_version_features_parent_id_idx" ON "_products_v_version_features" USING btree ("_parent_id");
  CREATE INDEX "_products_v_version_use_cases_order_idx" ON "_products_v_version_use_cases" USING btree ("_order");
  CREATE INDEX "_products_v_version_use_cases_parent_id_idx" ON "_products_v_version_use_cases" USING btree ("_parent_id");
  CREATE INDEX "_products_v_version_faqs_order_idx" ON "_products_v_version_faqs" USING btree ("_order");
  CREATE INDEX "_products_v_version_faqs_parent_id_idx" ON "_products_v_version_faqs" USING btree ("_parent_id");
  CREATE INDEX "_products_v_parent_idx" ON "_products_v" USING btree ("parent_id");
  CREATE INDEX "_products_v_version_version_slug_idx" ON "_products_v" USING btree ("version_slug");
  CREATE INDEX "_products_v_version_version_publication_idx" ON "_products_v" USING btree ("version_publication");
  CREATE INDEX "_products_v_version_version_category_slug_idx" ON "_products_v" USING btree ("version_category_slug");
  CREATE INDEX "_products_v_version_version_updated_at_idx" ON "_products_v" USING btree ("version_updated_at");
  CREATE INDEX "_products_v_version_version_created_at_idx" ON "_products_v" USING btree ("version_created_at");
  CREATE INDEX "_products_v_created_at_idx" ON "_products_v" USING btree ("created_at");
  CREATE INDEX "_products_v_updated_at_idx" ON "_products_v" USING btree ("updated_at");
  CREATE INDEX "_products_v_texts_order_parent" ON "_products_v_texts" USING btree ("order","parent_id");
  CREATE UNIQUE INDEX "industries_slug_idx" ON "industries" USING btree ("slug");
  CREATE INDEX "industries_publication_idx" ON "industries" USING btree ("publication");
  CREATE INDEX "industries_updated_at_idx" ON "industries" USING btree ("updated_at");
  CREATE INDEX "industries_created_at_idx" ON "industries" USING btree ("created_at");
  CREATE INDEX "industries_texts_order_parent" ON "industries_texts" USING btree ("order","parent_id");
  CREATE INDEX "_industries_v_parent_idx" ON "_industries_v" USING btree ("parent_id");
  CREATE INDEX "_industries_v_version_version_slug_idx" ON "_industries_v" USING btree ("version_slug");
  CREATE INDEX "_industries_v_version_version_publication_idx" ON "_industries_v" USING btree ("version_publication");
  CREATE INDEX "_industries_v_version_version_updated_at_idx" ON "_industries_v" USING btree ("version_updated_at");
  CREATE INDEX "_industries_v_version_version_created_at_idx" ON "_industries_v" USING btree ("version_created_at");
  CREATE INDEX "_industries_v_created_at_idx" ON "_industries_v" USING btree ("created_at");
  CREATE INDEX "_industries_v_updated_at_idx" ON "_industries_v" USING btree ("updated_at");
  CREATE INDEX "_industries_v_texts_order_parent" ON "_industries_v_texts" USING btree ("order","parent_id");
  CREATE UNIQUE INDEX "enterprise_services_slug_idx" ON "enterprise_services" USING btree ("slug");
  CREATE INDEX "enterprise_services_publication_idx" ON "enterprise_services" USING btree ("publication");
  CREATE INDEX "enterprise_services_updated_at_idx" ON "enterprise_services" USING btree ("updated_at");
  CREATE INDEX "enterprise_services_created_at_idx" ON "enterprise_services" USING btree ("created_at");
  CREATE INDEX "enterprise_services_texts_order_parent" ON "enterprise_services_texts" USING btree ("order","parent_id");
  CREATE INDEX "_enterprise_services_v_parent_idx" ON "_enterprise_services_v" USING btree ("parent_id");
  CREATE INDEX "_enterprise_services_v_version_version_slug_idx" ON "_enterprise_services_v" USING btree ("version_slug");
  CREATE INDEX "_enterprise_services_v_version_version_publication_idx" ON "_enterprise_services_v" USING btree ("version_publication");
  CREATE INDEX "_enterprise_services_v_version_version_updated_at_idx" ON "_enterprise_services_v" USING btree ("version_updated_at");
  CREATE INDEX "_enterprise_services_v_version_version_created_at_idx" ON "_enterprise_services_v" USING btree ("version_created_at");
  CREATE INDEX "_enterprise_services_v_created_at_idx" ON "_enterprise_services_v" USING btree ("created_at");
  CREATE INDEX "_enterprise_services_v_updated_at_idx" ON "_enterprise_services_v" USING btree ("updated_at");
  CREATE INDEX "_enterprise_services_v_texts_order_parent" ON "_enterprise_services_v_texts" USING btree ("order","parent_id");
  CREATE INDEX "resources_body_order_idx" ON "resources_body" USING btree ("_order");
  CREATE INDEX "resources_body_parent_id_idx" ON "resources_body" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "resources_slug_idx" ON "resources" USING btree ("slug");
  CREATE INDEX "resources_publication_idx" ON "resources" USING btree ("publication");
  CREATE INDEX "resources_updated_at_idx" ON "resources" USING btree ("updated_at");
  CREATE INDEX "resources_created_at_idx" ON "resources" USING btree ("created_at");
  CREATE INDEX "resources_texts_order_parent" ON "resources_texts" USING btree ("order","parent_id");
  CREATE INDEX "_resources_v_version_body_order_idx" ON "_resources_v_version_body" USING btree ("_order");
  CREATE INDEX "_resources_v_version_body_parent_id_idx" ON "_resources_v_version_body" USING btree ("_parent_id");
  CREATE INDEX "_resources_v_parent_idx" ON "_resources_v" USING btree ("parent_id");
  CREATE INDEX "_resources_v_version_version_slug_idx" ON "_resources_v" USING btree ("version_slug");
  CREATE INDEX "_resources_v_version_version_publication_idx" ON "_resources_v" USING btree ("version_publication");
  CREATE INDEX "_resources_v_version_version_updated_at_idx" ON "_resources_v" USING btree ("version_updated_at");
  CREATE INDEX "_resources_v_version_version_created_at_idx" ON "_resources_v" USING btree ("version_created_at");
  CREATE INDEX "_resources_v_created_at_idx" ON "_resources_v" USING btree ("created_at");
  CREATE INDEX "_resources_v_updated_at_idx" ON "_resources_v" USING btree ("updated_at");
  CREATE INDEX "_resources_v_texts_order_parent" ON "_resources_v_texts" USING btree ("order","parent_id");
  CREATE UNIQUE INDEX "leads_reference_idx" ON "leads" USING btree ("reference");
  CREATE INDEX "leads_status_idx" ON "leads" USING btree ("status");
  CREATE INDEX "leads_assigned_to_idx" ON "leads" USING btree ("assigned_to_id");
  CREATE INDEX "leads_enquiry_type_idx" ON "leads" USING btree ("enquiry_type");
  CREATE INDEX "leads_product_slug_idx" ON "leads" USING btree ("product_slug");
  CREATE INDEX "leads_category_slug_idx" ON "leads" USING btree ("category_slug");
  CREATE INDEX "leads_fingerprint_idx" ON "leads" USING btree ("fingerprint");
  CREATE INDEX "leads_updated_at_idx" ON "leads" USING btree ("updated_at");
  CREATE INDEX "leads_created_at_idx" ON "leads" USING btree ("created_at");
  CREATE UNIQUE INDEX "payload_kv_key_idx" ON "payload_kv" USING btree ("key");
  CREATE INDEX "payload_locked_documents_global_slug_idx" ON "payload_locked_documents" USING btree ("global_slug");
  CREATE INDEX "payload_locked_documents_updated_at_idx" ON "payload_locked_documents" USING btree ("updated_at");
  CREATE INDEX "payload_locked_documents_created_at_idx" ON "payload_locked_documents" USING btree ("created_at");
  CREATE INDEX "payload_locked_documents_rels_order_idx" ON "payload_locked_documents_rels" USING btree ("order");
  CREATE INDEX "payload_locked_documents_rels_parent_idx" ON "payload_locked_documents_rels" USING btree ("parent_id");
  CREATE INDEX "payload_locked_documents_rels_path_idx" ON "payload_locked_documents_rels" USING btree ("path");
  CREATE INDEX "payload_locked_documents_rels_users_id_idx" ON "payload_locked_documents_rels" USING btree ("users_id");
  CREATE INDEX "payload_locked_documents_rels_product_categories_id_idx" ON "payload_locked_documents_rels" USING btree ("product_categories_id");
  CREATE INDEX "payload_locked_documents_rels_products_id_idx" ON "payload_locked_documents_rels" USING btree ("products_id");
  CREATE INDEX "payload_locked_documents_rels_industries_id_idx" ON "payload_locked_documents_rels" USING btree ("industries_id");
  CREATE INDEX "payload_locked_documents_rels_enterprise_services_id_idx" ON "payload_locked_documents_rels" USING btree ("enterprise_services_id");
  CREATE INDEX "payload_locked_documents_rels_resources_id_idx" ON "payload_locked_documents_rels" USING btree ("resources_id");
  CREATE INDEX "payload_locked_documents_rels_leads_id_idx" ON "payload_locked_documents_rels" USING btree ("leads_id");
  CREATE INDEX "payload_preferences_key_idx" ON "payload_preferences" USING btree ("key");
  CREATE INDEX "payload_preferences_updated_at_idx" ON "payload_preferences" USING btree ("updated_at");
  CREATE INDEX "payload_preferences_created_at_idx" ON "payload_preferences" USING btree ("created_at");
  CREATE INDEX "payload_preferences_rels_order_idx" ON "payload_preferences_rels" USING btree ("order");
  CREATE INDEX "payload_preferences_rels_parent_idx" ON "payload_preferences_rels" USING btree ("parent_id");
  CREATE INDEX "payload_preferences_rels_path_idx" ON "payload_preferences_rels" USING btree ("path");
  CREATE INDEX "payload_preferences_rels_users_id_idx" ON "payload_preferences_rels" USING btree ("users_id");
  CREATE INDEX "payload_migrations_updated_at_idx" ON "payload_migrations" USING btree ("updated_at");
  CREATE INDEX "payload_migrations_created_at_idx" ON "payload_migrations" USING btree ("created_at");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "users_roles" CASCADE;
  DROP TABLE "users_sessions" CASCADE;
  DROP TABLE "users" CASCADE;
  DROP TABLE "product_categories" CASCADE;
  DROP TABLE "product_categories_texts" CASCADE;
  DROP TABLE "_product_categories_v" CASCADE;
  DROP TABLE "_product_categories_v_texts" CASCADE;
  DROP TABLE "products_features" CASCADE;
  DROP TABLE "products_use_cases" CASCADE;
  DROP TABLE "products_faqs" CASCADE;
  DROP TABLE "products" CASCADE;
  DROP TABLE "products_texts" CASCADE;
  DROP TABLE "_products_v_version_features" CASCADE;
  DROP TABLE "_products_v_version_use_cases" CASCADE;
  DROP TABLE "_products_v_version_faqs" CASCADE;
  DROP TABLE "_products_v" CASCADE;
  DROP TABLE "_products_v_texts" CASCADE;
  DROP TABLE "industries" CASCADE;
  DROP TABLE "industries_texts" CASCADE;
  DROP TABLE "_industries_v" CASCADE;
  DROP TABLE "_industries_v_texts" CASCADE;
  DROP TABLE "enterprise_services" CASCADE;
  DROP TABLE "enterprise_services_texts" CASCADE;
  DROP TABLE "_enterprise_services_v" CASCADE;
  DROP TABLE "_enterprise_services_v_texts" CASCADE;
  DROP TABLE "resources_body" CASCADE;
  DROP TABLE "resources" CASCADE;
  DROP TABLE "resources_texts" CASCADE;
  DROP TABLE "_resources_v_version_body" CASCADE;
  DROP TABLE "_resources_v" CASCADE;
  DROP TABLE "_resources_v_texts" CASCADE;
  DROP TABLE "leads" CASCADE;
  DROP TABLE "payload_kv" CASCADE;
  DROP TABLE "payload_locked_documents" CASCADE;
  DROP TABLE "payload_locked_documents_rels" CASCADE;
  DROP TABLE "payload_preferences" CASCADE;
  DROP TABLE "payload_preferences_rels" CASCADE;
  DROP TABLE "payload_migrations" CASCADE;
  DROP TYPE "public"."enum_users_roles";
  DROP TYPE "public"."enum_product_categories_publication";
  DROP TYPE "public"."enum_product_categories_icon";
  DROP TYPE "public"."enum__product_categories_v_version_publication";
  DROP TYPE "public"."enum__product_categories_v_version_icon";
  DROP TYPE "public"."enum_products_publication";
  DROP TYPE "public"."enum_products_lifecycle";
  DROP TYPE "public"."enum__products_v_version_publication";
  DROP TYPE "public"."enum__products_v_version_lifecycle";
  DROP TYPE "public"."enum_industries_publication";
  DROP TYPE "public"."enum__industries_v_version_publication";
  DROP TYPE "public"."enum_enterprise_services_publication";
  DROP TYPE "public"."enum__enterprise_services_v_version_publication";
  DROP TYPE "public"."enum_resources_publication";
  DROP TYPE "public"."enum_resources_type";
  DROP TYPE "public"."enum__resources_v_version_publication";
  DROP TYPE "public"."enum__resources_v_version_type";
  DROP TYPE "public"."enum_leads_status";
  DROP TYPE "public"."enum_leads_enquiry_type";`)
}
