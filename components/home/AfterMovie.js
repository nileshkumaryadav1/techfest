"use client";

import { FestData } from "@/data/FestData";
import React, { useState } from "react";

const afterMovies = [
  { year: "2025", videoId: "BdsJAMHC_z4" },
  { year: "2024", videoId: "NLh4gUvtdPY" },
  { year: "2023", videoId: "2F1O3Pyvwdc" },
];

function AfterMovie() {
  const [selected, setSelected] = useState(afterMovies[0]);

  return (
    <section className="py-16 px-6 sm:px-12 lg:px-24 bg-[color:var(--background)] text-[color:var(--foreground)] text-center">
      <div className="max-w-5xl mx-auto space-y-8">
        <h2 className="text-3xl sm:text-4xl font-bold text-[color:var(--accent)]">
          Fest Aftermovies 🎥
        </h2>
        <p className="text-base sm:text-lg text-[color:var(--secondary)]">
          Relive the memories of {afterMovies.length} years of {FestData.name}!
        </p>

        {/* Year Buttons */}
        <div className="flex flex-wrap justify-center gap-4">
          {afterMovies.map((movie) => (
            <button
              key={movie.year}
              onClick={() => setSelected(movie)}
              className={`px-6 py-2 rounded-xl border transition-all duration-300 ${
                selected.year === movie.year
                  ? "bg-[color:var(--accent)] text-white shadow-lg"
                  : "bg-[color:var(--card)] text-[color:var(--foreground)] hover:bg-[color:var(--accent)] hover:text-white"
              }`}
            >
              {movie.year}
            </button>
          ))}
        </div>

        {/* YouTube Video */}
        <div className="relative w-full max-w-3xl mx-auto aspect-video rounded-xl overflow-hidden shadow-lg">
          <iframe
            key={selected.videoId}
            width="100%"
            height="100%"
            src={`https://www.youtube.com/embed/${selected.videoId}`}
            title={`Aftermovie ${selected.year}`}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full h-full"
          ></iframe>
        </div>
      </div>
    </section>
  );
}

export default AfterMovie;
