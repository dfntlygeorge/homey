"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface PrivacyModalProps {
  children: React.ReactNode;
}

export function PrivacyModal({ children }: PrivacyModalProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>Privacy Policy</DialogTitle>
        </DialogHeader>
        <div className="overflow-y-auto max-h-[60vh] pr-4">
          <div className="space-y-4 text-sm">
            <p className="text-gray-600">
              <strong>Last updated: July 11, 2025</strong>
            </p>

            <p>
              This Privacy Policy describes how Hestia (&quot;we,&quot;
              &quot;us,&quot; or &quot;our&quot;) collects, uses, and protects
              your personal information when you use our website and services
              (the &quot;Service&quot;).
            </p>

            <div className="space-y-4">
              <section>
                <h3 className="font-semibold text-gray-900 mb-2">
                  1. Information We Collect
                </h3>
                <p className="text-gray-700 mb-2">
                  We collect information you provide directly to us, such as:
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                  <li>
                    Account information (name, email address) when you sign up
                  </li>
                  <li>Profile information and content you create</li>
                  <li>Communications with us</li>
                  <li>
                    Information from third-party services like Google when you
                    sign in
                  </li>
                </ul>
              </section>

              <section>
                <h3 className="font-semibold text-gray-900 mb-2">
                  2. How We Use Your Information
                </h3>
                <p className="text-gray-700 mb-2">
                  We use your information to:
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                  <li>Provide and improve our Service</li>
                  <li>Create and manage your account</li>
                  <li>Communicate with you about updates and support</li>
                  <li>Ensure security and prevent fraud</li>
                  <li>Comply with legal obligations</li>
                </ul>
              </section>

              <section>
                <h3 className="font-semibold text-gray-900 mb-2">
                  3. Information Sharing
                </h3>
                <p className="text-gray-700">
                  We do not sell, trade, or otherwise transfer your personal
                  information to third parties without your consent, except as
                  described in this policy. We may share information in the
                  following circumstances:
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4 mt-2">
                  <li>
                    With service providers who assist us in operating our
                    Service
                  </li>
                  <li>When required by law or to protect our rights</li>
                  <li>In connection with a business transfer or sale</li>
                </ul>
              </section>

              <section>
                <h3 className="font-semibold text-gray-900 mb-2">
                  4. Data Security
                </h3>
                <p className="text-gray-700">
                  We implement appropriate security measures to protect your
                  personal information against unauthorized access, alteration,
                  disclosure, or destruction. However, no method of transmission
                  over the Internet is 100% secure.
                </p>
              </section>

              <section>
                <h3 className="font-semibold text-gray-900 mb-2">
                  5. Your Rights
                </h3>
                <p className="text-gray-700 mb-2">You have the right to:</p>
                <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                  <li>Access and update your personal information</li>
                  <li>Delete your account and associated data</li>
                  <li>Opt out of certain communications</li>
                  <li>Request a copy of your data</li>
                </ul>
              </section>

              <section>
                <h3 className="font-semibold text-gray-900 mb-2">
                  6. Cookies and Tracking
                </h3>
                <p className="text-gray-700">
                  We use cookies and similar technologies to enhance your
                  experience, analyze usage, and provide personalized content.
                  You can control cookie preferences through your browser
                  settings.
                </p>
              </section>

              <section>
                <h3 className="font-semibold text-gray-900 mb-2">
                  7. Third-Party Services
                </h3>
                <p className="text-gray-700">
                  Our Service may contain links to third-party websites or
                  integrate with third-party services (like Google Sign-In). We
                  are not responsible for the privacy practices of these third
                  parties.
                </p>
              </section>

              <section>
                <h3 className="font-semibold text-gray-900 mb-2">
                  8. Children&apos;s Privacy
                </h3>
                <p className="text-gray-700">
                  Our Service is not intended for children under 18. We do not
                  knowingly collect personal information from children under 18.
                </p>
              </section>

              <section>
                <h3 className="font-semibold text-gray-900 mb-2">
                  9. Changes to This Policy
                </h3>
                <p className="text-gray-700">
                  We may update this Privacy Policy from time to time. We will
                  notify you of any changes by posting the new Privacy Policy on
                  this page and updating the &quot;Last updated&quot; date.
                </p>
              </section>

              <section>
                <h3 className="font-semibold text-gray-900 mb-2">
                  10. Contact Us
                </h3>
                <p className="text-gray-700">
                  If you have any questions about this Privacy Policy, please
                  contact us at{" "}
                  <a
                    href="mailto:g.a.donayre.business@gmail.com"
                    className="text-blue-600 hover:text-blue-700"
                  >
                    g.a.donayre.business@gmail.com
                  </a>
                </p>
              </section>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
