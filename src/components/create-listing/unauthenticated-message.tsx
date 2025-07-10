import Link from "next/link";
import { Button } from "@/components/ui/button";
import { routes } from "@/config/routes";
import {
  Home,
  Plus,
  ChevronRight,
  Camera,
  MapPin,
  DollarSign,
} from "lucide-react";

export function CreateListingUnauthenticated() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 flex items-center justify-center p-6">
      <div className="text-center max-w-2xl mx-auto">
        {/* Icon */}
        <div className="relative mb-8">
          <div className="w-24 h-24 mx-auto bg-gradient-to-br from-primary/20 to-primary/10 rounded-full flex items-center justify-center border border-primary/20 shadow-lg">
            <Home className="h-12 w-12 text-primary" />
          </div>
          <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-gradient-to-br from-orange-400 to-red-400 rounded-full flex items-center justify-center shadow-md border-2 border-background">
            <Plus className="h-5 w-5 text-white" />
          </div>
        </div>

        {/* Content */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
              Ready to List Your Property?
            </h1>
            <p className="text-lg text-muted-foreground max-w-md mx-auto leading-relaxed">
              Sign in to your account to create and publish property listings.
              Start showcasing your properties to potential buyers today.
            </p>
          </div>

          {/* Features Preview */}
          <div className="grid md:grid-cols-3 gap-4 my-8 max-w-2xl mx-auto">
            <div className="p-4 bg-card border border-border/60 rounded-xl shadow-sm">
              <div className="flex flex-col items-center gap-3">
                <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center">
                  <Camera className="h-5 w-5 text-blue-500" />
                </div>
                <div className="text-center">
                  <h3 className="font-medium text-foreground text-sm">
                    Photo Upload
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Multiple images
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4 bg-card border border-border/60 rounded-xl shadow-sm">
              <div className="flex flex-col items-center gap-3">
                <div className="w-10 h-10 bg-green-500/10 rounded-lg flex items-center justify-center">
                  <MapPin className="h-5 w-5 text-green-500" />
                </div>
                <div className="text-center">
                  <h3 className="font-medium text-foreground text-sm">
                    Location Details
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Maps & address
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4 bg-card border border-border/60 rounded-xl shadow-sm">
              <div className="flex flex-col items-center gap-3">
                <div className="w-10 h-10 bg-purple-500/10 rounded-lg flex items-center justify-center">
                  <DollarSign className="h-5 w-5 text-purple-500" />
                </div>
                <div className="text-center">
                  <h3 className="font-medium text-foreground text-sm">
                    Pricing Tools
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Market insights
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
                Sign In to Create Listing
                <ChevronRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>

            <p className="text-sm text-muted-foreground">
              New to our platform?{" "}
              <Link
                href={routes.signIn}
                className="text-primary hover:text-primary/80 font-medium underline underline-offset-2"
              >
                Sign up for free
              </Link>
            </p>
          </div>

          {/* Listing Benefits */}
          <div className="mt-12 p-6 bg-card/50 border border-border/40 rounded-xl backdrop-blur-sm">
            <h3 className="font-semibold text-foreground mb-3">
              Create professional listings with:
            </h3>
            <div className="space-y-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                <span>High-quality photo galleries</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                <span>Detailed property descriptions</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                <span>Interactive maps and location data</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                <span>Instant publishing to marketplace</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                <span>Lead tracking and inquiry management</span>
              </div>
            </div>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute inset-0 -z-10 opacity-20">
          <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-primary/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 right-1/4 w-40 h-40 bg-orange-400/10 rounded-full blur-3xl"></div>
        </div>
      </div>
    </div>
  );
}
