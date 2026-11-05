import { createClient } from "@supabase/supabase-js";
import type { Database } from "@protege/shared";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "";

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    "Supabase URL ou Anon Key não configurados. Verifique seu arquivo .env com base no .env.example"
  );
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);
