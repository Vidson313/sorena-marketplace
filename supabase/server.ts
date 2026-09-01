import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const createClient = async () => {
  if (!supabaseUrl || !supabaseKey || supabaseUrl.includes("your-project")) {
    // Return a dummy client that always errors — callers fallback to mock data
    return new Proxy({}, {
      get: () => () => new Proxy({}, {
        get: () => () => Promise.resolve({ data: null, error: { message: "Supabase not configured" }, count: 0 }),
      }),
    }) as never;
  }
  const cookieStore = await cookies();
  return createServerClient(supabaseUrl, supabaseKey, {
    cookies: {
      getAll() { return cookieStore.getAll(); },
      setAll(cookiesToSet: { name: string; value: string; options?: Record<string, unknown> }[]) {
        cookiesToSet.forEach(({ name, value, options }) => {
          try { (cookieStore as unknown as { set: (n: string, v: string, o?: unknown) => void }).set(name, value, options); } catch {}
        });
      },
    },
  });
};

export const isSupabaseConfigured = () => !!supabaseUrl && !!supabaseKey && !supabaseUrl.includes("your-project");
