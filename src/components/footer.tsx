import Image from "next/image";
import Link from "next/link";
import { FaFacebookF, FaInstagram, FaXTwitter } from "react-icons/fa6";

export default function Footer() {
  return (
    <footer className="bg-sky-950 pt-20 pb-8">
      <div className="mx-auto max-w-[1440px] px-6 xl:px-20">
        {/* Top */}
        <div className="flex flex-col gap-16 lg:flex-row lg:justify-between">
          {/* Left */}
          <div className="max-w-md">
            <Image
              src="/logo.png"
              alt="Discount Deals"
              width={200}
              height={110}
              className="mb-6"
            />

            <p className="mb-8 text-base leading-1 text-gray-400">
              Premium liquidation destination for smart buyers. Access exclusive
              overstock and returned inventory at unbeatable prices through our
              secure auction platform.
            </p>

            <div className="flex gap-4">
              {[FaFacebookF, FaXTwitter, FaInstagram].map((Icon, index) => (
                <Link
                  key={index}
                  href="#"
                  className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/5 hover:bg-orange-500 transition"
                >
                  <Icon className="h-5 w-5 text-white" />
                </Link>
              ))}
            </div>
          </div>

          {/* Right */}
          <div className="grid flex-1 gap-10 md:grid-cols-3">
            {/* Quick Links */}
            <div>
              <h3 className="mb-8 text-lg font-bold text-white">Quick Links</h3>

              <ul className="space-y-4">
                {[
                  "Live Auctions",
                  "Categories",
                  "How It Works",
                  "Upcoming Lots",
                  "Seller Portal",
                ].map((item) => (
                  <li key={item}>
                    <Link
                      href="#"
                      className="text-sm text-gray-400 transition hover:text-orange-500"
                    >
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Support */}
            <div>
              <h3 className="mb-8 text-lg font-bold text-white">Support</h3>

              <ul className="space-y-4">
                {[
                  "Help Center",
                  "Buyer Protection",
                  "Pickup Locations",
                  "Contact Us",
                  "FAQ",
                ].map((item) => (
                  <li key={item}>
                    <Link
                      href="#"
                      className="text-sm text-gray-400 transition hover:text-orange-500"
                    >
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Newsletter */}
            <div>
              <h3 className="mb-6 text-lg font-bold text-white">Newsletter</h3>

              <p className="mb-6 text-sm text-gray-400">
                Get weekly alerts on the hottest premium lots.
              </p>

              <form className="space-y-3">
                <input
                  type="email"
                  placeholder="Your email address"
                  className="w-full rounded-lg border border-slate-300 bg-transparent px-4 py-4 text-sm text-white placeholder:text-indigo-100 outline-none focus:border-orange-500"
                />

                <button
                  type="submit"
                  className="rounded-sm bg-orange-500 px-8 py-4 text-sm font-bold text-white transition hover:bg-orange-600"
                >
                  Subscribe
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-10 flex flex-col items-center justify-between gap-6 border-t border-white/10 pt-8 md:flex-row">
          <p className="text-xs text-white">
            © 2026{" "}
            <span className="font-semibold uppercase text-orange-500">
              Discount Deals
            </span>
            . All rights reserved.
          </p>

          <div className="flex gap-8">
            {["Privacy", "Terms", "Cookies"].map((item) => (
              <Link
                key={item}
                href="#"
                className="text-xs font-bold uppercase tracking-wider text-gray-200 transition hover:text-orange-500"
              >
                {item}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
