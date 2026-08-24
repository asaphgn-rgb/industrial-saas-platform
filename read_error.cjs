// Error analysis:
// ERROR: 42P10: there is no unique or exclusion constraint matching the ON CONFLICT specification
// CONTEXT: SQL statement "INSERT INTO auth.users ... ON CONFLICT (email) DO UPDATE SET ..."
// The auth.users table in modern Supabase versions doesn't have a simple UNIQUE constraint on (email) alone anymore.
// It has a unique constraint on (tenant_id, email) or relies on identity constraints.
// To fix this, we should do the check in PL/pgSQL using IF EXISTS instead of ON CONFLICT, or just not use ON CONFLICT (email) for auth.users.
