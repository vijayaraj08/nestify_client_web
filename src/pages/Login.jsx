import { useState } from 'react';
import AuthImageCarousel from '../components/auth/AuthImageCarousel';
import AuthPanel from '../components/auth/AuthPanel';
import ResidentReviewsStrip from '../components/auth/ResidentReviewsStrip';

/**
 * Login / Authentication Page
 * ────────────────────────────
 * Integrated Full-Page Layout:
 * - Background blueprint grid & architectural lines visible across entire 100vw x 100vh viewport
 * - No outer white container box
 * - Top-Left: Promotional Image Carousel Card
 * - Top-Right: Login / Sign Up Authentication Panel Card
 * - Bottom: Full-Width "What Our Residents Say" Dark Review Strip
 */
export default function Login() {
  const [user, setUser] = useState(null);

  const handleLoginSuccess = (result) => {
    setUser(result.user);
  };

  /* ── Success State Overlay ── */
  if (user) {
    return (
      <div className="min-h-screen bg-[#F5EFEB] flex flex-col justify-between p-4 sm:p-6 relative overflow-hidden">
        {/* Full-viewport architectural grid */}
        <div 
          className="fixed inset-0 pointer-events-none opacity-[0.14]"
          style={{
            backgroundImage: `
              linear-gradient(to right, #8B6238 1px, transparent 1px),
              linear-gradient(to bottom, #8B6238 1px, transparent 1px)
            `,
            backgroundSize: '54px 54px',
          }}
        />

        <div className="flex-1 flex items-center justify-center relative z-10">
          <div className="bg-white rounded-3xl border border-[#E8DFC8] shadow-2xl p-8 sm:p-10 max-w-md w-full text-center animate-scale-in">
            <div className="w-16 h-16 rounded-full bg-[#FAF3EC] border border-[#E0D0C0] flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-[#8B6238]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-[#221612] mb-1">
              Welcome back, {user.name || 'Resident'}!
            </h2>
            <p className="text-sm text-stone-500 mb-2">
              Signed in as <span className="font-semibold text-[#8B6238]">{user.email}</span>
            </p>
            <div className="inline-flex items-center gap-2 text-xs font-semibold px-3 py-1 rounded-full bg-[#FAF3EC] text-[#8B6238] border border-[#E0D0C0] mb-6">
              <span>Role: {user.role || 'Resident'}</span>
            </div>
            <div className="p-3.5 bg-[#FAF8F5] rounded-xl border border-[#EDE4D8] text-xs text-stone-600 mb-6 text-left">
              <p className="font-semibold text-stone-800">Current Residence:</p>
              <p className="text-stone-600 mt-0.5">Veda North Wing &bull; Floor 04 &bull; Room 412 (Bed A)</p>
            </div>
            <button
              type="button"
              onClick={() => setUser(null)}
              className="text-xs font-semibold text-[#8B6238] hover:underline cursor-pointer"
            >
              Sign out / switch account
            </button>
          </div>
        </div>

        <footer className="text-center py-3 text-xs text-stone-400 relative z-10">
          © {new Date().getFullYear()} Hostello — Living Experience Redefined
        </footer>
      </div>
    );
  }

  /* ── Full-Page Integrated Authentication Layout ── */
  return (
    <div className="min-h-screen bg-[#F5EFEB] flex flex-col justify-center items-center relative overflow-x-hidden p-4 sm:p-6 lg:p-8 xl:p-10 selection:bg-[#8B6238]/20 selection:text-[#45301B]">
      {/* ── Full-Page Blueprint Grid & Watermark (Visible into all 4 corners) ── */}
      <div 
        className="fixed inset-0 pointer-events-none opacity-[0.14]"
        style={{
          backgroundImage: `
            linear-gradient(to right, #8B6238 1px, transparent 1px),
            linear-gradient(to bottom, #8B6238 1px, transparent 1px)
          `,
          backgroundSize: '54px 54px',
        }}
      />

      {/* Decorative architectural floorplan geometric curves */}
      <div className="fixed -top-32 -left-32 w-[650px] h-[650px] rounded-full border border-[#8B6238]/15 pointer-events-none" />
      <div className="fixed -bottom-32 -right-32 w-[750px] h-[750px] rounded-full border border-[#8B6238]/15 pointer-events-none" />
      <div className="fixed top-1/2 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#8B6238]/10 to-transparent pointer-events-none" />

      {/* ── Integrated Direct Content Grid (No wrapping card) ── */}
      <main className="w-full max-w-[1380px] 2xl:max-w-[1480px] relative z-10 flex flex-col gap-4 sm:gap-5 my-auto">
        {/* ── Top Row: Image Carousel (Left) + Auth Panel (Right) ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-5 items-stretch">
          {/* Top-Left: Promotional Image Carousel Card */}
          <div className="lg:col-span-6 flex">
            <AuthImageCarousel />
          </div>

          {/* Top-Right: Dynamic Login / Signup Form Card */}
          <div className="lg:col-span-6 flex">
            <AuthPanel onLoginSuccess={handleLoginSuccess} />
          </div>
        </div>

        {/* ── Bottom Row: Resident Reviews Dark Strip (Full Width) ── */}
        <div className="w-full">
          <ResidentReviewsStrip />
        </div>
      </main>
    </div>
  );
}
