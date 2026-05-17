import { createContext, useState, useEffect, useContext } from 'react';
import { clearSupabaseAuthStorage, supabase } from '../lib/supabase';

const SessionContext = createContext();
const SESSION_TIMEOUT_MS = 4000;

const withTimeout = (promise, ms) => {
  return Promise.race([
    promise,
    new Promise((_, reject) => {
      window.setTimeout(() => reject(new Error("Supabase session check timed out")), ms);
    }),
  ]);
};

export const SessionProvider = ({ children }) => {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const loadSession = async () => {
      try {
        const { data: { session } } = await withTimeout(supabase.auth.getSession(), SESSION_TIMEOUT_MS);
        if (!isMounted) return;
        setSession(session);
      } catch (error) {
        console.warn("Unable to restore Supabase session:", error.message);
        clearSupabaseAuthStorage();
        if (!isMounted) return;
        setSession(null);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!isMounted) return;
      setSession(session);
      setLoading(false);
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  return (
    <SessionContext.Provider value={{ session, loading }}>
      {children}
    </SessionContext.Provider>
  );
};

export const useSession = () => {
  return useContext(SessionContext);
};
