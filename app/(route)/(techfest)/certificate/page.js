"use client";

import { useRef, useState } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export default function CertificatePage() {
  const [festId, setFestId] = useState("");
  const [certificateData, setCertificateData] = useState(null);
  const certRef = useRef(null);

  async function fetchCertificate() {
    try {
      const res = await fetch(`/api/certificate?festId=${festId.trim()}`);
      if (!res.ok) throw new Error("Invalid Fest ID");
      const data = await res.json();
      setCertificateData(data);
    } catch (err) {
      alert("Certificate not found. Please enter a valid Fest ID.");
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
    <div style={{ minHeight: "100vh", padding: "2rem", backgroundColor: "#ffffff", color: "#000000" }}>
      <h1 style={{ textAlign: "center", fontSize: "2rem", fontWeight: "bold", marginBottom: "2rem" }}>
        🎓 Download Your Certificate
      </h1>

      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1rem", marginBottom: "2rem" }}>
        <input
          type="text"
          placeholder="Enter Fest ID"
          value={festId}
          onChange={(e) => setFestId(e.target.value)}
          style={{ padding: "0.5rem 1rem", width: "300px", border: "1px solid #ccc", borderRadius: "4px" }}
        />
        <button
          onClick={fetchCertificate}
          style={{
            backgroundColor: "#4CAF50",
            color: "white",
            padding: "0.5rem 1.2rem",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Get Certificate
        </button>
      </div>

      {certificateData && (
        <>
          <div
            ref={certRef}
            style={{
              backgroundColor: "#ffffff",
              color: "#000000",
              padding: "2rem",
              width: "800px",
              margin: "2rem auto",
              border: "1px solid #ddd",
              borderRadius: "6px",
            }}
          >
            <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
              <h2 style={{ fontSize: "1.8rem", fontWeight: "bold" }}>Certificate of Participation</h2>
              <p style={{ fontSize: "0.9rem", color: "#555" }}>
                Presented by {certificateData.festName}
              </p>
            </div>

            <h3 style={{ textAlign: "center", fontSize: "1.4rem", fontWeight: "bold", marginBottom: "0.5rem" }}>
              {certificateData.name}
            </h3>

            <p style={{ textAlign: "center", fontSize: "1rem", color: "#333", padding: "0 1rem" }}>
              has successfully participated in the event{" "}
              <strong>{certificateData.eventName}</strong> held on{" "}
              <strong>{certificateData.date}</strong>.
            </p>

            <div style={{ marginTop: "2rem", display: "flex", justifyContent: "space-between", fontSize: "0.9rem", borderTop: "1px solid #eee", paddingTop: "1rem" }}>
              <p>
                Certificate ID: <span style={{ fontFamily: "monospace" }}>{certificateData.certId}</span>
              </p>
              <div style={{ textAlign: "right" }}>
                <p>Centre Fest Committee</p>
                <p style={{ fontSize: "0.75rem", marginTop: "0.25rem" }}>Authorized Signatory</p>
              </div>
            </div>
          </div>

          <div style={{ textAlign: "center", marginTop: "1.5rem" }}>
            <button
              onClick={downloadPDF}
              style={{
                backgroundColor: "#4CAF50",
                color: "white",
                padding: "0.6rem 1.5rem",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              Download PDF
            </button>
          </div>
        </>
      )}
    </div>
  );
}
