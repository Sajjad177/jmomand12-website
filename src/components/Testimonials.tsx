import Image from "next/image";
import { Star } from "lucide-react";

const testimonials = [
  {
    id: 1,
    name: "David Thompson",
    role: "Verified Bidder",
    image: "/img/avatar-1.png",
    review:
      "I've won three high-end appliances here for less than half their retail price. The pickup process was seamless and the items were exactly as described.",
  },
  {
    id: 2,
    name: "Sarah Johnson",
    role: "Verified Bidder",
    image: "/img/avatar-2.png",
    review:
      "Excellent platform! The bidding process is transparent, and every product I've received has exceeded my expectations.",
  },
  {
    id: 3,
    name: "Michael Carter",
    role: "Verified Bidder",
    image: "/img/avatar-3.png",
    review:
      "Customer support was amazing. I saved hundreds of dollars on premium electronics and furniture.",
  },
  {
    id: 4,
    name: "Emily Wilson",
    role: "Verified Bidder",
    image: "/img/avatar-4.png",
    review:
      "The local pickup experience was smooth and hassle-free. I'll definitely participate in more auctions.",
  },
];

export default function Testimonials() {
  return (
    <section className="bg-indigo-50 py-20">
      <div className="container mx-auto px-6 xl:px-20">
        {/* Heading */}
        <div className="mb-16 text-center">
          <h2 className="text-5xl font-bold text-gray-900">
            What Our Bidders Say
          </h2>
        </div>

        {/* Cards */}
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {testimonials.map((item) => (
            <div
              key={item.id}
              className="rounded-lg border border-slate-200 bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
            >
              {/* Rating */}
              <div className="mb-4 flex gap-1">
                {[...Array(5)].map((_, index) => (
                  <Star
                    key={index}
                    size={16}
                    className="fill-orange-500 text-orange-500"
                  />
                ))}
              </div>

              {/* Review */}
              <p className="mb-6 text-base leading-7 text-gray-900">
                {item.review}
              </p>

              {/* User */}
              <div className="flex items-center gap-4">
                <div className="relative h-12 w-12 overflow-hidden rounded-full border-2 border-orange-500">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover"
                  />
                </div>

                <div>
                  <h4 className="text-base font-bold text-gray-900">
                    {item.name}
                  </h4>

                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                    {item.role}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
