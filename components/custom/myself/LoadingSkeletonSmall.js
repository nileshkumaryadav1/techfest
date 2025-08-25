import React from "react";

export default function LoadingSkeletonSmall() {
  return (
    <div className="w-full max-w-sm p-4 border border-[color:var(--border)] rounded-xl shadow-sm ">
      <div className="animate-pulse flex space-x-4">
        {/* Avatar placeholder */}
        <div className="rounded-full bg-[color:var(--border)] h-12 w-12"></div>
        <div className="flex-1 space-y-3 py-1">
          {/* Name line */}
          <div className="h-4 bg-[color:var(--border)] rounded w-3/4"></div>
          {/* Smaller line */}
          <div className="h-3 bg-[color:var(--border)] rounded w-1/2"></div>
        </div>
      </div>
    </div>
  );
}
