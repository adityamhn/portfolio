"use client";

import { Envelope, GithubLogo, LinkedinLogo, XLogo } from "@phosphor-icons/react";

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
    label: "X/Twitter",
    icon: XLogo,
  },
  {
    href: "mailto:aditya@bugbase.ai",
    label: "Mail",
    icon: Envelope,
  },
];

export default function SocialLinks() {
  return (
    <section className="flex justify-start gap-6 mb-6">
      {socials.map(({ href, label, icon: Icon }) => (
        <a
          key={label}
          href={href}
          aria-label={label}
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-500 hover:text-[#FD5A57] transition-all duration-300"
        >
          <Icon size={28} weight="regular" />
        </a>
      ))}
    </section>
  );
}
