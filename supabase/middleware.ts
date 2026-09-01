import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

export const updateSession = async (request: NextRequest) => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key || url.includes("your-project")) {
    // Supabase not configured — skip auth, let the app render with mock data
    return NextResponse.next({ request: { headers: request.headers } });
  }
  let response = NextResponse.next({ request: { headers: request.headers } });
  const supabase = createServerClient(url, key, {
    cookies: {
      getAll() { return request.cookies.getAll(); },
      setAll(cookiesToSet: { name: string; value: string; options?: Record<string, unknown> }[]) {
        cookiesToSet.forEach(({ name, value, options }) => {
          request.cookies.set(name, value);
          response = NextResponse.next({ request: { headers: request.headers } });
          response.cookies.set(name, value, options as never);
        });
      },
    },
  });
  const { error } = await supabase.auth.getUser();
  if (request.nextUrl.pathname.startsWith("/dashboard") && error) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }
  return response;
};
