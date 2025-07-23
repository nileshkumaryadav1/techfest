"use client";

import { useRef, useState } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { CollegeData, FestData } from "@/data/FestData";

export default function CertificatePage() {
  const [festId, setFestId] = useState("");
  const [certificateData, setCertificateData] = useState(null);
  const certRef = useRef(null);

  async function fetchCertificate() {
    try {
      const res = await fetch(`/api/certificate?festId=${festId.trim()}`);
      if (!res.ok) throw new Error("Invalid Fest ID");

      const data = await res.json();

      // Check if essential event details exist, otherwise skip
      if (!data?.name || !data?.events || !data?.dateRange) {
        throw new Error("Incomplete certificate data");
      }

      setCertificateData(data);
    } catch (err) {
      alert("Certificate not found or incomplete. Please enter a valid Fest ID.");
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
    <div style={{ minHeight: "100vh", padding: "2rem" }} className="bg-[color:var(--background)] text-[color:var(--foreground)]">
      <h1 style={{ textAlign: "center", fontSize: "2rem", fontWeight: "bold", marginBottom: "2rem" }}>
        🎓 Download Your <span className="text-[color:var(--accent)]"> {FestData.name} </span> Certificate
      </h1>

      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1rem", marginBottom: "2rem" }}>
        <input
          type="text"
          placeholder="Enter Fest ID"
          value={festId}
          onChange={(e) => setFestId(e.target.value.toLowerCase())}
          style={{ padding: "0.5rem 1rem", width: "300px", border: "1px solid #ccc", borderRadius: "4px" }}
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
          }}
        >
          Get Certificate
        </button>
      </div>

{certificateData && certificateData.name && certificateData.events && certificateData.dateRange && (
  <>
    <div
      ref={certRef}
      style={{
        backgroundColor: "#fffefcff",
        color: "#000000",
        padding: "2rem",
        width: "1000px",
        margin: "2rem auto",
        border: "1px solid #ddd",
        borderRadius: "6px",
        fontFamily: "monospace",
      }}
    >
      {/* Header with logos and banner */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "1rem",
        }}
      >
        <img
          src="/logo.png"
          alt="Logo Left"
          style={{ width: "100px", borderRadius: "50%" }}
        />

        <div style={{ textAlign: "center" }}>
          <img
            src="branding/banner.png"
            alt="Fest Banner"
            style={{ width: "300px", marginBottom: "0.5rem" , alignContent:"center" }}
          />
          <p style={{ fontSize: "1rem", color: "#555" }}>
            Presented by{" "}
            <span style={{ fontWeight: "bold", color: "var(--accent)" }}>
              {CollegeData.name}
            </span>
          </p>
        </div>

        <img
          src="/college/logo.png"
          alt="Logo Right"
          style={{ width: "100px", borderRadius: "50%" }}
        />
      </div>

      {/* Certificate Title */}
      <h4
        style={{
          fontSize: "2rem",
          fontWeight: "bold",
          textAlign: "center",
          margin: "1rem 0",
          textDecoration: "underline",
          textDecorationColor: "var(--accent)",
        }}
      >
        CERTIFICATE OF PARTICIPATION
      </h4>

      {/* Participant Name */}
      <h3
        style={{
          textAlign: "center",
          fontSize: "1.4rem",
          fontWeight: "bold",
          marginBottom: "0.2rem",
        }}
      >
        {certificateData.name}
      </h3>

      <p
        style={{
          textAlign: "center",
          fontSize: "0.7rem",
          marginBottom: "0.75rem",
        }}
      >
        Fest ID: {festId}
      </p>

      {/* Certificate Body */}
      <p
        style={{
          textAlign: "center",
          fontSize: "1rem",
          color: "#333",
          margin: "1rem 2rem",
          lineHeight: "1.6",
        }}
      >
        has successfully participated in the event(s):
        <br />
        <strong>{certificateData.events}</strong>
        <br />
        held on <strong>{certificateData.dateRange}</strong>.
      </p>

      {/* Footer: Certificate ID + Signatory */}
      <div
        style={{
          marginTop: "2rem",
          display: "flex",
          justifyContent: "space-between",
          borderTop: "1px solid #eee",
          paddingTop: "1rem",
          fontSize: "0.9rem",
        }}
      >
        <p>
          Certificate ID:{" "}
          <span style={{ color: "var(--accent)" }}>
            {certificateData.certId}
          </span>
        </p>
        <div style={{ textAlign: "right" }}>
          <p>Centre Fest Committee</p>
          <p style={{ fontSize: "0.75rem", marginTop: "0.25rem" }}>
            Authorized Signatory
          </p>
        </div>
      </div>
    </div>

    {/* Download Button */}
    <div style={{ textAlign: "center", marginTop: "1.5rem" }}>
      <button
        onClick={downloadPDF}
        style={{
          backgroundColor: "var(--accent)",
          color: "white",
          padding: "0.6rem 1.5rem",
          border: "none",
          borderRadius: "6px",
          fontWeight: "bold",
          cursor: "pointer",
          fontSize: "1rem",
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
