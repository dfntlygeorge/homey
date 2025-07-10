import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { AuthProvider } from "@/components/providers/session-provider";
import NextTopLoader from "nextjs-toploader";
import { Toaster } from "sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Hestia — Find Your Perfect Rental in Baguio",
  description:
    "Hestia helps you easily discover and connect with trusted rentals and boarding houses in Baguio City.",
  manifest: "/site.webmanifest", // ✅ remove /public — it's automatically served from public
  themeColor: "#000000", // adjust if you have a brand color
  openGraph: {
    title: "Hestia — Find Your Perfect Rental in Baguio",
    description:
      "Browse, connect, and secure your ideal rental or boarding house in Baguio effortlessly with Hestia.",
    url: "https://yourdomain.com",
    siteName: "Hestia",
    images: [
      {
        url: "/og-image.png", // replace with your OG image path
        width: 1200,
        height: 630,
        alt: "Hestia Website Preview",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Hestia — Find Your Perfect Rental in Baguio",
    description:
      "Browse, connect, and secure your ideal rental or boarding house in Baguio effortlessly with Hestia.",
    images: ["/og-image.png"], // same as above
  },
  metadataBase: new URL("https://yourdomain.com"), // change to your domain
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <NuqsAdapter>
          <AuthProvider>{children}</AuthProvider>
        </NuqsAdapter>
        <NextTopLoader showSpinner={false} />
        <Toaster />
      </body>
    </html>
  );
}
