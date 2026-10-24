// Source: Google Maps Platform Code Assist
import { useState, useEffect } from 'react';
import {
  APIProvider,
  Map,
  AdvancedMarker,
  Pin,
  InfoWindow,
  useMap,
} from '@vis.gl/react-google-maps';
import {
  MapPin,
  Phone,
  MessageCircle,
  Clock,
  ExternalLink,
  Navigation,
  AlertCircle,
  Layers,
  Compass,
  ArrowRight,
  Route,
} from 'lucide-react';
import { Language } from '../types';
import { BUSINESS_INFO } from '../data/content';

interface LocationContactProps {
  lang: Language;
}

const GOOGLE_MAPS_API_KEY =
  (import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string | undefined) ||
  'AIzaSyC3a0dCY7h91FIUJwUtKQDqAJBzYzoXOeo';

const WORKSHOP_LOCATION = {
  lat: 31.2988874,
  lng: -110.9549794,
};


const NOGALES_LANDMARKS = [
  {
    nameEs: 'Blvd. Luis Donaldo Colosio',
    nameEn: 'Blvd. Luis Donaldo Colosio',
    time: '4 min',
    distance: '2.1 km',
    origin: 'Boulevard Luis Donaldo Colosio, Nogales, Sonora',
    icon: '🏢',
  },
  {
    nameEs: 'Garita DeConcini (Frontera USA)',
    nameEn: 'DeConcini Port of Entry (Border)',
    time: '12 min',
    distance: '5.8 km',
    origin: 'Garita Dennis DeConcini, Nogales, Sonora',
    icon: '🛂',
  },
  {
    nameEs: 'Av. Álvaro Obregón / Centro',
    nameEn: 'Downtown / Av. Obregón',
    time: '10 min',
    distance: '4.6 km',
    origin: 'Avenida Alvaro Obregon, Centro, Nogales, Sonora',
    icon: '🚗',
  },
  {
    nameEs: 'Garita Mariposa (Nogales AZ/Son)',
    nameEn: 'Mariposa Port of Entry',
    time: '18 min',
    distance: '9.4 km',
    origin: 'Garita Mariposa, Nogales, Sonora',
    icon: '🚛',
  },
];

// Inner controller that accesses the Google Map instance via useMap hook
function MapViewController({
  mapTypeId,
  recenterTrigger,
}: {
  mapTypeId: string;
  recenterTrigger: number;
}) {
  const map = useMap();

  useEffect(() => {
    if (map) {
      map.setMapTypeId(mapTypeId);
    }
  }, [map, mapTypeId]);

  useEffect(() => {
    if (map && recenterTrigger > 0) {
      map.panTo(WORKSHOP_LOCATION);
      map.setZoom(17);
    }
  }, [map, recenterTrigger]);

  return null;
}

