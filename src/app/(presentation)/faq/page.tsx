"use client";

import { useState } from "react";
import {
  ChevronDown,
  Search,
  MessageCircle,
  Home,
  Shield,
  User,
  Phone,
} from "lucide-react";

interface FAQ {
  id: string;
  question: string;
  answer: string;
}

interface FAQSection {
  id: string;
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  faqs: FAQ[];
}

const FAQ_DATA: FAQSection[] = [
  {
    id: "reservations",
    title: "Reservations",
    icon: MessageCircle,
    faqs: [
      {
        id: "reserve-listing",
        question: "How do I reserve a listing?",
        answer:
          'Click the "Reserve Now" button on a listing. Note: The reservation flow is still under development, so it\'s currently a placeholder action.',
      },
      {
        id: "payment-required",
        question: "Do I need to pay to reserve a listing?",
        answer:
          "No. There is currently no payment step involved in the app. You can coordinate directly with the listing owner after reserving.",
      },
      {
        id: "after-reserve",
        question: "What happens after I reserve?",
        answer:
          "Not final. You may receive confirmation and contact details. Finalizing the reservation is currently done off-platform by communicating with the owner.",
      },
    ],
  },
  {
    id: "listings",
    title: "Listings",
    icon: Home,
    faqs: [
      {
        id: "post-listing",
        question: "How do I post my own listing?",
        answer:
          'Sign in, click "Add Listing", and fill out the required details. Once submitted, your listing will be reviewed by the admin.',
      },
      {
        id: "listing-visibility",
        question: "Why isn't my listing visible yet?",
        answer:
          "Listings must be approved by an admin before going public. You'll receive a notification once your listing is approved or rejected.",
      },
      {
        id: "edit-listing",
        question: "Can I edit or delete my listing later?",
        answer:
          "Yes. You can edit, archive, or delete your listing anytime from your account dashboard.",
      },
      {
        id: "archive-listing",
        question: "What does archiving a listing do?",
        answer:
          "Archiving a listing hides it from the public. You can unarchive it later to make it visible again.",
      },
    ],
  },
  {
    id: "reporting",
    title: "Reporting & Moderation",
    icon: Shield,
    faqs: [
      {
        id: "report-listing",
        question: "How do I report a suspicious or fake listing?",
        answer:
          'Click the ••• menu on a listing and select "Report listing." Choose a reason and optionally provide more details.',
      },
      {
        id: "anonymous-report",
        question: "Will my report be anonymous?",
        answer:
          "Yes. The listing owner will not be notified who reported the listing.",
      },
      {
        id: "after-report",
        question: "What happens after I report a listing?",
        answer:
          "The report will be sent to the admin panel for moderation. Admins will review and take action if needed. You won't receive a follow-up notification for now.",
      },
    ],
  },
  {
    id: "accounts",
    title: "Accounts & Access",
    icon: User,
    faqs: [
      {
        id: "account-required",
        question: "Do I need an account to use the app?",
        answer:
          "No — you can browse listings without signing in. However, to post, report, reserve, or save a listing, you'll need an account.",
      },
      {
        id: "save-listing",
        question: "Can I save or favorite a listing?",
        answer:
          "Yes. Just click the heart icon on any listing to add it to your saved list. You must be signed in.",
      },
      {
        id: "verify-account",
        question: "Can I verify my account or listing?",
        answer:
          "Not yet. We plan to implement account and listing verification in the future, especially for property managers or owners.",
      },
    ],
  },
  {
    id: "contact",
    title: "Contacting Owners",
    icon: Phone,
    faqs: [
      {
        id: "contact-owner",
        question: "How do I contact the owner of a listing?",
        answer:
          "Each listing includes either a Facebook profile link or a contact number so you can message or call the owner directly.",
      },
      {
        id: "in-app-messaging",
        question: "Can I message the owner inside the app?",
        answer:
          "Not yet. In-app messaging is not currently available, but it is planned for a future update.",
      },
    ],
  },
];

