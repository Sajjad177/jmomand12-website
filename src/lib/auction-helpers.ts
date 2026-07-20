// Auction Helper Utilities for Premium Card System

/**
 * Calculate auction status based on current time and auction end time
 */
export function getAuctionStatus(
  status: string,
  endsAt: string,
): { label: string; isLive: boolean } {
  const now = new Date();
  const endTime = new Date(endsAt);

  const isLive = status === "active" && endTime > now;

  return {
    label: isLive ? "LIVE" : "CLOSED",
    isLive,
  };
}

/**
 * Calculate remaining time until auction ends
 * Returns formatted string: "2d 6h", "5h 14m", "23m", or "Ended"
 */
export function getTimeLeft(endsAt: string): string {
  const now = new Date();
  const endTime = new Date(endsAt);
  const diffMs = endTime.getTime() - now.getTime();

  // If auction has ended
  if (diffMs <= 0) {
    return "Ended";
  }

  const diffSeconds = Math.floor(diffMs / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);

  // Days and hours
  if (diffDays > 0) {
    const remainingHours = diffHours % 24;
    return `${diffDays}d ${remainingHours}h`;
  }

  // Hours and minutes
  if (diffHours > 0) {
    const remainingMinutes = diffMinutes % 60;
    return `${diffHours}h ${remainingMinutes}m`;
  }

  // Minutes only
  if (diffMinutes > 0) {
    return `${diffMinutes}m`;
  }

  // Less than a minute
  return `${diffSeconds}s`;
}

/**
 * Format currency amount
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Get current bid amount (highest bid or starting bid)
 */
export function getCurrentBidAmount(
  highestBid: { amount: number } | null | undefined,
  startingBid: number,
): number {
  return highestBid?.amount ?? startingBid;
}
