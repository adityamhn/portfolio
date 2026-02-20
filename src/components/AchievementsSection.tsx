type Achievement = {
  title: string;
  subtitle: string;
  date: string;
  prize?: string;
};

const achievements: Achievement[] = [
  {
    title: "Published AI Security Research",
    subtitle: "published work on AI/ML for vulnerability detection and presented findings in security research circles",
    date: "2024",
  },
  {
    title: "Winner — MHash Manipal Hackathon",
    subtitle: "national-level hackathon",
    date: "2024",
  },
  {
    title: "Track Prize Winner — ETH India",
    subtitle: "won track prizes across ETH India 2023 and ETH India 2022",
    date: "2023 / 2022",
    prize: "$5,000",
  },
  {
    title: "Runner-up — iNeuron Hackathon",
    subtitle: "national-level hackathon",
    date: "2022",
  },
  {
    title: "Mentored 100+ Students at IECSE",
    subtitle: "ran technical workshops in web development as management committee member",
    date: "2022 - 2024",
  },
  {
    title: "Winner — Reva Hack",
    subtitle: "national-level hackathon",
    date: "2021",
  },
  {
    title: "Winner — HackOWasp",
    subtitle: "national-level hackathon",
    date: "2021",
  },
];

export default function AchievementsSection() {
  return (
    <section className="w-full max-w-3xl mb-12">
      <h2 className="text-2xl font-waldenburg font-bold mb-6 tracking-tight flex items-center gap-2">
        <span className="text-[#FD5A57]">&gt;</span> achievements
      </h2>
      <div className="flex flex-col gap-6">
        {achievements.map(({ title, subtitle, date, prize }) => (
          <div
            key={title}
            className="group border-l-2 border-gray-800 pl-6 hover:border-[#FD5A57] transition-all duration-300"
          >
            <div className="flex items-baseline gap-3 mb-1">
              <h3 className="text-base font-waldenburg font-bold text-gray-100 group-hover:text-[#FD5A57] transition-colors duration-300">
                {title}
              </h3>
              {prize && (
                <span className="text-sm font-mono text-[#FD5A57]">· {prize}</span>
              )}
              <span className="text-xs text-gray-600 font-mono">{date}</span>
            </div>
            <p className="text-sm text-gray-400 font-mono">{subtitle}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
