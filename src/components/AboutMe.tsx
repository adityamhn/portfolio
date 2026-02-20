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
          I don&apos;t have many interests outside of building things. Writing code, designing systems, making difficult architecture decisions — it&apos;s the only thing I&apos;m genuinely good at.<br />
          <br />
          I dropped out of my BTech at Manipal in 2021 because waiting felt like the wrong answer. Since then, I&apos;ve been building full-time.<br />
          <br />
          Four years in, I&apos;ve learned that most hard technical problems aren&apos;t actually technical. They&apos;re about how you decompose the problem, who you put in the room, and how fast you&apos;re willing to kill your own bad ideas.<br />
          <br />
          I build across the stack—frontend, backend and design, API design, deployment pipelines—because staying in one layer means missing how the pieces actually interact.<br />
          <br />
          Right now I&apos;m obsessed with the intersection of AI and security — specifically what breaks when you put an LLM in an autonomous loop with real systems. The attack surfaces are strange and underexplored. That&apos;s where I want to spend the next decade.<br />
          <br />
          If you&apos;re working on hard problems, building tools, or rethinking modern engineering—let&apos;s talk.<br />
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
