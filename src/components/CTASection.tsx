import Link from "next/link";

export default function CTASection() {
  return (
    <section className="bg-white py-24">
      <div className="container px-6 xl:px-20">
        <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-[#1E3A8A] to-[#0F172A] px-8 py-20 shadow-2xl md:px-16">
          {/* Background Decoration */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute -left-20 -top-20 h-72 w-72 rounded-full bg-white blur-3xl" />
            <div className="absolute -right-24 bottom-0 h-80 w-80 rounded-full bg-orange-500 blur-3xl" />
          </div>

          {/* Content */}
          <div className="relative z-10 mx-auto max-w-4xl text-center">
            <h2 className="text-4xl font-black leading-tight text-white md:text-6xl">
              Ready To Start Winning
              <br />
              Incredible Deals?
            </h2>

            <p className="mx-auto mt-8 max-w-3xl text-lg leading-8 text-indigo-100 md:text-2xl">
              Join over{" "}
              <span className="font-bold text-white">15,000 smart bidders</span>{" "}
              today and get instant access to premium liquidation inventory at
              up to{" "}
              <span className="font-bold text-orange-400">90% off retail</span>.
            </p>

            <div className="mt-10">
              <Link
                href="/auctions"
                className="inline-flex items-center justify-center rounded-sm bg-orange-500 px-8 py-4 text-sm font-bold text-white shadow-lg transition-all duration-300 hover:bg-orange-600 hover:scale-105"
              >
                Join Auctions Now
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
