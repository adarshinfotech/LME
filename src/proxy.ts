import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/proxy";

const LOCAL_SESSION_COOKIE = "lmi_local_session";
const supabaseConfigured = Boolean(
  process.env.NEXT_PUBLIC_SUPABASE_URL && (process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY),
);

/**
 * Admin gate: refreshes the Supabase session and sends signed-out visitors
 * to the login page. Real authorisation (staff membership) is enforced in
 * the admin pages and by Row Level Security.
 */
export async function proxy(request: NextRequest) {
  const isLogin = request.nextUrl.pathname === "/admin/login";

  let response = NextResponse.next({ request });
  let signedIn = false;
  if (supabaseConfigured) {
    ({ response, signedIn } = await updateSession(request));
  } else {
    signedIn = request.cookies.has(LOCAL_SESSION_COOKIE);
  }

  if (!signedIn && !isLogin) {
    const url = request.nextUrl.clone();
    url.pathname = "/admin/login";
    url.search = "";
    return NextResponse.redirect(url);
  }

  response.headers.set("x-robots-tag", "noindex, nofollow");
  response.headers.set("cache-control", "private, no-store");
  return response;
}

export const config = {
  matcher: ["/admin/:path*"],
};
