"use client";

import Link from "next/link";
import { routes } from "@/config/routes";
import { TermsModal } from "../auth/terms-modal";
import { PrivacyModal } from "../auth/privacy-modal";

export function PublicFooter() {
  const currentYear = new Date().getFullYear();
  const email = "g.a.donayre.business@gmail.com"; // Change email here
  const address = "27 Upper Phil Am, Baguio City"; // Change address here

  return (
    <footer className="bg-gray-50 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand & About */}
          <div className="md:col-span-2">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Hestia</h3>
            <p className="text-gray-600 text-sm mb-4">
              Your trusted platform for property listings and real estate
              solutions.
            </p>
            <div className="text-sm text-gray-600">
              <p>{address}</p>
              <p className="mt-1">
                <a
                  href={`mailto:${email}`}
                  className="text-blue-600 hover:text-blue-700"
                >
                  {email}
                </a>
              </p>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-4">
              Quick Links
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="text-gray-600 hover:text-gray-900">
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href={routes.listings}
                  className="text-gray-600 hover:text-gray-900"
                >
                  Browse Listings
                </Link>
              </li>
              <li>
                <Link
                  href={routes.faq}
                  className="text-gray-600 hover:text-gray-900"
                >
                  FAQ
                </Link>
              </li>
              <li>
                <a
                  href={`mailto:${email}`}
                  className="text-gray-600 hover:text-gray-900"
                >
                  Contact Us
                </a>
              </li>
            </ul>
          </div>

          {/* Legal & Social */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-4">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <TermsModal>
                  <button className="text-gray-600 hover:text-gray-900">
                    Terms of Service
                  </button>
                </TermsModal>
              </li>
              <li>
                <PrivacyModal>
                  <button className="text-gray-600 hover:text-gray-900">
                    Privacy Policy
                  </button>
                </PrivacyModal>
              </li>
            </ul>

            <div className="mt-6">
              <h4 className="text-sm font-semibold text-gray-900 mb-4">
                Follow Us
              </h4>
              <p className="text-sm text-gray-500">
                Social media coming soon...
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-200 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-gray-600">
              © {currentYear} Hestia. All rights reserved.
            </p>
            <div className="flex items-center space-x-4 mt-4 md:mt-0">
              <p className="text-sm text-gray-500">
                Made with ❤️ in the Philippines
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
