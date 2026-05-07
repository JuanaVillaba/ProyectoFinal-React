import { createClient } from "@supabase/supabase-js";
import AsyncStorage  from "@react-native-async-storage/async-storage";
import { ENV } from "@/lib/env";

export const supabase = createClient(
    ENV.SUPABASE_URL, ENV.SUPABASE_ANON_KEY,{
        auth:{
            storage: AsyncStorage,
            autoRefreshToken: true,
            persistSession: true,
            detectSessionInUrl: false,
        }
    }
)