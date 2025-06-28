const ContactSection = () => {
  return (
    <section className="bg-[#1e1f3b] text-white py-20 px-6 sm:px-16">
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="text-3xl font-bold text-[#00F0FF] mb-6">Get in Touch</h2>
        <p className="text-slate-300 mb-6">Have questions or want to collaborate? Reach out to the organizing team.</p>
        <a
          href="mailto:techfest@gmail.com"
          className="inline-block px-6 py-3 bg-[#00F0FF] text-black font-semibold rounded-lg hover:bg-[#00d0dd] transition"
        >
          techfest@gmail.com
        </a>
      </div>
    </section>
  );
};

export default ContactSection;
