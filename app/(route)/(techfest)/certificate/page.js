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
    <div className="min-h-screen p-6 bg-[var(--background)] text-[var(--foreground)]">
      <h1 className="text-3xl md:text-4xl font-bold mb-8 text-center text-[var(--highlight)]">
        🎓 Download Your Certificate
      </h1>

      <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-10">
        <input
          type="text"
          placeholder="Enter Fest ID"
          value={festId}
          onChange={(e) => setFestId(e.target.value)}
          className="border border-[var(--border)] p-2 px-4 rounded-md w-72 focus:outline-none text-[var(--foreground)]"
        />
        <button
          onClick={fetchCertificate}
          className="bg-[var(--accent)] hover:brightness-110 text-white font-semibold px-5 py-2 rounded-md transition"
        >
          Get Certificate
        </button>
      </div>

      {certificateData && (
        <>
          <div
            ref={certRef}
            className="bg-white text-black shadow-2xl border border-gray-300 p-10 w-[800px] mx-auto my-6 rounded-xl font-serif"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-gray-300 pb-6 mb-6">
              <img src="/logo.png" alt="Fest Logo" className="h-16" />
              <div className="text-center flex-1">
                <h2 className="text-4xl font-extrabold text-[var(--accent)]">
                  Certificate of Participation
                </h2>
                <p className="text-base mt-1 text-gray-700">This is to certify that</p>
              </div>
              <div className="w-16" />
            </div>

            {/* Name */}
            <h3 className="text-3xl font-semibold text-center my-4">
              {certificateData.name}
            </h3>

            {/* Body */}
            <p className="text-lg text-center leading-relaxed px-6 text-gray-800">
              has successfully participated in the event{" "}
              <span className="text-blue-700 font-semibold">{certificateData.eventName}</span>{" "}
              organized as part of{" "}
              <span className="text-blue-700 font-semibold">{certificateData.festName}</span>{" "}
              on{" "}
              <span className="text-blue-700 font-semibold">{certificateData.date}</span>.
            </p>

            {/* Footer */}
            <div className="mt-10 flex justify-between items-center text-sm border-t border-gray-300 pt-4 text-gray-700">
              <p>
                Certificate ID:{" "}
                <span className="font-mono text-blue-600">{certificateData.certId}</span>
              </p>
              <div className="text-right">
                <p>Centre Fest Committee</p>
                <p className="mt-1 text-xs">Authorized Signatory</p>
              </div>
            </div>
          </div>

          <div className="text-center mt-6">
            <button
              onClick={downloadPDF}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-md shadow-md transition"
            >
              Download PDF
            </button>
          </div>
        </>
      )}
    </div>
  );
}
