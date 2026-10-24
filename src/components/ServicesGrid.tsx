import { ArrowRight, Wrench, Flame, Sparkles, Shield, Car, Check, Clock, ShieldCheck } from 'lucide-react';
import { Language } from '../types';
import { SERVICES_LIST, BUSINESS_INFO } from '../data/content';
import { useScrollReveal } from '../hooks/useScrollReveal';

interface ServicesGridProps {
  lang: Language;
}

export default function ServicesGrid({ lang }: ServicesGridProps) {
  const icons = [Wrench, Flame, Sparkles, Shield, Car, Check];
  const { ref: headerRef, isVisible: headerVisible } = useScrollReveal();
  const { ref: gridRef, isVisible: gridVisible } = useScrollReveal({ threshold: 0.1 });

  const getStaggerDelay = (idx: number) => {
    const delays = ['delay-75', 'delay-150', 'delay-200', 'delay-300', 'delay-400', 'delay-500'];
    return delays[idx % delays.length];
  };

  return (
    <section id="servicios" className="py-16 sm:py-24 bg-[#12141c] border-b border-white/5 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header with Scroll Reveal */}
        <div
          ref={headerRef}
          className={`max-w-3xl mb-12 transition-all duration-700 ease-out ${
            headerVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold mb-3">
            <Wrench className="w-3.5 h-3.5 text-amber-500" />
            <span>{lang === 'es' ? 'Nuestros Servicios Principales' : 'Our Core Services'}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white tracking-tight mb-2.5">
            {lang === 'es' ? 'Especialidades de Carrocería & Pintura' : 'Auto Body & Paint Specialties'}
          </h2>
          <p className="text-neutral-300 text-sm sm:text-base leading-relaxed">
            {lang === 'es'
              ? 'Hojalatería especializada, cabina de horneado para un acabado impecable y estética Genesis en Nogales, Sonora.'
              : 'Precision collision repair, spray booth oven curing, and Genesis detailing in Nogales, Sonora.'}
          </p>
        </div>

        {/* 3-Column Services Grid with Staggered Scroll Reveal */}
        <div
          ref={gridRef}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
        >
          {SERVICES_LIST.map((srv, idx) => {
            const IconComponent = icons[idx % icons.length];
            const cleanNumber = parseInt(srv.number, 10) || idx + 1;
            const delayClass = getStaggerDelay(idx);

            return (
              <div
                key={srv.number}
                className={`group relative bg-[#1a1d26] hover:bg-[#202430] border border-white/5 hover:border-amber-500/30 rounded-2xl p-6 sm:p-7 flex flex-col justify-between shadow-sm hover:shadow-md transition-all duration-700 ease-out ${delayClass} ${
                  gridVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-12 scale-[0.97]'
                }`}
              >
                <div>
                  {/* Top Badges (No monospace code look) */}
                  <div className="flex items-center justify-between text-xs mb-5">
                    <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400">
                      Servicio {cleanNumber}
                    </span>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-neutral-300 text-[11px] font-medium">
                      <Clock className="w-3 h-3 text-neutral-400" />
                      {srv.time}
                    </span>
                  </div>

                  {/* Icon */}
                  <div className="w-12 h-12 rounded-2xl bg-[#12141c] border border-white/5 flex items-center justify-center text-amber-500 mb-5 shadow-inner group-hover:scale-105 group-hover:border-amber-500/30 transition-all">
                    <IconComponent className="w-5 h-5" />
                  </div>

                  {/* Title & Desc */}
                  <h3 className="text-lg font-bold text-white mb-2 group-hover:text-amber-400 transition-colors">
                    {lang === 'es' ? srv.title : srv.titleEn}
                  </h3>

                  <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed mb-6">
                    {lang === 'es' ? srv.desc : srv.descEn}
                  </p>
                </div>

                {/* Footer with Warranty & WhatsApp CTA */}
                <div className="pt-4 border-t border-white/5 space-y-3">
                  <div className="flex items-center gap-1.5 text-[11px] text-emerald-400 font-medium">
                    <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
                    <span>{srv.warranty}</span>
                  </div>

                  <a
                    href={`https://wa.me/${BUSINESS_INFO.whatsappNumber}?text=${encodeURIComponent(
                      lang === 'es'
                        ? `Hola, me interesa información y presupuesto sobre el servicio de "${srv.title}".`
                        : `Hi, I am interested in details and quote for "${srv.titleEn}".`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-[#12141c] hover:bg-amber-500 text-neutral-200 hover:text-neutral-950 border border-white/5 hover:border-amber-500 font-bold text-xs transition-all shadow-sm group/btn cursor-pointer"
                  >
                    <span>{lang === 'es' ? 'Cotizar Servicio por WhatsApp' : 'Quote via WhatsApp'}</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
