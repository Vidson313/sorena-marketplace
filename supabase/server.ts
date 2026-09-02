import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = () =>
  Boolean(supabaseUrl && supabaseKey && !supabaseUrl.includes("your-project"));

export const createClient = async () => {
  if (!isSupabaseConfigured()) {
    const dummyQuery = () => {
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
      q.containedBy = chain;
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
        onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
      },
      from: () => dummyQuery(),
      storage: {
        from: () => ({
          getPublicUrl: () => ({ data: { publicUrl: "" } }),
          download: async () => ({ data: null, error: null }),
          upload: async () => ({ data: null, error: null }),
        }),
      },
      rpc: async () => ({ data: null, error: null }),
    };

    return dummyClient as unknown as ReturnType<typeof createServerClient>;
  }

  const cookieStore = await cookies();
  return createServerClient(supabaseUrl!, supabaseKey!, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet: { name: string; value: string; options?: Record<string, unknown> }[]) {
        cookiesToSet.forEach(({ name, value, options }) => {
          try {
            (cookieStore as unknown as { set: (n: string, v: string, o?: unknown) => void }).set(name, value, options);
          } catch {}
        });
      },
    },
  });
};
