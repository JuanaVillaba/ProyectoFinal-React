import Constant from 'expo-constants';

const extra = Constant.expoConfig?.extra;


export const ENV ={
    API_URL: extra?.apiUrl,
    SUPABASE_URL: extra?.supabaseUrl,
    SUPABASE_ANON_KEY: extra?.supabaseAnonKey
};