"use client";

import { useState, useRef } from "react";
import axios from "axios";
import { Loader2, Search, Download } from "lucide-react";
import { motion } from "framer-motion";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export default function WinnerCertComponent() {
  const [festId, setFestId] = useState("");
  const [certData, setCertData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const certRef = useRef(null);

  const fetchCertificate = async () => {
    if (!festId.trim()) {
      setError("Please enter a valid Fest ID");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setCertData(null);

      const res = await axios.get(`/api/certificate/winner?festId=${festId.trim()}`);
      setCertData(res.data);
    } catch (err) {
      setCertData(null);
      setError(err.response?.data?.error || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const downloadPDF = async () => {
    if (!certRef.current) return;
    const canvas = await html2canvas(certRef.current, { scale: 2 });
    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF("landscape", "pt", "a4");
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save(`Winner_Certificate_${festId}.pdf`);
  };

  return (
    <div className="p-4 sm:p-8 max-w-4xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h2 className="text-3xl sm:text-4xl font-extrabold text-accent mb-2">
          🏆 Winner Certificate
        </h2>
        <p className="text-gray-600 dark:text-gray-300 mb-6 text-sm sm:text-base">
          Enter your Fest ID to view and download your award
        </p>
      </motion.div>

      {/* Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
        <input
          type="text"
          placeholder="Enter your Fest ID"
          value={festId}
          onChange={(e) => setFestId(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg 
                     focus:outline-none focus:ring-2 focus:ring-accent 
                     bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100"
        />
        <button
          onClick={fetchCertificate}
          disabled={loading}
          className="bg-accent hover:opacity-90 text-white px-4 py-2 rounded-lg 
                     flex items-center justify-center gap-1 font-semibold transition"
        >
          {loading ? (
            <>
              <Loader2 className="animate-spin h-5 w-5" /> Loading...
            </>
          ) : (
            <>
              <Search className="h-5 w-5" /> Fetch
            </>
          )}
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-red-600 mt-4 text-center font-medium"
        >
          {error}
        </motion.p>
      )}

      {/* Certificate View */}
      {certData && (
        <motion.div
          ref={certRef}
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mt-10 border-4 border-yellow-500 bg-gradient-to-br from-white to-yellow-50 
                     dark:from-gray-900 dark:to-yellow-900 rounded-2xl shadow-2xl p-6 sm:p-10 relative"
        >
          {/* Decorative corners */}
          <div className="absolute top-4 left-4 w-8 h-8 border-t-4 border-l-4 border-yellow-500"></div>
          <div className="absolute top-4 right-4 w-8 h-8 border-t-4 border-r-4 border-yellow-500"></div>
          <div className="absolute bottom-4 left-4 w-8 h-8 border-b-4 border-l-4 border-yellow-500"></div>
          <div className="absolute bottom-4 right-4 w-8 h-8 border-b-4 border-r-4 border-yellow-500"></div>

          <h3 className="text-2xl sm:text-3xl font-bold text-center text-yellow-700 mb-3">
            Certificate of Achievement
          </h3>
          <p className="text-center text-gray-700 dark:text-gray-300 italic mb-5 text-sm sm:text-base">
            This is to certify that
          </p>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-center text-accent mb-3">
            {certData.name}
          </h1>
          <p className="text-center text-gray-700 dark:text-gray-300 mb-5 text-sm sm:text-base">
            has secured a winning position in{" "}
            <strong>{Array.isArray(certData.events) ? certData.events.join(", ") : certData.events}</strong>{" "}
            at <strong>{certData.festName}</strong>
          </p>
          <p className="text-center text-gray-600 dark:text-gray-400 text-xs sm:text-sm">
            Date: {certData.dateRange} &nbsp;|&nbsp; Certificate ID: {certData.certId}
          </p>
          <p className="text-center text-gray-600 dark:text-gray-400 mb-8 text-xs sm:text-sm">
            Issued On: {certData.issuedOn}
          </p>

          {/* Signature section */}
          <div className="flex justify-between mt-8 px-4 sm:px-8">
            <div className="text-center">
              <div className="w-24 sm:w-32 border-b border-gray-600 mx-auto"></div>
              <p className="mt-2 text-xs sm:text-sm">Organizer</p>
            </div>
            <div className="text-center">
              <div className="w-24 sm:w-32 border-b border-gray-600 mx-auto"></div>
              <p className="mt-2 text-xs sm:text-sm">Head of Fest</p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Download Button */}
      {certData && (
        <div className="text-center mt-6">
          <button
            onClick={downloadPDF}
            className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg flex items-center gap-2 mx-auto font-semibold transition"
          >
            <Download className="h-5 w-5" /> Download PDF
          </button>
        </div>
      )}
    </div>
  );
}
