ALTER TABLE "invoices" ALTER COLUMN "number" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "invoices" ADD COLUMN "payment_date" text;