"use client";

import { useState } from "react";
import { CheckCircle2, Copy, Loader2, X, Zap } from "lucide-react";
import { applyToListing } from "./actions";

type Status = "idle" | "loading" | "success" | "error";

export function EasyApplyButton({
  listingId,
  listingTitle,
}: {
  listingId: string;
  listingTitle: string;
}) {
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState<Status>("idle");
  const [letter, setLetter] = useState("");
  const [copied, setCopied] = useState(false);

  async function handleApply() {
    setOpen(true);
    setStatus("loading");
    try {
      const result = await applyToListing(listingId);
      setLetter(result.letter);
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  async function handleCopy() {
    await navigator.clipboard.writeText(letter);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function handleClose() {
    setOpen(false);
    setStatus("idle");
    setCopied(false);
  }

  return (
    <>
      <button
        type="button"
        onClick={handleApply}
        className="flex w-full items-center justify-center gap-2 rounded-lg bg-brand px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-dark"
      >
        <Zap size={18} fill="currentColor" />
        Easy Apply
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="flex max-h-[85vh] w-full max-w-lg flex-col overflow-hidden rounded-xl bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-neutral-200 px-5 py-4">
              <div className="flex items-center gap-2">
                <Zap size={18} className="text-brand" fill="currentColor" />
                <h2 className="text-sm font-semibold text-neutral-900">
                  Easy Apply
                </h2>
              </div>
              <button
                type="button"
                onClick={handleClose}
                aria-label="Close"
                className="text-neutral-400 hover:text-neutral-700"
              >
                <X size={18} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-5">
              {status === "loading" && (
                <div className="flex flex-col items-center gap-3 py-10 text-center">
                  <Loader2 size={28} className="animate-spin text-brand" />
                  <p className="text-sm text-neutral-600">
                    Generating your personalized Dutch motivation letter
                    for &ldquo;{listingTitle}&rdquo;…
                  </p>
                </div>
              )}

              {status === "error" && (
                <div className="flex flex-col items-center gap-3 py-10 text-center">
                  <p className="text-sm text-red-600">
                    Something went wrong generating your letter. Please try
                    again.
                  </p>
                  <button
                    type="button"
                    onClick={handleApply}
                    className="rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white hover:bg-brand-dark"
                  >
                    Retry
                  </button>
                </div>
              )}

              {status === "success" && (
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-2 rounded-lg bg-green-50 px-3 py-2 text-sm font-medium text-green-700">
                    <CheckCircle2 size={16} />
                    Your application is ready to send
                  </div>

                  <p className="text-xs text-neutral-500">
                    We generated this motivation letter from your profile.
                    Review it, then copy it to send to the landlord — it has
                    also been saved to your{" "}
                    <a href="/alerts" className="text-brand hover:underline">
                      alert history
                    </a>
                    .
                  </p>

                  <pre className="max-h-64 overflow-y-auto whitespace-pre-wrap rounded-lg border border-neutral-200 bg-neutral-50 p-3 text-sm text-neutral-800">
                    {letter}
                  </pre>

                  <button
                    type="button"
                    onClick={handleCopy}
                    className="flex items-center justify-center gap-2 rounded-lg border border-brand/30 bg-brand/5 px-3 py-2 text-sm font-medium text-brand transition-colors hover:bg-brand/10"
                  >
                    <Copy size={16} />
                    {copied ? "Copied!" : "Copy motivation letter"}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
