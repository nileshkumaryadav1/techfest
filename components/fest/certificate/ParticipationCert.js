"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { QRCodeSVG } from "qrcode.react";
import Image from "next/image";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

import { FestData, CollegeData } from "@/data/FestData";

export default function ParticipationCertificate() {
  const [student, setStudent] = useState(null);
  const [certificateData, setCertificateData] = useState(null);
  const router = useRouter();
  const cardRef = useRef(null);
  const [loading, setLoading] = useState(false);

  // ✅ Load student from localStorage and fetch certificate
  useEffect(() => {
    const stored = localStorage.getItem("student");
    if (!stored) {
      router.push("/login");
      return;
    }

    try {
      const parsed = JSON.parse(stored);
      setStudent(parsed);
      setLoading(true);

      fetch(`/api/certificate?festId=${parsed.festId}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.error) {
            alert("⚠️ " + data.error);
            setCertificateData(null);
            return;
          }
          setCertificateData(data);
          setLoading(false);
        })
        .catch((err) => {
          console.error("Error fetching certificate:", err);
          alert("⚠️ Unable to fetch certificate. Try again later.");
        });
    } catch (err) {
      console.error("Invalid student data:", err);
      localStorage.removeItem("student");
      router.push("/login");
    }
  }, [router]);

  // ✅ Download PDF
  const downloadPDF = async () => {
    if (!cardRef.current) return;

    try {
      const canvas = await html2canvas(cardRef.current, {
        scale: 3,
        useCORS: true,
        backgroundColor: "#ffffff",
        onclone: (doc) => {
          doc.querySelectorAll("*").forEach((el) => {
            const style = window.getComputedStyle(el);
            if (style.backgroundColor.includes("oklch"))
              el.style.backgroundColor = "#ffffff";
            if (style.color.includes("oklch")) el.style.color = "#000000";
            if (style.borderColor.includes("oklch"))
              el.style.borderColor = "#000000";
          });
        },
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "landscape",
        unit: "mm",
        format: "a4",
      });

      pdf.addImage(imgData, "PNG", 0, 0, 297, 210);
      pdf.save(
        `ParticipationCertificate_${certificateData?.certId || "fest"}.pdf`
      );
    } catch (err) {
      console.error("PDF generation failed:", err);
      alert("⚠️ PDF generation failed. Try again.");
    }
  };

  // ✅ Loading state
  if (!student) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-[var(--background)] text-[var(--foreground)]">
        <p className="text-sm">Loading your dashboard...</p>
      </main>
    );
  }

  return (
    <main className="px-4 py-6 sm:px-6 md:px-12 bg-[var(--background)] text-[var(--foreground)]">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header */}
        <div className="md:p-6 p-4 rounded-3xl bg-white/5 backdrop-blur-xl border border-white/20 shadow-lg flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <h1 className="md:text-2xl text-lg font-bold">
            Hello, {student.name || student.email}!
          </h1>{" "}
          {/* Status */}
          <div className="flex items-center gap-2">
            {loading ? (
              <p className="text-sm text-gray-300">
                Generating your certificate...
              </p>
            ) : certificateData ? (
              <p className="text-sm text-gray-300">
                🏆 Congratulations! Your certificate is ready!
              </p>
            ) : (
              <p className="text-sm text-gray-300">
                ⚠️ No certificate data found
              </p>
            )}
          </div>
        </div>

        {/* Certificate */}
        {certificateData ? (
          <div className="max-w-5xl mx-auto">
            <div className="w-full h-[540px] bg-white border-2 border-gray-700 rounded-xl shadow-2xl overflow-hidden mx-auto">
              {/* Horizontal scroll container */}
              <div className="w-full h-full overflow-x-auto overflow-y-hidden no-scrollbar flex justify-center">
                <div
                  ref={cardRef}
                  className="min-w-[900px] h-full flex flex-col" // 👈 wider than parent to enable horizontal scroll
                >
                  {/* Header */}
                  <div className="bg-gradient-to-r from-[#004d00] to-[#008000] text-white px-4 py-3 flex items-center justify-between">
                    {/* Fest Info */}
                    <div className="flex items-center gap-2">
                      <div>
                        <h2 className="text-lg font-bold uppercase">
                          {certificateData.festName || FestData.name}
                        </h2>
                        <p className="text-xs opacity-80">{FestData.venue}</p>
                      </div>
                      <Image
                        src="/logo.png"
                        alt="Fest Logo"
                        width={32}
                        height={32}
                        className="rounded-full border border-white"
                        priority
                      />
                    </div>

                    {/* College Info */}
                    <div className="flex items-center gap-2">
                      <Image
                        src={CollegeData.logo}
                        alt="College Logo"
                        width={32}
                        height={32}
                        className="rounded-full border border-white"
                        priority
                      />
                      <div>
                        <h2 className="text-sm font-medium">
                          {CollegeData.name}
                        </h2>
                        <p className="text-[10px] opacity-80">
                          {CollegeData.address}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Certificate Body */}
                  <div className="flex flex-col items-center text-center flex-1 px-6 py-6">
                    <p className="text-xl font-semibold text-gray-700">
                      Certificate of Participation
                    </p>
                    <p className="text-sm text-gray-500">
                      This is to certify that
                    </p>
                    <h1 className="text-3xl font-bold text-green-700 mt-2">
                      {certificateData.name}
                    </h1>
                    <p className="text-sm text-gray-600 mt-2">
                      {student.college}
                    </p>

                    <div className="mt-4">
                      <p className="text-lg">has participated in</p>
                      <ul className="mt-2 text-base font-medium text-gray-700 space-y-1">
                        {certificateData.events.map((event, idx) => (
                          <li key={idx}>🎯 {event}</li>
                        ))}
                      </ul>
                      <p className="text-sm text-gray-500 mt-4">
                        Held on {certificateData.dateRange} at {FestData.venue}
                      </p>
                    </div>
                  </div>

                  {/* Footer with QR + Sponsors */}
                  <div className="flex items-center justify-between px-4 py-3 border-t bg-gray-50">
                    <div className="flex flex-col items-center">
                      <QRCodeSVG
                        value={JSON.stringify(certificateData)}
                        size={64}
                      />
                      <p className="text-[10px] text-gray-500 mt-1">Verify</p>
                    </div>
                    <div className="text-[10px] text-gray-500 text-center">
                      Sponsored by <br /> {FestData.sponsors}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          !loading && (
            <p className="text-center text-gray-400">
              ⚠️ No certificate data found
            </p>
          )
        )}

        {/* Download PDF */}
        {certificateData && (
          <div className="flex justify-center">
            <button
              onClick={downloadPDF}
              className="px-5 py-2 rounded-lg bg-gradient-to-r from-[#004d00] to-[#008000] text-white text-sm font-semibold shadow-md hover:scale-105 transition"
            >
              📥 Download Participation Certificate (PDF)
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
