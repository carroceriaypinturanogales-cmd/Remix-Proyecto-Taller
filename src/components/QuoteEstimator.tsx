import { useState, useId } from 'react';
import { Upload, Trash2, MessageCircle, Sparkles, Check, Send, CheckCircle2 } from 'lucide-react';
import { Language } from '../types';
import { BUSINESS_INFO } from '../data/content';
import { saveQuote } from '../lib/firebase';

interface QuoteEstimatorProps {
  lang: Language;
}

const COMMON_SERVICES = [
  { id: 'facia', nameEs: 'Fascia / Defensa', nameEn: 'Bumper Repair & Paint', minMxn: 1800, maxMxn: 2600, badge: 'Popular' },
  { id: 'salpicadera', nameEs: 'Salpicadera / Puerta', nameEn: 'Fender / Door Repair', minMxn: 1700, maxMxn: 2400 },
  { id: 'cofre', nameEs: 'Cofre / Cajuela', nameEn: 'Hood / Trunk Panel', minMxn: 2200, maxMxn: 3200 },
  { id: 'pulido', nameEs: 'Pulido Espejo Genesis', nameEn: 'Mirror Polish Detailing', minMxn: 1500, maxMxn: 2800, badge: 'Genesis' },
  { id: 'ceramico', nameEs: 'Recubrimiento Cerámico 9H', nameEn: '9H Ceramic Coating', minMxn: 3500, maxMxn: 5500 },
  { id: 'faros', nameEs: 'Restauración de Faros (Par)', nameEn: 'Headlight Restoration', minMxn: 700, maxMxn: 1000 },
  { id: 'general', nameEs: 'Pintura General al Horno', nameEn: 'Complete Oven Repaint', minMxn: 16000, maxMxn: 26000 },
  { id: 'chasis', nameEs: 'Hojalatería de Colisión', nameEn: 'Collision Bodywork', minMxn: 3000, maxMxn: 6500 },
];

