'use client';
import { GithubLogo, LinkedinLogo, Envelope } from "phosphor-react";
import { XLogoIcon } from "@phosphor-icons/react";

const socials = [
  {
    href: "https://github.com/adityamhn",
    label: "GitHub",
    icon: GithubLogo,
  },
  {
    href: "https://www.linkedin.com/in/adityapeela/",
    label: "LinkedIn",
    icon: LinkedinLogo,
  },
  {
    href: "https://x.com/adityapeela",
    label: "X (Twitter)",
    icon: XLogoIcon,
  },
  {
    href: "mailto:aditya@bugbase.ai",
    label: "Email",
    icon: Envelope,
  },
];

export default function ReachOut() {
  return (
    <section id="reachout" className="mx-auto mb-16">
      <h2 className="text-2xl font-waldenburg font-bold mb-6 tracking-tight flex items-center gap-2">
        <span className="text-[#FD5A57]">&gt;</span> contact
      </h2>
      <p className="text-gray-400 mb-6 text-sm">
        Always open to new ideas and conversations, new connections and collaborations. Reach out anytime!
      </p>
      <div className="flex flex-row gap-5">
        {socials.map(({ href, label, icon: Icon }) => (
          <a
            key={label}
            href={href}
            aria-label={label}
            target={href.startsWith("mailto:") ? undefined : "_blank"}
            rel={href.startsWith("mailto:") ? undefined : "noopener noreferrer"}
            className="text-gray-600 hover:text-[#FD5A57] transition-all duration-300"
          >
            <Icon size={24} weight="regular" />
          </a>
        ))}
      </div>
    </section>
  );
}
