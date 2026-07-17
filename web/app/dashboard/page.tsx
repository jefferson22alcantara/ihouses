import { SearchBar } from "@/components/SearchBar";
import { PropertyCard } from "@/components/PropertyCard";
import { MOCK_LISTINGS, filterListings } from "@/lib/mock-listings";

export const dynamic = "force-dynamic";

type SearchParams = Promise<{
  city?: string;
  property_type?: string;
  max_budget?: string;
  min_bedrooms?: string;
}>;

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;

  const listings = filterListings(MOCK_LISTINGS, {
    city: params.city,
    property_type: params.property_type,
    max_budget: params.max_budget ? Number(params.max_budget) : undefined,
    min_bedrooms: params.min_bedrooms ? Number(params.min_bedrooms) : undefined,
  });

  return (
    <div className="flex flex-col gap-6 pb-10">
      <div>
        <h1 className="text-xl font-semibold text-neutral-900">
          Find your next home in the Netherlands
        </h1>
        <p className="mt-1 text-sm text-neutral-500">
          Listings aggregated from Pararius, Funda and Kamernet. Save your
          criteria on your{" "}
          <a href="/profile" className="text-brand hover:underline">
            profile
          </a>{" "}
          to get instant Telegram alerts.
        </p>
      </div>

      <SearchBar
        defaultValues={{
          city: params.city,
          property_type: params.property_type,
          max_budget: params.max_budget,
          min_bedrooms: params.min_bedrooms,
        }}
      />

      <p className="text-sm text-neutral-500">
        {listings.length} {listings.length === 1 ? "property" : "properties"}{" "}
        found
      </p>

      {listings.length === 0 ? (
        <p className="rounded-xl border border-neutral-200 bg-white p-6 text-center text-sm text-neutral-500 shadow-sm">
          No listings match your search. Try widening your filters.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {listings.map((listing) => (
            <PropertyCard key={listing.id} listing={listing} />
          ))}
        </div>
      )}
    </div>
  );
}
