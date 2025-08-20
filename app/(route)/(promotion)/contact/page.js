"use client";

import { useState } from "react";
import { FestData } from "@/data/FestData";
import { Search, Users, HelpCircle } from "lucide-react";

export default function Contact() {
  const [ambSearch, setAmbSearch] = useState("");
  const [coordSearch, setCoordSearch] = useState("");
  const [openFAQ, setOpenFAQ] = useState(null);

  const campusAmbassadors = [
    { name: "Aarav Sharma", college: "IIT Delhi" },
    { name: "Priya Patel", college: "NIT Trichy" },
    { name: "Rahul Verma", college: "VIT Vellore" },
  ];

  const eventCoordinators = [
    { name: "Sanya Kapoor", event: "Hackathon" },
    { name: "Aditya Singh", event: "Robotics Challenge" },
    { name: "Neha Gupta", event: "Gaming Tournament" },
  ];

  const faqs = [
    {
      q: "When is the fest happening?",
      a: "The fest is scheduled from 14th - 16th March 2025 at the main campus.",
    },
    {
      q: "How can I register for events?",
      a: "Students can register via our website under the Events section after logging in.",
    },
    {
      q: "Do I need to pay for participation?",
      a: "Some events are free, while others have a nominal participation fee. Check event details.",
    },
    {
      q: "Can I participate without a team?",
      a: "Yes, many events support individual participation. Team-based events allow you to either create or join a team.",
    },
    {
      q: "Will I get a certificate?",
      a: "Yes, every participant gets a participation certificate, and winners get a winner’s certificate + goodies.",
    },
    {
      q: "How do I contact support?",
      a: "You can reach out to fest@collegefinder.site or use the Contact section in the dashboard.",
    },
  ];

  return (
    <section className="py-16 px-6 sm:px-12 lg:px-24 bg-[color:var(--background)] text-[color:var(--foreground)]">
      <div className="max-w-5xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-3xl sm:text-4xl font-bold text-[color:var(--accent)] drop-shadow-lg">
            Contact the {FestData.name} Team
          </h1>
          <p className="text-base sm:text-lg text-[color:var(--secondary)] leading-relaxed">
            Have questions or want to connect with our team? Find the right
            contact below.
          </p>
        </div>

        {/* Fest Management Section */}
        <div className="backdrop-blur-lg bg-white/10 border border-white/20 rounded-2xl shadow-lg p-6 space-y-6">
          <h2 className="text-xl font-semibold text-[color:var(--accent)]">
            Fest Management Team
          </h2>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
            <MemberCard name="Nilesh Kumar" role="Backend Developer" contact="nilesh@centre.com" />
            <MemberCard name="Ananya Gupta" role="Fest Lead" contact="ananya@centre.com" />
            <MemberCard name="Rohit Sharma" role="PR Head" contact="rohit@centre.com" />
          </div>
        </div>

        {/* Campus Ambassador Section */}
        <div className="backdrop-blur-lg bg-white/10 border border-white/20 rounded-2xl shadow-lg p-6 space-y-6">
          <h2 className="text-xl font-semibold flex items-center gap-2 text-[color:var(--accent)]">
            <Users className="w-5 h-5" /> Campus Ambassadors
          </h2>
          <SearchBox value={ambSearch} setValue={setAmbSearch} placeholder="Search Ambassador..." />
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
            {campusAmbassadors
              .filter((a) =>
                a.name.toLowerCase().includes(ambSearch.toLowerCase())
              )
              .map((amb, i) => (
                <MemberCard key={i} name={amb.name} role="Campus Ambassador" contact={amb.college} />
              ))}
          </div>
        </div>

        {/* Event Coordinators Section */}
        <div className="backdrop-blur-lg bg-white/10 border border-white/20 rounded-2xl shadow-lg p-6 space-y-6">
          <h2 className="text-xl font-semibold flex items-center gap-2 text-[color:var(--accent)]">
            <Users className="w-5 h-5" /> Event Coordinators
          </h2>
          <SearchBox value={coordSearch} setValue={setCoordSearch} placeholder="Search by event..." />
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
            {eventCoordinators
              .filter((c) =>
                c.event.toLowerCase().includes(coordSearch.toLowerCase())
              )
              .map((coord, i) => (
                <MemberCard key={i} name={coord.name} role={coord.event} contact="coordinator@centre.com" />
              ))}
          </div>
        </div>

        {/* FAQs */}
        <div className="backdrop-blur-lg bg-white/10 border border-white/20 rounded-2xl shadow-lg p-6 space-y-6">
          <h2 className="text-xl font-semibold flex items-center gap-2 text-[color:var(--accent)]">
            <HelpCircle className="w-5 h-5" /> Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="rounded-xl bg-white/5 p-4 cursor-pointer transition hover:bg-white/10"
                onClick={() => setOpenFAQ(openFAQ === idx ? null : idx)}
              >
                <h3 className="font-medium flex justify-between items-center">
                  {faq.q}
                  <span className="text-[color:var(--accent)]">
                    {openFAQ === idx ? "−" : "+"}
                  </span>
                </h3>
                {openFAQ === idx && (
                  <p className="mt-2 text-sm text-[color:var(--secondary)] leading-relaxed">
                    {faq.a}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* 🔹 Reusable Components */
function MemberCard({ name, role, contact }) {
  return (
    <div className="rounded-xl p-4 bg-white/10 border border-white/20 shadow-md hover:scale-[1.02] transition transform duration-200">
      <h3 className="font-semibold text-[color:var(--foreground)]">{name}</h3>
      <p className="text-sm text-[color:var(--secondary)]">{role}</p>
      <p className="text-xs text-[color:var(--accent)] mt-1">{contact}</p>
    </div>
  );
}

function SearchBox({ value, setValue, placeholder }) {
  return (
    <div className="flex items-center gap-2 px-3 py-2 bg-white/5 border border-white/20 rounded-lg backdrop-blur-md">
      <Search className="w-4 h-4 text-[color:var(--secondary)]" />
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        className="bg-transparent outline-none w-full text-sm text-[color:var(--foreground)]"
      />
    </div>
  );
}
