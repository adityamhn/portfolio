'use client';

import { GithubLogo, ArrowSquareOut } from "phosphor-react";
import { useHoverImages } from "@/context/HoverImageContext";

type Project = {
  title: string;
  desc: string;
  href?: string;
  date?: string;
  github?: string;
  images?: string[];
};

const projects: Project[] = [
  {
    title: "Pentest Copilot Enterprise",
    desc: "AI-native autonomous red teaming platform that maps attack surfaces, simulates realistic kill-chain behavior, and automates validation and reporting across web, API, and internal environments.",
    href: "https://copilot.bugbase.ai",
    date: "2023 - Present",
    images: [
      "/assets/pentest-copilot-enterprise/logo.svg",
      "/assets/pentest-copilot-enterprise/banner.jpg",
    ],
  },
  {
    title: "BugBase",
    desc: "A Continuous Vulnerability Assessment and Management Platform to identify, manage and mitigate real security vulnerabilities by plugging into Bug Bounty and Pentesting programs",
    href: "https://bugbase.ai",
    date: "2021 - Present",
    images: [],
  },
  // {
  //   title: "Pentest Copilot (Open Source)",
  //   desc: "Open-source autonomous pentesting project backed by published research (arXiv:2409.09493), with 250+ GitHub stars and a practical workflow for discovery, exploitation, and reporting.",
  //   href: "https://arxiv.org/abs/2409.09493",
  //   github: "https://github.com/bugbasesecurity/pentest-copilot",
  //   date: "",
  //   images: [],
  // },
  {
    title: "SynthChoice",
    desc: "Watch AI agents with real personalities pick choices in a simulated world and explain their choices. It's conjoint analysis that feels like SimCity—no surveys, no waiting, just instant insight into what drives customer decisions.",
    href: "https://devfolio.co/projects/synthchoice-2f37",
    github: "https://github.com/adityamhn/synthchoice",
    date: "2026",
    images: [],
  },
  {
    title: "DiffCast",
    desc: "Diffcast uses AI to watch your code changes and generate a perfect demo video the moment you merge. No more screen recording, no more explaining features—just instant, visual updates for your entire team.",
    github: "https://github.com/adityamhn/diffcast",
    date: "2026",
    images: [],
  },
  // {
  //   title: "Eye Can Do",
  //   desc: "Pentest Copilot is an open-source tool for performing security assessments on web applications. It is a full-stack application built with Next.js, Tailwind, FastAPI, Supabase, and Vercel.",
  //   href: "https://github.com/adityamhn/pentest-copilot",
  //   stack: ["Next.js", "Tailwind", "FastAPI", "Supabase", "Vercel"],
  //   date: "2026",
  //   images: [],
  // },
  {
    title: "Authify",
    desc: "Authify is a Role-Based Access Control (RBAC) platform designed to streamline the process of building and managing permissions. A Simple dashboard to manage users, roles and permissions.",
    github: "https://github.com/adityamhn/authify",
    date: "2024",
    images: [],
  },
  // {
  //   title: "Krypto Cards",
  //   desc: "Pentest Copilot is an open-source tool for performing security assessments on web applications. It is a full-stack application built with Next.js, Tailwind, FastAPI, Supabase, and Vercel.",
  //   href: "https://github.com/adityamhn/pentest-copilot",
  //   stack: ["Next.js", "Tailwind", "FastAPI", "Supabase", "Vercel"],
  //   date: "2026",
  //   images: [],
  // },
  {
    title: "Squad: On-Chain Encrypted AES-RSA File Management",
    desc: "Squad brings Google Drive-like access control to Web3, replacing 'public-by-default' IPFS storage with a novel AES-RSA encryption scheme. Now DAOs can securely manage sensitive files within specific teams, ensuring only authorized members hold the decryption keys.",
    href: "https://devfolio.co/projects/squad-onchain-encrypted-aesrsa-file-management-74b5",
    github: "https://github.com/Hackerbone/ethIndia22-cod3ine",
    date: "2022",
    images: [],
  },
  // {
  //   title: "Extra Tantra",
  //   desc: "Pentest Copilot is an open-source tool for performing security assessments on web applications. It is a full-stack application built with Next.js, Tailwind, FastAPI, Supabase, and Vercel.",
  //   href: "https://github.com/adityamhn/pentest-copilot",
  //   stack: ["Next.js", "Tailwind", "FastAPI", "Supabase", "Vercel"],
  //   date: "2026",
  //   images: [],
  // },
];

function ProjectRow({ project }: Readonly<{ project: Project }>) {
  const { setImagesToShow } = useHoverImages();
  const { title, desc, href, date, github, images } = project;

  return (
    <div
      className="group border-l-2 border-gray-800 pl-5 hover:border-[#FD5A57] transition-all duration-300"
      onMouseEnter={() => {
        if (images && images.length > 0) setImagesToShow(images);
      }}
      onMouseLeave={() => setImagesToShow([])}
    >
      <div className="flex flex-row items-start justify-between mb-2">
        <div className="flex items-baseline gap-3">
          <h3 className="text-xl font-waldenburg font-bold text-gray-100 group-hover:text-[#FD5A57] transition-colors duration-300">{title}</h3>
          {date && (
            <span className="text-xs text-gray-600 font-mono">{date}</span>
          )}
        </div>
        <span className="flex items-center gap-3">
          {github && (
            <a
              href={github}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub repo"
              className="text-gray-600 hover:text-[#FD5A57] transition-colors duration-300"
            >
              <GithubLogo size={20} weight="regular" />
            </a>
          )}
          {href && (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Live Project"
              className="text-gray-600 hover:text-[#FD5A57] transition-colors duration-300"
            >
              <ArrowSquareOut size={20} weight="regular" />
            </a>
          )}
        </span>
      </div>
      {title === "promptly" ? (
        <p className="text-gray-400 text-sm leading-relaxed">
          a friction-less prompt engineering browser extension, completely customizable, one click rewrites to supercharge your prompts. <span className="underline decoration-[#FD5A57] underline-offset-2">live and closed source</span> with 100+ users(as of 18/11/25).
        </p>
      ) : (
        <p className="text-gray-400 text-sm leading-relaxed">{desc}</p>
      )}
    </div>
  );
}

export default function ProjectsSection() {
  return (
    <section className="w-full max-w-3xl mb-12">
      <h2 className="text-2xl font-waldenburg font-bold mb-6 tracking-tight flex items-center gap-2">
        <span className="text-[#FD5A57]">&gt;</span> projects
      </h2>
      <div className="flex flex-col gap-8">
        {projects.map((project) => (
          <ProjectRow key={project.title} project={project} />
        ))}
      </div>
    </section>
  );
}
