'use client';

import Image from 'next/image';

export default function ProfileSection() {

  return (
    <section className="flex flex-col md:flex-row items-start gap-10 mb-8">
      <div className="flex flex-col gap-3 font-waldenburg">
        <h1
          className="text-4xl md:text-5xl tracking-tight leading-none cursor-default font-medium "
        >
          Aditya Peela

        </h1>
        <p className="text-gray-400 text-base md:text-lg flex items-center gap-2">
          <span>co-founder & chief technology officer @ BugBase</span>
          <Image
            src="/assets/profile/bugbase.png"
            alt="BugBase"
            width={24}
            height={24}
            className="inline-block shrink-0 rounded-sm border border-gray-800"
          />
        </p>
      </div>
    </section>
  );
}
