import { prisma } from "@/lib/prisma";
import { DEMO_USER_ID } from "@/lib/constants";
import { CopyButton } from "@/components/CopyButton";

export const dynamic = "force-dynamic";

export default async function AlertsPage() {
  const alerts = await prisma.alerts_history.findMany({
    where: { user_id: DEMO_USER_ID },
    orderBy: { created_at: "desc" },
  });

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-6 pb-10">
      <div>
        <h1 className="text-xl font-semibold text-neutral-900">Alert history</h1>
        <p className="mt-1 text-sm text-neutral-500">
          Listings matched to your filters, with a ready-to-send motivation letter.
        </p>
      </div>

      {alerts.length === 0 ? (
        <p className="rounded-xl border border-neutral-200 bg-white p-4 text-sm text-neutral-500 shadow-sm">
          No matches yet. Once a listing matches your filters, it will show up here.
        </p>
      ) : (
        <ul className="flex flex-col gap-4">
          {alerts.map((alert) => (
            <li
              key={alert.id}
              className="flex flex-col gap-3 rounded-xl border border-neutral-200 bg-white p-4 shadow-sm"
            >
              <div className="flex items-start justify-between gap-2">
                <h2 className="font-medium text-neutral-900">{alert.listing_title}</h2>
                <span className="shrink-0 rounded-full bg-neutral-100 px-2 py-0.5 text-xs text-neutral-500">
                  {alert.listing_source}
                </span>
              </div>

              <div className="flex items-center justify-between text-sm text-neutral-500">
                <span>
                  {alert.listing_price ? `€${Number(alert.listing_price).toFixed(0)}/mo` : "Price unknown"}
                </span>
                <span>{alert.created_at.toLocaleString()}</span>
              </div>

              <a
                href={alert.listing_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-medium text-brand hover:text-brand-dark"
              >
                View listing →
              </a>

              {alert.motivation_letter && <CopyButton text={alert.motivation_letter} />}

              {!alert.sent_to_telegram && (
                <p className="text-xs text-amber-600">
                  Telegram alert not sent — configure a chat ID in your profile.
                </p>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
