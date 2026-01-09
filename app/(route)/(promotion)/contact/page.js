"use client";

import { useEffect, useState } from "react";
import { FestData } from "@/data/FestData";
import { Search, Users, HelpCircle } from "lucide-react";
import CoordinatorCard from "@/components/management/CoordinatorCard";

export default function Contact() {
  const [ambSearch, setAmbSearch] = useState("");
  const [coordSearch, setCoordSearch] = useState("");
  const [openFAQ, setOpenFAQ] = useState(null);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  const campusAmbassadors = [
    { name: "N/A", college: "N/A" },
  ];

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await fetch("/api/homepage");
        const data = await res.json();

        if (res.ok && data.events) {
          setEvents(data.events);
        } else {
          console.error("Failed to fetch events:", data?.error);
        }
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const faqs = [
    {
      q: "When is the fest happening?",
      a: "The fest is scheduled from 13th - 16th March 2026 at the main campus.",
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
      a: "You can reach out to keccentreorg@gmail.com or use the Contact section in the dashboard.",
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
        <CardSection title="Fest Management Team">
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
            <MemberCard name="Nilesh Kumar" role="Full Stack Developer" contact="nilesh@centre.com" />
            <MemberCard name="Shubham Sagar" role="PR Head" contact="shubham@centre.com" />
            <MemberCard name="Shivam Kumar" role="Fest Lead" contact="shivam@centre.com" />
            <MemberCard name="Nikhil Raj" role="Fest Lead" contact="nikhil@centre.com" />
            <MemberCard name="Vikash Kumar" role="Campus Ambassador" contact="vikash@centre.com" />
            <MemberCard name="Rishu Anand" role="Account Lead" contact="rishu@centre.com" />
          </div>
        </CardSection>

        {/* Campus Ambassador Section */}
        <CardSection title="Campus Ambassadors" icon={<Users className="w-5 h-5" />}>
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
        </CardSection>

        {/* Event Coordinators Section */}
        <CardSection title="Event Coordinators" icon={<Users className="w-5 h-5" />}>
          <SearchBox value={coordSearch} setValue={setCoordSearch} placeholder="Search by event or name..." />
          {loading ? (
            <p className="text-sm text-[color:var(--secondary)]">Loading coordinators...</p>
          ) : (
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
              {events
                .filter(
                  (event) =>
                    event.title.toLowerCase().includes(coordSearch.toLowerCase()) ||
                    event.coordinators?.some((c) =>
                      c.name.toLowerCase().includes(coordSearch.toLowerCase())
                    )
                )
                .map((event) => (
                  <CoordinatorCard key={event.slug} event={event} />
                ))}
            </div>
          )}
        </CardSection>

        {/* FAQs */}
        <CardSection title="Frequently Asked Questions" icon={<HelpCircle className="w-5 h-5" />}>
          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="rounded-xl bg-white/5 p-4 cursor-pointer transition hover:bg-white/10"
                onClick={() => setOpenFAQ(openFAQ === idx ? null : idx)}
              >
                <h3 className="font-medium flex justify-between items-center">
                  {faq.q}
                  <span className="text-[color:var(--accent)]">{openFAQ === idx ? "−" : "+"}</span>
                </h3>
                {openFAQ === idx && (
                  <p className="mt-2 text-sm text-[color:var(--secondary)] leading-relaxed">{faq.a}</p>
                )}
              </div>
            ))}
          </div>
        </CardSection>
      </div>
    </section>
  );
}

/* 🔹 Reusable Components */
function CardSection({ title, icon, children }) {
  return (
    <div className="backdrop-blur-lg bg-white/10 border border-white/20 rounded-2xl shadow-lg p-6 space-y-6">
      <h2 className="text-xl font-semibold flex items-center gap-2 text-[color:var(--accent)]">
        {icon} {title}
      </h2>
      {children}
    </div>
  );
}

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
