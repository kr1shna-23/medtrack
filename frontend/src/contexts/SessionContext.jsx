import { createContext, useState, useEffect, useContext } from 'react';

const SessionContext = createContext();

export const SessionProvider = ({ children }) => {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Provide a mocked session immediately instead of contacting Supabase
    setSession({
      user: {
        id: "mock-user-123",
        email: "testuser@example.com",
        user_metadata: {
          full_name: "Test User"
        }
      }
    });
    setLoading(false);
  }, []);

  return (
    <SessionContext.Provider value={{ session, loading, setSession }}>
      {children}
    </SessionContext.Provider>
  );
};

export const useSession = () => {
  return useContext(SessionContext);
};
