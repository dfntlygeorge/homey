"use client";

import { signIn, useSession } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";
import { routes } from "@/config/routes";
import { TermsModal } from "./terms-modal";
import { PrivacyModal } from "./privacy-modal";

export const SignInForm = () => {
  const { status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated") {
      router.push(routes.listings); // or routes.challenge
    }
  }, [status, router]);

  return (
    <div className="max-h-[calc(100vh-4rem)] flex items-center justify-center">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Welcome Back
            </h1>
            <p className="text-gray-600">Sign in to continue to your account</p>
          </div>

          {/* Google Sign-In Button */}
          <Button
            type="button"
            onClick={() => signIn("google")}
            className="w-full h-12 bg-white hover:bg-gray-50 text-gray-700 border-2 border-gray-200 hover:border-gray-300 font-medium rounded-lg transition-all duration-200 flex items-center justify-center gap-3 shadow-sm hover:shadow-md"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Continue with Google
          </Button>

          {/* Additional Options */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              By signing in, you agree to our{" "}
              <TermsModal>
                <span className="text-blue-600 hover:text-blue-700 font-medium cursor-pointer">
                  Terms of Service
                </span>
              </TermsModal>{" "}
              and{" "}
              <PrivacyModal>
                <span className="text-blue-600 hover:text-blue-700 font-medium cursor-pointer">
                  Privacy Policy
                </span>
              </PrivacyModal>
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-sm text-gray-500">
            Don&apos;t have an account?{" "}
            <button
              onClick={() => signIn("google")}
              className="text-blue-600 hover:text-blue-700 font-medium cursor-pointer"
            >
              Sign up with Google
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};
