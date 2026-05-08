import { supabase } from "@/supabase/supabase";

export type AuthCredentials={
    email : string,
    password : string,
    options?:{
        data: {
            nombre: string,
            apellido: string,
        }
    }
}

export const authService={
    signUp: async ({email,password, options}: AuthCredentials)=>{
        const {data,error}= await supabase.auth.signUp({email,password,options});
        if (error) throw error
        return data
    },
    signIn: async ({email, password}: AuthCredentials)=>{
        const{data, error } =await supabase.auth.signInWithPassword({email,password})
        if (error){
             console.log("Error en Service:", error.message)
             throw error
        }
        return data
    },
    signOut: async ()=>{
        const {error}= await supabase.auth.signOut();
        if (error) throw error;
    },
}