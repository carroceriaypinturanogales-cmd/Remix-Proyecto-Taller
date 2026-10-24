import { BUSINESS_INFO } from '../data/content';
import { Sparkles } from 'lucide-react';

interface HeaderProps {
  onOpenWorkspace?: () => void;
}

export default function Header({ onOpenWorkspace }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 bg-[#080a0e]/95 backdrop-blur-md border-b border-white/10 transition-all shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 sm:h-24 flex items-center justify-between gap-4">
        
        {/* Left: Shield Logo + Typography */}
        <a 
          href="#" 
          className="flex items-center gap-3.5 sm:gap-4 group shrink-0"
        >
          {/* Silver Chrome Shield Logo with Car Silhouette */}
          <div className="relative w-12 h-14 sm:w-14 sm:h-16 shrink-0 transition-transform duration-300 group-hover:scale-105">
            <img
              src="/assets/new_design/shield_badge.png"
              alt="Carrocería y Pintura Nogales"
              className="w-full h-full object-contain filter drop-shadow-[0_4px_12px_rgba(255,255,255,0.12)]"
            />
          </div>

          <div className="flex flex-col">
            <div className="font-serif-luxury text-xl sm:text-2xl md:text-[26px] font-bold text-white tracking-wide leading-tight group-hover:text-amber-300 transition-colors">
              Carrocería y Pintura
            </div>
            <div className="text-[11px] sm:text-xs font-semibold tracking-[0.35em] text-neutral-300 uppercase leading-snug">
              N O G A L E S
            </div>
            <div className="text-[8px] sm:text-[9px] tracking-[0.25em] text-neutral-400 font-medium uppercase mt-0.5">
              ESTÉTICA QUE VALORIZA TU CAMINO
            </div>
          </div>
        </a>

        {/* Right: Workspace Portal Button + Social Links */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          
          {/* Google Workspace & Firebase Hub Button */}
          {onOpenWorkspace && (
            <button
              onClick={onOpenWorkspace}
              className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-full text-xs font-bold text-white bg-gradient-to-r from-amber-600 via-purple-600 to-indigo-600 hover:opacity-90 border border-white/20 transition-all shadow-md hover:scale-105 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span className="hidden sm:inline">Google Workspace</span>
              <span className="sm:hidden">Workspace</span>
            </button>
          )}

          {/* Facebook Pill Button */}
          <a
            href={BUSINESS_INFO.social.facebook}
            target="_blank"
            rel="noopener noreferrer"
            title="Facebook Oficial"
            className="hidden md:inline-flex items-center gap-2 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-semibold text-white bg-[#1877F2] hover:bg-[#166fe5] border border-blue-400/30 transition-all shadow-md hover:scale-105 cursor-pointer"
          >
            <i className="fa-brands fa-facebook-f text-sm"></i>
            <span className="font-medium">Facebook</span>
          </a>

          {/* Instagram Pill Button */}
          <a
            href={BUSINESS_INFO.social.instagram}
            target="_blank"
            rel="noopener noreferrer"
            title="Instagram Oficial"
            className="hidden sm:inline-flex items-center gap-2 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-semibold text-white bg-gradient-to-r from-[#f09433] via-[#dc2743] to-[#bc1888] hover:opacity-95 border border-rose-400/30 transition-all shadow-md hover:scale-105 cursor-pointer"
          >
            <i className="fa-brands fa-instagram text-sm"></i>
            <span className="font-medium">Instagram</span>
          </a>

        </div>

      </div>
    </header>
  );
}

