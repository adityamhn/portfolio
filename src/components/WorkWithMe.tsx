export default function WorkWithMe() {
    return (
      <section className="mx-auto mb-12">
        <h2 className="text-2xl font-waldenburg font-bold mb-6 tracking-tight flex items-center gap-2">
          <span className="text-[#FD5A57]">&gt;</span> work
        </h2>
        <p className="text-gray-300 mb-3 text-sm">
          open to:
        </p>
        <ul className="mb-4 space-y-1 text-gray-400 text-sm">
          <li className="flex items-start gap-2">
            <span className="text-[#FD5A57]">★</span>
            <span>freelance engineering, consulting and ai projects</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-[#FD5A57]">★</span>
            <span>internships that have genuinely high-growth potential or are really interesting</span>
          </li>
        </ul>
        <p className="text-gray-400 text-sm">
          if you have an opportunity you think i&apos;d be interested in or want to build something ambitious,{" "}
          <a
            href="#reachout"
            className="text-[#FD5A57] hover:underline transition-colors duration-300"
          >
            reach out
          </a>
          .
        </p>
      </section>
    );
  }






  