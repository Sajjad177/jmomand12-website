export type AuctionProduct = {
  id: string;
  title: string;
  category: string;
  bids: number;
  image: string;
  currentBid: string;
  timeLeft: string;
  badge?: {
    label: string;
    tone: "live" | "ending" | "upcoming";
  };
};

export type NavLink = {
  label: string;
  href: string;
};

export type FilterGroup = {
  title: string;
  options: Array<{
    label: string;
    count?: number;
    checked?: boolean;
  }>;
};
