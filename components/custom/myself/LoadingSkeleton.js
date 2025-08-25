import React from "react";

export default function LoadingSkeleton() {
  return (
    <div className="w-full max-w-sm p-4 rounded-2xl shadow-md bg-[color:var(--background)] border border-[color:var(--border)] animate-pulse text-[color:var(--foreground)]">
      {/* Image placeholder */}
      <div className="h-40 w-full rounded-xl bg-[var(--border)] mb-4" />

      {/* Title line */}
      <div className="h-5 w-3/4 rounded bg-[var(--border)] mb-3" />

      {/* Subtitle line */}
      <div className="h-4 w-1/2 rounded bg-[var(--border)] mb-4" />

      {/* 3 small lines */}
      <div className="space-y-2">
        <div className="h-3 w-full rounded bg-[var(--border)]" />
        <div className="h-3 w-5/6 rounded bg-[var(--border)]" />
        <div className="h-3 w-2/3 rounded bg-[var(--border)]" />
      </div>

      {/* Button placeholder */}
      <div className="mt-5 h-10 w-24 rounded-lg bg-[var(--border)]" />
    </div>
  );
}
