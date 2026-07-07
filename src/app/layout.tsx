import type { Metadata } from "next";
import { Inter } from "next/font/google";
import MainProviders from "@/Providers/MainProviders";
import Provider from "@/Providers/Provider";
import "./globals.css";
import { Toaster } from "sonner";
import NextTopLoader from "nextjs-toploader";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "Discount Deals",
  description:
    "Premium liquidation marketplace for live auctions, overstock inventory, and smart bidding.",
  icons: {
    icon: "/images/Logo.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>
        <MainProviders>
          <Provider>
            <NextTopLoader
              color="#154242"
              easing="ease-in"
              showSpinner={false}
            />
            {children}
          </Provider>
        
        </MainProviders>
        <Toaster position="top-right" closeButton />
      </body>
    </html>
  );
}