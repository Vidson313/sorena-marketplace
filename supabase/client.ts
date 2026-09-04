import { createBrowserClient } from "@supabase/ssr";

export const createClient = () => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key || url.includes("your-project")) {
    // Offline demo mode: structured dummy client mirroring the real Supabase
    // shape so client components (navbar, dashboard, admin) never crash.
    const emptyList = Promise.resolve({ data: [], error: null, count: 0 });

    const makeQuery = (): Record<string, unknown> => {
      const q: Record<string, unknown> = {};
      const chain = () => q;
      q.select = chain;
      q.insert = chain;
      q.update = chain;
      q.delete = chain;
      q.upsert = chain;
      q.eq = chain;
      q.neq = chain;
      q.gt = chain;
      q.gte = chain;
      q.lt = chain;
      q.lte = chain;
      q.like = chain;
      q.ilike = chain;
      q.is = chain;
      q.in = chain;
      q.contains = chain;
      q.range = chain;
      q.order = chain;
      q.limit = chain;
      q.single = () => Promise.resolve({ data: null, error: null });
      q.maybeSingle = () => Promise.resolve({ data: null, error: null });
      q.then = (resolve: (val: unknown) => unknown) => resolve({ data: [], error: null, count: 0 });
      return q;
    };

    const dummyClient = {
      auth: {
        getUser: async () => ({ data: { user: null }, error: null }),
        getSession: async () => ({ data: { session: null }, error: null }),
        signInWithPassword: async () => ({ data: { user: null, session: null }, error: null }),
        signUp: async () => ({ data: { user: null, session: null }, error: null }),
        signOut: async () => ({ error: null }),
        resetPasswordForEmail: async () => ({ data: {}, error: null }),
        updateUser: async () => ({ data: { user: null }, error: null }),
        exchangeCodeForSession: async () => ({ data: { session: null }, error: null }),
        // Must be sync like the real client (navbar destructures .data directly)
        onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
      },
      from: () => makeQuery(),
      storage: {
        from: () => ({
          getPublicUrl: () => ({ data: { publicUrl: "" } }),
          download: async () => ({ data: null, error: null }),
          upload: async () => ({ data: null, error: null }),
        }),
      },
      rpc: async () => ({ data: null, error: null }),
    };

    // Keep tree-shakeable reference so linters don't flag unused import
    void emptyList;
    return dummyClient as unknown as ReturnType<typeof createBrowserClient>;
  }
  return createBrowserClient(url, key);
};
