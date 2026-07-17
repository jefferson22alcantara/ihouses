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
      className="w-full rounded-lg border border-indigo-400/40 bg-indigo-500/10 px-3 py-2 text-sm font-medium text-indigo-300 transition-colors hover:bg-indigo-500/20"
    >
      {copied ? "Copied!" : "Copy AI motivation letter"}
    </button>
  );
}
