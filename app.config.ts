import 'dotenv/config';

export default {
    expo: {
        name: 'project-name',
        slug: 'project-name',
        extra:{
            apiUrl: process.env.EXPO_PUBLIC_API_URL,
            supabaseUrl: process.env.EXPO_PUBLIC_SUPABASE_URL,
            supabaseAnonKey: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY,
        }
    }
};