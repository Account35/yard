# Migrations

Migrations live in `supabase/migrations/`, starting with `0001_core_tables.sql`.

- Name files with a four-digit number and a short name, for example `0001_core_tables.sql`.
- Never edit an old migration. Every change is a new numbered file.
- Changes are additive only: new tables, new nullable columns, or columns with a safe default.
  Never drop, rename or retype an existing table or column.
- Use `CREATE TABLE IF NOT EXISTS`, `ADD COLUMN IF NOT EXISTS` and `CREATE INDEX IF NOT EXISTS`.
- Every new table has Row Level Security enabled, with policies so a landlord only sees their own data.
- After each migration, regenerate the TypeScript types: `npm run types:gen`
  (needs the Supabase CLI and `SUPABASE_PROJECT_ID` set in your shell).
