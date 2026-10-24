// Direct imports of real workshop photos so Vite bundles them with correct paths in both dev & production
import imgFachada from '../assets/images/real/work-fachada.jpg';
import imgGmc from '../assets/images/real/work-gmc.jpg';
import imgPulido from '../assets/images/real/work-pulido.jpg';
import imgHonda from '../assets/images/real/work-honda.jpg';
import imgPintura from '../assets/images/real/work-pintura.jpg';
import imgDefensa from '../assets/images/real/work-defensa.jpg';
import imgTaller from '../assets/images/real/work-taller.jpg';
import imgPickupProceso from '../assets/images/real/work-pickup-proceso.jpg';
import imgEquipo from '../assets/images/real/work-equipo.webp';

export const BUSINESS_INFO = {
  name: 'Carrocería y Pintura Nogales',
  partnerBrand: 'Detallado Genesis',
  address: 'José Zazueta #16, Col. Los Encinos, C.P. 84064',
  city: 'Nogales, Sonora, México',
  phoneDisplay: '(631) 132-2616',
  phoneCall: '+526311322616',
  whatsappDisplay: '(631) 132-2616',
  whatsappNumber: '526311322616',
  email: 'carroceriaypinturanogales@gmail.com',
  website: 'www.carroceriaypintura.com',
  hoursWeekday: 'Lunes a Sábado: 8:00 AM - 6:00 PM',
  hoursDetailing: 'Detallado Genesis: Lunes a Domingo 9:00 AM - 7:00 PM',
  googleMapsUrl: 'https://www.google.com/maps/place/Taller+de+Carrocer%C3%ADa+y+Pintura/@31.2988874,-110.9549794,19z/data=!3m1!4b1!4m6!3m5!1s0x86d153005b10bfed:0x3f274fab2f53c6a5!8m2!3d31.2988874!4d-110.9549794!16s%2Fg%2F11zf0m97xm',
  googleMapsCoordinatesUrl: 'https://www.google.com/maps/place/Taller+de+Carrocer%C3%ADa+y+Pintura/@31.2988874,-110.9549794,19z/data=!3m1!4b1!4m6!3m5!1s0x86d153005b10bfed:0x3f274fab2f53c6a5!8m2!3d31.2988874!4d-110.9549794!16s%2Fg%2F11zf0m97xm',
  googleMapsEmbed: '/locator.html',
  social: {
    facebook: 'https://www.facebook.com/AutoDetalladoGenesis',
    instagram: 'https://www.instagram.com/carroceria_pintura_genecis',
    twitter: 'https://x.com/Carroceria_Nog',
    whatsapp: 'https://wa.me/526311322616',
  },
};

export const REAL_WORK_PHOTOS = [
  {
    id: 'gmc-espejo',
    src: imgGmc,
    title: 'GMC Sierra Acabado Espejo',
    titleEn: 'GMC Sierra Mirror Finish',
    desc: 'GMC Sierra recién pulida con acabado reflejante de espejo frente al taller.',
    descEn: 'GMC Sierra freshly polished with crisp mirror reflection in front of the shop.',
    category: 'Detallado',
  },
  {
    id: 'fachada-encinos',
    src: imgFachada,
    title: 'La Entrada del Taller',
    titleEn: 'Workshop Entrance',
    desc: 'Instalaciones en José Zazueta #16, Col. Los Encinos con lonas rojas de Detallado Genesis.',
    descEn: 'Workshop facility at José Zazueta #16, Col. Los Encinos with red Detallado Genesis awnings.',
    category: 'Taller',
  },
  {
    id: 'pulido-profesional',
    src: imgPulido,
    title: 'Técnico en Pulido Profesional',
    titleEn: 'Master Polishing Technician',
    desc: 'Técnico puliendo el cofre de una Explorer negra con equipo profesional Rupes.',
    descEn: 'Technician compounding and polishing black Explorer hood with precision rotary tools.',
    category: 'Pulido',
  },
  {
    id: 'honda-espejo',
    src: imgHonda,
    title: 'Honda Accord Negro Espejo',
    titleEn: 'Black Honda Accord Mirror Gloss',
    desc: 'Cofre con acabado de espejo impecable junto a la lona del taller.',
    descEn: 'Flawless mirror gloss finish next to workshop banner.',
    category: 'Detallado',
  },
  {
    id: 'sedan-pintura',
    src: imgPintura,
    title: 'Sedán en Proceso de Pintura',
    titleEn: 'Sedan In Paint Prep',
    desc: 'Sedán rojo en primarios con enmascarado de luces y cofre abierto para pintura.',
    descEn: 'Red sedan in primer stage with masked headlights and open hood ready for spray booth.',
    category: 'Pintura',
  },
  {
    id: 'defensa-primer',
    src: imgDefensa,
    title: 'Defensa en Primer Lista',
    titleEn: 'Bumper in Primer & Masked',
    desc: 'Fascia con primer y enmascarado milimétrico lista para horneado.',
    descEn: 'Bumper cover primed and meticulously masked, ready for color application.',
    category: 'Carrocería',
  },
  {
    id: 'taller-operacion',
    src: imgTaller,
    title: 'El Taller en Operación',
    titleEn: 'Workshop In Daily Operation',
    desc: 'Vehículos en proceso de hojalatería bajo la lona roja del taller.',
    descEn: 'Multiple vehicles undergoing body repairs under the shop canopy.',
    category: 'Taller',
  },
  {
    id: 'pickup-proceso',
    src: imgPickupProceso,
    title: 'Pickup Amarilla en Reparación',
    titleEn: 'Yellow Pickup In Repair',
    desc: 'Pickup con cofre enmascarado durante el proceso de enderezado y pintura.',
    descEn: 'Yellow truck with masked panels during metal straightening and paint prep.',
    category: 'Carrocería',
  },
  {
    id: 'equipo-detallado',
    src: imgEquipo,
    title: 'Equipo Profesional de Detallado',
    titleEn: 'Professional Detailing Equipment',
    desc: 'Pulidoras orbitales, microfibras, compuestos de corte y pads en el taller.',
    descEn: 'Orbital polishers, microfiber towels, cutting compounds, and pads in shop.',
    category: 'Equipo',
  },
];

