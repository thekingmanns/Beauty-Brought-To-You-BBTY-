import React from 'react';
import { Heart, Gift, Award, ArrowRight } from 'lucide-react';
import { useAccessibility } from '../context/AccessibilityContext';

interface Props {
  onLearnMore?: () => void;
}

const getGurleyBearSvgDataUrl = (isDark: boolean, isHighContrast: boolean) => {
  const bgColor = isHighContrast ? (isDark ? "%23000000" : "%23ffffff") : (isDark ? "%23090d16" : "%23fcfbfa");
  const textColor = isHighContrast ? (isDark ? "%23ffffff" : "%23000000") : (isDark ? "%23f1f5f9" : "%231e293b");
  const subtitleColor = isHighContrast ? (isDark ? "%23fafafa" : "%23444444") : (isDark ? "%2394a3b8" : "%234a4a4a");
  const heartStroke = isHighContrast ? (isDark ? "%23ffffff" : "%23000000") : (isDark ? "%23f472b6" : "%232e2e2e");
  
  // Custom watercolor gradients for authentic branding representation
  const stop1 = isHighContrast ? "%23000000" : "%23f472b6";
  const stop2 = isHighContrast ? "%23000000" : "%23c084fc";
  const stop3 = isHighContrast ? "%23000000" : "%23fbbf24";
  const stopOpacity = isHighContrast ? "0.0" : "0.45";

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" style="background-color: ${bgColor}; transition: background-color 0.2s;">
    <defs>
      <filter id="pastel-glow" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation="30" />
      </filter>
      <linearGradient id="pastel-heart-grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="${stop1}" stop-opacity="${stopOpacity}" />
        <stop offset="50%" stop-color="${stop2}" stop-opacity="${isHighContrast ? "0.0" : "0.35"}" />
        <stop offset="100%" stop-color="${stop3}" stop-opacity="${isHighContrast ? "0.0" : "0.2"}" />
      </linearGradient>
    </defs>

    <path
      d="M 200 215 C 130 160, 95 110, 130 65 C 155 35, 200 70, 200 70 C 200 70, 245 35, 270 65 C 305 110, 270 160, 200 215 Z"
      fill="url(%23pastel-heart-grad)"
      filter="url(%23pastel-glow)"
      transform="translate(0, 5) scale(1.1) rotate(5, 200, 150)"
    />

    <g transform="translate(255, 120) scale(0.68)">
      <ellipse cx="60" cy="182" rx="65" ry="14" fill="%23000000" opacity="0.08" filter="blur(4px)" />

      <circle cx="10" cy="165" r="28" fill="%23dfbba5" stroke="%23ccaa95" stroke-width="2" />
      <circle cx="10" cy="165" r="18" fill="%23eccdb7" />
      <circle cx="-1" cy="154" r="4.5" fill="%23dfbba5" />
      <circle cx="10" cy="150" r="4.5" fill="%23dfbba5" />
      <circle cx="21" cy="154" r="4.5" fill="%23dfbba5" />

      <circle cx="110" cy="165" r="28" fill="%23dfbba5" stroke="%23ccaa95" stroke-width="2" />
      <circle cx="110" cy="165" r="18" fill="%23eccdb7" />
      <circle cx="99" cy="154" r="4.5" fill="%23dfbba5" />
      <circle cx="110" cy="150" r="4.5" fill="%23dfbba5" />
      <circle cx="121" cy="154" r="4.5" fill="%23dfbba5" />

      <g transform="rotate(32, -15, 115)">
        <rect x="-15" y="85" width="28" height="52" rx="14" fill="%23dfbba5" stroke="%23ccaa95" stroke-width="2" />
        <circle cx="-1" cy="120" r="8" fill="%23eccdb7" />
      </g>

      <g transform="rotate(-32, 135, 115)">
        <rect x="107" y="85" width="28" height="52" rx="14" fill="%23dfbba5" stroke="%23ccaa95" stroke-width="2" />
        <circle cx="121" cy="120" r="8" fill="%23eccdb7" />
      </g>

      <ellipse cx="60" cy="126" rx="42" ry="48" fill="%23eccdb7" stroke="%23dfbba5" stroke-width="2" />
      <ellipse cx="60" cy="125" rx="28" ry="32" fill="%23f7dfcf" />

      <circle cx="18" cy="24" r="18" fill="%23dfbba5" stroke="%23ccaa95" stroke-width="2" />
      <circle cx="18" cy="24" r="10" fill="%23f7dfcf" />

      <circle cx="102" cy="24" r="18" fill="%23dfbba5" stroke="%23ccaa95" stroke-width="2" />
      <circle cx="102" cy="24" r="10" fill="%23f7dfcf" />

      <circle cx="60" cy="48" r="42" fill="%23eccdb7" stroke="%23dfbba5" stroke-width="2" />

      <circle cx="44" cy="40" r="5" fill="%232d221e" />
      <circle cx="42.5" cy="38.5" r="1.5" fill="%23ffffff" />
      <circle cx="76" cy="40" r="5" fill="%232d221e" />
      <circle cx="74.5" cy="38.5" r="1.5" fill="%23ffffff" />

      <ellipse cx="60" cy="56" rx="15" ry="11" fill="%23fbf0e6" />
      <path d="M 60 52 L 60 56.5 M 60 56.5 Q 57 59.5, 54 57.5 M 60 56.5 Q 63 59.5, 66 57.5" stroke="%232d221e" stroke-width="1.8" stroke-linecap="round" fill="none" />
      <ellipse cx="60" cy="50" rx="7.5" ry="5" fill="%232d221e" />
    </g>

    <g transform="translate(24, 75)">
      <text
        x="0"
        y="55"
        font-family="'Dancing Script', 'Style Script', 'Caveat', 'Pacifico', 'Brush Script MT', cursive"
        font-size="54"
        font-weight="bold"
        fill="${textColor}"
        style="transition: fill 0.2s;"
      >
        Gurley
      </text>

      <text
        x="4"
        y="98"
        font-family="'Plus Jakarta Sans', sans-serif"
        font-size="24"
        font-weight="900"
        letter-spacing="0.45em"
        fill="${textColor}"
        style="transition: fill 0.2s;"
      >
        BEAR
      </text>

      <text
        x="4"
        y="132"
        font-family="'Playfair Display', serif"
        font-size="21"
        font-weight="500"
        letter-spacing="0.08em"
        fill="${subtitleColor}"
        style="transition: fill 0.2s;"
      >
        Foundation
      </text>
    </g>

    <g transform="translate(195, 30) scale(0.72)">
      <path
        d="M 160 190 C 140 170, 115 140, 137 112 C 154 92, 180 115, 180 115 C 180 115, 206 92, 223 112 C 245 140, 220 170, 200 190 Z"
        fill="none"
        stroke="${heartStroke}"
        stroke-width="2.8"
        stroke-linecap="round"
        stroke-linejoin="round"
        style="transition: stroke 0.2s;"
      />
    </g>
  </svg>`;
  
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
};

export default function GurleyBearSection({ onLearnMore }: Props) {
  const { settings } = useAccessibility();
  return (
    <section id="gurley-bear-foundation" className="py-20 bg-transparent border-b border-white/10 dark:border-white/5 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Box outline with beautiful border & shadow */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-250 dark:border-slate-800/80 p-8 md:p-12 shadow-md hover:shadow-lg transition-all relative overflow-hidden">
          
          {/* Subtle decoration */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-amber-400/5 dark:bg-amber-400/2 rounded-full blur-3xl" />
          <div className="absolute -left-12 -bottom-12 w-96 h-96 bg-pink-500/5 dark:bg-pink-500/2 rounded-full blur-3xl" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center relative z-10">
            
            {/* Column 1: Cute Bear Mascot Logo / Badge (Left side alignment) - Col-span-3 */}
            <div className="lg:col-span-3 flex flex-col items-center text-center space-y-4">
              <div className="w-40 h-40 bg-pink-50/80 dark:bg-pink-950/20 rounded-full p-4 border-2 border-dashed border-pink-200/60 dark:border-pink-900/40 relative flex items-center justify-center shadow-inner group">
                <div className="absolute top-2 right-2 bg-pink-500 text-white rounded-full p-1 shadow-sm">
                  <Heart className="w-3.5 h-3.5 fill-current" />
                </div>
                <img 
                  src="https://images.unsplash.com/photo-1559251606-c623743a6d76?auto=format&fit=crop&w=400&h=400&q=80"
                  alt="Gurley Bear Mascot"
                  className="w-full h-full object-cover rounded-full group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div>
                <span className="text-xs font-mono uppercase tracking-[0.2em] font-extrabold text-pink-600 dark:text-pink-400 block">
                  Official Mascot
                </span>
                <span className="text-sm font-sans font-black text-slate-800 dark:text-slate-200 mt-1 block">
                  Caring Teddy
                </span>
              </div>
            </div>

            {/* Column 2: Detailed messaging text & actions - Col-span-5 */}
            <div className="lg:col-span-5 text-left space-y-5">
              <span className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-rose-100/60 dark:bg-rose-950/30 rounded-full text-rose-700 dark:text-rose-300 text-xs font-bold border border-rose-200/30 dark:border-rose-900/10">
                <Gift className="w-3.5 h-3.5 text-rose-500" />
                <span>Our Philanthropic Mission</span>
              </span>

              <h2 className="text-2xl md:text-3.5xl font-serif font-black text-slate-900 dark:text-white leading-tight">
                Supporting Community Wellness with the Gurley Bear Foundation
              </h2>

              <p className="text-slate-600 dark:text-slate-300 text-sm md:text-base leading-relaxed">
                A portion of our proceeds supports the **Gurley Bear Foundation**, helping provide compassionate care, comforting resources, cuddly bear companions, and living hope to children, senior residents, and vulnerable families in need across our community.
              </p>

              <div className="pt-2 flex flex-col sm:flex-row gap-4">
                <button
                  onClick={onLearnMore}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-xl text-xs font-bold shadow-md hover:from-pink-600 hover:to-purple-600 transition-all cursor-pointer"
                >
                  <span>Learn More & Get Involved</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
                <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                  <Award className="w-4 h-4 text-amber-500" />
                  <span>100% Tax Deductible Support</span>
                </div>
              </div>
            </div>

            {/* Column 3: Heartwarming Right Illustrative Image - Col-span-4 */}
            <div className="lg:col-span-4 flex justify-center">
              <div className="relative rounded-2xl overflow-hidden shadow-lg border border-slate-100 dark:border-slate-850/50 aspect-4/3 w-full max-w-sm group">
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/45 via-transparent to-transparent z-10" />
                <img 
                  src={getGurleyBearSvgDataUrl(settings.darkMode, settings.highContrast)}
                  alt="Official Gurley Bear Foundation Logo"
                  className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-700"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute bottom-3 left-4 right-4 z-20 text-left">
                  <p className="text-[11px] font-mono uppercase tracking-widest text-pink-200 font-bold">
                    Official Foundation Brand
                  </p>
                  <p className="text-xs font-serif text-white mt-0.5">
                    "Comfort is the greatest gift we can give."
                  </p>
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
