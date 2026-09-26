import { useNavigate } from 'react-router-dom';
import BackgroundCarousel from '../components/auth/BackgroundCarousel';
import BrandOverlay from '../components/auth/BrandOverlay';
import QuoteSection from '../components/auth/QuoteSection';
import AuthPanel from '../components/auth/AuthPanel';
import LegalFooter from '../components/auth/LegalFooter';
import { getDefaultRouteForRole } from '../auth/role.utils';

/**
 * Login / Authentication Page
 * ────────────────────────────
 * Full-screen premium authentication experience:
 * - 100vw x 100vh property image auto-carousel (crossfades every 2s)
 * - Subtle dark overlay for high foreground contrast
 * - Top-left Hostello branding & center-left quote
 * - Right-side centered authentication panel (Sign In / Sign Up) with RBAC redirection
 * - Bottom legal links (Terms, Privacy, Cookies)
 */
export default function Login() {
  const navigate = useNavigate();

  const handleLoginSuccess = (result) => {
    if (result && result.user) {
      const targetRoute = getDefaultRouteForRole(result.user.role);
      navigate(targetRoute, { replace: true });
    }
  };

  return (
    <div className="min-h-screen w-full relative flex flex-col justify-between p-4 sm:p-6 md:p-8 lg:p-12 overflow-x-hidden selection:bg-indigo-500/30 selection:text-white">
      {/* ── 1. Full-Viewport Dynamic Background Carousel (2s Interval) ── */}
      <BackgroundCarousel />

      {/* ── 2. Top-Left Branding ── */}
      <header className="relative z-10 w-full mb-4 sm:mb-6">
        <BrandOverlay />
      </header>

      {/* ── 3. Main Body: Left Quote + Right Auth Panel ── */}
      <main className="relative z-10 w-full max-w-7xl mx-auto flex-1 flex items-center my-auto py-4">
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Hospitality Quote & Brand Value */}
          <div className="hidden lg:flex lg:col-span-6 xl:col-span-7 flex-col justify-center pr-4">
            <QuoteSection />
          </div>

          {/* Right Column: Centered Auth Panel */}
          <div className="col-span-1 lg:col-span-6 xl:col-span-5 flex justify-center lg:justify-end w-full">
            <AuthPanel onLoginSuccess={handleLoginSuccess} />
          </div>
        </div>
      </main>

      {/* ── 4. Bottom Legal Footer ── */}
      <div className="relative z-10 w-full pt-4 mt-auto">
        <LegalFooter />
      </div>
    </div>
  );
}
