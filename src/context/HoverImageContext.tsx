'use client';

import { createContext, useContext, useState, useMemo, ReactNode } from 'react';

type HoverImageContextType = {
  imagesToShow: string[];
  setImagesToShow: (images: string[]) => void;
};

const HoverImageContext = createContext<HoverImageContextType>({
  imagesToShow: [],
  setImagesToShow: () => {},
});

export function HoverImageProvider({ children }: Readonly<{ children: ReactNode }>) {
  const [imagesToShow, setImagesToShow] = useState<string[]>([]);

  const value = useMemo(
    () => ({ imagesToShow, setImagesToShow }),
    [imagesToShow],
  );

  return (
    <HoverImageContext.Provider value={value}>
      {children}
    </HoverImageContext.Provider>
  );
}

export function useHoverImages() {
  return useContext(HoverImageContext);
}
