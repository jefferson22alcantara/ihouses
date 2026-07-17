// Placeholder listings used to design the property-browsing dashboard before
// the scraper pipeline persists real listings (with photos, area, bedrooms,
// etc.) to the database. Replace with a real `listings` query once that
// table exists.
export type PropertyType = "apartment" | "studio" | "room" | "house";

export type EnergyLabel = "A" | "B" | "C" | "D";

export type MockListing = {
  id: string;
  title: string;
  price: number;
  service_costs: number;
  deposit: number;
  city: string;
  neighborhood: string;
  address: string;
  postal_code: string;
  area_m2: number;
  bedrooms: number;
  bathrooms: number;
  floor: string;
  interior: "Furnished" | "Upholstered" | "Shell";
  furnished: boolean;
  property_type: PropertyType;
  energy_label: EnergyLabel;
  available_from: string;
  description: string;
  source: "Pararius" | "Funda" | "Kamernet";
  url: string;
  image: string;
  images: string[];
};

const PHOTO_POOL = [
  "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1449844908441-8829872d2607?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1560185127-6ed189bf02f4?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1554995207-c18c203602cb?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1502005229762-cf1b2da7c5d6?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=1200&q=80",
];

function gallery(mainIndex: number, ...altIndexes: number[]): {
  image: string;
  images: string[];
} {
  return {
    image: PHOTO_POOL[mainIndex],
    images: [mainIndex, ...altIndexes].map((i) => PHOTO_POOL[i]),
  };
}

