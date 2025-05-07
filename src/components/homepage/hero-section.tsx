"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";

export const HeroSection = () => {
  return (
    <section
      className="relative flex h-[calc(100vh-4rem)] flex-col items-center justify-center bg-cover bg-center text-white"
      style={{
        backgroundImage: "url('/hero-bg.png')",
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40 z-0" />

      {/* Content */}
      <div className="relative z-10 max-w-3xl px-6 text-center">
        <h1 className="text-4xl font-bold md:text-6xl leading-tight">
          Find Safe & Verified <br className="hidden lg:block" /> Boarding
          Houses in Baguio
        </h1>
        <p className="mt-4 text-lg text-gray-200 md:text-xl">
          Safe. Affordable. Verified by students like you.
        </p>

        {/* CTA Buttons */}
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Link href="/inventory">
            <Button
              size="lg"
              className="bg-primary text-white hover:bg-primary/90 cursor-pointer"
            >
              Browse Listings
            </Button>
          </Link>
          <Link href="#">
            <Button
              variant="outline"
              size="lg"
              className="bg-white text-primary hover:bg-gray-100 cursor-pointer"
            >
              List Your Place
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};
