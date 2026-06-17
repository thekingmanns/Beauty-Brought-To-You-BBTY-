import React, { useState } from 'react';
import { Copy, Check, Sparkles, BookOpen, Heart, Eye } from 'lucide-react';

interface BrandKitProps {
  onSelectHeadline: (headline: string) => void;
  onSelectTagline: (tagline: string) => void;
  currentHeadline: string;
  currentTagline: string;
}

export default function BrandKit({
  onSelectHeadline,
  onSelectTagline,
  currentHeadline,
  currentTagline,
}: BrandKitProps) {
  const [copiedText, setCopiedText] = useState<string | null>(null);

  const headlines = [
    "Expirences Professional beauty & wellness grooming services delivered directly to you. At your convenience in the comfort and privacy of any where you are.",
    "Professional Beauty & Grooming, Brought Directly to Your Comfort Zone",
    "Restoring Dignity, Comfort, and Care Through Mobile Wellness Beauty",
    "Salon-Quality Care That Comes to You — Where You Are, Just as You Are",
    "Empowering Every Individual to Feel Confident, Seen, and Beautiful",
    "Bridging the Accessibility Gap in Beauty and Wellness Support"
  ];

  const taglines = [
    "Compassionate, mobility-friendly beauty care designed for your comfort and safety.",
    "Because everyone deserves to look and feel their absolute best.",
    "Professional, wellness-aware hair, nail, and grooming services at your convenient location.",
    "Bringing salon standards, respectful care, and heartfelt smiles right to your door.",
    "Connecting families, care facilities, and local beauty experts in shared community care."
  ];

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(id);
    setTimeout(() => setCopiedText(null), 2000);
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-pink-100 dark:border-slate-800 shadow-sm overflow-hidden transition-colors" id="brand-kit-section">
      {/* Decorative Brand Header */}
      <div className="bg-gradient-to-r from-pink-50 via-rose-50 to-amber-50 dark:from-pink-950/20 dark:via-rose-950/10 dark:to-amber-950/20 p-6 md:p-8 border-b border-pink-100 dark:border-slate-800 transition-colors">
        <div className="flex items-center gap-3 mb-2">
          <span className="p-2 bg-pink-100 dark:bg-pink-950/40 text-pink-600 dark:text-pink-300 rounded-xl">
            <Sparkles className="w-5 h-5" />
          </span>
          <span className="text-xs font-semibold uppercase tracking-wider text-pink-600 dark:text-pink-300 font-mono">
            Strategic Brand Assets
          </span>
        </div>
        <h3 className="text-2xl md:text-3xl font-serif text-slate-900 dark:text-white font-medium tracking-tight">
          Brand Strategy & Creative Kit
        </h3>
        <p className="text-slate-600 dark:text-slate-350 text-sm md:text-base mt-2 max-w-2xl">
          Use these copy blocks and core messaging components to speak with impact across marketing channels. 
          Click <span className="font-semibold text-pink-600 dark:text-pink-350">Apply to Live Page</span> to dynamically update the main website hero!
        </p>
      </div>

      <div className="p-6 md:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Playbook Left Column */}
        <div className="lg:col-span-7 space-y-6">
          {/* Headlines List */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-200 uppercase tracking-wider flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-pink-500 rounded-full"></span>
                Headline Options (Select to live preview)
              </h4>
              <span className="text-[11px] text-slate-400 dark:text-slate-500 font-mono bg-slate-50 dark:bg-slate-950 px-2 py-0.5 rounded-full">5 Styles Included</span>
            </div>
            
            <div className="space-y-2.5">
              {headlines.map((headline, index) => {
                const isSelected = currentHeadline === headline;
                const copyId = `headline-${index}`;
                return (
                  <div
                    key={index}
                    className={`p-3.5 rounded-xl border transition-all text-left flex items-start justify-between gap-4 cursor-pointer group ${
                      isSelected
                        ? 'bg-[#fff9fa] dark:bg-pink-950 border-rose-350 dark:border-rose-900 ring-1 ring-rose-200/50'
                        : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 hover:bg-slate-100/60 dark:hover:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-700'
                    }`}
                    onClick={() => onSelectHeadline(headline)}
                  >
                    <div className="flex gap-3">
                      <span className="text-xs font-mono font-bold text-slate-400 mt-1">0{index + 1}</span>
                      <p className={`text-sm md:text-base font-serif font-medium ${isSelected ? 'text-rose-900 dark:text-pink-305' : 'text-slate-700 dark:text-slate-300'}`}>
                        {headline}
                      </p>
                    </div>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCopy(headline, copyId);
                        }}
                        type="button"
                        className="p-1.5 hover:bg-white dark:hover:bg-slate-800 rounded-lg border border-transparent hover:border-slate-200 dark:hover:border-slate-705 text-slate-400 hover:text-slate-200 transition-all shadow-sm"
                        title="Copy headline"
                      >
                        {copiedText === copyId ? (
                          <Check className="w-3.5 h-3.5 text-emerald-500" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
 
          {/* Taglines List */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-205 uppercase tracking-wider flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-amber-500 rounded-full"></span>
                Tagline Options (Select to live preview)
              </h4>
              <span className="text-[11px] text-slate-400 dark:text-slate-500 font-mono bg-slate-50 dark:bg-slate-950 px-2 py-0.5 rounded-full">5 Styles Included</span>
            </div>
 
            <div className="space-y-2.5">
              {taglines.map((tagline, index) => {
                const isSelected = currentTagline === tagline;
                const copyId = `tagline-${index}`;
                return (
                  <div
                    key={index}
                    className={`p-3.5 rounded-xl border transition-all text-left flex items-start justify-between gap-4 cursor-pointer group ${
                      isSelected
                        ? 'bg-[#fffdf8] dark:bg-amber-950/30 border-amber-300 dark:border-amber-900 ring-1 ring-amber-200/40'
                        : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 hover:bg-slate-100/60 dark:hover:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-700'
                    }`}
                    onClick={() => onSelectTagline(tagline)}
                  >
                    <div className="flex gap-3">
                      <span className="text-xs font-mono font-bold text-slate-400 mt-0.5">0{index + 1}</span>
                      <p className={`text-xs md:text-sm ${isSelected ? 'text-amber-900 dark:text-amber-305 font-medium' : 'text-slate-600 dark:text-slate-400'}`}>
                        {tagline}
                      </p>
                    </div>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCopy(tagline, copyId);
                        }}
                        type="button"
                        className="p-1.5 hover:bg-white dark:hover:bg-slate-800 rounded-lg border border-transparent hover:border-slate-200 dark:hover:border-slate-705 text-slate-400 hover:text-slate-200 transition-all shadow-sm"
                        title="Copy tagline"
                      >
                        {copiedText === copyId ? (
                          <Check className="w-3.5 h-3.5 text-emerald-500" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Brand Mission/Vision & Preview Card */}
        <div className="lg:col-span-5 space-y-6">
          {/* Real-time Hero Miniature Sandbox */}
          <div className="bg-slate-950 text-white rounded-2xl p-6 relative overflow-hidden shadow-md border border-slate-800">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-pink-500/20 to-amber-500/20 rounded-full blur-2xl"></div>
            
            <div className="flex items-center gap-2 mb-4 relative z-10">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
              <span className="text-[10px] font-mono tracking-widest text-slate-400 uppercase">Live Preview Sandbox</span>
            </div>

            <div className="relative z-10 space-y-3 min-h-[140px] flex flex-col justify-center text-left">
              <p className="text-rose-400 text-[10px] uppercase tracking-widest font-bold font-mono">Coming Soon</p>
              <h5 className="text-lg md:text-xl font-serif font-medium leading-tight text-white transition-all duration-300">
                "{currentHeadline}"
              </h5>
              <p className="text-xs text-slate-300 leading-relaxed font-sans transition-all duration-300">
                {currentTagline}
              </p>
            </div>

            <div className="mt-5 pt-4 border-t border-slate-800 flex justify-between items-center text-xs text-slate-400 relative z-10">
              <span>Layout mockup container</span>
              <span className="text-rose-300 font-semibold flex items-center gap-1">
                <Eye className="w-3 h-3" /> Fully Customized
              </span>
            </div>
          </div>

          {/* Mission & Vision Statements */}
          <div className="bg-gradient-to-br from-slate-50 to-pink-50/20 dark:from-slate-900 dark:to-pink-950/5 rounded-2xl p-6 border border-slate-100 dark:border-slate-800 text-left space-y-5 transition-colors">
            {/* Mission Statement */}
            <div className="space-y-2">
              <span className="flex items-center gap-2 text-xs font-semibold text-pink-600 dark:text-pink-300 uppercase font-mono tracking-wider">
                <Heart className="w-3.5 h-3.5 text-pink-600 dark:text-pink-400" /> Core Mission Statement
              </span>
              <p className="text-sm text-slate-700 dark:text-slate-350 leading-relaxed italic bg-white/80 dark:bg-slate-950 p-3 rounded-xl border border-pink-100/50 dark:border-slate-800">
                "Our mission is to expand accessibility in self-care, helping people feel confident, cared for, beautiful, respected, and seen—especially seniors and individuals with physical or sensory mobility needs, by delivering trained, salon-grade grooming solutions directly to their comfort zone with unconditional dignity."
              </p>
              <div className="flex justify-end">
                <button
                  onClick={() => handleCopy("Our mission is to expand accessibility in self-care, helping people feel confident, cared for, beautiful, respected, and seen—especially seniors and individuals with physical or sensory mobility needs, by delivering trained, salon-grade grooming solutions directly to their comfort zone with unconditional dignity.", 'mission')}
                  className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-400 font-medium transition-colors cursor-pointer"
                  type="button"
                >
                  {copiedText === 'mission' ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-500" /> Copied Mission!
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" /> Copy Mission Statement
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Vision Statement */}
            <div className="space-y-2 pt-3 border-t border-slate-100 dark:border-slate-800">
              <span className="flex items-center gap-2 text-xs font-semibold text-amber-600 dark:text-amber-400 uppercase font-mono tracking-wider">
                <BookOpen className="w-3.5 h-3.5 text-amber-500" /> High-Level Vision
              </span>
              <p className="text-sm text-slate-700 dark:text-slate-350 leading-relaxed bg-white/80 dark:bg-slate-950 p-3 rounded-xl border border-amber-100/30 dark:border-slate-800">
                "We envision a world where physical limitations never compromise individual dignity. By partnering with independent technicians and local salons, BBTY will build the global standard for mobile wellness-beauty, transforming isolation into a healing, community-backed luxury of compassionate touch."
              </p>
              <div className="flex justify-end">
                <button
                  onClick={() => handleCopy("We envision a world where physical limitations never compromise individual dignity. By partnering with independent technicians and local salons, BBTY will build the global standard for mobile wellness-beauty, transforming isolation into a healing, community-backed luxury of compassionate touch.", 'vision')}
                  className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-400 font-medium transition-colors cursor-pointer"
                  type="button"
                >
                  {copiedText === 'vision' ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-500" /> Copied Vision!
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" /> Copy Vision Statement
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
