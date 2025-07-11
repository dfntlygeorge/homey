"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface TermsModalProps {
  children: React.ReactNode;
}

export function TermsModal({ children }: TermsModalProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>Terms of Service</DialogTitle>
        </DialogHeader>
        <div className="overflow-y-auto max-h-[60vh] pr-4">
          <div className="space-y-4 text-sm">
            <p className="text-gray-600">
              <strong>Last updated: July 11, 2025</strong>
            </p>

            <p>
              Welcome to Hestia! By accessing or using our website and services
              (the &quot;Service&quot;), you agree to be bound by these Terms of
              Service (&quot;Terms&quot;). Please read them carefully.
            </p>

            <div className="space-y-4">
              <section>
                <h3 className="font-semibold text-gray-900 mb-2">
                  1. Use of Our Service
                </h3>
                <p className="text-gray-700">
                  You must be at least 18 years old or have the consent of a
                  parent or guardian to use our Service. You agree to use the
                  Service only for lawful purposes and in accordance with these
                  Terms.
                </p>
              </section>

              <section>
                <h3 className="font-semibold text-gray-900 mb-2">
                  2. Accounts
                </h3>
                <p className="text-gray-700">
                  When you create an account or sign in with a third-party
                  service (such as Google), you agree to provide accurate and
                  complete information. You are responsible for maintaining the
                  confidentiality of your account and for any activity under
                  your account.
                </p>
              </section>

              <section>
                <h3 className="font-semibold text-gray-900 mb-2">
                  3. Listings and Content
                </h3>
                <p className="text-gray-700">
                  If you create or submit listings or content on our platform,
                  you are solely responsible for that content. You must ensure
                  that it does not violate any laws or infringe on any rights.
                </p>
                <p className="text-gray-700 mt-2">
                  We reserve the right to remove or modify any content at our
                  discretion.
                </p>
              </section>

              <section>
                <h3 className="font-semibold text-gray-900 mb-2">
                  4. Prohibited Activities
                </h3>
                <p className="text-gray-700 mb-2">You agree not to:</p>
                <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                  <li>Violate any laws or regulations.</li>
                  <li>Infringe the rights of others.</li>
                  <li>Upload viruses or malicious code.</li>
                  <li>
                    Attempt to gain unauthorized access to other accounts or
                    systems.
                  </li>
                </ul>
              </section>

              <section>
                <h3 className="font-semibold text-gray-900 mb-2">
                  5. Termination
                </h3>
                <p className="text-gray-700">
                  We may suspend or terminate your access to the Service at any
                  time, without prior notice or liability, for any reason,
                  including if you violate these Terms.
                </p>
              </section>

              <section>
                <h3 className="font-semibold text-gray-900 mb-2">
                  6. Disclaimer
                </h3>
                <p className="text-gray-700">
                  Our Service is provided &quot;as is&quot; and &quot;as
                  available.&quot; We do not guarantee that the Service will be
                  uninterrupted, secure, or error-free.
                </p>
              </section>

              <section>
                <h3 className="font-semibold text-gray-900 mb-2">
                  7. Limitation of Liability
                </h3>
                <p className="text-gray-700">
                  To the maximum extent permitted by law, Hestia and its
                  affiliates shall not be liable for any indirect, incidental,
                  special, consequential, or punitive damages arising out of or
                  related to your use of the Service.
                </p>
              </section>

              <section>
                <h3 className="font-semibold text-gray-900 mb-2">
                  8. Changes to Terms
                </h3>
                <p className="text-gray-700">
                  We may update these Terms from time to time. We will notify
                  you of any changes by posting the new Terms on this page. Your
                  continued use of the Service after changes become effective
                  means you agree to the new Terms.
                </p>
              </section>

              <section>
                <h3 className="font-semibold text-gray-900 mb-2">
                  9. Governing Law
                </h3>
                <p className="text-gray-700">
                  These Terms are governed by and construed in accordance with
                  the laws of the Philippines, without regard to its conflict of
                  law principles.
                </p>
              </section>

              <section>
                <h3 className="font-semibold text-gray-900 mb-2">
                  10. Contact Us
                </h3>
                <p className="text-gray-700">
                  If you have any questions about these Terms, please contact us
                  at{" "}
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
