"use client";

import Link from "next/link";
import { BookOpen, NotePencil } from "phosphor-react";

type WritingItem = {
  id: string;
  title: string;
  subtitle?: string;
  type: "paper" | "blog";
  href: string;
};

const TYPE_META: Record<WritingItem["type"], { label: string; Icon: React.ElementType }> = {
  paper: { label: "Research Paper", Icon: BookOpen },
  blog: { label: "Blog Post", Icon: NotePencil },
};

const WRITING_AND_RESEARCH: WritingItem[] = [
  {
    id: "1",
    title: "Hacking, The Lazy Way: LLM Augmented Pentesting",
    subtitle: "An agentic AI system for autonomous penetration testing using LLMs.",
    type: "paper",
    href: "https://arxiv.org/abs/2409.09493",
  },
  {
    id: "2",
    title: "How to Implement Role-Based Access Control",
    subtitle: "A practical guide to designing and enforcing RBAC in modern applications.",
    type: "blog",
    href: "https://medium.com/@adityapeela/how-to-implement-role-based-access-control-cb1aa7b4e6ab",
  },
  {
    id: "3",
    title: "Understanding Single Sign-On (SSO)",
    subtitle: "Breaking down SSO protocols, flows, and implementation strategies.",
    type: "blog",
    href: "https://medium.com/@adityapeela/understanding-single-sign-on-sso-23606cc12e99",
  },
];

export default function Blogs() {
  return (
    <section className="mx-auto mb-16 max-w-3xl">
      <h2 className="text-2xl font-waldenburg font-bold mb-6 tracking-tight flex items-center gap-2">
        <span className="text-[#FD5A57]">&gt;</span> research & writing
      </h2>

      <div className="space-y-0">
        <p className="text-gray-400 mb-2 text-sm">
          Read my research papers and blog posts.
        </p>
        {WRITING_AND_RESEARCH.map((item) => {
          const { label, Icon } = TYPE_META[item.type];

          const content = (
            <>
              <Icon
                weight="duotone"
                className="mt-0.5 shrink-0 h-5 w-5 text-gray-500 group-hover:text-[#FD5A57] transition-colors duration-300"
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-500 mb-1">{label}</p>
                <p className="text-base font-medium text-gray-200 group-hover:text-[#FD5A57] transition-colors duration-300 leading-snug">
                  {item.title}
                </p>
                {item.subtitle && (
                  <p className="mt-1 text-sm text-gray-500 leading-snug">
                    {item.subtitle}
                  </p>
                )}
              </div>
            </>
          );

          return (
            <Link
              key={item.id}
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-start gap-4 pt-5 pb-6 border-b border-gray-800 hover:border-[#FD5A57] transition-colors duration-300"
            >
              {content}
            </Link>
          );
        })}
      </div>
    </section>
  );
}
