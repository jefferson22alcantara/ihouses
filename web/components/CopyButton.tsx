"use client";

import { useState } from "react";

export function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="w-full rounded-lg border border-brand/30 bg-brand/5 px-3 py-2 text-sm font-medium text-brand transition-colors hover:bg-brand/10"
    >
      {copied ? "Copied!" : "Copy AI motivation letter"}
    </button>
  );
}
