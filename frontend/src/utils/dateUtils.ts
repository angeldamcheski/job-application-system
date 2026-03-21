// src/utils/dateUtils.ts

/**
 * Returns a relative date string for past or future dates.
 * For past: "Opened X days ago"
 * For future: "Opens in X days"
 * Falls back to absolute date for older than 30 days.
 * @param dateString - ISO date string
 * @param options.prefixPast - text prefix for past dates
 * @param options.prefixFuture - text prefix for future dates
 */
export const formatJobDate = (
  dateString: string,
  options?: { prefixPast?: string; prefixFuture?: string },
) => {
  const now = new Date();
  const date = new Date(dateString);

  const diffMs = date.getTime() - now.getTime(); // positive if future, negative if past
  const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));

  const prefixPast = options?.prefixPast || "Opened";
  const prefixFuture = options?.prefixFuture || "Opens in";

  if (diffDays === 0) return "Today";

  if (diffDays > 0) {
    // Future date
    if (diffDays < 7)
      return `${prefixFuture} ${diffDays} day${diffDays > 1 ? "s" : ""}`;
    if (diffDays < 30) {
      const weeks = Math.ceil(diffDays / 7);
      return `${prefixFuture} ${weeks} week${weeks > 1 ? "s" : ""}`;
    }
    return date.toLocaleDateString();
  } else {
    // Past date
    const pastDays = Math.abs(diffDays);
    if (pastDays < 7)
      return `${prefixPast} ${pastDays} day${pastDays > 1 ? "s" : ""} ago`;
    if (pastDays < 30) {
      const weeks = Math.floor(pastDays / 7);
      return `${prefixPast} ${weeks} week${weeks > 1 ? "s" : ""} ago`;
    }
    return date.toLocaleDateString();
  }
};
export const getTimeAgo = (dateString: string) => {
  const now = new Date();
  const date = new Date(dateString);
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Today";
  if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
  if (diffDays < 30) {
    const weeks = Math.floor(diffDays / 7);
    return `${weeks} week${weeks > 1 ? "s" : ""} ago`;
  }
  return date.toLocaleDateString(); // fallback to absolute date for older than a month
};
// /**
//  * Shortcut for job posts "Posted X ago"
//  */
// export const getTimeAgo = (dateString: string) =>
//   formatJobDate(dateString, { prefixPast: "", prefixFuture: "" });
