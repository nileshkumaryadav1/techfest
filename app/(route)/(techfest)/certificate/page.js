"use client";

import { useRef, useState, useEffect } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { CollegeData, FestData } from "@/data/FestData";

export default function CertificatePage() {
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
        🎓 Download Your{" "}
        <span style={{ color: "var(--accent)" }}>{FestData.name}</span>{" "}
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
                backgroundColor: "#f4ebebff",
                color: "#1a1a1a",
                fontFamily: "Georgia, serif",
                padding: "2rem",
                maxWidth: "750px",
                margin: "1rem auto",
                border: "6px double #aaa",
                borderRadius: "8px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                boxSizing: "border-box",
              }}
            >
              {/* Header */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <img
                  src="/college/logo.png"
                  alt="College Logo"
                  style={{
                    width: "60px",
                    height: "60px",
                    objectFit: "contain",
                  }}
                />
                <div style={{ textAlign: "center", flex: 1 }}>
                  <h2
                    style={{
                      margin: 0,
                      fontSize: "1.3rem",
                      fontWeight: "bold",
                    }}
                  >
                    {CollegeData.name}
                  </h2>
                  <h3
                    style={{
                      margin: "0.25rem 0",
                      fontSize: "1.1rem",
                      color: "#555",
                    }}
                  >
                    Presents
                  </h3>
                  <h1
                    style={{
                      margin: 0,
                      fontSize: "1.6rem",
                      color: "var(--accent)",
                      fontWeight: "bold",
                      letterSpacing: "1px",
                    }}
                  >
                    {FestData.name}
                  </h1>
                </div>
                <img
                  src="/logo.png"
                  alt="Fest Logo"
                  style={{
                    width: "60px",
                    height: "60px",
                    objectFit: "contain",
                  }}
                />
              </div>

              <hr style={{ margin: "1.5rem 0", borderTop: "2px solid #ccc" }} />

              <h2
                style={{
                  textAlign: "center",
                  fontSize: "1.4rem",
                  fontWeight: "bold",
                  textTransform: "uppercase",
                  letterSpacing: "1px",
                  textDecoration: "underline",
                  textDecorationColor: "#4ade80",
                  marginBottom: "1rem",
                }}
              >
                Certificate of Participation
              </h2>

              <h3
                style={{
                  textAlign: "center",
                  fontSize: "1.2rem",
                  fontWeight: "bold",
                  marginBottom: "0.25rem",
                }}
              >
                {certificateData.name}
              </h3>
              <p
                style={{
                  textAlign: "center",
                  fontSize: "0.8rem",
                  color: "#444",
                  marginBottom: "1rem",
                }}
              >
                Fest ID: <strong>{festId}</strong>
              </p>

              <p
                style={{
                  fontSize: "1rem",
                  textAlign: "center",
                  lineHeight: "1.6",
                  marginBottom: "1.5rem",
                }}
              >
                This is to certify that <strong>{certificateData.name}</strong>{" "}
                has actively participated in the event(s):{" "}
                <strong>{certificateData.events}</strong> conducted during the{" "}
                <strong>TechFest 2026</strong> held on{" "}
                <strong>{certificateData.dateRange}</strong> organized by{" "}
                <strong>{CollegeData.name}</strong>.
              </p>

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginTop: "2rem",
                }}
              >
                <div>
                  <p style={{ fontSize: "0.7rem", color: "#666" }}>
                    Certificate ID:
                  </p>
                  <p
                    style={{
                      fontSize: "0.85rem",
                      fontWeight: "bold",
                      color: "var(--accent)",
                    }}
                  >
                    {certificateData.certId}
                  </p>
                </div>
                <div style={{ textAlign: "right" }}>
                  <p style={{ fontSize: "0.9rem", fontWeight: "bold" }}>
                    Centre Fest Committee
                  </p>
                  <p style={{ fontSize: "0.7rem", color: "#4ade80" }}>
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
              Use Desktop to download your Participation & Winner Certificate
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
    </div>
  );
}
