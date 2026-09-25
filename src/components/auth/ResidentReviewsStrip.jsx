import { useState, useEffect, useRef } from 'react';
import { Star } from 'lucide-react';

const REVIEWS = [
  {
    id: 1,
    quote: '"The best community I\'ve ever lived in!"',
    author: '- Rahul S.',
    room: 'Room 412 - Bed A',
    rating: 5,
  },
  {
    id: 2,
    quote: '"Hostello makes student life easy!"',
    author: '- Priya K.',
    room: 'Room 412 - Bed A',
    rating: 5,
  },
  {
    id: 3,
    quote: '"Secure and friendly, perfect!"',
    author: '- David L.',
    room: 'Room 412 - Bed A',
    rating: 5,
  },
  {
    id: 4,
    quote: '"Great amenities and management."',
    author: '- Anjali M.',
    room: 'Room 412 - Bed A',
    rating: 5,
  },
  {
    id: 5,
    quote: '"Everything is so close and convenient."',
    author: '- Arjun P.',
    room: 'Room 412 - Bed A',
    rating: 5,
  },
];

export default function ResidentReviewsStrip() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    if (isPaused) return;

    timerRef.current = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % REVIEWS.length);
    }, 1000); // 1-second interval

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPaused]);

  return (
    <div
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      className="w-full bg-[#140C08]/95 backdrop-blur-sm rounded-2xl lg:rounded-3xl p-5 sm:p-6 lg:p-7 border border-[#3A261A] shadow-xl relative overflow-hidden select-none"
    >
      {/* Subtle gold line flourishes in corners */}
      <div className="absolute top-2 left-3 w-12 h-6 border-t border-l border-[#8B6238]/30 pointer-events-none rounded-tl" />
      <div className="absolute top-2 right-3 w-12 h-6 border-t border-r border-[#8B6238]/30 pointer-events-none rounded-tr" />

      {/* ── Title ── */}
      <div className="text-center mb-3">
        <h3 className="text-base sm:text-lg font-serif font-medium text-[#F0DFCD] tracking-wide">
          What Our Residents Say
        </h3>
      </div>

      {/* ── 5 Cards Horizontal Grid ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-2.5 items-stretch">
        {REVIEWS.map((review, idx) => {
          const isActive = activeIndex === idx;
          return (
            <div
              key={review.id}
              onClick={() => setActiveIndex(idx)}
              className={`
                rounded-xl p-3 flex flex-col justify-between cursor-pointer transition-all duration-300
                bg-[#1E130D]/90 border
                ${isActive
                  ? 'border-[#D4B28C] shadow-lg shadow-black/60 scale-[1.02] bg-[#281810]'
                  : 'border-[#3D291D] opacity-80 hover:opacity-100 hover:border-[#6B4B36]'
                }
              `}
            >
              <div>
                {/* 5 Stars */}
                <div className="flex items-center gap-0.5 text-amber-400 mb-1.5">
                  {[...Array(review.rating)].map((_, i) => (
                    <Star key={i} size={11} fill="currentColor" />
                  ))}
                </div>

                {/* Quote Text */}
                <p className="text-xs font-semibold text-[#F7EDE2] leading-snug line-clamp-2">
                  {review.quote}
                </p>
              </div>

              {/* Author & Room Footer */}
              <div className="flex items-center justify-between text-[10px] text-[#A69383] mt-2 pt-1.5 border-t border-white/10">
                <span className="font-semibold text-[#E5CBA8]">{review.author}</span>
                <span className="font-normal opacity-80">{review.room}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Bottom Progress Bar ── */}
      <div className="w-full bg-[#2A1B13] h-1 rounded-full mt-4 overflow-hidden relative">
        <div
          className="h-full bg-gradient-to-r from-[#8B6238] via-[#D4B28C] to-[#FAF3EC] rounded-full transition-all duration-300 ease-out"
          style={{
            width: `${((activeIndex + 1) / REVIEWS.length) * 100}%`,
          }}
        />
      </div>
    </div>
  );
}
