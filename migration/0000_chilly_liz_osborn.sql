CREATE TABLE IF NOT EXISTS "fast_pg_applications" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(256) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "fast_pg_roles" (
	"id" uuid DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(256) NOT NULL,
	"applicationId" uuid,
	"permissions" text[],
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "fast_pg_roles_name_applicationId_pk" PRIMARY KEY("name","applicationId")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "fast_pg_users" (
	"id" uuid DEFAULT gen_random_uuid() NOT NULL,
	"email" varchar(256) NOT NULL,
	"name" varchar(256) NOT NULL,
	"applicationId" uuid,
	"password" varchar(256) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "fast_pg_users_email_applicationId_pk" PRIMARY KEY("email","applicationId")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "fast_pg_usersToRoles" (
	"applicationId" uuid NOT NULL,
	"roleId" uuid NOT NULL,
	"userId" uuid NOT NULL,
	CONSTRAINT "fast_pg_usersToRoles_applicationId_roleId_userId_pk" PRIMARY KEY("applicationId","roleId","userId")
);
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "roles_id_index" ON "fast_pg_roles" ("id");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "users_id_index" ON "fast_pg_users" ("id");--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "fast_pg_roles" ADD CONSTRAINT "fast_pg_roles_applicationId_fast_pg_applications_id_fk" FOREIGN KEY ("applicationId") REFERENCES "fast_pg_applications"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "fast_pg_users" ADD CONSTRAINT "fast_pg_users_applicationId_fast_pg_applications_id_fk" FOREIGN KEY ("applicationId") REFERENCES "fast_pg_applications"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "fast_pg_usersToRoles" ADD CONSTRAINT "fast_pg_usersToRoles_applicationId_fast_pg_applications_id_fk" FOREIGN KEY ("applicationId") REFERENCES "fast_pg_applications"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "fast_pg_usersToRoles" ADD CONSTRAINT "fast_pg_usersToRoles_roleId_fast_pg_roles_id_fk" FOREIGN KEY ("roleId") REFERENCES "fast_pg_roles"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "fast_pg_usersToRoles" ADD CONSTRAINT "fast_pg_usersToRoles_userId_fast_pg_users_id_fk" FOREIGN KEY ("userId") REFERENCES "fast_pg_users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
