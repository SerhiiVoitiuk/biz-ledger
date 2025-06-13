CREATE TABLE "supplier_cars" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"supplier_id" uuid NOT NULL,
	"car_name" text NOT NULL,
	"car_registration" text NOT NULL,
	"car_owner" text NOT NULL,
	"owner_owner" text NOT NULL
);
--> statement-breakpoint
ALTER TABLE "supplier_cars" ADD CONSTRAINT "supplier_cars_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "supplier_cars" ADD CONSTRAINT "supplier_cars_supplier_id_suppliers_id_fk" FOREIGN KEY ("supplier_id") REFERENCES "public"."suppliers"("id") ON DELETE no action ON UPDATE no action;