"use client";

const stats = [
  {
    number: "2,500+",
    label: "ACTIVE AUCTIONS",
  },
  {
    number: "15,000+",
    label: "REGISTERED BIDDERS",
  },
  {
    number: "8,000+",
    label: "PRODUCTS SOLD",
  },
  {
    number: "$2.5M+",
    label: "TOTAL SAVINGS",
  },
];

export default function StatsSection() {
  return (
    <section className="bg-indigo-50 py-20">
      <div className="container mx-auto px-6">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="flex flex-col items-center justify-center gap-2 text-center"
            >
              <h2 className="text-5xl font-bold leading-none text-orange-500 lg:text-6xl">
                {stat.number}
              </h2>

              <p className="text-base font-bold uppercase tracking-wide text-gray-500">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
