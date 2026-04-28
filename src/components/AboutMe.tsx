"use client";
import { useState, useRef, useEffect } from "react";
import { ArrowDown } from "phosphor-react";

export default function AboutMe() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  function useIsBigScreen() {
    const [isBig, setIsBig] = useState(false);
    useEffect(() => {
      const check = () => setIsBig(window.innerWidth >= 768);
      check();
      window.addEventListener("resize", check);
      return () => window.removeEventListener("resize", check);
    }, []);
    return isBig;
  }


  const isBigScreen = useIsBigScreen();
  const collapsedHeight = isBigScreen ? "12rem" : "15.5rem";
  const [maxHeight, setMaxHeight] = useState<string>("0px");
  useEffect(() => {
    if (ref.current) setMaxHeight(`${ref.current.scrollHeight}px`);
  }, []);

  return (
    <section className="mx-auto mb-12 text-gray-300 text-sm md:text-base leading-relaxed">
      <div
        ref={ref}
        style={{
          maxHeight: open ? maxHeight : collapsedHeight,
          transition: "max-height 800ms cubic-bezier(0.22,1,0.36,1)",
          willChange: "max-height, opacity, transform"
        }}
        className="relative overflow-hidden"
      >
        <p className="transition-opacity duration-500 ease-out">
          I&apos;ve tried and failed at many things but succeeded at a few that truly stuck with me. In fact, I succeeded because I stuck with those.<br />
          <br />
          I&apos;m Aditya Peela, a builder, ex co-founder &amp; chief technology officer @ BugBase. I co-founded BugBase at 19 and my recent proudest build was Pentest Copilot, an autonomous AI agent that finds real security vulnerabilities without any human in the loop, aims to replace security red teams. <a
            href="https://copilot.bugbase.ai"
            target="_blank"
            rel="noopener noreferrer"
            className="underline decoration-gray-600 underline-offset-2 hover:text-[#FD5A57] hover:decoration-[#FD5A57] transition-colors"
          >
            Learn more here
          </a><br />
          <br />
          In 2021, I dropped out of my undergraduate program at Manipal to focus on building software.<br />
          <br />
          The problem I find most interesting right now is the gap between &ldquo;this clearly has this capability to work in theory&rdquo; and &ldquo;building something that actually does it reliably in the real world.&rdquo; That&apos;s what I&apos;ve been working on for the past 5 years, and it&apos;s what I&apos;m chasing next.<br />
        </p>

        {!open && (
          <div
            className="
              pointer-events-none absolute inset-x-0 bottom-0
              h-20
              bg-gradient-to-b from-transparent via-[#000000]/50 to-[#000000]
              transition-opacity duration-500
            "
          />
        )}
        {!open && (
          <button
            onClick={() => setOpen(true)}
            aria-expanded={open}
            className="
              group absolute bottom-1 left-1/2 -translate-x-1/2 z-20
              px-4 py-1.5 text-gray-400 text-xs font-medium
              border border-gray-800 bg-[#0a0a0a] hover:border-[#FD5A57] hover:text-[#FD5A57]
              transition-all duration-300 ease-out
              cursor-pointer
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FD5A57]/30
              flex items-center gap-1
            "
          >
            <span>read more</span>
            <ArrowDown className="h-3 w-3 flex-shrink-0" />
          </button>
        )}
      </div>

      {open && (
        <button
          onClick={() => setOpen(false)}
          aria-expanded={open}
          className="
            group mx-auto mt-3 flex items-center gap-1 px-4 py-1.5
            text-gray-400 text-xs font-medium cursor-pointer
            border border-gray-800 bg-[#0a0a0a] hover:border-[#FD5A57] hover:text-[#FD5A57]
            transition-all duration-300 ease-out
            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FD5A57]/30
          "
        >
          show less
          <ArrowDown className="rotate-180 h-3 w-3 flex-shrink-0" />
        </button>
      )}
    </section>
  );
}
