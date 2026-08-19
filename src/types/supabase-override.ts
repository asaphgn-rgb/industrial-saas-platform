// Esse arquivo corrige temporariamente a inferência de tipo "never" retornada pelo supabase-js 
// devido a esquemas locais não estarem sincronizados perfeitamente com os tipos gerados (Database).
export type SafeAny = any;
