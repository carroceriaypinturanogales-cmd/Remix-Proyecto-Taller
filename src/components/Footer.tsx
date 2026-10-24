import { Language } from '../types';
import { BUSINESS_INFO } from '../data/content';

interface FooterProps {
  lang: Language;
}

export default function Footer({ lang }: FooterProps) {
  return (
    <footer className="bg-[#0e1017] text-neutral-400 border-t border-white/5 text-xs py-12 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-8 border-b border-white/5">
          
          <div className="space-y-1.5">
            <div className="text-base font-bold text-white flex items-center gap-2">
              <span className="text-amber-500">🛡️</span>
              <span>Carrocería & Pintura Nogales</span>
            </div>
            <p className="text-xs text-neutral-400 max-w-md">
              {lang === 'es'
                ? 'Hojalatería, pintura al horno y detallado vehicular Genesis en Nogales, Sonora.'
                : 'Collision repair, oven-baked paint, and Genesis auto detailing in Nogales, Sonora.'}
            </p>
            <div className="text-[11px] text-neutral-300 pt-1">
              {BUSINESS_INFO.address} • Tel: {BUSINESS_INFO.phoneDisplay}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <a
              href="#servicios"
              className="px-3.5 py-1.5 rounded-full bg-[#1a1d26] hover:bg-[#202430] text-neutral-300 hover:text-white border border-white/5 transition-colors text-xs"
            >
              {lang === 'es' ? 'Servicios' : 'Services'}
            </a>
            <a
              href="#galeria"
              className="px-3.5 py-1.5 rounded-full bg-[#1a1d26] hover:bg-[#202430] text-neutral-300 hover:text-white border border-white/5 transition-colors text-xs"
            >
              {lang === 'es' ? 'Galería' : 'Gallery'}
            </a>
            <a
              href="#cotizador"
              className="px-3.5 py-1.5 rounded-full bg-[#1a1d26] hover:bg-[#202430] text-neutral-300 hover:text-white border border-white/5 transition-colors text-xs"
            >
              {lang === 'es' ? 'Cotizador' : 'Estimator'}
            </a>
            <a
              href="#ubicacion"
              className="px-3.5 py-1.5 rounded-full bg-[#1a1d26] hover:bg-[#202430] text-neutral-300 hover:text-white border border-white/5 transition-colors text-xs"
            >
              {lang === 'es' ? 'Ubicación' : 'Location'}
            </a>
            <a
              href={`https://wa.me/${BUSINESS_INFO.whatsappNumber}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 hover:bg-amber-500 hover:text-neutral-950 font-bold transition-all text-xs"
            >
              WhatsApp
            </a>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-neutral-400">
          <div>
            © {new Date().getFullYear()} Carrocería & Pintura Nogales. {lang === 'es' ? 'Todos los derechos reservados.' : 'All rights reserved.'}
          </div>
          <div className="flex items-center gap-2 text-neutral-400">
            <span>{lang === 'es' ? 'Col. Los Encinos, Nogales, Sonora' : 'Los Encinos, Nogales, Sonora'}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
