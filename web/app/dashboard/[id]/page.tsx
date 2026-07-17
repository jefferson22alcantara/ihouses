import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  BedDouble,
  ChevronLeft,
  ExternalLink,
  Layers,
  MapPin,
  Maximize,
  ShowerHead,
  Sofa,
  Zap as EnergyIcon,
} from "lucide-react";
import { getListingById } from "@/lib/mock-listings";
import { EasyApplyButton } from "./EasyApplyButton";

export const dynamic = "force-dynamic";

export default async function ListingDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const listing = getListingById(id);

  if (!listing) {
    notFound();
  }

  const totalMonthly = listing.price + listing.service_costs;
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    `${listing.address}, ${listing.postal_code} ${listing.city}`,
  )}`;

  return (
    <div className="flex flex-col gap-6 pb-10">
      <Link
        href="/dashboard"
        className="flex w-fit items-center gap-1 text-sm text-neutral-500 hover:text-brand"
      >
        <ChevronLeft size={16} />
        Back to search
      </Link>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="flex flex-col gap-6 lg:col-span-2">
          <div className="grid grid-cols-4 grid-rows-2 gap-2 overflow-hidden rounded-xl">
            <div className="relative col-span-4 row-span-2 aspect-[16/10] sm:col-span-2 sm:row-span-2">
              <Image
                src={listing.images[0]}
                alt={listing.title}
                fill
                priority
                sizes="(min-width: 640px) 50vw, 100vw"
                className="object-cover"
              />
            </div>
            {listing.images.slice(1, 3).map((src, i) => (
              <div key={src} className="relative col-span-2 row-span-1 hidden aspect-[16/10] sm:block">
                <Image
                  src={src}
                  alt={`${listing.title} photo ${i + 2}`}
                  fill
                  sizes="25vw"
                  className="object-cover"
                />
              </div>
            ))}
          </div>

          <div>
            <span className="rounded-full bg-neutral-100 px-2 py-0.5 text-xs font-medium capitalize text-neutral-600">
              {listing.property_type}
            </span>
            <h1 className="mt-2 text-2xl font-bold text-neutral-900">
              {listing.title}
            </h1>
            <a
              href={mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-1 flex items-center gap-1 text-sm text-neutral-500 hover:text-brand"
            >
              <MapPin size={15} />
              {listing.address}, {listing.postal_code} {listing.city} (
              {listing.neighborhood})
            </a>
          </div>

          <div className="grid grid-cols-2 gap-4 rounded-xl border border-neutral-200 bg-white p-4 shadow-sm sm:grid-cols-3">
            <Fact icon={<Maximize size={18} />} label="Living area" value={`${listing.area_m2} m²`} />
            <Fact icon={<BedDouble size={18} />} label="Bedrooms" value={String(listing.bedrooms)} />
            <Fact icon={<ShowerHead size={18} />} label="Bathrooms" value={String(listing.bathrooms)} />
            <Fact icon={<Layers size={18} />} label="Floor" value={listing.floor} />
            <Fact icon={<Sofa size={18} />} label="Interior" value={listing.interior} />
            <Fact icon={<EnergyIcon size={18} />} label="Energy label" value={listing.energy_label} />
          </div>

          <div>
            <h2 className="text-lg font-semibold text-neutral-900">Description</h2>
            <p className="mt-2 text-sm leading-relaxed text-neutral-700">
              {listing.description}
            </p>
          </div>

          <div className="rounded-xl border border-neutral-200 bg-white p-4 text-sm shadow-sm">
            <h2 className="mb-3 text-sm font-semibold text-neutral-900">
              Availability &amp; costs
            </h2>
            <dl className="grid grid-cols-2 gap-y-2">
              <dt className="text-neutral-500">Available from</dt>
              <dd className="text-right text-neutral-800">
                {new Date(listing.available_from).toLocaleDateString("en-GB", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </dd>
              <dt className="text-neutral-500">Service costs</dt>
              <dd className="text-right text-neutral-800">
                €{listing.service_costs}/month
              </dd>
              <dt className="text-neutral-500">Deposit</dt>
              <dd className="text-right text-neutral-800">
                €{listing.deposit.toLocaleString("en-US")}
              </dd>
            </dl>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="sticky top-20 flex flex-col gap-4 rounded-xl border border-neutral-200 bg-white p-5 shadow-sm">
            <div>
              <p className="text-2xl font-bold text-neutral-900">
                €{listing.price.toLocaleString("en-US")}
                <span className="text-sm font-normal text-neutral-500">
                  /month
                </span>
              </p>
              <p className="text-xs text-neutral-500">
                €{totalMonthly.toLocaleString("en-US")}/month incl. service
                costs
              </p>
            </div>

            <EasyApplyButton listingId={listing.id} listingTitle={listing.title} />

            <a
              href={listing.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 rounded-lg border border-neutral-300 px-4 py-2 text-sm font-medium text-neutral-700 transition-colors hover:border-neutral-400"
            >
              <ExternalLink size={16} />
              View original on {listing.source}
            </a>

            <p className="text-center text-xs text-neutral-400">
              Easy Apply uses your{" "}
              <Link href="/profile" className="text-brand hover:underline">
                profile
              </Link>{" "}
              to generate a personalized Dutch motivation letter instantly.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Fact({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-brand">{icon}</span>
      <div>
        <p className="text-sm font-semibold text-neutral-900">{value}</p>
        <p className="text-xs text-neutral-500">{label}</p>
      </div>
    </div>
  );
}
