import { developersData } from "@/data/FestData";
import { Github, Globe, Linkedin } from "lucide-react";

export default function DevelopersPage() {
  return (
    <section className="py-16 px-6 sm:px-12 lg:px-24 bg-[color:var(--background)] text-[color:var(--foreground)]">
      <div className="max-w-6xl mx-auto text-center">
        <h2 className="text-3xl sm:text-4xl font-bold text-[color:var(--accent)] mb-10">
          Meet Our Developers
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {developersData.map((developer) => (
            <DeveloperCard key={developer._id} {...developer} />
          ))}
        </div>
      </div>
    </section>
  );
}

function DeveloperCard({ name, role, bio, image, github, linkedin, portfolio }) {
  return (
    <div className="p-6 rounded-2xl bg-[color:var(--border)] shadow-lg hover:shadow-xl transition-shadow duration-300">
      <img
        src={image}
        alt={name}
        className="w-28 h-28 rounded-full mx-auto border-4 border-[color:var(--highlight)] object-cover"
      />
      <h3 className="text-xl font-semibold mt-4 text-[color:var(--highlight)]">{name}</h3>
      <p className="text-sm text-[color:var(--secondary)]">{role}</p>
      <p className="text-sm text-[color:var(--secondary)] mt-2">{bio}</p>
      <div className="mt-4 flex justify-center gap-4">
        <a
          href={github}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-[color:var(--highlight)] transition-colors"
        >
          <Github size={22} />
        </a>
        <a
          href={linkedin}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-[color:var(--highlight)] transition-colors"
        >
          <Linkedin size={22} />
        </a>
        <a
        href={portfolio}
        target="_blank"
        rel="noopener noreferrer"
        className="hover:text-[color:var(--highlight)] transition-colors"
        >
        <Globe size={22} />
        </a>
      </div>
    </div>
  );
}
