// lib/utils/message-utils.ts

export const formatMessageTimestamp = (date: Date): string => {
  const now = new Date();
  const messageDate = new Date(date);

  // Helper to check if two dates are the same day
  const isSameDay = (date1: Date, date2: Date) => {
    return (
      date1.getDate() === date2.getDate() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getFullYear() === date2.getFullYear()
    );
  };

  // Helper to check if date is within current week
  const isThisWeek = (date: Date) => {
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());
    startOfWeek.setHours(0, 0, 0, 0);

    return date >= startOfWeek && date < now;
  };

  // Helper to check if date is within current year
  const isThisYear = (date: Date) => {
    return date.getFullYear() === now.getFullYear();
  };

  // Format time (e.g., "5:12 PM")
  const formatTime = (date: Date) => {
    return date.toLocaleString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  // Format day name (e.g., "Thu")
  const formatDayName = (date: Date) => {
    return date.toLocaleDateString("en-US", { weekday: "short" });
  };

  // Format month and day (e.g., "Mar 28")
  const formatMonthDay = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  // Format full date (e.g., "Mar 28, 2025")
  const formatFullDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // Apply formatting logic
  if (isSameDay(messageDate, now)) {
    // Today: just time (5:12 PM)
    return formatTime(messageDate);
  } else if (isThisWeek(messageDate)) {
    // This week: day + time (Thu 7:45 PM)
    return `${formatDayName(messageDate)} ${formatTime(messageDate)}`;
  } else if (isThisYear(messageDate)) {
    // This year: month/day + time (Mar 28, 6:31 PM)
    return `${formatMonthDay(messageDate)}, ${formatTime(messageDate)}`;
  } else {
    // Different year: full date + time (Mar 28, 2025, 6:31 PM)
    return `${formatFullDate(messageDate)}, ${formatTime(messageDate)}`;
  }
};
