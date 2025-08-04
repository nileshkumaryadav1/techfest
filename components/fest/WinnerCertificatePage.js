"use client";

import { useState } from "react";
import axios from "axios";
import { Loader2, Search } from "lucide-react";
import { motion } from "framer-motion";

export default function WinnerCertComponent() {
  const [festId, setFestId] = useState("");
  const [certData, setCertData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

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
      setError(err.response?.data?.error || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 sm:p-10 max-w-2xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h2 className="text-4xl font-extrabold text-[color:var(--accent)] mb-3">🏆 Winner Certificate</h2>
        <p className="text-gray-600 dark:text-gray-300 mb-6">Enter your Fest ID to access your certificate</p>
      </motion.div>

      <div className="flex items-center gap-2">
        <input
          type="text"
          placeholder="Enter your Fest ID"
          value={festId}
          onChange={(e) => setFestId(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[color:var(--accent)] bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100"
        />
        <button
          onClick={fetchCertificate}
          disabled={loading}
          className="bg-[color:var(--accent)] hover:opacity-90 text-white px-4 py-2 rounded-lg flex items-center gap-1 font-semibold transition"
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

      {error && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-red-600 mt-4 text-center font-medium"
        >
          {error}
        </motion.p>
      )}

      {certData && (
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white dark:bg-gray-800 border mt-8 p-6 rounded-xl shadow-xl"
        >
          <h3 className="text-2xl font-bold text-center text-green-600 dark:text-green-400 mb-4">
            🎉 Certificate of Achievement
          </h3>
          <div className="space-y-2 text-gray-700 dark:text-gray-200">
            <p><strong>Name:</strong> {certData.name}</p>
            <p><strong>Fest:</strong> {certData.festName}</p>
            <p><strong>Winning Events:</strong> {certData.events.join(", ")}</p>
            <p><strong>Date Range:</strong> {certData.dateRange}</p>
            <p><strong>Certificate ID:</strong> {certData.certId}</p>
            <p><strong>Issued On:</strong> {certData.issuedOn}</p>
          </div>

          {/* Optional Download Button */}
          {/* <button className="mt-6 bg-blue-600 text-white py-2 px-4 rounded-lg w-full hover:bg-blue-700">
            Download PDF
          </button> */}
        </motion.div>
      )}
    </div>
  );
}
