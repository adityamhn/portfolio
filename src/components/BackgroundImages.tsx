'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useHoverImages } from '@/context/HoverImageContext';

type ImageSlot = {
  src: string;
  side: 'left' | 'right';
  sideIndex: number;
  key: string;
};

export default function BackgroundImages() {
  const { imagesToShow } = useHoverImages();
  const [slots, setSlots] = useState<ImageSlot[]>([]);
  const [visible, setVisible] = useState(false);
  const exitTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const mouseYRef = useRef(0);
  const [anchorY, setAnchorY] = useState(0);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    mouseYRef.current = e.clientY;
  }, []);

  useEffect(() => {
    globalThis.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => globalThis.removeEventListener('mousemove', handleMouseMove);
  }, [handleMouseMove]);

  useEffect(() => {
    if (exitTimerRef.current) {
      clearTimeout(exitTimerRef.current);
      exitTimerRef.current = null;
    }

    if (imagesToShow.length > 0) {
      setAnchorY(mouseYRef.current);

      const leftCount = { n: 0 };
      const rightCount = { n: 0 };

      const newSlots: ImageSlot[] = imagesToShow.map((src: string, index: number) => {
        const side: 'left' | 'right' = index % 2 === 0 ? 'left' : 'right';
        const sideIndex = side === 'left' ? leftCount.n++ : rightCount.n++;
        return { src, side, sideIndex, key: `${src}-${index}` };
      });

      setSlots(newSlots);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setVisible(true);
        });
      });
    } else {
      setVisible(false);
      exitTimerRef.current = setTimeout(() => {
        setSlots([]);
      }, 700);
    }

    return () => {
      if (exitTimerRef.current) clearTimeout(exitTimerRef.current);
    };
  }, [imagesToShow]);

  if (slots.length === 0) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-0 hidden md:block overflow-hidden">
      {slots.map((slot, i) => {
        const fullHeight = 260;
        const halfHeight = fullHeight / 2;
        const yOffset = slot.sideIndex * 300;
        const isLeft = slot.side === 'left';
        const staggerDelay = i * 50;
        const hiddenTranslateX = isLeft ? '60px' : '-60px';
        const hiddenTransform = `scale(0.7) translateX(${hiddenTranslateX})`;
        const shownTransform = 'scale(1) translateX(0px)';
        const easing = `cubic-bezier(0.22, 1, 0.36, 1) ${staggerDelay}ms`;

        return (
          <div
            key={slot.key}
            className="absolute w-auto h-[240px] max-w-[240px]"
            style={{
              top: `${anchorY - halfHeight }px`,
              ...(isLeft
                ? { right: 'calc(50% + 25rem)' }
                : { left: 'calc(50% + 25rem)' }),
              transition: `opacity 0.55s ${easing}, transform 0.55s ${easing}`,
              opacity: visible ? 0.55 : 0,
              transform: visible ? shownTransform : hiddenTransform,
              transformOrigin: isLeft ? 'right center' : 'left center',
            }}
          >
            <img
              src={slot.src}
              alt=""
              className="w-full h-full object-contain rounded-sm"
              style={{
                filter: 'brightness(0.7)',
              }}
            />
            {/* <div
              className="absolute inset-0 rounded-sm"
              style={{
                background: `linear-gradient(to ${isLeft ? 'left' : 'right'}, rgba(3,3,3,0.6) 0%, transparent 50%)`,
              }}
            /> */}
          </div>
        );
      })}
    </div>
  );
}
