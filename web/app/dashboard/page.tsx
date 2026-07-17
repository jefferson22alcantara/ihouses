import { prisma } from "@/lib/prisma";
import { DEMO_USER_ID } from "@/lib/constants";
import { SubmitButton } from "@/components/SubmitButton";
import { saveProfileAndFilters } from "./actions";

export const dynamic = "force-dynamic";

const inputClass =
  "w-full rounded-lg border border-white/10 bg-slate-900 px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:border-indigo-400 focus:outline-none";
const labelClass = "mb-1 block text-xs font-medium text-slate-400";

export default async function DashboardPage() {
  const [user, profile, filter] = await Promise.all([
    prisma.users.findUnique({ where: { id: DEMO_USER_ID } }),
    prisma.user_profiles.findUnique({ where: { user_id: DEMO_USER_ID } }),
    prisma.search_filters.findFirst({
      where: { user_id: DEMO_USER_ID },
      orderBy: { created_at: "asc" },
    }),
  ]);

  return (
    <div className="flex flex-col gap-8 pb-10">
      <div>
        <h1 className="text-xl font-semibold text-white">Your profile</h1>
        <p className="mt-1 text-sm text-slate-400">
          Used to personalize your AI-generated motivation letters.
        </p>
      </div>

      <form action={saveProfileAndFilters} className="flex flex-col gap-6">
        <section className="flex flex-col gap-4 rounded-xl border border-white/10 bg-slate-900/40 p-4">
          <div>
            <label className={labelClass} htmlFor="profession">
              Profession
            </label>
            <input
              id="profession"
              name="profession"
              type="text"
              placeholder="Software Engineer"
              defaultValue={profile?.profession ?? ""}
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass} htmlFor="income_monthly">
              Monthly net income (€)
            </label>
            <input
              id="income_monthly"
              name="income_monthly"
              type="number"
              min="0"
              step="50"
              placeholder="3200"
              defaultValue={profile?.income_monthly?.toString() ?? ""}
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass} htmlFor="lifestyle">
              Lifestyle
            </label>
            <textarea
              id="lifestyle"
              name="lifestyle"
              rows={2}
              placeholder="Non-smoker, quiet, works from home"
              defaultValue={profile?.lifestyle ?? ""}
              className={inputClass}
            />
          </div>

          <label className="flex items-center gap-2 text-sm text-slate-300">
            <input
              type="checkbox"
              name="has_pets"
              defaultChecked={profile?.has_pets ?? false}
              className="h-4 w-4 rounded border-white/20 bg-slate-900 accent-indigo-500"
            />
            I have a pet
          </label>

          <div>
            <label className={labelClass} htmlFor="telegram_chat_id">
              Telegram chat ID
            </label>
            <input
              id="telegram_chat_id"
              name="telegram_chat_id"
              type="text"
              placeholder="123456789"
              defaultValue={user?.telegram_chat_id ?? ""}
              className={inputClass}
            />
            <p className="mt-1 text-xs text-slate-500">
              Message @userinfobot on Telegram to find your chat ID.
            </p>
          </div>
        </section>

        <div>
          <h2 className="text-lg font-semibold text-white">Search filters</h2>
          <p className="mt-1 text-sm text-slate-400">
            We&apos;ll alert you when a matching listing appears.
          </p>
        </div>

        <section className="flex flex-col gap-4 rounded-xl border border-white/10 bg-slate-900/40 p-4">
          <div>
            <label className={labelClass} htmlFor="city">
              City
            </label>
            <input
              id="city"
              name="city"
              type="text"
              required
              placeholder="Amsterdam"
              defaultValue={filter?.city ?? ""}
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass} htmlFor="max_budget">
              Max budget (€/month)
            </label>
            <input
              id="max_budget"
              name="max_budget"
              type="number"
              min="0"
              step="50"
              required
              placeholder="1800"
              defaultValue={filter?.max_budget?.toString() ?? ""}
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass} htmlFor="radius_km">
              Radius (km)
            </label>
            <input
              id="radius_km"
              name="radius_km"
              type="number"
              min="1"
              max="100"
              defaultValue={filter?.radius_km?.toString() ?? "10"}
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass} htmlFor="property_type">
              Property type
            </label>
            <select
              id="property_type"
              name="property_type"
              defaultValue={filter?.property_type ?? "apartment"}
              className={inputClass}
            >
              <option value="apartment">Apartment</option>
              <option value="studio">Studio</option>
              <option value="room">Room</option>
              <option value="house">House</option>
            </select>
          </div>
        </section>

        <SubmitButton>Save profile &amp; filters</SubmitButton>
      </form>
    </div>
  );
}
