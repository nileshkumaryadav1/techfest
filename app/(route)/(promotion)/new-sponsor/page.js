"use client";

import { useState } from "react";
import { toast } from "react-hot-toast";

export default function SponsorPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    phone: "",
    message: "",
    image: "",
  });

  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setSuccess(false);

    try {
      const res = await fetch("/api/sponsor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setSuccess(true);
        toast.success("Thank you! Your email has been sent.");
        setFormData({
          name: "",
          email: "",
          company: "",
          phone: "",
          message: "",
          image: "",
        });
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    } catch (err) {
      toast.error("Server error. Please try later.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="min-h-screen bg-[color:var(--background)] text-[color:var(--foreground)] py-20 px-6 sm:px-12 lg:px-24">
      <div className="max-w-4xl mx-auto space-y-16">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold">
            Partner With Us as Our{" "}
            <span className="text-[color:var(--accent)]">Sponsor</span>
          </h1>
          <p className="text-[color:var(--secondary)] text-lg">
            Empower innovation, support student talent, and amplify your brand
            visibility.
          </p>
        </div>

        {/* Benefits */}
        <div className="grid sm:grid-cols-2 gap-6">
          {[
            "Your logo on all event materials & media",
            "Direct engagement with 5000+ students",
            "Booth space & brand stalls at the venue",
            "Shout-outs on social media handles",
            "Networking with future tech leaders",
            "Recognition during award ceremonies",
          ].map((benefit, i) => (
            <div
              key={i}
              className="p-4 border border-[color:var(--highlight)] rounded-xl bg-white/5 backdrop-blur"
            >
              ✅ {benefit}
            </div>
          ))}
        </div>

        {/* Social Impact */}
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-2">Make a Difference</h2>
          <p className="text-[color:var(--color-secondary)]">
            By sponsoring, you&apos;re not just investing in an event —
            you&apos;re uplifting students, supporting grassroots innovation,
            and enabling skill development in young minds.
          </p>
        </div>

        {/* Sponsor Form */}
        <form
          onSubmit={handleSubmit}
          className="grid gap-4 bg-white/5 p-6 rounded-xl border border-[color:var(--border)]"
        >
          <input
            type="text"
            name="name"
            placeholder="Your Name"
            value={formData.name}
            onChange={handleChange}
            required
            className="p-3 rounded-lg border bg-transparent"
          />
          <input
            type="email"
            name="email"
            placeholder="Your Email"
            value={formData.email}
            onChange={handleChange}
            required
            className="p-3 rounded-lg border bg-transparent"
          />
          <input
            type="text"
            name="company"
            placeholder="Company Name"
            value={formData.company}
            onChange={handleChange}
            required
            className="p-3 rounded-lg border bg-transparent"
          />
          <input
            type="tel"
            name="phone"
            placeholder="Phone Number"
            value={formData.phone}
            onChange={handleChange}
            className="p-3 rounded-lg border bg-transparent"
          />
          <input
            type="text"
            name="image"
            placeholder="Image URL"
            value={formData.image}
            onChange={handleChange}
            className="p-3 rounded-lg border bg-transparent"
          />
          <textarea
            name="message"
            placeholder="Message or interest area..."
            value={formData.message}
            onChange={handleChange}
            rows={4}
            className="p-3 rounded-lg border bg-transparent"
            required
          />
          <button
            type="submit"
            disabled={submitting}
            className="bg-[color:var(--accent)] text-[color:var(--foreground)] px-6 py-3 rounded-xl font-semibold hover:scale-105 transition-transform disabled:opacity-50"
          >
            {submitting ? "Submitting..." : "Send Message"}
          </button>
          {success && (
            <>
            <p className="text-[color:var(--foreground)] font-semibold text-center">
              ✅ Your email has been sent successfully!
            </p>
            <p className="text-[color:var(--secondary)] text-center">We will get back to you soon.</p>
            </>
          )}
        </form>
      </div>
    </section>
  );
}
