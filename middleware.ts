import { NextRequest } from 'next/server';
import authConfig from './auth.config';
import NextAuth from 'next-auth';
import { protectedRoutes } from './protectedRoutes';
// Use only one of the two middleware options below
// 1. Use middleware directly
// export const { auth: middleware } = NextAuth(authConfig)

// 2. Wrapped middleware option
const { auth } = NextAuth(authConfig);
export default auth(async (req) => {
  // Your custom middleware logic goes here

  const isLoggedin = !!req.auth;
  const { nextUrl } = req;
  const isPrivateRoute = protectedRoutes.includes(nextUrl.pathname);
  const isAuthRoute = nextUrl.pathname.includes('/auth');
  const isAPiRoute = nextUrl.pathname.includes('/api');

  if (isAPiRoute) {
    return;
  }
  if (isLoggedin && isAuthRoute) {
    return Response.redirect(`${process.env.URL}/dashboard`);
  }
  if (isAuthRoute && !isLoggedin) {
    return;
  }
  if (!isLoggedin && isPrivateRoute) {
    return Response.redirect(`${process.env.URL}/auth/login`);
  }
});

export const config = {
  matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
};
