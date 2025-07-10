import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { routes } from "./config/routes";

export async function middleware(req: NextRequest) {
  const session = await auth();
  const { pathname } = req.nextUrl;
  const userRole = session?.user?.role;

  const isAdmin = userRole === "ADMIN";

  // Admin route protection
  if (!isAdmin && pathname.startsWith(routes.admin)) {
    console.log("Redirecting non-admin to listings");
    return NextResponse.redirect(new URL("/listings", req.url));
  }

  // Protected routes for authenticated users only
  const isProtectedRoute =
    pathname.startsWith("/chats") ||
    (pathname.startsWith("/manage/") && pathname !== "/manage") ||
    pathname === "/listings/new";

  if (!session && isProtectedRoute) {
    console.log("Redirecting unauthenticated user to listings");
    return NextResponse.redirect(new URL("/listings", req.url));
  }

  if (session && pathname === "/auth/sign-in") {
    console.log("OKAY KA NA IH");
    return NextResponse.redirect(new URL("/listings", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/manage/:path*",
    "/chats/:path*",
    "/auth/sign-in",
    "/listings/new",
  ],
};
