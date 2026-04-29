type Experience = {
  role: string;
  company: string;
  location: string;
  period: string;
  notes: string[];
};

const experiences: Experience[] = [
  {
    role: "Co-Founder & Chief Technology Officer",
    company: "BugBase",
    location: "Delhi, India",
    period: "May 2021 - Present",
    notes: [],
  },
  {
    role: "Co-Founder & Chief Technology Officer",
    company: "Krypto Cards LLP",
    location: "Manipal, Karnataka, India",
    period: "Jun 2021 - Feb 2022",
    notes: [],
  },
  {
    role: "Frontend Engineer Intern",
    company: "ZAAMO",
    location: "Remote",
    period: "Feb 2022 - Apr 2022",
    notes: [],
  },
  {
    role: "Management Committee Member",
    company: "IECSE",
    location: "Manipal, Karnataka, India",
    period: "Jan 2021 - Mar 2022",
    notes: [],
  },
];

export default function ExperienceSection() {
  return (
    <section className="w-full max-w-3xl mb-12">
      <h2 className="text-2xl font-waldenburg font-bold mb-6 tracking-tight flex items-center gap-2">
        <span className="text-[#FD5A57]">&gt;</span> experience
      </h2>
      <div className="flex flex-col gap-8">
        {experiences.map(({ role, company, location, period, notes }) => (
          <article
            key={`${company}-${period}`}
            className="border-l-2 border-gray-800 pl-5 hover:border-[#FD5A57] transition-all duration-300"
          >
            <div className="flex flex-col md:flex-row md:items-baseline md:justify-between gap-2 mb-3">
              <div>
                <h3 className="text-lg font-waldenburg font-bold text-gray-100">{role}</h3>
                <p className="text-sm text-gray-400">
                  {company} · {location}
                </p>
              </div>
              <span className="text-xs text-gray-600 font-mono">{period}</span>
            </div>
            <ul className="space-y-2 text-sm text-gray-400 leading-relaxed">
              {notes.map((note) => (
                <li key={note} className="flex gap-2">
                  <span className="text-[#FD5A57]">•</span>
                  <span>{note}</span>
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </section>
  );
}
