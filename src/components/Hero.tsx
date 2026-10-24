import { MapPin, Phone, MessageCircle, Clock, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { Language } from '../types';
import { BUSINESS_INFO } from '../data/content';
import workFachada from '../assets/images/real/work-fachada.jpg';
import workPulido from '../assets/images/real/work-pulido.jpg';

interface HeroProps {
  lang: Language;
}

export default function Hero({ lang }: HeroProps) {
  const content = {
    es: {
      badge: 'Instalaciones & Especialistas en Nogales',
      headline: 'Precisión artesanal en hojalatería y brillo automotriz de nivel agencia.',
      desc: 'En Carrocería y Pintura Nogales combinamos enderezado estructural milimétrico, cabina de horneado para un secado libre de impurezas, y estética vehicular Genesis con pulido espejo y recubrimiento cerámico 9H.',
      points: [
        'Cabina de horneado con atmósfera controlada',
        'Igualación de color exacta por código OEM',
        'Garantía por escrito en mano de obra y acabados',
      ],
      whatsappCta: 'Cotizar con Fotos por WhatsApp',
      callCta: 'Llamar al (631) 132-2616',
      hoursLabel: 'Lunes a Sábado de 8:00 AM a 6:00 PM',
      locationLabel: 'José Zazueta #16, Col. Los Encinos',
    },
    en: {
      badge: 'Facilities & Collision Specialists in Nogales',
      headline: 'Master craftsmanship in auto body repair and showroom-grade paint finishes.',
      desc: 'At Carrocería y Pintura Nogales, we combine precision structural alignment, dedicated oven-baked spray booth for flawless curing, and Genesis detailing with deep mirror gloss and 9H ceramic coating.',
      points: [
        'Controlled atmosphere oven-baked spray booth',
        'Exact OEM factory computerized color match',
        'Written warranty on workmanship and paint durability',
      ],
      whatsappCta: 'Quote via WhatsApp with Photos',
      callCta: 'Call (631) 132-2616',
      hoursLabel: 'Monday to Saturday 8:00 AM to 6:00 PM',
      locationLabel: 'José Zazueta #16, Col. Los Encinos',
    },
  }[lang];

  return (
    <section className="relative overflow-hidden py-14 sm:py-18 bg-[#12141c] border-b border-white/5">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: Workshop Information & Value Props */}
          <div className="lg:col-span-7 space-y-5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-500" />
              <span>{content.badge}</span>
            </div>

            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white tracking-tight leading-tight">
              {content.headline}
            </h2>

            <p className="text-sm sm:text-base text-neutral-300 leading-relaxed">
              {content.desc}
            </p>

            {/* Quality check bullets */}
            <div className="space-y-2.5 pt-1">
              {content.points.map((pt, i) => (
                <div key={i} className="flex items-center gap-3 text-xs sm:text-sm text-neutral-200">
                  <div className="w-5 h-5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </div>
                  <span>{pt}</span>
                </div>
              ))}
            </div>

            {/* Quick Actions */}
            <div className="flex flex-wrap items-center gap-3 pt-3">
              <a
                href={`https://wa.me/${BUSINESS_INFO.whatsappNumber}?text=${encodeURIComponent(
                  lang === 'es'
                    ? 'Hola, me gustaría cotizar un trabajo de hojalatería o pintura para mi vehículo.'
                    : 'Hello, I would like to get a quote for my vehicle.'
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs sm:text-sm shadow-sm transition-all hover:scale-105"
              >
                <MessageCircle className="w-4 h-4 fill-neutral-950" />
                <span>{content.whatsappCta}</span>
              </a>

              <a
                href={`tel:${BUSINESS_INFO.phoneCall}`}
                className="inline-flex items-center gap-2 px-4 py-3 rounded-full bg-[#1a1d26] hover:bg-[#202430] text-neutral-200 border border-white/10 text-xs sm:text-sm font-semibold transition-all hover:scale-105"
              >
                <Phone className="w-4 h-4 text-amber-500" />
                <span>{content.callCta}</span>
              </a>
            </div>
          </div>

          {/* Right Column: Visual Workshop Showcase Cards */}
          <div className="lg:col-span-5 relative">
            <div className="relative space-y-4">
              
              {/* Main Card: Fachada del Taller en Los Encinos */}
              <div className="relative rounded-2xl overflow-hidden border border-white/10 shadow-md group bg-[#1a1d26]">
                <img
                  src={workFachada}
                  alt="Instalaciones del Taller en Nogales"
                  className="w-full aspect-[4/3] object-cover object-center group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#12141c] via-[#12141c]/30 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="text-[11px] font-bold text-amber-400 uppercase tracking-wider">
                    {lang === 'es' ? 'Instalaciones Los Encinos' : 'Los Encinos Shop'}
                  </div>
                  <div className="text-sm font-bold text-white flex items-center gap-1.5 mt-0.5">
                    <MapPin className="w-3.5 h-3.5 text-rose-500" />
                    <span>{content.locationLabel}</span>
                  </div>
                </div>
              </div>

              {/* Secondary Floating Card: Acabado espejo real */}
              <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-[#1a1d26] border border-white/5 shadow-sm">
                <img
                  src={workPulido}
                  alt="Detalle de pulido automotriz"
                  className="w-14 h-14 rounded-xl object-cover shrink-0"
                />
                <div>
                  <div className="text-xs font-bold text-white">
                    {lang === 'es' ? 'Pulido Espejo Genesis' : 'Genesis Mirror Detailing'}
                  </div>
                  <div className="text-[11px] text-neutral-400 mt-0.5 flex items-center gap-1.5">
                    <Clock className="w-3 h-3 text-amber-500" />
                    <span>{content.hoursLabel}</span>
                  </div>
                </div>
              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