export const SERVICES_LIST = [
  {
    number: '01',
    title: 'Hojalatería y Carrocería de Colisión',
    titleEn: 'Collision Bodywork & Structural Repair',
    desc: 'Reparación de golpes, enderezado de lámina y ajuste milimétrico de líneas y defensas con soldadura de alta resistencia.',
    descEn: 'Dent removal, metal reshaping and precise panel alignment for front and rear collision damage.',
    time: '2 - 5 días',
    warranty: 'Garantía de alineación estructural',
  },
  {
    number: '02',
    title: 'Pintura Automotriz en Cabina al Horno',
    titleEn: 'Oven-Baked Automotive Painting',
    desc: 'Igualación computarizada del color original, primarios de alta adherencia y barniz poliuretano horneado de alto brillo.',
    descEn: 'Computerized OEM paint matching, premium primers and high-solid baked polyurethane clearcoat.',
    time: '3 - 6 días',
    warranty: 'Garantía contra desprendimiento o decoloración',
  },
  {
    number: '03',
    title: 'Pulido Espejo y Corrección de Pintura',
    titleEn: 'Mirror Polish & Paint Correction',
    desc: 'Proceso de microcorte en 3 pasos que elimina remolinos (swirls), rayones superficiales y devuelve el brillo de agencia.',
    descEn: '3-stage compounding and refining process eliminating swirls, haze, and restoring deep mirror clarity.',
    time: '1 - 2 días',
    warranty: 'Acabado reflejante cristalino',
  },
  {
    number: '04',
    title: 'Recubrimiento Cerámico 9H Genesis',
    titleEn: '9H Ceramic Nano Coating',
    desc: 'Capa protectora hidrofóbica que repele agua, suciedad, rayos UV, sarro y químicos, manteniendo la carrocería impecable.',
    descEn: 'Hydrophobic nano-coating defending against UV oxidation, chemical stains and harsh road grime.',
    time: '1 - 2 días',
    warranty: 'Protección hidrofóbica hasta 24 meses',
  },
  {
    number: '05',
    title: 'Restauración de Faros y Plásticos',
    titleEn: 'Headlight & Trim Restoration',
    desc: 'Lijado al agua, pulido óptico y sellado con polímero protector contra amarillamiento por sol para máxima visibilidad nocturna.',
    descEn: 'Wet-sanding, optical compounding and UV sealant restoring headlight clarity and night driving safety.',
    time: '2 - 3 horas',
    warranty: 'Claridad óptica garantizada',
  },
  {
    number: '06',
    title: 'Detallado Interior y Estética Integral',
    titleEn: 'Interior Detailing & Complete Aesthetics',
    desc: 'Lavado profundo de vestiduras a vapor, hidratación de plásticos, descontaminación de carrocería y detallado de rines.',
    descEn: 'Deep steam upholstery cleaning, dash conditioning, clay bar decontam and rim polishing.',
    time: '1 día',
    warranty: 'Limpieza e higienización al 100%',
  },
];