export default function LocationContact({ lang }: LocationContactProps) {
  const [infoOpen, setInfoOpen] = useState(true);
  const [mapError, setMapError] = useState(false);
  const [mapTypeId, setMapTypeId] = useState<'roadmap' | 'hybrid'>('roadmap');
  const [recenterCount, setRecenterCount] = useState(0);
  const [userOrigin, setUserOrigin] = useState('');

  const handleLaunchDirections = (originParam?: string) => {
    const origin = originParam || userOrigin.trim();
    let url = `https://www.google.com/maps/dir/?api=1&destination=${WORKSHOP_LOCATION.lat},${WORKSHOP_LOCATION.lng}`;
    if (origin) {
      url += `&origin=${encodeURIComponent(origin)}`;
    }
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <section id="ubicacion" className="py-16 sm:py-24 bg-[#12141c] border-b border-white/5 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-semibold mb-3">
            <MapPin className="w-3.5 h-3.5 text-rose-500" />
            <span>{lang === 'es' ? 'Ubicación Oficial & Horarios' : 'Official Location & Hours'}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white tracking-tight mb-2.5">
            {lang === 'es' ? 'Visítanos en Los Encinos, Nogales' : 'Visit Our Workshop in Nogales'}
          </h2>
          <p className="text-neutral-300 text-xs sm:text-sm leading-relaxed">
            {lang === 'es'
              ? 'Taller de Carrocería y Pintura en José Zazueta #16. Explora nuestra ubicación con Google Maps, activa vista satélite o traza tu ruta de llegada desde cualquier punto de Nogales o la frontera.'
              : 'Auto body and paint shop located at José Zazueta #16, Los Encinos. Explore our Google Maps locator, switch to satellite view, or plot driving directions from anywhere in Nogales or the border.'}
          </p>
        </div>

        {/* 2-Column Responsive Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Map Column (7 cols) - Solid Slate #1a1d26, rounded-2xl, soft shadow */}
          <div className="lg:col-span-7 bg-[#1a1d26] border border-white/5 rounded-2xl p-3 sm:p-4 shadow-md space-y-3">
            
            {/* Business Header Card above Map */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-xl bg-[#12141c] border border-white/5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5 text-amber-500" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white text-sm sm:text-base">
                      Taller de Carrocería y Pintura
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-bold">
                      {lang === 'es' ? 'Verificado en Maps' : 'Verified on Maps'}
                    </span>
                  </div>
                  <div className="text-xs text-neutral-400">
                    José Zazueta #16, Col. Los Encinos, Nogales, Son.
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => setRecenterCount((c) => c + 1)}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#202430] hover:bg-[#282d3d] text-neutral-200 text-xs font-semibold border border-white/10 transition-colors"
                  title={lang === 'es' ? 'Centrar taller' : 'Recenter workshop'}
                >
                  <Compass className="w-3.5 h-3.5 text-amber-500" />
                  <span className="hidden sm:inline">{lang === 'es' ? 'Centrar' : 'Center'}</span>
                </button>

                <div className="flex items-center bg-[#202430] rounded-lg p-0.5 border border-white/10">
                  <button
                    onClick={() => setMapTypeId('roadmap')}
                    className={`px-2.5 py-1 rounded text-xs font-semibold transition-all ${
                      mapTypeId === 'roadmap'
                        ? 'bg-amber-500 text-neutral-950 font-bold shadow-sm'
                        : 'text-neutral-400 hover:text-white'
                    }`}
                  >
                    {lang === 'es' ? 'Mapa' : 'Map'}
                  </button>
                  <button
                    onClick={() => setMapTypeId('hybrid')}
                    className={`px-2.5 py-1 rounded text-xs font-semibold flex items-center gap-1 transition-all ${
                      mapTypeId === 'hybrid'
                        ? 'bg-amber-500 text-neutral-950 font-bold shadow-sm'
                        : 'text-neutral-400 hover:text-white'
                    }`}
                  >
                    <Layers className="w-3 h-3" />
                    <span>{lang === 'es' ? 'Satélite' : 'Satellite'}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Map Canvas with Responsive Height */}
            <div className="w-full h-[460px] sm:h-[500px] rounded-xl overflow-hidden bg-[#12141c] border border-white/5 relative">
              {!mapError ? (
                <APIProvider
                  apiKey={GOOGLE_MAPS_API_KEY}
                  onError={() => setMapError(true)}
                >
                  <Map
                    style={{ width: '100%', height: '100%' }}
                    defaultCenter={WORKSHOP_LOCATION}
                    defaultZoom={17}
                    mapId="DEMO_MAP_ID"
                    gestureHandling="greedy"
                    disableDefaultUI={false}
                    fullscreenControl={true}
                    mapTypeControl={false}
                    streetViewControl={true}
                    internalUsageAttributionIds={['gmp_mcp_codeassist_v1_aistudio']}
                  >
                    <MapViewController
                      mapTypeId={mapTypeId}
                      recenterTrigger={recenterCount}
                    />

                    <AdvancedMarker
                      position={WORKSHOP_LOCATION}
                      title="Taller de Carrocería y Pintura (Detallado Genesis)"
                      onClick={() => setInfoOpen(true)}
                    >
                      <Pin
                        background="#f59e0b"
                        borderColor="#78350f"
                        glyphColor="#18181b"
                      />
                    </AdvancedMarker>

                    {infoOpen && (
                      <InfoWindow
                        position={WORKSHOP_LOCATION}
                        onCloseClick={() => setInfoOpen(false)}
                      >
                        <div className="p-1.5 text-neutral-900 max-w-[280px]">
                          <div className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-amber-100 text-amber-900 text-[10px] font-bold mb-1">
                            <span>📍 Taller de Carrocería y Pintura</span>
                          </div>
                          <div className="font-bold text-sm text-neutral-950 leading-snug mb-0.5">
                            Detallado Genesis & Hojalatería
                          </div>
                          <div className="text-xs text-neutral-600 mb-2 leading-relaxed">
                            José Zazueta #16, Col. Los Encinos, Nogales, Son.
                          </div>
                          <div className="text-[11px] text-neutral-700 bg-neutral-100 p-1.5 rounded mb-2.5 space-y-0.5">
                            <div>🕒 Lun-Sáb: 8:00 AM - 6:00 PM</div>
                            <div>📞 (631) 132-2616</div>
                          </div>
                          <div className="flex items-center gap-2">
                            <a
                              href={BUSINESS_INFO.googleMapsUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold rounded-lg text-xs transition-colors shadow-sm"
                            >
                              <ExternalLink className="w-3 h-3" />
                              <span>{lang === 'es' ? 'Ver en Maps' : 'View on Maps'}</span>
                            </a>
                            <button
                              onClick={() => handleLaunchDirections()}
                              className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-neutral-200 hover:bg-neutral-300 text-neutral-800 font-semibold rounded-lg text-xs transition-colors cursor-pointer"
                            >
                              <Navigation className="w-3 h-3" />
                              <span>{lang === 'es' ? 'Cómo llegar' : 'Directions'}</span>
                            </button>
                          </div>
                        </div>
                      </InfoWindow>
                    )}
                  </Map>
                </APIProvider>
              ) : (
                /* Fallback if map fails or network is blocked */
                <div className="absolute inset-0 z-20 bg-[#12141c] flex flex-col items-center justify-center p-6 text-center">
                  <AlertCircle className="w-10 h-10 text-amber-500 mb-3" />
                  <p className="text-white font-bold text-base mb-1">
                    Taller de Carrocería y Pintura
                  </p>
                  <p className="text-neutral-400 text-xs mb-3">
                    José Zazueta #16, Col. Los Encinos, Nogales, Son.
                  </p>
                  <a
                    href={BUSINESS_INFO.googleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold rounded-full text-xs shadow-md"
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span>{lang === 'es' ? 'Abrir Taller en Google Maps' : 'Open Shop in Google Maps'}</span>
                  </a>
                </div>
              )}
            </div>

            {/* Quick Interactive Route Calculator & Landmarks */}
            <div className="p-3 bg-[#12141c] border border-white/5 rounded-xl space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-bold text-white">
                  <Route className="w-3.5 h-3.5 text-amber-500" />
                  <span>{lang === 'es' ? 'Calcula tu tiempo de llegada a nuestro taller' : 'Estimated driving times in Nogales'}</span>
                </div>
                <span className="text-[10px] text-neutral-400">GPS Google Maps</span>
              </div>

              {/* Landmarks Chips */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {NOGALES_LANDMARKS.map((landmark) => (
                  <button
                    key={landmark.nameEs}
                    onClick={() => handleLaunchDirections(landmark.origin)}
                    className="p-2 rounded-lg bg-[#1a1d26] hover:bg-[#202430] border border-white/5 hover:border-amber-500/30 text-left transition-all group cursor-pointer"
                  >
                    <div className="flex items-center justify-between text-[11px] mb-0.5">
                      <span>{landmark.icon}</span>
                      <span className="text-amber-400 font-bold text-[10px]">{landmark.time}</span>
                    </div>
                    <div className="text-[11px] font-semibold text-white truncate group-hover:text-amber-300">
                      {lang === 'es' ? landmark.nameEs : landmark.nameEn}
                    </div>
                    <div className="text-[10px] text-neutral-400">
                      {landmark.distance}
                    </div>
                  </button>
                ))}
              </div>

              {/* Custom Origin Input */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleLaunchDirections();
                }}
                className="flex items-center gap-2 pt-1"
              >
                <div className="relative flex-1">
                  <input
                    type="text"
                    value={userOrigin}
                    onChange={(e) => setUserOrigin(e.target.value)}
                    placeholder={
                      lang === 'es'
                        ? 'Tu colonia o dirección (ej. Col. Kennedy, San Carlos, Nuevo Nogales...)'
                        : 'Your street or neighborhood in Nogales...'
                    }
                    className="w-full pl-3 pr-8 py-2 rounded-lg bg-[#1a1d26] border border-white/10 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500 transition-colors"
                  />
                  <Navigation className="w-3.5 h-3.5 text-neutral-500 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs inline-flex items-center gap-1.5 transition-all shadow-sm shrink-0 cursor-pointer"
                >
                  <span>{lang === 'es' ? 'Trazar Ruta' : 'Get Route'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </form>
            </div>

            {/* Quick Action Navigation Bar */}
            <div className="p-2 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2 text-neutral-300">
                <MapPin className="w-4 h-4 text-rose-500 shrink-0" />
                <span>{BUSINESS_INFO.address}, {BUSINESS_INFO.city}</span>
              </div>
              <div className="flex items-center gap-3">
                <a
                  href={BUSINESS_INFO.googleMapsCoordinatesUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-1.5 rounded-full bg-amber-500 text-neutral-950 font-bold hover:bg-amber-400 transition-all inline-flex items-center gap-1.5 shrink-0 shadow-sm"
                >
                  <Navigation className="w-3.5 h-3.5" />
                  <span>{lang === 'es' ? 'Cómo llegar (GPS)' : 'Get Directions'}</span>
                </a>
                <a
                  href={BUSINESS_INFO.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-neutral-400 hover:text-white font-medium inline-flex items-center gap-1 shrink-0 transition-colors"
                >
                  <span>{lang === 'es' ? 'Ver Perfil Oficial' : 'View Official Profile'}</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>

          {/* Contact Details Column (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            
            {/* Phone & WhatsApp Card */}
            <div className="bg-[#1a1d26] border border-white/5 rounded-2xl p-6 sm:p-7 space-y-4 shadow-sm">
              <div className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                {lang === 'es' ? 'Teléfono y WhatsApp Directo' : 'Direct Phone & WhatsApp'}
              </div>

              {/* Clean non-monospace font */}
              <div className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                {BUSINESS_INFO.phoneDisplay}
              </div>

              <div className="grid grid-cols-2 gap-3 pt-1">
                <a
                  href={`tel:${BUSINESS_INFO.phoneCall}`}
                  className="py-3 px-4 rounded-xl bg-[#12141c] hover:bg-[#202430] text-white text-xs font-bold text-center transition-all flex items-center justify-center gap-2 border border-white/5"
                >
                  <Phone className="w-3.5 h-3.5 text-amber-500" />
                  <span>{lang === 'es' ? 'Llamar' : 'Call'}</span>
                </a>

                <a
                  href={`https://wa.me/${BUSINESS_INFO.whatsappNumber}?text=${encodeURIComponent(
                    lang === 'es'
                      ? 'Hola Taller de Carrocería y Pintura Nogales, quiero solicitar información.'
                      : 'Hello, I want to ask about repair services.'
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-black text-xs font-bold text-center transition-all flex items-center justify-center gap-2 shadow-sm"
                >
                  <MessageCircle className="w-3.5 h-3.5 fill-black" />
                  <span>WhatsApp</span>
                </a>
              </div>
            </div>

            {/* Operating Hours */}
            <div className="bg-[#1a1d26] border border-white/5 rounded-2xl p-6 sm:p-7 space-y-2 shadow-sm">
              <div className="flex items-center gap-2 text-xs font-bold text-neutral-300 uppercase tracking-wider">
                <Clock className="w-4 h-4 text-amber-500" />
                <span>{lang === 'es' ? 'Horario de Atención' : 'Operating Hours'}</span>
              </div>
              <div className="text-sm font-bold text-white">
                {BUSINESS_INFO.hoursWeekday}
              </div>
              <div className="text-xs text-neutral-400">
                {BUSINESS_INFO.hoursDetailing}
              </div>
            </div>

            {/* Social Media Links */}
            <div className="bg-[#1a1d26] border border-white/5 rounded-2xl p-6 sm:p-7 space-y-3.5 shadow-sm">
              <div className="text-xs font-bold text-neutral-300 uppercase tracking-wider">
                {lang === 'es' ? 'Redes y Perfiles Oficiales' : 'Official Channels'}
              </div>

              <div className="space-y-2 pt-1 text-xs">
                <a
                  href={BUSINESS_INFO.social.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3 rounded-xl bg-[#12141c] hover:bg-[#202430] text-neutral-300 hover:text-white transition-all border border-white/5 group"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="w-6 h-6 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-xs">f</span>
                    <span>Facebook: Auto Detallado Genesis</span>
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 text-neutral-400 group-hover:text-blue-400" />
                </a>

                <a
                  href={BUSINESS_INFO.social.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3 rounded-xl bg-[#12141c] hover:bg-[#202430] text-neutral-300 hover:text-white transition-all border border-white/5 group"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="w-6 h-6 rounded-lg bg-gradient-to-tr from-amber-600 via-rose-600 to-purple-600 text-white flex items-center justify-center font-bold text-[10px]">IG</span>
                    <span>Instagram: @carroceria_pintura_genecis</span>
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 text-neutral-400 group-hover:text-rose-400" />
                </a>

                <a
                  href={BUSINESS_INFO.social.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3 rounded-xl bg-[#12141c] hover:bg-[#202430] text-neutral-300 hover:text-white transition-all border border-white/5 group"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="w-6 h-6 rounded-lg bg-neutral-800 border border-neutral-700 text-white flex items-center justify-center font-bold text-xs">𝕏</span>
                    <span>Twitter / X: @Carroceria_Nog</span>
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 text-neutral-400 group-hover:text-white" />
                </a>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
