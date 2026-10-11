# Migrations

Migrations live in `supabase/migrations/`, starting with `0001_core_tables.sql`.

The tenant flow uses `0002_tenants.sql` for landlord-managed tenant records and
`0003_public_tenant_page.sql` for the token-scoped tenant page lookup. The lookup returns
only the tenant's name, room/property names, rent, due day and tenancy dates; it does not
grant anonymous access to the underlying tables.

Migration version `0003` is already applied. The next migration must use version `0004`;
do not reuse `0003`. Apply each new migration to Supabase before deploying the matching
app code.

Phase 3 uses `0004_charges_and_balances.sql`. Phase 4 adds
`0005_payments_and_receipts.sql`; apply it manually in the Supabase SQL editor, then
regenerate the database types from the updated schema before deploying Phase 4.

- Name files with a four-digit number and a short name, for example `0001_core_tables.sql`.
- Never edit an old migration. Every change is a new numbered file.
- Changes are additive only: new tables, new nullable columns, or columns with a safe default.
  Never drop, rename or retype an existing table or column.
- Use `CREATE TABLE IF NOT EXISTS`, `ADD COLUMN IF NOT EXISTS` and `CREATE INDEX IF NOT EXISTS`.
- Every new table has Row Level Security enabled, with policies so a landlord only sees their own data.
- After each migration, regenerate the TypeScript types: `npm run types:gen`
  (needs the Supabase CLI and `SUPABASE_PROJECT_ID` set in your shell).
