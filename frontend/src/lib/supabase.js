// Mocked supabase instance since the backend is disconnected
export const supabase = {
    auth: {
        getSession: async () => ({ data: { session: null } }),
        onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => { } } } }),
        signInWithPassword: async () => ({ error: null }),
        signUp: async () => ({ error: null }),
        signOut: async () => ({ error: null }),
    },
    from: () => ({
        select: () => ({ eq: async () => ({ data: [], error: null }) }),
        insert: async () => ({ data: null, error: null }),
        update: () => ({ eq: async () => ({ data: null, error: null }) }),
        delete: () => ({ eq: async () => ({ error: null }) }),
    }),
    storage: {
        from: () => ({
            download: async () => ({ data: new Blob(), error: null }),
            upload: async () => ({ error: null })
        })
    }
};
