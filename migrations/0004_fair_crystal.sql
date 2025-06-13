CREATE TABLE "supplier_drivers" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"supplier_id" uuid NOT NULL,
	"driver_lastName" text NOT NULL,
	"driver_firstName" text NOT NULL,
	"driver_middleName" text NOT NULL,
	"driver_license" text NOT NULL
);
--> statement-breakpoint
ALTER TABLE "supplier_drivers" ADD CONSTRAINT "supplier_drivers_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "supplier_drivers" ADD CONSTRAINT "supplier_drivers_supplier_id_suppliers_id_fk" FOREIGN KEY ("supplier_id") REFERENCES "public"."suppliers"("id") ON DELETE no action ON UPDATE no action;