import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";

export async function middleware(req: NextRequest) {
  const session = await auth();
  const userRole = session?.user?.role;

  if (!session) {
    const signInUrl = new URL("/auth/sign-in", req.url);
    return NextResponse.redirect(signInUrl);
  }

  // if (userRole !== "LANDLORD")
  //   return NextResponse.redirect(new URL("/inventory", req.url));

  return NextResponse.next();
}

export const config = {
  matcher: ["/inventory/:path*/reserve", "/admin"],
};
