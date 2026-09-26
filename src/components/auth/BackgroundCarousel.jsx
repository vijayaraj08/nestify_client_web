import { useState, useEffect, useMemo } from 'react';

const BACKGROUND_SLIDES = [
  {
    id: 1,
    title: 'Communal Gourmet Kitchen & Dining',
    image: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1920&q=85',
  },
  {
    id: 2,
    title: 'Contemporary Community Living Lounge',
    image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1920&q=85',
  },
  {
    id: 3,
    title: '24/7 Dedicated Co-working & Study Pods',
    image: 'https://images.unsplash.com/photo-1527192491265-7e15c55b1ed2?auto=format&fit=crop&w=1920&q=85',
  },
  {
    id: 4,
    title: 'Luxury Ensuite Suite & Private Living',
    image: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1920&q=85',
  },
  {
    id: 5,
    title: 'Skyline Rooftop Terrace & Social Deck',
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1920&q=85',
  },
];

/**
 * BackgroundCarousel
 * ──────────────────
 * Full-screen auto-rotating background image carousel.
 * - Changes exactly every 2 seconds.
 * - Smooth crossfade transition.
 * - Preloads all images to eliminate flicker.
 * - Includes a subtle dark gradient overlay for optimal foreground legibility.
 */
export default function BackgroundCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Preload images once on mount
  useEffect(() => {
    BACKGROUND_SLIDES.forEach((slide) => {
      const img = new Image();
      img.src = slide.image;
    });
  }, []);

  // 2-second auto rotation with cleanup
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % BACKGROUND_SLIDES.length);
    }, 2000);

    return () => clearInterval(timer);
  }, []);

  const slideElements = useMemo(() => {
    return BACKGROUND_SLIDES.map((slide, idx) => {
      const isActive = idx === currentIndex;
      return (
        <div
          key={slide.id}
          className={`
            absolute inset-0 w-full h-full bg-cover bg-center transition-opacity duration-1000 ease-in-out will-change-[opacity]
            ${isActive ? 'opacity-100 z-0' : 'opacity-0 z-[-1] pointer-events-none'}
          `}
          style={{
            backgroundImage: `url("${slide.image}")`,
          }}
          aria-hidden={!isActive}
        />
      );
    });
  }, [currentIndex]);

  return (
    <div className="fixed inset-0 w-full h-full overflow-hidden pointer-events-none select-none z-0">
      {/* Background image layers */}
      {slideElements}

      {/* Subtle overlay so foreground content is readable without making property images too dark */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-black/60 backdrop-brightness-[0.92]" />

      {/* Subtle bottom gradient for legal footer readability */}
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
    </div>
  );
}
