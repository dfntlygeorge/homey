import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { routes } from "./config/routes";

export async function middleware(req: NextRequest) {
  const session = await auth();
  const { pathname } = req.nextUrl;
  const userRole = session?.user?.role;

  const isReservePage =
    pathname.startsWith("/listings/") && pathname.includes("/reserve");
  const isOnboardingPage = pathname === "/onboarding";
  const isAdmin = userRole === "ADMIN";

  // 👮 Redirect unauthenticated users trying to reserve
  if (!session && isReservePage) {
    return NextResponse.redirect(new URL("/auth/sign-in", req.url));
  }

  // 👋 Redirect signed-in users without role to onboarding
  if (session && !userRole && !isOnboardingPage) {
    return NextResponse.redirect(new URL("/onboarding", req.url));
  }
  if (!isAdmin && pathname.startsWith(routes.admin)) {
    console.log("Redirecting non-admin to listings");
    return NextResponse.redirect(new URL("/listings", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/listings/:path*", "/admin"],
};
