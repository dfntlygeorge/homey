import Link from "next/link";
import { Button } from "@/components/ui/button";
import { routes } from "@/config/routes";
import { ListingFormStep } from "@/config/types";
import { Home, Plus, Sparkles } from "lucide-react";

export function NoListingsMessage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 flex items-center justify-center p-6">
      <div className="text-center max-w-2xl mx-auto">
        {/* Icon */}
        <div className="relative mb-8">
          <div className="w-24 h-24 mx-auto bg-gradient-to-br from-primary/20 to-primary/10 rounded-full flex items-center justify-center border border-primary/20 shadow-lg">
            <Home className="h-12 w-12 text-primary" />
          </div>
          <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-full flex items-center justify-center shadow-md">
            <Sparkles className="h-4 w-4 text-white" />
          </div>
        </div>

        {/* Content */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
              Welcome to Your Property Hub
            </h1>
            <p className="text-lg text-muted-foreground max-w-lg mx-auto leading-relaxed">
              You haven&apos;t created any listings yet. Start by adding your
              first property and reach thousands of potential buyers and
              renters.
            </p>
          </div>

          {/* Benefits */}
          <div className="grid md:grid-cols-3 gap-4 my-8">
            <div className="p-6 bg-card border border-border/60 rounded-xl shadow-sm">
              <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center mb-3">
                <Plus className="h-5 w-5 text-blue-500" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">
                Easy to Create
              </h3>
              <p className="text-sm text-muted-foreground">
                Our simple form makes listing your property quick and effortless
              </p>
            </div>

            <div className="p-6 bg-card border border-border/60 rounded-xl shadow-sm">
              <div className="w-10 h-10 bg-green-500/10 rounded-lg flex items-center justify-center mb-3">
                <Sparkles className="h-5 w-5 text-green-500" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">
                Maximum Exposure
              </h3>
              <p className="text-sm text-muted-foreground">
                Reach verified buyers and renters actively searching for
                properties
              </p>
            </div>

            <div className="p-6 bg-card border border-border/60 rounded-xl shadow-sm">
              <div className="w-10 h-10 bg-purple-500/10 rounded-lg flex items-center justify-center mb-3">
                <Home className="h-5 w-5 text-purple-500" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">
                Full Control
              </h3>
              <p className="text-sm text-muted-foreground">
                Manage, edit, and track your listings all in one place
              </p>
            </div>
          </div>

          {/* CTA Button */}
          <div className="space-y-4">
            <Link href={routes.createListing(ListingFormStep.WELCOME)}>
              <Button
                size="lg"
                className="bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary/80 text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-200 px-8 py-3 text-lg font-semibold"
              >
                <Plus className="h-5 w-5 mr-2" />
                Create Your First Listing
              </Button>
            </Link>

            <p className="text-sm text-muted-foreground">
              Takes less than 5 minutes to get started
            </p>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute inset-0 -z-10 opacity-20">
          <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-primary/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 right-1/4 w-40 h-40 bg-secondary/10 rounded-full blur-3xl"></div>
        </div>
      </div>
    </div>
  );
}
