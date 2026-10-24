import { useState, useEffect } from 'react';
import { MessageCircle, ArrowUp } from 'lucide-react';
import { Language } from './types';
import Header from './components/Header';
import FlagshipHomepage from './components/FlagshipHomepage';
import ServicesGrid from './components/ServicesGrid';
import RealGallery from './components/RealGallery';
import SocialShowcase from './components/SocialShowcase';
import QuoteEstimator from './components/QuoteEstimator';
import LocationContact from './components/LocationContact';
import Footer from './components/Footer';
import GoogleWorkspaceHub from './components/GoogleWorkspaceHub';
import { BUSINESS_INFO } from './data/content';

export default function App() {
  const [lang, setLang] = useState<Language>('es');
  const [quotaExceeded, setQuotaExceeded] = useState(false);
  const [isWorkspaceOpen, setIsWorkspaceOpen] = useState(false);

  useEffect(() => {
    const handleQuota = () => setQuotaExceeded(true);
    window.addEventListener('gmp-quota-exceeded', handleQuota);
    return () => window.removeEventListener('gmp-quota-exceeded', handleQuota);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#07090c] text-neutral-100 flex flex-col selection:bg-emerald-500 selection:text-neutral-950 scroll-smooth font-['Plus_Jakarta_Sans',sans-serif] relative">
      
      {quotaExceeded && (
        <div className="bg-amber-50 border-b border-amber-200 text-amber-900 px-4 py-2.5 text-xs md:text-sm text-center sticky top-0 z-50 shadow-sm">
          <span>
            Google Maps Platform quota reached. If you are the app owner, visit{' '}
            <a
              href="https://developers.google.com/maps/ai/ai-studio?utm_campaign=gmp_mcp_codeassist_v1_aistudio#quota_exceeded_errors"
              target="_blank"
              rel="noopener noreferrer"
              className="underline font-semibold text-amber-950 hover:text-amber-800"
            >
              maps developer site
            </a>{' '}
            for instructions to update your account.
          </span>
        </div>
      )}

      {/* 1. Header with Brand Identity, Shield Logo, Google Workspace Hub Button and Socials */}
      <Header onOpenWorkspace={() => setIsWorkspaceOpen(true)} />

      {/* Google Workspace & Firebase Hub Modal */}
      <GoogleWorkspaceHub
        isOpen={isWorkspaceOpen}
        onClose={() => setIsWorkspaceOpen(false)}
      />

      <main className="flex-1 relative z-10">
        {/* 2. New Flagship Homepage (Dark Carbon Fiber Theme, High-Gloss Sports Car, 3 Tabs, Recent Works & Instagram) */}
        <FlagshipHomepage />

        {/* 3. Core Services Breakdown (Target for "Servicios" tab) */}
        <ServicesGrid lang={lang} />

        {/* 4. Real Photos Gallery (Target for "Galería" tab & "Ver galería completa") */}
        <RealGallery lang={lang} />

        {/* 5. Official Social Proof & Real Customer Highlights */}
        <SocialShowcase lang={lang} />

        {/* 6. Quick Online Quote Calculator */}
        <QuoteEstimator lang={lang} />

        {/* 7. Location, Embedded Google Maps & Contact (Target for "Ubicación" tab) */}
        <LocationContact lang={lang} />
      </main>

      {/* 8. Modern Quiet Footer */}
      <Footer lang={lang} />

      {/* Floating Action Buttons */}
      <div className="fixed bottom-6 right-6 z-40 flex items-center gap-2.5">
        <button
          onClick={scrollToTop}
          aria-label="Volver arriba"
          className="w-11 h-11 rounded-full bg-[#121620] border border-white/15 text-neutral-300 hover:text-white hover:bg-[#1b2130] flex items-center justify-center shadow-lg transition-all hover:scale-105 cursor-pointer"
        >
          <ArrowUp className="w-4 h-4" />
        </button>

        <a
          href={`https://wa.me/${BUSINESS_INFO.whatsappNumber}?text=${encodeURIComponent(
            'Hola Carrocería y Pintura Nogales, me gustaría cotizar una reparación.'
          )}`}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Contactar por WhatsApp"
          className="flex items-center gap-2 px-5 py-3 rounded-full bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs sm:text-sm shadow-[0_0_20px_rgba(16,185,129,0.35)] transition-all hover:scale-105 cursor-pointer"
        >
          <MessageCircle className="w-4 h-4 fill-black" />
          <span>(631) 132-2616</span>
        </a>
      </div>
    </div>
  );
}
