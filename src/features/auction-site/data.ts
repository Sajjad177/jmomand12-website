import type { AuctionProduct, FilterGroup, NavLink } from "./types";

export const quickLinks: NavLink[] = [
  { label: "Live Auctions", href: "/category" },
  { label: "Categories", href: "/category" },
  { label: "How It Works", href: "#howitwork" },
  { label: "Upcoming Lots", href: "#upcomming" },
];

export const supportLinks: NavLink[] = [
  { label: "Help Center", href: "/" },
  { label: "Buyer Protection", href: "/" },
  { label: "Pickup Locations", href: "/" },
  { label: "Contact Us", href: "/" },
  { label: "FAQ", href: "/" },
];

export const categoriesNav = [
  "All Products",
  "Appliances",
  "Electronics",
  "Furniture",
  "Home & Garden",
  "Tools",
  "Outdoor",
  "Office Furniture",
  "Bedding & Decor",
];

export const categoryFilters: FilterGroup[] = [
  {
    title: "Minimum Retail Value",
    options: [
      { label: "Under $100" },
      { label: "$100 – $500" },
      { label: "$500 – $1,000" },
      { label: "$1,000 – $5,000" },
      { label: "$5,000+" },
    ],
  },
  {
    title: "Auction Status",
    options: [
      { label: "Live Auctions", count: 342, checked: true },
      { label: "Ending Soon", count: 89 },
      { label: "Upcoming", count: 124 },
    ],
  },
  {
    title: "Condition",
    options: [
      { label: "Brand New", count: 45 },
      { label: "Like New / Open Box", count: 210, checked: true },
      { label: "Scratch & Dent", count: 800 },
      { label: "Salvage", count: 190 },
    ],
  },
];

export const homeActiveAuctions: AuctionProduct[] = [
  {
    id: "active-1",
    title: "Casio G-Shock Premium Chair Edition",
    category: "Electronics",
    bids: 4,
    image: "/images/login.jpg",
    currentBid: "$125.00",
    timeLeft: "04h 12m",
    badge: { label: "New", tone: "live" },
  },
  {
    id: "active-2",
    title: "Casio G-Shock Premium Lounge Sofa",
    category: "Electronics",
    bids: 4,
    image: "/images/4f8da1b70693c4fcf9e01b9293706aed5cd4e34d.jpg",
    currentBid: "$215.00",
    timeLeft: "04h 12m",
    badge: { label: "Hot", tone: "ending" },
  },
  {
    id: "active-3",
    title: "Holiday Wreath Designer Piece",
    category: "Electronics",
    bids: 4,
    image: "/images/kids-playing.png",
    currentBid: "$125.00",
    timeLeft: "04h 12m",
    badge: { label: "New", tone: "live" },
  },
  {
    id: "active-4",
    title: "Casio G-Shock Premium Laptop Bundle",
    category: "Electronics",
    bids: 4,
    image: "/images/12043465729ab7c8ceffce00749e7c71df0c9e25.jpg",
    currentBid: "$125.00",
    timeLeft: "04h 12m",
    badge: { label: "New", tone: "live" },
  },
  {
    id: "active-5",
    title: "Casio G-Shock Premium Lamp Set",
    category: "Electronics",
    bids: 4,
    image: "/images/4f8da1b70693c4fcf9e01b9293706aed5cd4e34d (1).jpg",
    currentBid: "$125.00",
    timeLeft: "04h 12m",
  },
];

export const categoryProducts: AuctionProduct[] = [
  {
    id: "category-1",
    title: "Casio G-Shock Premium Recliner",
    category: "Electronics",
    bids: 4,
    image: "/images/login.jpg",
    currentBid: "$125.00",
    timeLeft: "04h 12m",
    badge: { label: "High-Value", tone: "live" },
  },
  {
    id: "category-2",
    title: "Casio G-Shock Premium Dining Set",
    category: "Electronics",
    bids: 4,
    image: "/images/4f8da1b70693c4fcf9e01b9293706aed5cd4e34d.jpg",
    currentBid: "$125.00",
    timeLeft: "04h 12m",
    badge: { label: "Ending Soon", tone: "ending" },
  },
  {
    id: "category-3",
    title: "Casio G-Shock Premium Accent Chair",
    category: "Electronics",
    bids: 4,
    image: "/images/4f8da1b70693c4fcf9e01b9293706aed5cd4e34d (1).jpg",
    currentBid: "$125.00",
    timeLeft: "04h 12m",
    badge: { label: "Live", tone: "live" },
  },
  {
    id: "category-4",
    title: "Casio G-Shock Premium Lamp Chandelier",
    category: "Electronics",
    bids: 4,
    image: "/images/heroImage.png",
    currentBid: "$125.00",
    timeLeft: "04h 12m",
    badge: { label: "Live", tone: "live" },
  },
];

export const similarAuctions: AuctionProduct[] = [
  {
    id: "similar-1",
    title: "Casio G-Shock Premium Edition Laptop",
    category: "Electronics",
    bids: 4,
    image: "/images/12043465729ab7c8ceffce00749e7c71df0c9e25.jpg",
    currentBid: "$125.00",
    timeLeft: "04h 12m",
    badge: { label: "Live", tone: "live" },
  },
  {
    id: "similar-2",
    title: "Casio G-Shock Premium Edition Bed",
    category: "Electronics",
    bids: 4,
    image: "/images/4f8da1b70693c4fcf9e01b9293706aed5cd4e34d (1).jpg",
    currentBid: "$125.00",
    timeLeft: "04h 12m",
    badge: { label: "Live", tone: "live" },
  },
  {
    id: "similar-3",
    title: "Casio G-Shock Premium Edition Wall Art",
    category: "Electronics",
    bids: 4,
    image: "/images/thoughtful-senior-woman.png",
    currentBid: "$125.00",
    timeLeft: "04h 12m",
    badge: { label: "Live", tone: "live" },
  },
  {
    id: "similar-4",
    title: "Casio G-Shock Premium Edition Laptop",
    category: "Electronics",
    bids: 4,
    image: "/images/12043465729ab7c8ceffce00749e7c71df0c9e25.jpg",
    currentBid: "$125.00",
    timeLeft: "04h 12m",
    badge: { label: "Live", tone: "live" },
  },
];

export const liveBids = [
  { bidder: "Bidder 4921", timeAgo: "Just now", amount: "$850.00" },
  { bidder: "Bidder 8823", timeAgo: "15 mins ago", amount: "$800.00" },
  { bidder: "Bidder 7451", timeAgo: "30 mins ago", amount: "$750.00" },
  { bidder: "Bidder 6390", timeAgo: "45 mins ago", amount: "$720.00" },
  { bidder: "Bidder 5127", timeAgo: "1 hour ago", amount: "$690.00" },
  { bidder: "Bidder 4912", timeAgo: "2 hours ago", amount: "$650.00" },
];
