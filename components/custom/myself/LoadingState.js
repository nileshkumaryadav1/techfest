"use client";

export default function LoadingState({ text = "Loading..." }) {
  return (
    <div className="flex items-center gap-2 px-4 py-2 rounded-2xl backdrop-blur-md bg-white/10 border border-white/20 shadow-lg">
      <span className="animate-spin">⏳</span>
      <span className="text-cyan-400 font-medium">{text}</span>
    </div>
  );
}
