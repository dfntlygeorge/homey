"use client";

import { signIn, useSession } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { routes } from "@/config/routes";

export const SignInForm = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated") {
      router.push(routes.listings); // or routes.challenge
    }
  }, [status, router]);

  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center bg-white">
      <div className="w-full max-w-md pb-60">
        <form className="border-muted rounded-md border bg-white p-10 shadow-lg">
          <div className="mb-6 flex items-center justify-center">
            <h2 className="text-2xl font-bold uppercase">Sign In</h2>
          </div>
          <div className="space-y-4">
            {/* Placeholder inputs for future email/password support */}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                className="placeholder:text-gray-500"
                placeholder="Enter your email address"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                className="placeholder:text-gray-500"
                placeholder="Enter your password"
              />
            </div>

            <div className="my-6 text-center text-sm text-gray-600">
              <b>Use Google to sign in for now.</b>
            </div>

            {/* Google Sign-In */}
            <Button
              type="button"
              onClick={() => signIn("google")}
              className="w-full font-bold uppercase cursor-pointer"
            >
              Sign In with Google
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
