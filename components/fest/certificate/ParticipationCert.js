// app/(route)/(techfest)/certificate/page.js
"use client";

import { useRef, useState, useEffect } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { CollegeData, FestData } from "@/data/FestData";
// import WinnerCertificatePage from "@/components/fest/WinnerCertificatePage";
// import FestIdCard from "@/components/fest/FestIdCard";

export default function ParticipationCertificatePage() {
  const [festId, setFestId] = useState("");
  const [certificateData, setCertificateData] = useState(null);
  const certRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  async function fetchCertificate() {
    try {
      const res = await fetch(`/api/certificate?festId=${festId.trim()}`);
      if (!res.ok) throw new Error("Invalid Fest ID");

      const data = await res.json();

      if (!data?.name || !data?.events || !data?.dateRange) {
        throw new Error("Incomplete certificate data");
      }

      setCertificateData(data);
    } catch (err) {
      alert(
        "Certificate not found or incomplete. Please enter a valid Fest ID."
      );
      setCertificateData(null);
    }
  }

  async function downloadPDF() {
    if (!certRef.current) {
      alert("Certificate not loaded.");
      return;
    }

    const canvas = await html2canvas(certRef.current, {
      scale: 2,
      useCORS: true,
      backgroundColor: "#ffffff",
    });

    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF({
      orientation: "landscape",
      unit: "mm",
      format: "a4",
    });

    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save(`Certificate_${certificateData?.name || "Participant"}.pdf`);
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        padding: "2rem",
        backgroundColor: "var(--background)",
        color: "var(--foreground)",
      }}
    >
      <h1
        style={{
          textAlign: "center",
          fontSize: "2rem",
          fontWeight: "bold",
          marginBottom: "2rem",
        }}
      >
        🎓
        Participation
        Certificate
      </h1>

      {/* Input Area */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "1rem",
          marginBottom: "2rem",
        }}
      >
        <input
          type="text"
          placeholder="Enter Fest ID"
          value={festId}
          onChange={(e) => setFestId(e.target.value.toLowerCase())}
          style={{
            padding: "0.5rem 1rem",
            width: "300px",
            border: "1px solid #ccc",
            borderRadius: "4px",
          }}
        />
        <button
          onClick={fetchCertificate}
          style={{
            backgroundColor: "var(--accent)",
            color: "white",
            padding: "0.5rem 1.2rem",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          Get Certificate
        </button>
      </div>

      {/* Certificate Preview (Desktop Only) */}
      {certificateData && (
        <>
          {!isMobile && (
            <div
              ref={certRef}
              style={{
                backgroundColor: "#fffdf7",
                color: "#1a1a1a",
                fontFamily: "'Times New Roman', serif",
                padding: "3rem",
                maxWidth: "850px",
                margin: "2rem auto",
                border: "8px solid #0f172a",
                borderRadius: "12px",
                boxShadow: "0 10px 25px rgba(0, 0, 0, 0.15)",
                boxSizing: "border-box",
              }}
            >
              {/* Header */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "1.5rem",
                }}
              >
                <img
                  src="/college/logo.png"
                  alt="College Logo"
                  style={{
                    width: "70px",
                    height: "70px",
                    objectFit: "contain",
                  }}
                />
                <div style={{ textAlign: "center", flex: 1 }}>
                  <h2
                    style={{ margin: 0, fontSize: "1.5rem", fontWeight: "700" }}
                  >
                    {CollegeData.name}
                  </h2>
                  <h3
                    style={{
                      margin: "0.3rem 0",
                      fontSize: "1.1rem",
                      color: "#64748b",
                    }}
                  >
                    Presents
                  </h3>
                  <h1
                    style={{
                      margin: 0,
                      fontSize: "1.8rem",
                      color: "var(--accent)",
                      fontWeight: "800",
                      letterSpacing: "1px",
                      textTransform: "uppercase",
                    }}
                  >
                    {FestData.name}
                  </h1>
                </div>
                <img
                  src="/logo.png"
                  alt="Fest Logo"
                  style={{
                    width: "70px",
                    height: "70px",
                    objectFit: "contain",
                  }}
                />
              </div>

              <hr
                style={{ margin: "1.8rem 0", borderTop: "2px dashed #ccc" }}
              />

              <h2
                style={{
                  textAlign: "center",
                  fontSize: "1.7rem",
                  fontWeight: "700",
                  textTransform: "uppercase",
                  letterSpacing: "1.5px",
                  color: "#0f172a",
                  marginBottom: "1rem",
                  textDecoration: "underline",
                  textDecorationColor: "#4ade80",
                }}
              >
                Certificate of Participation
              </h2>

              <h3
                style={{
                  textAlign: "center",
                  fontSize: "1.3rem",
                  fontWeight: "700",
                  marginBottom: "0.5rem",
                }}
              >
                {certificateData.name}
              </h3>
              <p
                style={{
                  textAlign: "center",
                  fontSize: "0.9rem",
                  color: "#555",
                  marginBottom: "1.5rem",
                }}
              >
                Fest ID: <strong>{festId}</strong>
              </p>

              <p
                style={{
                  fontSize: "1.05rem",
                  textAlign: "center",
                  lineHeight: "1.75",
                  marginBottom: "2rem",
                  color: "#1e293b",
                }}
              >
                This is to certify that <strong>{certificateData.name}</strong>{" "}
                has actively participated in the event(s):{" "}
                <strong>{certificateData.events}</strong> conducted during{" "}
                <strong>{FestData.name}</strong> held on{" "}
                <strong>{certificateData.dateRange}</strong>, organized by{" "}
                <strong>{CollegeData.name}</strong>.
              </p>

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginTop: "2.5rem",
                  alignItems: "flex-end",
                }}
              >
                <div>
                  <p style={{ fontSize: "0.75rem", color: "#6b7280" }}>
                    Certificate ID:
                  </p>
                  <p
                    style={{
                      fontSize: "0.95rem",
                      fontWeight: "600",
                      color: "var(--accent)",
                    }}
                  >
                    {certificateData.certId}
                  </p>
                </div>
                <div style={{ textAlign: "right" }}>
                  <p
                    style={{
                      fontSize: "1rem",
                      fontWeight: "700",
                      color: "#0f172a",
                    }}
                  >
                    Centre Fest Committee
                  </p>
                  <p style={{ fontSize: "0.8rem", color: "#4ade80" }}>
                    Authorized Signatory
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Download Button (Mobile & Desktop) */}
          <div style={{ textAlign: "center", marginTop: "1rem" }}>
            <button
              onClick={downloadPDF}
              disabled={!certificateData || isMobile}
              style={{
                backgroundColor: "var(--accent)",
                color: "white",
                padding: "0.6rem 1.25rem",
                border: "none",
                borderRadius: "4px",
                fontSize: "0.9rem",
                cursor:
                  !certificateData || isMobile ? "not-allowed" : "pointer",
                opacity: !certificateData || isMobile ? 0 : 1,
                transition: "opacity 0.3s ease",
              }}
            >
              Download PDF
            </button>
            <p className="mobile-only">
              Use Desktop Mode or Desktop to download your Participation &
              Winner Certificate
            </p>

            <style jsx>{`
              .mobile-only {
                display: none;
              }

              @media (max-width: 768px) {
                .mobile-only {
                  display: block;
                  font-size: 0.9rem;
                  color: #e63946;
                  text-align: center;
                  margin-top: 1rem;
                }
              }
            `}</style>
          </div>
        </>
      )}

      {/* Winner certificate download */}
      {/* <WinnerCertificatePage /> */}

      {/* Student Fest Id Card */}
      {/* <FestIdCard /> */}
    </div>
  );
}
