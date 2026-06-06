export { default } from "next-auth/middleware";

/**
 * Protect all /admin/* routes — unauthenticated visitors are redirected
 * to the sign-in page defined in authOptions.pages.signIn (/login).
 */
export const config = {
  matcher: ["/admin/:path*"],
};
