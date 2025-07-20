import Link from "next/link";
import { ArrowRightCircle } from "lucide-react";

export default function RegisterCTA() {
  return (
    <section
      className="w-full py-20 px-6 sm:px-12 lg:px-24 bg-[color:var(--foreground)] text-[color:var(--background)]"
      id="register"
    >
      <div className="max-w-5xl mx-auto text-center space-y-6">
        <h2 className="text-3xl sm:text-4xl font-extrabold">
          Ready to <span className="text-[color:var(--accent)]">Join the Revolution</span>?
        </h2>
        <p className="text-lg sm:text-xl text-[color:var(--secondary)]">
          Register now and be part of the most exciting, innovative, and unforgettable TechFest experience at <span className="font-semibold text-[color:var(--highlight)]">Your College Name</span>.
        </p>

        <div className="mt-8 flex justify-center flex-wrap gap-4">
          <Link
            href="/register"
            className="inline-flex items-center gap-2 bg-[color:var(--accent)] text-[color:var(--background)] px-6 py-3 rounded-full text-lg font-medium shadow-lg hover:scale-105 transition-all"
          >
            Register Now <ArrowRightCircle className="w-5 h-5" />
          </Link>

          <Link
            href="/events"
            className="inline-flex items-center gap-2 border-2 border-[color:var(--accent)] text-[color:var(--accent)] px-6 py-3 rounded-full text-lg font-medium hover:bg-[color:var(--accent)] hover:text-[color:var(--background)] transition-all"
          >
            Explore Events
          </Link>
        </div>
      </div>
    </section>
  );
}
