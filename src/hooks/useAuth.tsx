import { useState, useEffect } from "react";
import { Session } from "@supabase/supabase-js";
import { supabase } from "@/supabase/supabase";
import { authService, AuthCredentials } from "@/services/auth.service";

export function useAuth() {
    const [session, setSession] = useState<Session | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session)
            setLoading(false)
        })
        const {data: {subscription}} =
            supabase.auth.onAuthStateChange((_event, session)=>{
                setSession(session)
                setLoading(false)
            })
        return () => subscription.unsubscribe()
    },[])

    const signIn = async (creds: AuthCredentials)=>{
        setError(null);
        setLoading(true);
        try{
            await authService.signIn(creds)
        } catch (e: any){
            setError(e.message)
            throw e; 
        } finally {
            setLoading(false);
        }
    }
    const signUp = async (creds: AuthCredentials)=>{
        setError(null);
        setLoading(true);
        try{
            await authService.signUp(creds)
        } catch (e: any){
            setError(e.message);
        }
    }
    const signOut = () => authService.signOut()

    return {session, loading, error, signIn, signUp, signOut}
}