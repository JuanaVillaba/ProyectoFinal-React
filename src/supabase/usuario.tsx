import { createClient } from "@supabase/supabase-js";
import {env} from "./env";
export const usuario = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY);