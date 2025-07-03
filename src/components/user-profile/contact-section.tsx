"use client";

import { Button } from "@/components/ui/button";
import { MessageCircle, Phone, Facebook } from "lucide-react";
import { User } from "@prisma/client";
import { redirect } from "next/navigation";

interface ContactSectionProps {
  user: User;
}

export const ContactSection = ({ user }: ContactSectionProps) => {
  const handleContactViaMessenger = () => {
    // TODO: Implement messenger contact functionality
    console.log("Contact via messenger:", user.id);
  };

  const handlePhoneContact = () => {
    // Assuming contact field contains phone number
    if (user.email) {
      window.location.href = `tel:${user.email}`; // Replace with actual phone field
    }
  };

  return (
    <div className="space-y-2">
      <Button
        className="w-full"
        onClick={handleContactViaMessenger}
        variant="outline"
      >
        <MessageCircle className="w-4 h-4 mr-2" />
        Contact via Messenger
      </Button>

      {/* TODO: Add phone contact if you have a phone field */}
      {/* <Button 
        className="w-full" 
        onClick={handlePhoneContact}
        variant="outline"
      >
        <Phone className="w-4 h-4 mr-2" />
        Call Now
      </Button> */}
    </div>
  );
};
