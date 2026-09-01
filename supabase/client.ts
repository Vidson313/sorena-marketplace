import { createBrowserClient } from "@supabase/ssr";

export const createClient = () => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key || url.includes("your-project")) {
    return new Proxy({}, {
      get: () => () => Promise.resolve({ data: null, error: { message: "Supabase not configured" } }),
    }) as never;
  }
  return createBrowserClient(url, key);
};