export default function QuoteEstimator({ lang }: QuoteEstimatorProps) {
  const photoInputId = useId();
  const [selectedService, setSelectedService] = useState<string>('facia');
  const [vehicleModel, setVehicleModel] = useState('');
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [damageNotes, setDamageNotes] = useState('');
  const [uploadedPhotos, setUploadedPhotos] = useState<string[]>([]);
  const [savingFirestore, setSavingFirestore] = useState(false);
  const [savedQuoteId, setSavedQuoteId] = useState<string | null>(null);

  const activeService = COMMON_SERVICES.find((s) => s.id === selectedService) || COMMON_SERVICES[0];
  const usdMin = Math.round(activeService.minMxn / 18.5);
  const usdMax = Math.round(activeService.maxMxn / 18.5);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    const newPhotos: string[] = [];
    Array.from(files).forEach((file) => {
      newPhotos.push(URL.createObjectURL(file));
    });
    setUploadedPhotos((prev) => [...prev, ...newPhotos]);
  };

  const removePhoto = (idx: number) => {
    setUploadedPhotos((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleSaveToFirestore = async () => {
    if (!clientName.trim() || !clientPhone.trim()) {
      alert(lang === 'es' ? 'Por favor ingresa tu nombre y teléfono de contacto.' : 'Please enter your name and phone number.');
      return;
    }
    setSavingFirestore(true);
    try {
      const qId = await saveQuote({
        clientName: clientName.trim(),
        clientPhone: clientPhone.trim(),
        vehicleMake: vehicleModel.split(' ')[0] || 'Vehículo',
        vehicleModel: vehicleModel || 'No especificado',
        vehicleYear: '2024',
        serviceType: activeService.nameEs,
        description: damageNotes.trim() || 'Cotización solicitada desde la web',
        estimatedRange: `$${activeService.minMxn.toLocaleString()} - $${activeService.maxMxn.toLocaleString()} MXN`,
        status: 'recibida',
        userId: 'web-client',
      });
      setSavedQuoteId(qId);
    } catch (err) {
      console.error(err);
      alert(lang === 'es' ? 'Hubo un error al guardar tu cotización. Puedes enviarla por WhatsApp.' : 'Error saving quote. You can send it via WhatsApp.');
    } finally {
      setSavingFirestore(false);
    }
  };

  const handleSendWhatsApp = () => {
    const text = 
`*SOLICITUD DE VALORACIÓN - CARROCERÍA Y PINTURA NOGALES*
---------------------------------------
*Cliente:* ${clientName || 'Cliente web'}
*Teléfono:* ${clientPhone || 'No especificado'}
*Servicio solicitado:* ${activeService.nameEs}
*Vehículo:* ${vehicleModel || 'No especificado'}
*Estimado orientativo:* $${activeService.minMxn.toLocaleString()} - $${activeService.maxMxn.toLocaleString()} MXN (Aprox. $${usdMin} - $${usdMax} USD)
*Detalles:* ${damageNotes || 'Sin notas'}
*Fotos preparadas:* ${uploadedPhotos.length} foto(s)
${savedQuoteId ? `*ID Folio Web:* ${savedQuoteId}\n` : ''}---------------------------------------
_Hola, envío mis datos para una valoración personalizada de mi auto en José Zazueta #16, Los Encinos._`;

    const url = `https://wa.me/${BUSINESS_INFO.whatsappNumber}?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  return (
    <section id="cotizador" className="py-16 sm:py-24 bg-[#12141c] border-b border-white/5 relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>{lang === 'es' ? 'Presupuesto Rápido Online' : 'Quick Online Estimate'}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white tracking-tight mb-3">
            {lang === 'es' ? 'Calcula tu Cotización al Instante' : 'Instant Repair Cost Estimator'}
          </h2>
          <p className="text-neutral-300 text-xs sm:text-sm leading-relaxed">
            {lang === 'es'
              ? 'Elige el trabajo necesario y envía los detalles directo a nuestro WhatsApp para darte respuesta inmediata.'
              : 'Select your needed service and send the details directly to our WhatsApp for immediate attention.'}
          </p>
        </div>

        {/* Solid Slate Card #1a1d26 (No glassmorphism, rounded-2xl, soft shadow) */}
        <div className="relative rounded-2xl bg-[#1a1d26] border border-white/5 p-6 sm:p-9 space-y-7 shadow-md">
          
          {/* Step 1: Select Service */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                {lang === 'es' ? '1. Selecciona el servicio a reparar' : '1. Select service needed'}
              </label>
              <span className="text-[11px] text-neutral-400">
                {lang === 'es' ? 'Toca una opción' : 'Tap an option'}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {COMMON_SERVICES.map((s) => {
                const isSelected = selectedService === s.id;
                return (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setSelectedService(s.id)}
                    className={`p-3.5 rounded-2xl border text-left text-xs transition-all cursor-pointer relative ${
                      isSelected
                        ? 'bg-amber-500/15 border-amber-500/40 text-white font-bold shadow-sm'
                        : 'bg-[#12141c] border-white/5 text-neutral-300 hover:border-amber-500/20 hover:text-white'
                    }`}
                  >
                    {s.badge && (
                      <span className="absolute top-2 right-2 text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-amber-500 text-neutral-950">
                        {s.badge}
                      </span>
                    )}
                    <div className="truncate font-medium text-xs mt-1">
                      {lang === 'es' ? s.nameEs : s.nameEn}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Step 2: Car model + Photos */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-neutral-200 uppercase tracking-wider mb-2">
                {lang === 'es' ? '2. Tu Vehículo (Marca / Modelo / Año)' : '2. Vehicle (Make / Model / Year)'}
              </label>
              <input
                type="text"
                value={vehicleModel}
                onChange={(e) => setVehicleModel(e.target.value)}
                placeholder={lang === 'es' ? 'Ej: Silverado 2021, Civic 2020...' : 'e.g. Ford F150 2021, Civic...'}
                className="w-full px-4 py-3 bg-[#12141c] border border-white/10 rounded-2xl text-xs sm:text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500/50 transition-colors shadow-inner"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-200 uppercase tracking-wider mb-2">
                {lang === 'es' ? '3. Fotos del Golpe o Detalle (Opcional)' : '3. Photos of Damage (Optional)'}
              </label>
              <div className="flex items-center gap-2">
                <label
                  htmlFor={photoInputId}
                  className="cursor-pointer inline-flex items-center gap-2 px-4 py-3 bg-[#12141c] hover:bg-[#202430] border border-white/10 hover:border-amber-500/30 rounded-2xl text-xs font-semibold text-neutral-200 hover:text-white transition-all shadow-sm"
                >
                  <Upload className="w-4 h-4 text-amber-500" />
                  <span>{lang === 'es' ? 'Adjuntar Fotos del Auto' : 'Attach Vehicle Photos'}</span>
                </label>
                <input
                  id={photoInputId}
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="hidden"
                />
                {uploadedPhotos.length > 0 && (
                  <span className="text-xs text-amber-400 font-bold px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/20">
                    {uploadedPhotos.length} {lang === 'es' ? 'foto(s)' : 'photo(s)'}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Step 3: Optional Contact Details for Online Firestore Submission */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="block text-xs font-bold text-neutral-200 uppercase tracking-wider mb-2">
                {lang === 'es' ? 'Tu Nombre (Para el presupuesto)' : 'Your Name'}
              </label>
              <input
                type="text"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                placeholder="Ej: Carlos Ramírez"
                className="w-full px-4 py-2.5 bg-[#12141c] border border-white/10 rounded-xl text-xs sm:text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500/50 transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-200 uppercase tracking-wider mb-2">
                {lang === 'es' ? 'Teléfono o WhatsApp' : 'Phone or WhatsApp'}
              </label>
              <input
                type="tel"
                value={clientPhone}
                onChange={(e) => setClientPhone(e.target.value)}
                placeholder="Ej: (631) 123-4567"
                className="w-full px-4 py-2.5 bg-[#12141c] border border-white/10 rounded-xl text-xs sm:text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500/50 transition-colors"
              />
            </div>
          </div>

          {/* Photo previews */}
          {uploadedPhotos.length > 0 && (
            <div className="flex gap-2.5 overflow-x-auto py-1">
              {uploadedPhotos.map((url, i) => (
                <div key={i} className="relative w-16 h-16 rounded-xl overflow-hidden border border-white/10 shrink-0 shadow-md">
                  <img src={url} alt={`Foto ${i + 1}`} className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removePhoto(i)}
                    className="absolute top-1 right-1 bg-black/80 hover:bg-rose-600 text-white p-1 rounded-full transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Saved in Firestore Badge */}
          {savedQuoteId && (
            <div className="p-3.5 rounded-xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>¡Presupuesto registrado en el sistema del taller! Folio: <strong className="font-mono">{savedQuoteId}</strong></span>
              </div>
            </div>
          )}

          {/* Price Range & Direct WhatsApp / Firestore Actions */}
          <div className="pt-6 border-t border-white/5 flex flex-col lg:flex-row lg:items-center justify-between gap-5">
            <div>
              <div className="text-xs text-neutral-400 mb-1">
                {lang === 'es' ? 'Rango orientativo en taller:' : 'Estimated shop price range:'}
              </div>
              <div className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                ${activeService.minMxn.toLocaleString()} – ${activeService.maxMxn.toLocaleString()} <span className="text-sm font-bold text-amber-400">MXN</span>
                <span className="text-xs text-neutral-400 ml-2 font-normal">
                  (Aprox. ${usdMin} – ${usdMax} USD)
                </span>
              </div>
              <div className="text-[11px] text-neutral-400 mt-1">
                {lang === 'es' ? 'Presupuesto sin compromiso • Incluye garantía por escrito' : 'No obligation quote • Includes written warranty'}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
              {/* Save to Firestore Online Button */}
              <button
                type="button"
                onClick={handleSaveToFirestore}
                disabled={savingFirestore}
                className="inline-flex items-center justify-center gap-2 px-5 py-3.5 bg-[#252c3c] hover:bg-[#30394e] text-neutral-100 font-bold text-xs rounded-full border border-white/15 transition-all shadow-sm cursor-pointer disabled:opacity-50"
              >
                <Send className="w-3.5 h-3.5 text-amber-400" />
                <span>{savingFirestore ? 'Guardando...' : 'Registrar Cotización en Taller'}</span>
              </button>

              {/* WhatsApp Button */}
              <button
                type="button"
                onClick={handleSendWhatsApp}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs sm:text-sm rounded-full transition-all shadow-md hover:scale-105 whitespace-nowrap cursor-pointer"
              >
                <MessageCircle className="w-4 h-4 fill-neutral-950" />
                <span>{lang === 'es' ? 'Enviar mis datos para una valoración personalizada' : 'Send my details for a personalized estimate'}</span>
              </button>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
