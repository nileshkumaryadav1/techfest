"use client";

import { useRouter } from "next/navigation";
import { Trophy } from "lucide-react";
import { useState, useEffect } from "react";

export default function FloatingWinnersButton() {
  const router = useRouter();

  const fullText = "See Winners";

  // States
  const [displayedText, setDisplayedText] = useState("");
  const [index, setIndex] = useState(0);
  const [deleting, setDeleting] = useState(false);
  const [collapsed, setCollapsed] = useState(true); // collapsed to icon-only
  const [pause, setPause] = useState(false);

  useEffect(() => {
    // Initial collapsed pause
    const initialTimeout = setTimeout(() => {
      setCollapsed(false); // expand to start typing
    }, 5000); // 5 sec

    return () => clearTimeout(initialTimeout);
  }, []);

  useEffect(() => {
    if (collapsed || pause) return;

    const timeout = setTimeout(() => {
      if (!deleting) {
        setDisplayedText(fullText.slice(0, index + 1));
        setIndex(index + 1);

        // Pause after typing complete
        if (index + 1 === fullText.length) {
          setPause(true);
          setTimeout(() => {
            setDeleting(true);
            setPause(false);
          }, 3000); // 3 sec pause
        }
      } else {
        setDisplayedText(fullText.slice(0, index - 1));
        setIndex(index - 1);

        // After deleting completely, collapse again for 5 minutes
        if (index - 1 === 0) {
          setPause(true);
          setTimeout(() => {
            setDeleting(false);
            setCollapsed(true);
            setDisplayedText("");
            setPause(false);

            // Automatically expand again after 30 seconds
            setTimeout(() => setCollapsed(false), 30000); // 30 sec
          }, 500); // short pause before collapsing
        }
      }
    }, 150);

    return () => clearTimeout(timeout);
  }, [index, deleting, pause, collapsed]);

  return (
    <button
      onClick={() => router.push("/hof")}
      style={{
        position: "fixed",
        bottom: "120px",
        right: "10px",
        display: "flex",
        alignItems: "center",
        gap: "8px",
        padding: collapsed ? "10px" : "10px 15px",
        borderRadius: "50px",
        backgroundColor: "#ffc71fff",
        color: "#000",
        fontWeight: "bold",
        boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
        border: "none",
        cursor: "pointer",
        zIndex: 1000,
        width: collapsed ? "50px" : "auto",
        justifyContent: "center",
        transition: "all 0.3s ease",
        animation: "blink 1s infinite",
      }}
      onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.1)")}
      onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
    >
      <Trophy size={20} />
      {!collapsed && <span style={{ fontSize: "14px" }}>{displayedText}</span>}

      <style jsx>{`
        @keyframes blink {
          0% { opacity: 1; }
          50% { opacity: 0.6; }
          100% { opacity: 1; }
        }
      `}</style>
    </button>
  );
}