export default function FaqsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [openSections, setOpenSections] = useState<Set<string>>(new Set());
  const [openItems, setOpenItems] = useState<Set<string>>(new Set());

  const toggleSection = (sectionId: string) => {
    const newOpenSections = new Set(openSections);
    if (newOpenSections.has(sectionId)) {
      newOpenSections.delete(sectionId);
      // Close all items in this section when section is closed
      const newOpenItems = new Set(openItems);
      FAQ_DATA.find((section) => section.id === sectionId)?.faqs.forEach(
        (faq) => {
          newOpenItems.delete(faq.id);
        }
      );
      setOpenItems(newOpenItems);
    } else {
      newOpenSections.add(sectionId);
    }
    setOpenSections(newOpenSections);
  };

  const toggleItem = (itemId: string) => {
    const newOpenItems = new Set(openItems);
    if (newOpenItems.has(itemId)) {
      newOpenItems.delete(itemId);
    } else {
      newOpenItems.add(itemId);
    }
    setOpenItems(newOpenItems);
  };

  const filteredData = FAQ_DATA.map((section) => ({
    ...section,
    faqs: section.faqs.filter(
      (faq) =>
        faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
    ),
  })).filter((section) => section.faqs.length > 0);

  const totalFAQs = FAQ_DATA.reduce(
    (acc, section) => acc + section.faqs.length,
    0
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="mx-auto max-w-4xl px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-lg text-slate-600 mb-8 max-w-2xl mx-auto">
            Find answers to common questions about our platform. Can&apos;t find
            what you&apos;re looking for? Feel free to reach out to our support
            team.
          </p>

          {/* Search Bar */}
          <div className="relative max-w-md mx-auto mb-6">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search FAQs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white shadow-sm transition-all duration-200"
            />
          </div>

          <p className="text-sm text-slate-500">
            {searchTerm
              ? `Showing results for "${searchTerm}"`
              : `${totalFAQs} questions across ${FAQ_DATA.length} categories`}
          </p>
        </div>

        {/* FAQ Sections */}
        <div className="space-y-6">
          {filteredData.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto mb-4 bg-slate-100 rounded-full flex items-center justify-center">
                <Search className="w-8 h-8 text-slate-400" />
              </div>
              <h3 className="text-lg font-medium text-slate-900 mb-2">
                No results found
              </h3>
              <p className="text-slate-600">
                Try adjusting your search terms or browse all categories below.
              </p>
            </div>
          ) : (
            filteredData.map((section) => (
              <div
                key={section.id}
                className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden"
              >
                {/* Section Header */}
                <button
                  onClick={() => toggleSection(section.id)}
                  className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-slate-50 transition-colors duration-200"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <section.icon className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <h2 className="text-lg font-semibold text-slate-900">
                        {section.title}
                      </h2>
                      <p className="text-sm text-slate-500">
                        {section.faqs.length} questions
                      </p>
                    </div>
                  </div>
                  <ChevronDown
                    className={`w-5 h-5 text-slate-400 transition-transform duration-200 ${
                      openSections.has(section.id) ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {/* Section Content */}
                {openSections.has(section.id) && (
                  <div className="border-t border-slate-100">
                    {section.faqs.map((faq, index) => (
                      <div
                        key={faq.id}
                        className={index > 0 ? "border-t border-slate-50" : ""}
                      >
                        <button
                          onClick={() => toggleItem(faq.id)}
                          className="w-full px-6 py-4 text-left hover:bg-slate-25 transition-colors duration-200 flex items-center justify-between cursor-pointer"
                        >
                          <h3 className="font-medium text-slate-900 pr-4">
                            {faq.question}
                          </h3>
                          <ChevronDown
                            className={`w-4 h-4 text-slate-400 transition-transform duration-200 flex-shrink-0 ${
                              openItems.has(faq.id) ? "rotate-180" : ""
                            }`}
                          />
                        </button>

                        {openItems.has(faq.id) && (
                          <div className="px-6 pb-4">
                            <div className="bg-slate-50 rounded-lg p-4 border-l-4 border-blue-500">
                              <p className="text-slate-700 leading-relaxed">
                                {faq.answer}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* Footer CTA */}
        <div className="mt-16 text-center">
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-8 text-white">
            <h3 className="text-xl font-semibold mb-2">
              Still have questions?
            </h3>
            <p className="text-blue-100 mb-6">
              Our support team is here to help you get the most out of our
              platform.
            </p>
            <button className="bg-white text-blue-600 px-6 py-3 rounded-lg font-medium hover:bg-blue-50 transition-colors duration-200 shadow-sm">
              Contact Support
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
