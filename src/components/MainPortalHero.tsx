import { Wrench, Images, Calculator, MapPin, Phone, ChevronRight, ShieldCheck, Clock, Share2 } from 'lucide-react';
import { Language } from '../types';
import { BUSINESS_INFO } from '../data/content';
import wallpaperTitanium from '../assets/images/wallpaper-titanium.jpg';

interface MainPortalHeroProps {
  lang: Language;
  onToggleLang: () => void;
}

export default function MainPortalHero({ lang, onToggleLang }: MainPortalHeroProps) {
  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const navTools = [
    {
      id: 'redes-sociales',
      icon: Share2,
      emoji: '📱',
      title: lang === 'es' ? 'Fotos & Videos de Nuestras Redes' : 'Social Media Photos & Reels',
      desc: lang === 'es' ? 'Publicaciones oficiales en Facebook e Instagram, o sube nuevas fotos' : 'Official Facebook & Instagram posts, or upload new photos',
      badge: lang === 'es' ? 'Facebook & Instagram' : 'Facebook & Instagram',
      badgeColor: 'bg-blue-500/10 border-blue-500/20 text-blue-400',
      accent: 'hover:border-blue-500/30 hover:bg-[#202430]',
      iconBg: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    },
    {
      id: 'galeria',
      icon: Images,
      emoji: '📸',
      title: lang === 'es' ? 'Galería de Trabajos Reales' : 'Real Work Gallery',
      desc: lang === 'es' ? 'Evidencia fotográfica de acabados espejo, detallado y taller' : 'Real photos of mirror finishes, detailing & shop',
      badge: lang === 'es' ? 'Fotos Reales' : 'Real Photos',
      badgeColor: 'bg-amber-500/10 border-amber-500/20 text-amber-400',
      accent: 'hover:border-amber-500/30 hover:bg-[#202430]',
      iconBg: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    },
    {
      id: 'cotizador',
      icon: Calculator,
      emoji: '💰',
      title: lang === 'es' ? 'Cotizador Express' : 'Express Quote Calculator',
      desc: lang === 'es' ? 'Calcula el presupuesto estimado de hojalatería o pintura' : 'Instant repair or paint cost estimate in seconds',
      badge: lang === 'es' ? 'Instantáneo' : 'Instant',
      badgeColor: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400',
      accent: 'hover:border-emerald-500/30 hover:bg-[#202430]',
      iconBg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    },
    {
      id: 'ubicacion',
      icon: MapPin,
      emoji: '📍',
      title: lang === 'es' ? 'Ubicación & Mapa Oficial' : 'Official Location & Map',
      desc: lang === 'es' ? 'José Zazueta #16, Los Encinos, Nogales • Mapa Google interactivo' : 'José Zazueta #16, Los Encinos, Nogales • Official Google map',
      badge: lang === 'es' ? 'Google Maps' : 'Google Maps',
      badgeColor: 'bg-rose-500/10 border-rose-500/20 text-rose-400',
      accent: 'hover:border-rose-500/30 hover:bg-[#202430]',
      iconBg: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
    },
    {
      id: 'servicios',
      icon: Wrench,
      emoji: '🛠️',
      title: lang === 'es' ? 'Servicios & Especialidades' : 'Services & Specialties',
      desc: lang === 'es' ? 'Hojalatería de colisión, pintura al horno y detallado cerámico' : 'Collision bodywork, oven-baked paint & ceramic detailing',
      badge: lang === 'es' ? 'Especialidades' : 'Specialties',
      badgeColor: 'bg-amber-500/10 border-amber-500/20 text-amber-400',
      accent: 'hover:border-amber-500/30 hover:bg-[#202430]',
      iconBg: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    },
  ];

  return (
    <section className="relative overflow-hidden bg-[#12141c] text-white border-b border-white/5 pt-5 sm:pt-8 pb-12 sm:pb-16">
      
      {/* Background Image: Luxury Dark Titanium Wallpaper matching user reference */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none select-none">
        <img
          src={wallpaperTitanium}
          alt="Fondo Titanium Genesis"
          className="w-full h-full object-cover object-center opacity-65 filter brightness-105"
          referrerPolicy="no-referrer"
        />
        {/* Soft natural charcoal matte overlay for pristine text contrast */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#12141c]/65 via-[#12141c]/80 to-[#12141c]" />
      </div>

      <div className="relative z-10 max-w-2xl sm:max-w-4xl mx-auto px-4 sm:px-6 space-y-6 sm:space-y-8">
        
        {/* ==================== BANNER PRINCIPAL DE INFORMACIÓN ==================== */}
        <section className="p-6 sm:p-8 rounded-2xl bg-[#1a1d26] border border-white/5 shadow-md relative overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold w-fit">
              <span>📍 {lang === 'es' ? 'Taller de Carrocería Genesis' : 'Genesis Auto Body Workshop'}</span>
            </div>

            {/* Status indicator & lang toggle */}
            <div className="flex items-center gap-2 self-start sm:self-auto">
              <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-medium text-[11px] flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                {lang === 'es' ? 'Abierto hoy: 8:00 AM - 6:00 PM' : 'Open today: 8:00 AM - 6:00 PM'}
              </span>
              <button
                type="button"
                onClick={onToggleLang}
                className="text-[11px] text-neutral-400 hover:text-amber-400 underline cursor-pointer ml-1"
              >
                {lang === 'es' ? 'English' : 'Español'}
              </button>
            </div>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white tracking-tight mt-3.5 leading-tight">
            Carrocería & Pintura Nogales
          </h1>
          
          <p className="text-sm sm:text-base text-neutral-200 font-medium mt-2 leading-relaxed">
            {lang === 'es'
              ? 'Devolviéndole la estética, el valor y el brillo original a tu vehículo con mano de obra calificada y garantía por escrito.'
              : 'Restoring life, aesthetics, and showroom shine to your vehicle with master craftsmanship and written warranty.'}
          </p>

          <p className="text-xs sm:text-sm text-neutral-300 mt-2 leading-relaxed max-w-2xl">
            {lang === 'es'
              ? 'Hojalatería de colisión, pintura automotriz en cabina al horno y detallado cerámico Genesis.'
              : 'Collision bodywork, oven-baked spray booth painting, and Genesis ceramic detailing.'}
          </p>

          <div className="mt-5 pt-4 border-t border-white/5 flex flex-wrap items-center gap-y-2 gap-x-5 text-xs text-neutral-300">
            <div className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-rose-500" />
              <span>José Zazueta #16, Col. Los Encinos</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-amber-500" />
              <span>Lun a Sáb 8:00 AM - 6:00 PM</span>
            </div>
          </div>
        </section>

        {/* ==================== PORTADA PRINCIPAL • HERRAMIENTAS ==================== */}
        <section className="space-y-3.5">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-xs font-bold text-neutral-200 uppercase tracking-wider flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
              {lang === 'es' ? 'Herramientas & Secciones' : 'Tools & Sections'}
            </h2>
            <span className="text-[11px] text-amber-400 font-medium">
              {lang === 'es' ? 'Ir directo a sección' : 'Jump directly'}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {navTools.map((tool) => {
              const IconComp = tool.icon;
              return (
                <button
                  key={tool.id}
                  type="button"
                  onClick={() => scrollTo(tool.id)}
                  className={`w-full group p-4 rounded-2xl bg-[#1a1d26] border border-white/5 ${tool.accent} transition-all duration-200 text-left flex items-center justify-between cursor-pointer shadow-sm hover:shadow-md`}
                >
                  <div className="flex items-center gap-3.5">
                    <div className={`w-11 h-11 rounded-2xl ${tool.iconBg} border flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform text-lg`}>
                      <IconComp className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm sm:text-base font-bold text-white group-hover:text-amber-400 transition-colors">
                          {tool.title}
                        </span>
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${tool.badgeColor}`}>
                          {tool.badge}
                        </span>
                      </div>
                      <p className="text-xs text-neutral-400 group-hover:text-neutral-300 transition-colors line-clamp-1 mt-0.5">
                        {tool.desc}
                      </p>
                    </div>
                  </div>

                  <div className="w-8 h-8 rounded-full bg-white/5 group-hover:bg-amber-500/20 text-neutral-400 group-hover:text-amber-400 flex items-center justify-center shrink-0 transition-colors ml-2">
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        {/* ==================== CONTACTO DIRECTO ==================== */}
        <section className="space-y-3.5">
          <div className="text-xs font-bold text-neutral-200 uppercase tracking-wider px-1 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            {lang === 'es' ? 'Contacto Inmediato & Cotización' : 'Instant Contact & Quote'}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* WhatsApp Card */}
            <a
              href={`https://wa.me/${BUSINESS_INFO.whatsappNumber}?text=${encodeURIComponent(
                lang === 'es'
                  ? 'Hola Taller de Carrocería y Pintura Nogales, me gustaría cotizar la reparación de mi auto.'
                  : 'Hello Carroceria y Pintura Nogales, I would like to quote the repair of my vehicle.'
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-black flex items-center justify-between shadow-sm hover:shadow-md transition-all group"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-2xl bg-black/15 flex items-center justify-center shrink-0 text-2xl text-black">
                  <i className="fa-brands fa-whatsapp"></i>
                </div>
                <div>
                  <div className="text-[11px] font-bold text-black/80 uppercase tracking-wider">
                    {lang === 'es' ? 'Envía fotos de tu auto' : 'Send vehicle photos'}
                  </div>
                  <div className="font-bold text-sm sm:text-base text-black">
                    WhatsApp: {BUSINESS_INFO.phoneDisplay}
                  </div>
                </div>
              </div>
              <span className="text-xs font-bold px-3.5 py-1.5 rounded-full bg-black text-white shadow-sm shrink-0 group-hover:scale-105 transition-transform">
                {lang === 'es' ? 'Escribir' : 'Chat'}
              </span>
            </a>

            {/* Direct Phone Call */}
            <a
              href={`tel:${BUSINESS_INFO.phoneCall}`}
              className="p-4 rounded-2xl bg-[#1a1d26] hover:bg-[#202430] border border-white/5 hover:border-amber-500/30 text-white flex items-center justify-between transition-all shadow-sm group"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-500 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[11px] text-neutral-400 font-medium">
                    {lang === 'es' ? 'Llamada directa al taller' : 'Direct shop phone line'}
                  </div>
                  <div className="font-bold text-sm sm:text-base text-white group-hover:text-amber-400 transition-colors">
                    {BUSINESS_INFO.phoneDisplay}
                  </div>
                </div>
              </div>
              <span className="text-xs font-bold text-amber-400 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 group-hover:bg-amber-500 group-hover:text-black transition-colors">
                {lang === 'es' ? 'Llamar' : 'Call'}
              </span>
            </a>
          </div>
        </section>

        {/* ==================== REDES Y PERFILES OFICIALES ==================== */}
        <section className="space-y-3.5">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-xs font-bold text-neutral-200 uppercase tracking-wider flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
              {lang === 'es' ? 'Redes Sociales & Perfil de Negocio' : 'Social Media & Business Profiles'}
            </h2>
            <span className="text-[11px] text-neutral-400">
              {lang === 'es' ? 'Síguenos y consulta opiniones' : 'Follow & review us'}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {/* Facebook Oficial */}
            <a
              href={BUSINESS_INFO.social.facebook}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3.5 rounded-2xl bg-[#1a1d26] hover:bg-[#202430] border border-white/5 hover:border-blue-500/30 flex items-center justify-between text-xs transition-all shadow-sm group"
            >
              <div className="flex items-center gap-3">
                <span className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-base shadow-sm group-hover:scale-105 transition-transform shrink-0">
                  <i className="fa-brands fa-facebook-f"></i>
                </span>
                <div>
                  <div className="font-bold text-white group-hover:text-blue-400 transition-colors">
                    Facebook Oficial
                  </div>
                  <div className="text-[11px] text-neutral-400">
                    Auto Detallado Genesis
                  </div>
                </div>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
                Página
              </span>
            </a>

            {/* Instagram Oficial */}
            <a
              href={BUSINESS_INFO.social.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3.5 rounded-2xl bg-[#1a1d26] hover:bg-[#202430] border border-white/5 hover:border-pink-500/30 flex items-center justify-between text-xs transition-all shadow-sm group"
            >
              <div className="flex items-center gap-3">
                <span className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-600 via-rose-600 to-purple-600 text-white flex items-center justify-center font-bold text-base shadow-sm group-hover:scale-105 transition-transform shrink-0">
                  <i className="fa-brands fa-instagram"></i>
                </span>
                <div>
                  <div className="font-bold text-white group-hover:text-rose-400 transition-colors">
                    Instagram Oficial
                  </div>
                  <div className="text-[11px] text-neutral-400">
                    @carroceria_pintura_genecis
                  </div>
                </div>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20">
                Fotos
              </span>
            </a>

            {/* Twitter / X */}
            <a
              href={BUSINESS_INFO.social.twitter}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3.5 rounded-2xl bg-[#1a1d26] hover:bg-[#202430] border border-white/5 hover:border-neutral-500/30 flex items-center justify-between text-xs transition-all shadow-sm group"
            >
              <div className="flex items-center gap-3">
                <span className="w-9 h-9 rounded-xl bg-neutral-800 border border-neutral-700 text-white flex items-center justify-center font-bold text-sm shadow-sm group-hover:scale-105 transition-transform shrink-0">
                  <i className="fa-brands fa-x-twitter"></i>
                </span>
                <div>
                  <div className="font-bold text-white group-hover:text-neutral-200 transition-colors">
                    Twitter / X
                  </div>
                  <div className="text-[11px] text-neutral-400">
                    @Carroceria_Nog
                  </div>
                </div>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/5 text-neutral-400 border border-white/10">
                Actualidad
              </span>
            </a>

            {/* Google Maps Perfil de Negocio */}
            <a
              href={BUSINESS_INFO.googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3.5 rounded-2xl bg-[#1a1d26] hover:bg-[#202430] border border-white/5 hover:border-amber-500/30 flex items-center justify-between text-xs transition-all shadow-sm group"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-500 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform text-base">
                  <i className="fa-solid fa-location-dot"></i>
                </div>
                <div>
                  <div className="font-bold text-white group-hover:text-amber-400 transition-colors">
                    Google Maps
                  </div>
                  <div className="text-[11px] text-neutral-400">
                    Perfil de Negocio & Reseñas
                  </div>
                </div>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
                Ver Ficha
              </span>
            </a>
          </div>
        </section>

        {/* WORKSHOP TRUST BAR (Solid slate, rounded-2xl) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
          <div className="flex items-center gap-2.5 px-3.5 py-3 rounded-2xl bg-[#1a1d26] border border-white/5 text-xs text-neutral-300">
            <ShieldCheck className="w-4 h-4 text-amber-500 shrink-0" />
            <span>{lang === 'es' ? 'Cabina de Horneado & Colorimetría' : 'Oven Spray Booth & Color Match'}</span>
          </div>
          <div className="flex items-center gap-2.5 px-3.5 py-3 rounded-2xl bg-[#1a1d26] border border-white/5 text-xs text-neutral-300">
            <ShieldCheck className="w-4 h-4 text-amber-500 shrink-0" />
            <span>{lang === 'es' ? 'Pulido Espejo & Cerámico 9H' : 'Mirror Polish & 9H Ceramic'}</span>
          </div>
          <div className="flex items-center gap-2.5 px-3.5 py-3 rounded-2xl bg-[#1a1d26] border border-white/5 text-xs text-neutral-300">
            <Clock className="w-4 h-4 text-amber-500 shrink-0" />
            <span>{lang === 'es' ? 'Entregas Rápidas y Garantizadas' : 'Fast Guaranteed Delivery'}</span>
          </div>
        </div>

      </div>
    </section>
  );
}
