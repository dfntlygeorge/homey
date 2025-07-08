import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { routes } from "./config/routes";

export async function middleware(req: NextRequest) {
  const session = await auth();
  const { pathname } = req.nextUrl;
  const userRole = session?.user?.role;

  const isAdmin = userRole === "ADMIN";

  if (!isAdmin && pathname.startsWith(routes.admin)) {
    console.log("Redirecting non-admin to listings");
    return NextResponse.redirect(new URL("/listings", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin"],
};
