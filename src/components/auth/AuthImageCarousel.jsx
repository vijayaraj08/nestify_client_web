import { useState, useEffect, useRef } from 'react';
import { Sparkles, ChevronLeft, ChevronRight } from 'lucide-react';

const CAROUSEL_SLIDES = [
  {
    id: 1,
    title: 'Communal Gourmet Kitchen',
    tag: 'Fully Equipped',
    description: 'Fully-equipped modern kitchen for culinary creativity and shared dining.',
    image: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 2,
    title: 'Shared Lounge',
    tag: 'Community Space',
    description: 'Contemporary community lounge designed for networking, relaxation, and movie nights.',
    image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 3,
    title: 'Co-working Space',
    tag: '24/7 Dedicated',
    description: 'High-speed optical fiber, ergonomic desks, and private acoustic study pods.',
    image: 'https://images.unsplash.com/photo-1527192491265-7e15c55b1ed2?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 4,
    title: 'Private Luxury Suite',
    tag: 'Premium Ensuite',
    description: 'Spacious single & premium double occupancy suites with ensuite bathrooms.',
    image: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 5,
    title: 'Rooftop Lounge & Cafe',
    tag: 'Skyline Terrace',
    description: 'Panoramic sunset views, artisan coffee bar, and weekend social gatherings.',
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
  },
];

export default function AuthImageCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    if (isPaused) return;

    timerRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % CAROUSEL_SLIDES.length);
    }, 1000); // 1-second auto cycle

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPaused]);

  const currentSlide = CAROUSEL_SLIDES[currentIndex];

  const handlePrev = (e) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev === 0 ? CAROUSEL_SLIDES.length - 1 : prev - 1));
  };

  const handleNext = (e) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % CAROUSEL_SLIDES.length);
  };

  return (
    <div
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      className="relative w-full h-full min-h-[440px] lg:min-h-[490px] rounded-2xl lg:rounded-3xl overflow-hidden shadow-xl border border-slate-800 bg-slate-900 flex flex-col justify-between p-6 sm:p-8 select-none group"
    >
      {/* ── Background Slides with Smooth Crossfade ── */}
      {CAROUSEL_SLIDES.map((slide, idx) => (
        <div
          key={slide.id}
          className={`
            absolute inset-0 transition-opacity duration-700 ease-in-out
            ${idx === currentIndex ? 'opacity-100 z-0' : 'opacity-0 pointer-events-none z-[-1]'}
          `}
        >
          <img
            src={slide.image}
            alt={slide.title}
            className="w-full h-full object-cover"
          />
          {/* Subtle multi-stop gradient for readable text overlays */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/30" />
        </div>
      ))}

      {/* ── Top Header Bar (Logo Left, Slide Counter Right) ── */}
      <div className="relative z-10 flex items-center justify-between">
        {/* Brand Logo */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-black/40 backdrop-blur-md border border-white/20 flex items-center justify-center text-[#818CF8]">
            <Sparkles size={16} />
          </div>
          <div>
            <span className="text-lg font-bold tracking-tight text-white font-serif leading-none block">
              Hostello
            </span>
            <span className="text-[9px] uppercase tracking-widest text-indigo-200/80 font-semibold">
              LUXURY CO-LIVING
            </span>
          </div>
        </div>

        {/* Counter Badge */}
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/50 backdrop-blur-md border border-white/15 text-[11px] font-mono text-white/90">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>0{currentIndex + 1}</span>
          <span className="opacity-40">|</span>
          <span className="opacity-70">0{CAROUSEL_SLIDES.length}</span>
        </div>
      </div>

      {/* ── Navigation Arrows ── */}
      <div className="relative z-10 flex justify-between items-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none px-1">
        <button
          type="button"
          onClick={handlePrev}
          className="pointer-events-auto w-8 h-8 rounded-full bg-black/50 hover:bg-black/80 text-white backdrop-blur-md border border-white/20 flex items-center justify-center transition-transform active:scale-95 cursor-pointer shadow"
          aria-label="Previous image"
        >
          <ChevronLeft size={16} />
        </button>
        <button
          type="button"
          onClick={handleNext}
          className="pointer-events-auto w-8 h-8 rounded-full bg-black/50 hover:bg-black/80 text-white backdrop-blur-md border border-white/20 flex items-center justify-center transition-transform active:scale-95 cursor-pointer shadow"
          aria-label="Next image"
        >
          <ChevronRight size={16} />
        </button>
      </div>

      {/* ── Bottom Info & Tag ── */}
      <div className="relative z-10 mt-auto">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-black/50 border border-white/20 backdrop-blur-md text-[11px] text-indigo-100 font-medium mb-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[#818CF8]" />
          <span>{currentSlide.tag}</span>
        </div>

        <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight drop-shadow-md">
          {currentSlide.title}
        </h3>

        <p className="text-xs sm:text-sm text-slate-200 mt-1 leading-relaxed max-w-md drop-shadow line-clamp-2">
          {currentSlide.description}
        </p>
      </div>
    </div>
  );
}
