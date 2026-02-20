type Education = {
  degree: string;
  institution: string;
  period: string;
  coursework: string[];
};

const education: Education = {
  degree: "Bachelor of Technology in Information Technology",
  institution: "Manipal Institute of Technology",
  period: "2020 - 2026",
  coursework: [],
};

export default function EducationSection() {
  return (
    <section className="w-full max-w-3xl mb-12">
      <h2 className="text-2xl font-waldenburg font-bold mb-6 tracking-tight flex items-center gap-2">
        <span className="text-[#FD5A57]">&gt;</span> education
      </h2>

      <article className="border-l-2 border-gray-800 pl-5 hover:border-[#FD5A57] transition-all duration-300">
        <div className="flex flex-col md:flex-row md:items-baseline md:justify-between gap-2 mb-3">
          <div>
            <h3 className="text-lg font-waldenburg font-bold text-gray-100">
              {education.degree}
            </h3>
            <p className="text-sm text-gray-400">{education.institution}</p>
          </div>
          <span className="text-xs text-gray-600 font-mono">{education.period}</span>
        </div>

        {/* <p className="text-xs text-gray-500 mb-2 font-mono">relevant coursework</p>
        <div className="flex flex-wrap gap-2">
          {education.coursework.map((item) => (
            <span
              key={item}
              className="text-xs px-2 py-1 border border-gray-800 text-gray-400 hover:border-[#FD5A57] hover:text-[#FD5A57] transition-all duration-300"
            >
              {item}
            </span>
          ))}
        </div> */}
      </article>
    </section>
  );
}
