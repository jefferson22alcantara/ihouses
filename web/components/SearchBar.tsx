import Form from "next/form";
import { Search } from "lucide-react";

const fieldClass =
  "w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand";

export function SearchBar({
  defaultValues,
}: {
  defaultValues: {
    city?: string;
    property_type?: string;
    max_budget?: string;
    min_bedrooms?: string;
  };
}) {
  return (
    <Form
      action="/dashboard"
      className="flex flex-col gap-3 rounded-xl border border-neutral-200 bg-white p-4 shadow-sm sm:flex-row sm:items-end"
    >
      <div className="flex-1">
        <label htmlFor="city" className="mb-1 block text-xs font-medium text-neutral-500">
          City
        </label>
        <input
          id="city"
          name="city"
          type="text"
          placeholder="Amsterdam, Utrecht, Rotterdam…"
          defaultValue={defaultValues.city}
          className={fieldClass}
        />
      </div>

      <div className="sm:w-40">
        <label
          htmlFor="property_type"
          className="mb-1 block text-xs font-medium text-neutral-500"
        >
          Type
        </label>
        <select
          id="property_type"
          name="property_type"
          defaultValue={defaultValues.property_type ?? ""}
          className={fieldClass}
        >
          <option value="">Any</option>
          <option value="apartment">Apartment</option>
          <option value="studio">Studio</option>
          <option value="room">Room</option>
          <option value="house">House</option>
        </select>
      </div>

      <div className="sm:w-36">
        <label
          htmlFor="max_budget"
          className="mb-1 block text-xs font-medium text-neutral-500"
        >
          Max €/month
        </label>
        <input
          id="max_budget"
          name="max_budget"
          type="number"
          min="0"
          step="50"
          placeholder="2000"
          defaultValue={defaultValues.max_budget}
          className={fieldClass}
        />
      </div>

      <div className="sm:w-32">
        <label
          htmlFor="min_bedrooms"
          className="mb-1 block text-xs font-medium text-neutral-500"
        >
          Bedrooms
        </label>
        <select
          id="min_bedrooms"
          name="min_bedrooms"
          defaultValue={defaultValues.min_bedrooms ?? ""}
          className={fieldClass}
        >
          <option value="">Any</option>
          <option value="1">1+</option>
          <option value="2">2+</option>
          <option value="3">3+</option>
          <option value="4">4+</option>
        </select>
      </div>

      <button
        type="submit"
        className="flex items-center justify-center gap-2 rounded-lg bg-brand px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-brand-dark"
      >
        <Search size={16} />
        Search
      </button>
    </Form>
  );
}
