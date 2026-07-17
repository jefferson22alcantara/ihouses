import Image from "next/image";
import Link from "next/link";
import { BedDouble, MapPin, Maximize, ShowerHead } from "lucide-react";
import type { MockListing } from "@/lib/mock-listings";

export function PropertyCard({ listing }: { listing: MockListing }) {
  return (
    <Link
      href={`/dashboard/${listing.id}`}
      className="group flex flex-col overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-sm transition-shadow hover:shadow-lg"
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-neutral-100">
        <Image
          src={listing.image}
          alt={listing.title}
          fill
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <span className="absolute left-2 top-2 rounded-md bg-black/60 px-2 py-0.5 text-xs font-medium text-white">
          {listing.source}
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <p className="text-lg font-bold text-neutral-900">
          €{listing.price.toLocaleString("en-US")}
          <span className="text-sm font-normal text-neutral-500">/month</span>
        </p>

        <h3 className="line-clamp-1 text-sm font-semibold text-neutral-800">
          {listing.title}
        </h3>

        <p className="flex items-center gap-1 text-xs text-neutral-500">
          <MapPin size={14} className="shrink-0 text-brand" />
          <span className="line-clamp-1">
            {listing.address}, {listing.neighborhood}, {listing.city}
          </span>
        </p>

        <div className="mt-auto flex items-center gap-4 border-t border-neutral-100 pt-3 text-xs text-neutral-600">
          <span className="flex items-center gap-1">
            <Maximize size={14} />
            {listing.area_m2} m²
          </span>
          <span className="flex items-center gap-1">
            <BedDouble size={14} />
            {listing.bedrooms}
          </span>
          <span className="flex items-center gap-1">
            <ShowerHead size={14} />
            {listing.bathrooms}
          </span>
          <span className="ml-auto rounded-full bg-neutral-100 px-2 py-0.5 capitalize">
            {listing.property_type}
          </span>
        </div>
      </div>
    </Link>
  );
}
