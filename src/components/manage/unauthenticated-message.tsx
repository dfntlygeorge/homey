import Link from "next/link";
import { Button } from "@/components/ui/button";
import { routes } from "@/config/routes";
import { Lock, Shield, UserCheck, ChevronRight } from "lucide-react";

export function UnauthenticatedMessage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 flex items-center justify-center p-6">
      <div className="text-center max-w-2xl mx-auto">
        {/* Icon */}
        <div className="relative mb-8">
          <div className="w-24 h-24 mx-auto bg-gradient-to-br from-primary/20 to-primary/10 rounded-full flex items-center justify-center border border-primary/20 shadow-lg">
            <Lock className="h-12 w-12 text-primary" />
          </div>
          <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-gradient-to-br from-green-400 to-emerald-400 rounded-full flex items-center justify-center shadow-md border-2 border-background">
            <Shield className="h-5 w-5 text-white" />
          </div>
        </div>

        {/* Content */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
              Secure Access Required
            </h1>
            <p className="text-lg text-muted-foreground max-w-md mx-auto leading-relaxed">
              Sign in to your account to access your property listings dashboard
              and manage your real estate portfolio.
            </p>
          </div>

          {/* Security Features */}
          <div className="grid md:grid-cols-2 gap-4 my-8 max-w-lg mx-auto">
            <div className="p-4 bg-card border border-border/60 rounded-xl shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-500/10 rounded-lg flex items-center justify-center">
                  <Shield className="h-4 w-4 text-blue-500" />
                </div>
                <div className="text-left">
                  <h3 className="font-medium text-foreground text-sm">
                    Secure Login
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Protected access
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4 bg-card border border-border/60 rounded-xl shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-green-500/10 rounded-lg flex items-center justify-center">
                  <UserCheck className="h-4 w-4 text-green-500" />
                </div>
                <div className="text-left">
                  <h3 className="font-medium text-foreground text-sm">
                    Your Data
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Private & secure
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Sign In Options */}
          <div className="space-y-4">
            <Link href={routes.signIn}>
              <Button
                size="lg"
                className="bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary/80 text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-200 px-8 py-3 text-lg font-semibold group"
              >
                Sign In to Continue
                <ChevronRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>

            <p className="text-sm text-muted-foreground">
              Don&apos;t have an account?{" "}
              <Link
                href={routes.signIn}
                className="text-primary hover:text-primary/80 font-medium underline underline-offset-2"
              >
                Create one here
              </Link>
            </p>
          </div>

          {/* Benefits Preview */}
          <div className="mt-12 p-6 bg-card/50 border border-border/40 rounded-xl backdrop-blur-sm">
            <h3 className="font-semibold text-foreground mb-3">
              What you&apos;ll get access to:
            </h3>
            <div className="space-y-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                <span>Manage all your property listings</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                <span>Track views and engagement</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                <span>Edit and update property details</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                <span>Advanced filtering and search</span>
              </div>
            </div>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute inset-0 -z-10 opacity-20">
          <div className="absolute top-1/3 left-1/3 w-32 h-32 bg-primary/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/3 right-1/3 w-40 h-40 bg-secondary/10 rounded-full blur-3xl"></div>
        </div>
      </div>
    </div>
  );
}
