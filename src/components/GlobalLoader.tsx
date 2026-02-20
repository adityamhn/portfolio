"use client";

import { useState, useEffect } from "react";

function waitForImage(img: HTMLImageElement): Promise<void> {
  if (img.complete) return Promise.resolve();

  return new Promise((resolve) => {
    const done = () => resolve();
    img.addEventListener("load", done, { once: true });
    img.addEventListener("error", done, { once: true });
  });
}

function waitForAllImages(): Promise<void> {
  const images = Array.from(document.images);
  return Promise.all(images.map(waitForImage)).then(() => undefined);
}

function waitForFonts(): Promise<void> {
  return document.fonts.ready.then(() => undefined);
}

function waitForWindowLoad(): Promise<void> {
  if (document.readyState === "complete") return Promise.resolve();

  return new Promise((resolve) => {
    globalThis.addEventListener("load", () => resolve(), { once: true });
  });
}

export default function GlobalLoader() {
  const [loading, setLoading] = useState(true);
  const [canHide, setCanHide] = useState(false);

  useEffect(() => {
    let mounted = true;
    const finishLoading = async () => {
      await Promise.all([waitForAllImages(), waitForFonts(), waitForWindowLoad()]);
    };

    const minDisplayTimer = globalThis.setTimeout(() => {
      if (mounted) setCanHide(true);
    }, 500);

    finishLoading().finally(() => {
      if (mounted) setLoading(false);
    });

    return () => {
      mounted = false;
      globalThis.clearTimeout(minDisplayTimer);
    };
  }, []);

  const showLoader = loading || !canHide;

  return (
    <div
      className={`fixed inset-0 z-[9999] bg-[#0a0a0a] grid place-items-center transition-opacity duration-500 ${
        showLoader ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
    >
      <span className="sr-only">Loading content</span>
      <div className="relative h-12 w-12" aria-hidden="true">
        <div className="absolute inset-0 rounded-full border border-[#262626]" />
        <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-[#FD5A57] border-r-[#FD5A57] animate-spin" />
      </div>
    </div>
  );
}
