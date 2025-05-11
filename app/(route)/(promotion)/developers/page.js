import { Github, Linkedin } from "lucide-react";

export default function DevelopersPage() {
  const developers = [
    {
      _id: 2,
      name: "Nilesh Kumar",
      role: "Backend Developer",
      bio: "Hi! I am passonate about web development. I am a computer science student and I have a passion for web development.",
      image: "/next.svg",
      github: "https://github.com/nileshkumaryadav1",
      linkedin: "https://www.linkedin.com/in/nileshkumar123/",
    },
  ];
  return (
    <section className="py-12 px-6 sm:px-12 lg:px-24">
      <div className="max-w-6xl mx-auto text-center">
        <h2 className="text-2xl sm:text-3xl font-bold mb-6">Our Developers</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {developers.map((developer) => (
            <DeveloperCard
              key={developer._id}
              name={developer.name}
              role={developer.role}
              bio={developer.bio}
              image={developer.image}
              github={developer.github}
              linkedin={developer.linkedin}
            />
          ))}
        </div>
      </div>
    </section>
  );

  function DeveloperCard({ name, role, bio, image, github, linkedin }) {
    return (
      <div className="p-6 bg-gray-100 rounded-lg shadow-md">
        <img
          src={image}
          alt={name}
          className="w-32 h-32 rounded-full mx-auto"
        />
        <h3 className="text-xl font-bold mt-4">{name}</h3>
        <p className="text-gray-600">{role}</p>
        <p className="text-gray-600 my-2">{bio}</p>
        <div className="mt-4 flex justify-center space-x-4">
          <a href={github} className="hover:text-blue-400">
            <Github size={24} />
          </a>
          <a href={linkedin} className="hover:text-blue-400">
            <Linkedin size={24} />
          </a>
        </div>
      </div>
    );
  }
}
