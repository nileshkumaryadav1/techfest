"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

export default function ExamDetailsPage() {
  const { id } = useParams();
  const [exam, setExam] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchExam = async () => {
      try {
        const res = await fetch(`/api/exams/${id}`);
        const data = await res.json();
        setExam(data);
      } catch (error) {
        console.error("Error fetching exam:", error);
      }
      setLoading(false);
    };

    fetchExam();
  }, [id]);

  if (loading)
    return <p className="text-center mt-10">Loading exam details...</p>;
  if (!exam) return <p className="text-center mt-10">Exam not found.</p>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      {exam.imageUrl && (
        <Image
          src={exam.imageUrl}
          alt={exam.name}
          width={500}
          height={500}
          className="w-full h-40 object-cover"
        />
      )}
      <h1 className="text-3xl font-bold mt-4">{exam.name}</h1>
      <p className="text-gray-700">{exam.date}</p>
      <p className="text-gray-700 mt-2">Eligibility: {exam.eligibility}</p>
      <p className="mt-4">{exam.syllabus}</p>
      <a
        href={exam.website}
        target="_blank"
        className="text-blue-500 mt-4 block"
      >
        Visit Website
      </a>
      <Link href="/exams" className="text-gray-600 mt-4 block">
        ← Back to Exams
      </Link>
    </div>
  );
}
