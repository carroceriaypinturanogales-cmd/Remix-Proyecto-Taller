import { useState } from 'react';
import { Camera, X, ZoomIn, ArrowRight, ChevronLeft, ChevronRight, Images, MessageCircle } from 'lucide-react';
import { Language } from '../types';
import { REAL_WORK_PHOTOS, BUSINESS_INFO } from '../data/content';
import { useScrollReveal } from '../hooks/useScrollReveal';

interface RealGalleryProps {
  lang: Language;
}

export default function RealGallery({ lang }: RealGalleryProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [activePhotoIndex, setActivePhotoIndex] = useState(0);
  const [activeFilter, setActiveFilter] = useState<string>('all');

  const { ref: headerRef, isVisible: headerVisible } = useScrollReveal();
  const { ref: tabsRef, isVisible: tabsVisible } = useScrollReveal({ threshold: 0.1 });
  const { ref: galleryRef, isVisible: galleryVisible } = useScrollReveal({ threshold: 0.08 });

  const getStaggerDelay = (idx: number) => {
    const delays = ['delay-75', 'delay-150', 'delay-200', 'delay-300', 'delay-400', 'delay-500'];
    return delays[idx % delays.length];
  };

  const categories = [
    { id: 'all', nameEs: 'Todos (9 Trabajos)', nameEn: 'All (9 Works)' },
    { id: 'Detallado', nameEs: 'Acabados Espejo', nameEn: 'Mirror Finish' },
    { id: 'Pulido', nameEs: 'Pulido Profesional', nameEn: 'Pro Polishing' },
    { id: 'Pintura', nameEs: 'Pintura al Horno', nameEn: 'Spray Booth' },
    { id: 'Carrocería', nameEs: 'Carrocería & Lámina', nameEn: 'Body & Panels' },
    { id: 'Taller', nameEs: 'Instalaciones', nameEn: 'Shop Facility' },
  ];

  const filteredPhotos = activeFilter === 'all'
    ? REAL_WORK_PHOTOS
    : REAL_WORK_PHOTOS.filter((p) => p.category === activeFilter);

  const openModalAt = (index: number) => {
    setActivePhotoIndex(index);
    setModalOpen(true);
  };

  const handleNext = () => {
    setActivePhotoIndex((prev) => (prev + 1) % REAL_WORK_PHOTOS.length);
  };

  const handlePrev = () => {
    setActivePhotoIndex((prev) => (prev - 1 + REAL_WORK_PHOTOS.length) % REAL_WORK_PHOTOS.length);
  };

  const activePhoto = REAL_WORK_PHOTOS[activePhotoIndex];

  return (
    <section id="galeria" className="py-16 sm:py-24 bg-[#12141c] border-b border-white/5 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header with Scroll Reveal */}
        <div
          ref={headerRef}
          className={`flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4 transition-all duration-700 ease-out ${
            headerVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold mb-3">
              <Camera className="w-3.5 h-3.5 text-amber-500" />
              <span>{lang === 'es' ? 'Evidencia Real de Taller' : 'Real Workshop Evidence'}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white tracking-tight">
              {lang === 'es' ? 'Galería de Trabajos Realizados' : 'Workshop Portfolio Gallery'}
            </h2>
            <p className="text-xs sm:text-sm text-neutral-300 mt-1.5">
              {lang === 'es'
                ? 'Fotografías directas de nuestros trabajos en Nogales: hojalatería, horneado y acabados espejo.'
                : 'Direct unedited photos of our collision repairs, paint booth finishes, and mirror gloss in Nogales.'}
            </p>
          </div>

          <button
            type="button"
            onClick={() => openModalAt(0)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-[#1a1d26] hover:bg-[#202430] text-neutral-200 hover:text-white border border-white/5 text-xs font-semibold transition-all hover:scale-105 self-start sm:self-auto cursor-pointer shadow-sm"
          >
            <Images className="w-4 h-4 text-amber-500" />
            <span>{lang === 'es' ? 'Ver Pantalla Completa' : 'Full Screen Viewer'}</span>
            <ArrowRight className="w-3.5 h-3.5 text-neutral-400" />
          </button>
        </div>

        {/* Filter Category Tabs with Scroll Reveal */}
        <div
          ref={tabsRef}
          className={`flex items-center gap-2 overflow-x-auto pb-4 mb-6 no-scrollbar transition-all duration-500 ease-out delay-100 ${
            tabsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          {categories.map((cat) => {
            const isActive = activeFilter === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setActiveFilter(cat.id)}
                className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'bg-amber-500 text-neutral-950 font-bold shadow-sm'
                    : 'bg-[#1a1d26] hover:bg-[#202430] text-neutral-300 border border-white/5'
                }`}
              >
                {lang === 'es' ? cat.nameEs : cat.nameEn}
              </button>
            );
          })}
        </div>

        {/* Dynamic Image Grid with Staggered Scroll Reveal */}
        <div
          ref={galleryRef}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
        >
          {filteredPhotos.map((photo, idx) => {
            const originalIndex = REAL_WORK_PHOTOS.findIndex((p) => p.src === photo.src);
            const delayClass = getStaggerDelay(idx);
            return (
              <div
                key={photo.id || idx}
                onClick={() => openModalAt(originalIndex)}
                className={`group relative rounded-2xl overflow-hidden bg-[#1a1d26] border border-white/5 hover:border-amber-500/30 cursor-pointer shadow-sm hover:shadow-md transition-all duration-700 ease-out ${delayClass} ${
                  galleryVisible
                    ? 'opacity-100 translate-y-0 scale-100'
                    : 'opacity-0 translate-y-12 scale-[0.97]'
                }`}
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-[#12141c]">
                  <img
                    src={photo.src}
                    alt={photo.title}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#12141c] via-transparent to-transparent opacity-80 group-hover:opacity-60 transition-opacity" />
                  
                  {/* Category Pill Tag */}
                  <div className="absolute top-3 left-3">
                    <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-[#12141c]/80 border border-white/10 text-amber-400 uppercase tracking-wider">
                      {photo.category}
                    </span>
                  </div>

                  {/* Zoom indicator on hover */}
                  <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-[#12141c]/80 border border-white/10 text-neutral-300 group-hover:text-amber-400 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <ZoomIn className="w-4 h-4" />
                  </div>
                </div>

                {/* Card Information */}
                <div className="p-4 sm:p-5 space-y-1.5 bg-[#1a1d26]">
                  <div className="text-sm font-bold text-white group-hover:text-amber-400 transition-colors">
                    {lang === 'es' ? photo.title : photo.titleEn}
                  </div>
                  <p className="text-xs text-neutral-400 line-clamp-2 leading-relaxed">
                    {lang === 'es' ? photo.desc : photo.descEn}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Full Gallery Lightbox Modal */}
        {modalOpen && (
          <div
            className="fixed inset-0 z-50 bg-[#12141c]/95 flex items-center justify-center p-3 sm:p-6"
            onClick={() => setModalOpen(false)}
          >
            <div
              className="relative max-w-4xl w-full bg-[#1a1d26] rounded-2xl overflow-hidden border border-white/10 shadow-2xl flex flex-col max-h-[92vh]"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Top Bar */}
              <div className="p-4 sm:p-5 bg-[#12141c] border-b border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
                    <Camera className="w-4 h-4 text-amber-500" />
                  </div>
                  <div>
                    <span className="text-xs sm:text-sm font-bold text-white block">
                      {lang === 'es' ? activePhoto.title : activePhoto.titleEn}
                    </span>
                    <span className="text-[11px] text-amber-400 font-medium">
                      {activePhoto.category} • Foto {activePhotoIndex + 1} de {REAL_WORK_PHOTOS.length}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="w-9 h-9 rounded-full bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
                  aria-label="Cerrar galería"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Main Image Display with Navigation Arrows */}
              <div className="relative flex-1 bg-black min-h-[40vh] sm:min-h-[55vh] flex items-center justify-center overflow-hidden p-2">
                <img
                  src={activePhoto.src}
                  alt={activePhoto.title}
                  className="max-h-[55vh] sm:max-h-[60vh] w-auto max-w-full object-contain select-none rounded-xl"
                  referrerPolicy="no-referrer"
                />

                {/* Left arrow */}
                <button
                  type="button"
                  onClick={handlePrev}
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-[#12141c]/90 hover:bg-neutral-800 text-white border border-white/10 flex items-center justify-center transition-transform hover:scale-110 cursor-pointer shadow-lg"
                  aria-label="Foto anterior"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>

                {/* Right arrow */}
                <button
                  type="button"
                  onClick={handleNext}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-[#12141c]/90 hover:bg-neutral-800 text-white border border-white/10 flex items-center justify-center transition-transform hover:scale-110 cursor-pointer shadow-lg"
                  aria-label="Foto siguiente"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Bottom Bar with Description & WhatsApp Cotizar */}
              <div className="p-4 sm:p-5 bg-[#12141c] border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <p className="text-xs sm:text-sm text-neutral-300 max-w-xl">
                  {lang === 'es' ? activePhoto.desc : activePhoto.descEn}
                </p>

                <a
                  href={`https://wa.me/${BUSINESS_INFO.whatsappNumber}?text=${encodeURIComponent(
                    `Hola, vi la foto "${activePhoto.title}" en su galería y me interesa cotizar un trabajo similar para mi vehículo.`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-amber-500 hover:bg-amber-400 text-neutral-950 text-xs font-bold shadow-sm hover:scale-105 transition-all shrink-0"
                >
                  <MessageCircle className="w-3.5 h-3.5 fill-neutral-950" />
                  <span>{lang === 'es' ? 'Cotizar Este Trabajo' : 'Quote This Finish'}</span>
                </a>
              </div>
            </div>
          </div>
        )}

      </div>
    </section>
  );
}