export const MOCK_LISTINGS: MockListing[] = [
  {
    id: "1",
    title: "Bright canal-side apartment",
    price: 1850,
    service_costs: 85,
    deposit: 3700,
    city: "Amsterdam",
    neighborhood: "Jordaan",
    address: "Prinsengracht 210",
    postal_code: "1016 HZ",
    area_m2: 62,
    bedrooms: 2,
    bathrooms: 1,
    floor: "2nd floor",
    interior: "Upholstered",
    furnished: true,
    property_type: "apartment",
    energy_label: "B",
    available_from: "2026-08-01",
    description:
      "Recently renovated canal-side apartment in the heart of the Jordaan, featuring a bright living room with large windows overlooking Prinsengracht, an open kitchen, and a small balcony. Walking distance to Westerpark and Centraal Station.",
    source: "Pararius",
    url: "https://www.pararius.com/apartment-for-rent/amsterdam",
    ...gallery(0, 4, 6),
  },
  {
    id: "2",
    title: "Modern studio near Central Station",
    price: 1250,
    service_costs: 60,
    deposit: 2500,
    city: "Amsterdam",
    neighborhood: "Centrum",
    address: "Damrak 45",
    postal_code: "1012 LK",
    area_m2: 34,
    bedrooms: 1,
    bathrooms: 1,
    floor: "3rd floor",
    interior: "Furnished",
    furnished: true,
    property_type: "studio",
    energy_label: "A",
    available_from: "2026-07-25",
    description:
      "Compact, fully furnished studio two minutes from Amsterdam Centraal. Ideal for a student or young professional — includes a kitchenette, private bathroom, and fast fiber internet.",
    source: "Kamernet",
    url: "https://kamernet.nl/en/for-rent/studios-amsterdam",
    ...gallery(1, 5, 8),
  },
  {
    id: "3",
    title: "Spacious family house with garden",
    price: 2650,
    service_costs: 0,
    deposit: 5300,
    city: "Utrecht",
    neighborhood: "Oudwijk",
    address: "Burgemeester Reigerstraat 88",
    postal_code: "3581 KT",
    area_m2: 140,
    bedrooms: 4,
    bathrooms: 2,
    floor: "Ground floor + 1",
    interior: "Shell",
    furnished: false,
    property_type: "house",
    energy_label: "C",
    available_from: "2026-09-01",
    description:
      "Spacious family home with a south-facing garden, close to Utrecht Science Park. Four bedrooms, two bathrooms, and a private driveway. Unfurnished, ready for your own interior.",
    source: "Funda",
    url: "https://www.funda.nl/en/huur/utrecht",
    ...gallery(2, 6, 9),
  },
  {
    id: "4",
    title: "Cozy room in shared student house",
    price: 650,
    service_costs: 45,
    deposit: 1300,
    city: "Rotterdam",
    neighborhood: "Kralingen",
    address: "Oudedijk 12",
    postal_code: "3062 AC",
    area_m2: 18,
    bedrooms: 1,
    bathrooms: 1,
    floor: "1st floor",
    interior: "Furnished",
    furnished: true,
    property_type: "room",
    energy_label: "B",
    available_from: "2026-08-15",
    description:
      "Furnished room in a friendly shared house with four other students, five minutes from Erasmus University by bike. Shared kitchen and living room, private lock on the door.",
    source: "Kamernet",
    url: "https://kamernet.nl/en/for-rent/rooms-rotterdam",
    ...gallery(3, 7, 1),
  },
  {
    id: "5",
    title: "Newly renovated apartment near Vondelpark",
    price: 2100,
    service_costs: 95,
    deposit: 4200,
    city: "Amsterdam",
    neighborhood: "Oud-Zuid",
    address: "Van Baerlestraat 33",
    postal_code: "1071 AP",
    area_m2: 75,
    bedrooms: 2,
    bathrooms: 1,
    floor: "1st floor",
    interior: "Shell",
    furnished: false,
    property_type: "apartment",
    energy_label: "B",
    available_from: "2026-08-10",
    description:
      "Newly renovated apartment one block from Vondelpark, with high ceilings, herringbone floors, and a modern kitchen. Unfurnished, available for long-term rental.",
    source: "Pararius",
    url: "https://www.pararius.com/apartment-for-rent/amsterdam",
    ...gallery(4, 0, 12),
  },
  {
    id: "6",
    title: "Compact studio with canal view",
    price: 1400,
    service_costs: 55,
    deposit: 2800,
    city: "Utrecht",
    neighborhood: "Binnenstad",
    address: "Nieuwegracht 5",
    postal_code: "3512 LC",
    area_m2: 40,
    bedrooms: 1,
    bathrooms: 1,
    floor: "2nd floor",
    interior: "Upholstered",
    furnished: true,
    property_type: "studio",
    energy_label: "C",
    available_from: "2026-07-30",
    description:
      "Charming studio overlooking the Nieuwegracht canal, in the heart of Utrecht's historic center. Compact but efficient layout with a Juliet balcony.",
    source: "Funda",
    url: "https://www.funda.nl/en/huur/utrecht",
    ...gallery(6, 5, 2),
  },
  {
    id: "7",
    title: "Family townhouse near the beach",
    price: 2300,
    service_costs: 0,
    deposit: 4600,
    city: "Den Haag",
    neighborhood: "Scheveningen",
    address: "Keizerstraat 76",
    postal_code: "2584 BB",
    area_m2: 110,
    bedrooms: 3,
    bathrooms: 2,
    floor: "Ground floor + 2",
    interior: "Shell",
    furnished: false,
    property_type: "house",
    energy_label: "C",
    available_from: "2026-09-15",
    description:
      "Family townhouse a ten-minute walk from Scheveningen beach, with a private rear garden and garage. Three bedrooms and two bathrooms spread across three floors.",
    source: "Funda",
    url: "https://www.funda.nl/en/huur/den-haag",
    ...gallery(6, 11, 3),
  },
  {
    id: "8",
    title: "Sunny room close to TU Eindhoven",
    price: 575,
    service_costs: 40,
    deposit: 1150,
    city: "Eindhoven",
    neighborhood: "Strijp",
    address: "Torenallee 20",
    postal_code: "5617 BC",
    area_m2: 16,
    bedrooms: 1,
    bathrooms: 1,
    floor: "3rd floor",
    interior: "Furnished",
    furnished: true,
    property_type: "room",
    energy_label: "A",
    available_from: "2026-08-01",
    description:
      "Sunny room in the creative Strijp-S district, a five-minute cycle from TU Eindhoven. Shared kitchen and rooftop terrace with other international students.",
    source: "Kamernet",
    url: "https://kamernet.nl/en/for-rent/rooms-eindhoven",
    ...gallery(7, 3, 4),
  },
  {
    id: "9",
    title: "Elegant apartment in a historic building",
    price: 1950,
    service_costs: 75,
    deposit: 3900,
    city: "Rotterdam",
    neighborhood: "Kralingen-Crooswijk",
    address: "Honingerdijk 61",
    postal_code: "3062 NR",
    area_m2: 68,
    bedrooms: 2,
    bathrooms: 1,
    floor: "1st floor",
    interior: "Upholstered",
    furnished: true,
    property_type: "apartment",
    energy_label: "B",
    available_from: "2026-08-20",
    description:
      "Elegant apartment in a beautifully maintained historic building overlooking Kralingse Bos. High ceilings, original details, and a fully equipped kitchen.",
    source: "Pararius",
    url: "https://www.pararius.com/apartment-for-rent/rotterdam",
    ...gallery(8, 4, 0),
  },
  {
    id: "10",
    title: "Loft-style apartment near the university",
    price: 1550,
    service_costs: 65,
    deposit: 3100,
    city: "Groningen",
    neighborhood: "Binnenstad",
    address: "Grote Markt 4",
    postal_code: "9712 HN",
    area_m2: 55,
    bedrooms: 1,
    bathrooms: 1,
    floor: "4th floor",
    interior: "Furnished",
    furnished: true,
    property_type: "apartment",
    energy_label: "B",
    available_from: "2026-07-28",
    description:
      "Loft-style apartment right on Grote Markt, in the middle of Groningen's student life. Exposed brick walls, high ceilings, and a small home office nook.",
    source: "Kamernet",
    url: "https://kamernet.nl/en/for-rent/apartments-groningen",
    ...gallery(9, 8, 12),
  },
  {
    id: "11",
    title: "Detached house with private garden",
    price: 2900,
    service_costs: 0,
    deposit: 5800,
    city: "Utrecht",
    neighborhood: "Tuindorp",
    address: "Amaliadwarsstraat 9",
    postal_code: "3571 CH",
    area_m2: 155,
    bedrooms: 4,
    bathrooms: 2,
    floor: "Ground floor + 1",
    interior: "Shell",
    furnished: false,
    property_type: "house",
    energy_label: "D",
    available_from: "2026-10-01",
    description:
      "Detached family house in the quiet, leafy Tuindorp neighborhood, with a large private garden, garage, and four spacious bedrooms. Close to good schools.",
    source: "Funda",
    url: "https://www.funda.nl/en/huur/utrecht",
    ...gallery(10, 2, 6),
  },
  {
    id: "12",
    title: "Bright studio in a renovated warehouse",
    price: 1300,
    service_costs: 50,
    deposit: 2600,
    city: "Amsterdam",
    neighborhood: "Noord",
    address: "NDSM-plein 3",
    postal_code: "1033 WB",
    area_m2: 38,
    bedrooms: 1,
    bathrooms: 1,
    floor: "5th floor",
    interior: "Upholstered",
    furnished: true,
    property_type: "studio",
    energy_label: "A",
    available_from: "2026-08-05",
    description:
      "Bright studio in a converted warehouse on the NDSM wharf, a five-minute free ferry ride from Centraal Station. Industrial finishes, floor-to-ceiling windows.",
    source: "Pararius",
    url: "https://www.pararius.com/apartment-for-rent/amsterdam",
    ...gallery(11, 1, 13),
  },
];

export function getListingById(id: string): MockListing | undefined {
  return MOCK_LISTINGS.find((listing) => listing.id === id);
}

export type ListingFilters = {
  city?: string;
  property_type?: string;
  max_budget?: number;
  min_bedrooms?: number;
};

export function filterListings(
  listings: MockListing[],
  filters: ListingFilters,
): MockListing[] {
  return listings.filter((listing) => {
    if (
      filters.city &&
      !listing.city.toLowerCase().includes(filters.city.toLowerCase())
    ) {
      return false;
    }
    if (
      filters.property_type &&
      listing.property_type !== filters.property_type
    ) {
      return false;
    }
    if (filters.max_budget && listing.price > filters.max_budget) {
      return false;
    }
    if (filters.min_bedrooms && listing.bedrooms < filters.min_bedrooms) {
      return false;
    }
    return true;
  });
}
