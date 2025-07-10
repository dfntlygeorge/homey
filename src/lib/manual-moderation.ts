import {
  ListingWithImagesAndAddress,
  ModerationResponse,
} from "@/config/types";

export const fallbackTextModeration = (
  listing: ListingWithImagesAndAddress
): ModerationResponse => {
  // Basic keyword-based moderation
  const suspiciousKeywords = [
    // Explicit content
    "adult",
    "explicit",
    "xxx",
    "porn",
    "nude",
    "naked",
    "sex",
    // Scam indicators
    "too good to be true",
    "urgent",
    "wire transfer",
    "western union",
    "send money",
    "cash only",
    "no questions asked",
    "guaranteed",
    // Inappropriate contact
    "whatsapp only",
    "telegram only",
    "signal only",
    "encrypted",
    // Suspicious pricing
    "free",
    "$0",
    "no cost",
    "giveaway",
    // Prohibited items (adjust based on your platform)
    "weapon",
    "gun",
    "knife",
    "drug",
    "illegal",
    "stolen",
    // Spam indicators
    "work from home",
    "make money fast",
    "click here",
    "visit my website",
  ];

  const textToCheck = [
    listing.title,
    listing.description,
    listing.address?.formattedAddress,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  // Check for suspicious keywords
  const foundSuspiciousKeywords = suspiciousKeywords.filter((keyword) =>
    textToCheck.includes(keyword.toLowerCase())
  );

  // Check for excessive capitalization (potential spam)
  const capsPercentage =
    (textToCheck.match(/[A-Z]/g) || []).length / textToCheck.length;
  const excessiveCaps = capsPercentage > 0.3 && textToCheck.length > 20;

  // Check for excessive punctuation (spam indicator)
  const punctuationCount = (textToCheck.match(/[!?]{2,}/g) || []).length;
  const excessivePunctuation = punctuationCount > 3;

  // Check for suspicious patterns
  const hasRepeatedChars = /(.)\1{4,}/.test(textToCheck); // 5+ repeated characters
  const hasMultipleEmojis =
    (
      textToCheck.match(
        /[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]/gu
      ) || []
    ).length > 5;

  // Check for missing essential information
  const missingTitle = !listing.title || listing.title.trim().length < 5;
  const missingDescription =
    !listing.description || listing.description.trim().length < 10;
  const missingLocation = !listing.address?.formattedAddress;

  // Price validation
  const suspiciousPrice =
    listing.rent !== null && (listing.rent <= 0 || listing.rent > 1000000);

  // Decision logic
  if (foundSuspiciousKeywords.length > 0) {
    return {
      action: "reject",
      reason: `Contains suspicious keywords: ${foundSuspiciousKeywords.join(
        ", "
      )}`,
    };
  }

  if (excessiveCaps) {
    return {
      action: "reject",
      reason: "Excessive capitalization detected (potential spam)",
    };
  }

  if (excessivePunctuation) {
    return {
      action: "reject",
      reason: "Excessive punctuation detected (potential spam)",
    };
  }

  if (hasRepeatedChars) {
    return {
      action: "reject",
      reason: "Suspicious repeated characters detected",
    };
  }

  if (suspiciousPrice) {
    return {
      action: "manual_review",
      reason: "Suspicious pricing detected",
    };
  }

  if (missingTitle || missingDescription || missingLocation) {
    return {
      action: "manual_review",
      reason: "Missing essential information",
    };
  }

  if (hasMultipleEmojis) {
    return {
      action: "manual_review",
      reason: "Excessive emoji usage detected",
    };
  }

  // If all checks pass, approve
  return {
    action: "approve",
    reason: "Passed basic moderation checks",
  };
};
