import Link from "next/link";
import { Button } from "@/components/ui/button";
import { routes } from "@/config/routes";
import { ListingFormStep } from "@/config/types";
import { Home, Plus, Sparkles, Archive } from "lucide-react";

interface NoListingsMessageProps {
  hasArchived?: boolean;
}

export function NoListingsMessage({ hasArchived }: NoListingsMessageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 flex items-center justify-center p-6">
      <div className="text-center max-w-2xl mx-auto relative">
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
              {hasArchived
                ? "No Active Listings Found"
                : "Welcome to Your Property Hub"}
            </h1>
            <p className="text-lg text-muted-foreground max-w-lg mx-auto leading-relaxed">
              {hasArchived
                ? "You may have archived your listings. View your archive to manage or restore them."
                : "You haven't created any listings yet. Start by adding your first property and reach thousands of potential renters."}
            </p>
          </div>

          {/* CTA Button */}
          <div className="space-y-4">
            {hasArchived ? (
              <Link href={`/manage/?view=archived`}>
                <Button
                  size="lg"
                  variant="outline"
                  className="text-sm md:text-base"
                >
                  <Archive className="h-5 w-5 mr-2" />
                  View Archived Listings
                </Button>
              </Link>
            ) : (
              <Link href={routes.createListing(ListingFormStep.WELCOME)}>
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary/80 text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-200 px-8 py-3 text-lg font-semibold"
                >
                  <Plus className="h-5 w-5 mr-2" />
                  Create Your First Listing
                </Button>
              </Link>
            )}

            {!hasArchived && (
              <p className="text-sm text-muted-foreground">
                Takes less than 5 minutes to get started
              </p>
            )}
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
