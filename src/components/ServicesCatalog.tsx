import React, { useState } from 'react';
import { 
  Scissors, 
  Wind, 
  Sparkles, 
  Hand, 
  Heart, 
  ShieldCheck, 
  Check, 
  SlidersHorizontal, 
  Copy, 
  Calendar, 
  Gift, 
  Activity, 
  Coffee,
  CheckSquare,
  Square
} from 'lucide-react';
import { safeCopyToClipboard } from '../lib/safeCopyToClipboard';

interface ServiceItem {
  name: string;
  description: string;
  duration: string;
  highlights: string[];
}

interface ServiceCategory {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  services: ServiceItem[];
}

export default function ServicesCatalog() {
  const [activeTab, setActiveTab] = useState<string>('hair');
  
  // Custom Planner States
  const [recipient, setRecipient] = useState<string>('parent');
  const [frequency, setFrequency] = useState<string>('monthly');
  const [customServices, setCustomServices] = useState<string[]>(['hair-cut', 'nail-mani']);
  const [comfortSensitivities, setComfortSensitivities] = useState<string[]>(['wheelchair', 'low-noise']);
  const [copiedSummary, setCopiedSummary] = useState(false);

  const categories: ServiceCategory[] = [
    {
      id: 'hair',
      title: 'Gentle Hair Design & Blowouts',
      description: 'Dignified styles tailored to match unique personal identities. Our certified stylists operate carefully, respecting range-of-motion limits and neck safety, leaving clients feeling elegant and refreshed.',
      icon: Scissors,
      services: [
        {
          name: 'The Gentle Sculpt Haircut',
          description: 'A customized unhurried haircut designed to optimize posture comfort. Can be performed fully standing, seated in standard living chairs, or safely aligned to wheelchair supports.',
          duration: '45-60 mins',
          highlights: ['Adapted styling positions', 'Dry or damp cut flexibility', 'Textured thinning hair focus', 'Easy to maintain day-to-day']
        },
        {
          name: 'Classic Roller-Set & Restorative Blowout',
          description: 'A nostalgic, comforting style session utilizing low-noise heat setups. Popular with seniors who love to preserve their cherished weekly roller or round-brush routine without typical salon overwhelm.',
          duration: '40-50 mins',
          highlights: ['Low-noise, low-vibration dryers', 'Comfort-angled neck support', 'Volumizing & scalp-conscious products', 'Delightful unhurried scalp brushing']
        },
        {
          name: 'Protective Braiding & Hand-Sewn Sew-Ins',
          description: 'A careful, protective braiding session followed by precise, tension-free hand-sewing of custom hair wefts. Designed for individuals looking to restore volume or maintain a cherished natural-hair style without salon fatigue.',
          duration: '90-120 mins',
          highlights: ['Zero-tension braid base', 'Scalp-conscious weft sewing', 'Protective style preservation', 'Performed comfortably in-chair']
        },
        {
          name: 'Therapeutic Cranial Prosthesis (TCP) Custom Styling',
          description: 'A compassionate, highly supportive medical-grade wig (cranial hair prosthesis) fitting, alignment, and customization session, designed specifically for clients with sensitive scalps or experiencing thinning hair.',
          duration: '60 mins',
          highlights: ['Hypoallergenic base alignment', 'Custom razor-shaping & trimming', 'Sensitive-scalp soothing care', 'Compassionate, privacy-focused']
        },
        {
          name: 'Express Cleanse & Adaptive Style-Out',
          description: 'A soothing dry-cleanse or warm-towel spray wash followed by customizable finishing work. Designed for quick, refreshing beauty boosts between major appointments or ahead of family gatherings.',
          duration: '30 mins',
          highlights: ['Waterless foam cleanse options', 'Perfect for low-energy days', 'Scent-free styling crèmes', 'No hard bending or leaning required']
        }
      ]
    },
    {
      id: 'nails',
      title: 'Adaptive Hand & Foot Nail Care',
      description: 'Strictly cosmetic wellness nail grooming designed to prevent painful self-scratching, hydrate fragile nail beds, and maintain smooth, comfortable, and beautifully finished fingertips.',
      icon: Hand,
      services: [
        {
          name: 'The Safe-Trim Compassionate Manicure',
          description: 'Meticulous fingernail trimming and filing designed specifically for fragile skin or stiff finger joints. Includes a soothing moisturizer rub and optional non-toxic nail polish.',
          duration: '35 mins',
          highlights: ['Anti-scratch rounded nail filing', 'Zero sharp metal clippers used', 'Extensive hydration of dry cuticles', 'Safe, non-toxic, scent-free polish']
        },
        {
          name: 'Restorative Care Comfort Pedicure',
          description: 'A comforting cosmetic soak and trim for toenails. Stylists use gentle water basins or warming mist pads to soften and file thick, hard-to-reach nails while the client relaxes in their favorite room armchair.',
          duration: '45 mins',
          highlights: ['Dry-spray or low-water basin choices', 'Safe, certified cosmetic hygienic practices', 'Deep moisturizing for extremely dry heels', 'Zero medical intervention, purely cosmetic wellness']
        },
        {
          name: 'Nourishing Barrier Treatment',
          description: 'Specifically crafted for clients experiencing thin, brittle, or yellowing nail layers due to health imbalances. Uses organic tea-tree oil blends and collagen base coats to reinforce structural strength.',
          duration: '20 mins',
          highlights: ['Strengthens fragile, paper-thin plates', 'Organic, plant-based nutrient sealants', 'Instantly reduces ragged edge snags', 'Relaxing manual massage finish']
        }
      ]
    },
    {
      id: 'glow',
      title: 'Gentle Glow Makeup & Cosmetics',
      description: 'Hypoallergenic cosmetic touches designed to emphasize natural brightness and boost psychological wellness. Perfect for milestone anniversaries, birthday celebrations, or daily self-care confidence.',
      icon: Sparkles,
      services: [
        {
          name: 'Simple Radiance Daily Face Finish',
          description: 'A light, breathable cosmetic application focusing on hydrating thin skin and warming the complexion. Designed to make eyes sparkle and skin feel soft without looking heavy.',
          duration: '25 mins',
          highlights: ['Hypoallergenic mineral foundation', 'Feather-light eye & lip tinting', 'Gentle brush techniques for sensitive skin', 'Confidence-boosting focus']
        },
        {
          name: 'Legacy Photo & Milestone Event Pampering',
          description: 'Elegant makeup styling to prepare clients for family portraits, generational video calls, or special in-home celebrations. Our artists coordinate with caregiver outfits to ensure a camera-ready look.',
          duration: '40 mins',
          highlights: ['Long-lasting camera-friendly formulas', 'Color-matching to favorite outfits', 'Includes soft eyebrow defining', 'Beautiful, natural, timeless look']
        }
      ]
    },
    {
      id: 'grooming',
      title: 'Dignified Grooming & Sensory Support',
      icon: Coffee,
      description: 'Essential grooming services that keep ears, brows, and faces clean, comfortable, and neatly trimmed. We prioritize patience and calm tactile sensory pacing to reduce grooming-related anxieties.',
      services: [
        {
          name: 'Warm Towel Face & Beard Refresh',
          description: 'A rich therapeutic wrap using safe, unheated warm towels to open pores, soothe tense facial muscles, and safely prep facial hair for quick neatening. Highly calming for seniors.',
          duration: '25 mins',
          highlights: ['Steam-validated touch parameters', 'Scent-free calming hydration', 'Beard shaping with safety-guarded shavers', 'Therapeutic physical relaxation benefits']
        },
        {
          name: 'Precision Comfort Trim',
          description: 'Delicate, slow trim of eyebrows, ears, and necklines. Stylists talk through every sound, warning clients before turning on quiet clippers, assuring absolute peace of mind.',
          duration: '20 mins',
          highlights: ['Whisper-quiet trimmer motors', 'Extremely gentle ear/brow hair pruning', 'Constant conversational validation', 'Restores fresh, tidy contours quickly']
        },
        {
          name: 'Scalp Hydration & Botanical Conditioning',
          description: 'An ultra-gentle massage focusing on dehydrated, tight scalps. Ideal for clients recovering from hair loss or bed-resting conditions. We restore natural oils to keep the scalp safe from itchiness.',
          duration: '20 mins',
          highlights: ['De-stresses dry cranial pressure', 'Soothing, circular friction methods', 'Warm lavender or plain jojoba oils', 'Helps preserve underlying follicles']
        }
      ]
    }
  ];

  const toggleCustomService = (id: string) => {
    if (customServices.includes(id)) {
      setCustomServices(customServices.filter(s => s !== id));
    } else {
      setCustomServices([...customServices, id]);
    }
  };

  const toggleComfortSensitivity = (id: string) => {
    if (comfortSensitivities.includes(id)) {
      setComfortSensitivities(comfortSensitivities.filter(c => c !== id));
    } else {
      setComfortSensitivities([...comfortSensitivities, id]);
    }
  };

  // Generate dynamic copywriting profile summary for caregivers to copy-paste
  const generatePlannerSummary = () => {
    const serviceNames = {
      'hair-cut': 'Gentle Sculpt Haircut',
      'hair-roll': 'Classic Roller-Set & Blowout',
      'hair-sew': 'Protective Sew-Ins',
      'hair-tcp': 'TCP Cranial Prosthesis Fitting',
      'nail-mani': 'Safe-Trim Manicure',
      'nail-pedi': 'Care Comfort Pedicure',
      'glow-face': 'Simple Radiance Makeup',
      'groom-trim': 'Precision Comfort Trim'
    };

    const sensitivityNames = {
      'wheelchair': 'Seated wheelchair-compatible styling required',
      'low-noise': 'Exhibits sound sensitivity, requests ultra-quiet blow dryer',
      'warmth': 'Prone to chills, requests warm shoulder towel wrap',
      'fragile': 'Fragile skin/joints, requires hypoallergenic scent-free formula'
    };

    const chosenServicesText = customServices.map(s => serviceNames[s as keyof typeof serviceNames] || s).join(', ');
    const chosenSensitivitiesText = comfortSensitivities.map(c => sensitivityNames[c as keyof typeof sensitivityNames] || c).join('; ');

    return `BBTY Care Profile:
• Client Profile: ${recipient.toUpperCase()} (Care Frequency: ${frequency})
• Desired Care Services: ${chosenServicesText || 'None Selected'}
• Accessibility & Comfort Preferences: ${chosenSensitivitiesText || 'Standard gentle setup'}
• Note: Strictly non-medical cosmetic self-care and self-esteem hygiene help. Ready for regional launch coordination approval.`;
  };

  const handleCopySummary = () => {
    const summaryText = generatePlannerSummary();
    safeCopyToClipboard(summaryText).then(() => {
      setCopiedSummary(true);
      setTimeout(() => setCopiedSummary(false), 3000);
    });
  };

  const currentCategory = categories.find(c => c.id === activeTab) || categories[0];
  const TabIcon = currentCategory.icon;

  return (
    <section className="py-24 bg-transparent border-y border-white/10 dark:border-white/5 transition-colors duration-250" id="services-catalog-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Title */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-pink-600 dark:text-pink-300 uppercase tracking-widest font-mono bg-pink-50 dark:bg-pink-950/30 px-3.5 py-1.5 rounded-full border border-pink-100/40 dark:border-pink-900/10 shadow-3xs">
            <Sparkles className="w-3.5 h-3.5 text-pink-500 animate-pulse" />
            Adaptive Services Portfolio
          </span>
          <h2 className="text-3xl md:text-5xl font-serif text-slate-900 dark:text-white font-bold tracking-tight mt-3">
            Elegance Designed to Adapt
          </h2>
          <p className="text-slate-600 dark:text-slate-350 mt-4 text-sm md:text-lg leading-relaxed">
            Standard salon layouts can be stressful or inaccessible. We offer professional, slow-paced cosmetic haircuts, blowouts, gentle hand/foot nail hydration, and light makeup touch-ups delivered completely inside the physical comfort zone of your home.
          </p>
        </div>

        {/* Categories Tab Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-4xl mx-auto mb-10" id="services-category-tabs">
          {categories.map((cat) => {
            const CatIcon = cat.icon;
            const isSelected = activeTab === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveTab(cat.id)}
                type="button"
                className={`py-3.5 px-4 rounded-2xl border text-xs font-bold tracking-tight flex items-center justify-center gap-2 transition-all cursor-pointer outline-none ${
                    isSelected
                      ? 'bg-gradient-to-br from-pink-50 to-pink-100/30 dark:from-pink-950/30 dark:to-pink-900/10 border-pink-200 dark:border-pink-850 text-pink-950 dark:text-pink-100 shadow-3xs'
                      : 'bg-slate-50 hover:bg-slate-100 dark:bg-slate-900/40 dark:hover:bg-slate-900 border-slate-200 dark:border-slate-850 text-slate-500 dark:text-slate-400'
                }`}
                id={`tab-btn-${cat.id}`}
              >
                <CatIcon className={`w-4 h-4 ${isSelected ? 'text-pink-600 dark:text-pink-400' : ''}`} />
                <span>{cat.title.split(' ')[1] || cat.title.split(' ')[0]}</span>
              </button>
            );
          })}
        </div>

        {/* Selected Category Feature Display Block */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-8 mb-16 text-left shadow-sm" id="services-pane-container">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Category Meta Text (Left Side, 4 cols) */}
            <div className="lg:col-span-4 space-y-4">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-pink-100 dark:bg-pink-950/45 text-pink-600 dark:text-pink-300 border border-pink-200/40 dark:border-pink-900/10">
                <TabIcon className="w-6 h-6" />
              </div>
              <h3 className="text-xl md:text-2xl font-serif text-slate-950 dark:text-white font-black leading-tight">
                {currentCategory.title}
              </h3>
              <p className="text-xs md:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-sans">
                {currentCategory.description}
              </p>
              
              {/* Guarantee Seal */}
              <div className="pt-4 border-t border-slate-200 dark:border-slate-800 space-y-2.5">
                <div className="flex items-center gap-2 text-[11px] font-bold text-slate-850 dark:text-slate-250">
                  <ShieldCheck className="w-4.5 h-4.5 text-emerald-500" />
                  <span>The Caregiver Companion Guarantee</span>
                </div>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-relaxed">
                  We maintain zero-rush scheduling. Our professionals set extra transition padding around visits to guarantee complete physical safety parameters. No client is ever prompted to hurry.
                </p>
              </div>
            </div>

            {/* List of Services inside this Category (Right Side, 8 cols) */}
            <div className="lg:col-span-8 space-y-4">
              {currentCategory.services.map((svc, sIdx) => (
                <div 
                  key={sIdx}
                  className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850/60 rounded-2xl p-5 md:p-6 shadow-3xs hover:shadow-sm hover:scale-[1.01] active:scale-[0.99] hover:border-pink-400 dark:hover:border-pink-500/55 transition-all duration-300 ease-out flex flex-col md:flex-row justify-between items-start md:items-center gap-4 text-left"
                >
                  <div className="space-y-2 max-w-xl">
                    <div className="flex flex-wrap items-center gap-2">
                       <h4 className="text-sm md:text-base font-bold text-slate-950 dark:text-white font-sans tracking-tight">
                        {svc.name}
                      </h4>
                      <span className="text-[9px] font-mono bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 px-2 py-0.5 rounded-md font-bold">
                        ⏱️ Estimated {svc.duration}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-350 leading-relaxed font-sans">
                      {svc.description}
                    </p>
                    {/* Visual Highlights */}
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {svc.highlights.map((hlt, hIdx) => (
                        <span 
                          key={hIdx}
                          className="inline-flex items-center gap-1 text-[9px] px-2 py-0.5 rounded-full font-mono font-medium text-pink-600 dark:text-pink-300 bg-pink-500/5 dark:bg-pink-500/10 border border-pink-100/30 dark:border-pink-950/40"
                        >
                          <Check className="w-2.5 h-2.5 text-pink-500" />
                          {hlt}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <button
                    onClick={() => {
                      // Smooth scroll to waitlist block below
                      const el = document.getElementById('waitlist-form-block');
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                    }}
                    type="button"
                    className="flex-shrink-0 w-full md:w-auto px-6 py-3 bg-gradient-to-r from-pink-500 via-purple-600 to-blue-600 hover:from-pink-600 hover:via-purple-700 hover:to-blue-700 text-white font-black rounded-xl text-xs tracking-wider uppercase transition-all duration-300 hover:scale-[1.05] active:scale-[0.95] shadow-md hover:shadow-lg shadow-pink-500/12 cursor-pointer text-center border border-white/20 hover:border-white/45"
                  >
                    Register Waitlist
                  </button>
                </div>
              ))}
            </div>

          </div>
        </div>

        {/* INTERACTIVE BUILDER: Custom Wellness Care Planner */}
        <div className="max-w-4xl mx-auto bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-8 text-left shadow-sm" id="services-planner-block">
          
          {/* Header */}
          <div className="flex items-center gap-2.5 border-b border-slate-100 dark:border-slate-900 pb-5 mb-6">
            <div className="w-9 h-9 rounded-xl bg-pink-50 dark:bg-pink-950 flex items-center justify-center text-pink-600 dark:text-pink-400 border border-pink-100 dark:border-pink-900/30">
              <SlidersHorizontal className="w-4.5 h-4.5" />
            </div>
            <div>
              <h3 className="text-base md:text-lg font-bold font-sans tracking-tight text-slate-900 dark:text-white">
                Client Comfort Service Profile Planner
              </h3>
              <p className="text-[11px] text-slate-400 dark:text-slate-500 leading-normal mt-0.5">
                Draft adaptation coordinates ahead of launching times. Instantly generate a custom care summary card to easily paste in waitlist registries!
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
            
            {/* Planner Selections panel (Right Side/Left Side interaction, 7 cols) */}
            <div className="md:col-span-7 space-y-5">
              
              {/* Recipient Selection */}
              <div className="space-y-2">
                <span className="text-[10px] font-mono font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest block">
                  1. Who is the Service For?
                </span>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'parent', label: '👴 Aging Parent / Senior' },
                    { id: 'disability', label: '♿ Mobility Challenge Ally' },
                    { id: 'facility', label: '🏢 Care Facility Resident' },
                    { id: 'independent', label: '🏡 Busy Family / Self' }
                  ].map((res) => (
                    <button
                      key={res.id}
                      type="button"
                      onClick={() => setRecipient(res.id)}
                      className={`p-2.5 rounded-xl border text-[11px] font-medium transition-all cursor-pointer text-left outline-none ${
                        recipient === res.id
                          ? 'bg-pink-500/5 dark:bg-pink-500/10 border-pink-300 dark:border-pink-800 text-pink-700 dark:text-pink-300'
                          : 'bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-850 text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      {res.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom Service Checklist Selection */}
              <div className="space-y-2">
                <span className="text-[10px] font-mono font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest block">
                  2. Desired Care Treatments
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {[
                    { id: 'hair-cut', label: '💇 Sculpt Haircut' },
                    { id: 'hair-roll', label: '🧴 nostalgic Roller-Set / Blowout' },
                    { id: 'hair-sew', label: '🪡 Sew-Ins / Braiding' },
                    { id: 'hair-tcp', label: '🦾 TCP Cranial Prosthesis' },
                    { id: 'nail-mani', label: '💅 Safe-Trim Manicure' },
                    { id: 'nail-pedi', label: '🦶 Comfort Pedicure' },
                    { id: 'glow-face', label: '✨ Light Natural Makeup' },
                    { id: 'groom-trim', label: '☕ Precision Clipper Trim' }
                  ].map((svc) => {
                    const active = customServices.includes(svc.id);
                    return (
                      <button
                        key={svc.id}
                        type="button"
                        onClick={() => toggleCustomService(svc.id)}
                        className={`p-2.5 rounded-xl border text-[11px] font-medium transition-all flex items-center gap-2 cursor-pointer text-left outline-none ${
                          active
                            ? 'bg-pink-500/5 dark:bg-pink-500/10 border-pink-300 dark:border-pink-800 text-pink-700 dark:text-pink-300 font-bold'
                            : 'bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-850 text-slate-600 dark:text-slate-400'
                        }`}
                      >
                        {active ? <CheckSquare className="w-3.5 h-3.5 text-pink-500" /> : <Square className="w-3.5 h-3.5 text-slate-350" />}
                        <span>{svc.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Comfort Adaptations / Preferences Checkboxes */}
              <div className="space-y-2">
                <span className="text-[10px] font-mono font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest block">
                  3. Key Physical Adaptation Preferences
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {[
                    { id: 'wheelchair', label: 'Wheelchair / Seated Setup' },
                    { id: 'low-noise', label: 'Low-Sound Hair Dryer' },
                    { id: 'warmth', label: 'Extra Heating Towels' },
                    { id: 'fragile', label: 'Fragile Skin / Fragrance-Free' }
                  ].map((sen) => {
                    const active = comfortSensitivities.includes(sen.id);
                    return (
                      <button
                        key={sen.id}
                        type="button"
                        onClick={() => toggleComfortSensitivity(sen.id)}
                        className={`p-2.5 rounded-xl border text-[11px] font-medium transition-all flex items-center gap-2 cursor-pointer text-left outline-none ${
                          active
                            ? 'bg-pink-500/5 dark:bg-pink-500/10 border-pink-300 dark:border-pink-800 text-pink-700 dark:text-pink-300'
                            : 'bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-850 text-slate-600 dark:text-slate-400'
                        }`}
                      >
                        {active ? <CheckSquare className="w-3.5 h-3.5 text-pink-500" /> : <Square className="w-3.5 h-3.5 text-slate-350" />}
                        <span>{sen.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Service Frequency */}
              <div className="space-y-2">
                <span className="text-[10px] font-mono font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest block">
                  4. Indicated Service Frequency
                </span>
                <div className="flex gap-2">
                  {[
                    { id: 'once', label: 'One-Time Treat' },
                    { id: 'monthly', label: 'Monthly Care' },
                    { id: 'biweekly', label: 'Every 2 Weeks' }
                  ].map((freq) => (
                    <button
                      key={freq.id}
                      type="button"
                      onClick={() => setFrequency(freq.id)}
                      className={`flex-1 p-2 rounded-xl border text-[11px] font-medium transition-all cursor-pointer text-center outline-none ${
                        frequency === freq.id
                          ? 'bg-pink-500/5 dark:bg-pink-500/10 border-pink-300 dark:border-pink-800 text-pink-700 dark:text-pink-300 font-semibold'
                          : 'bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-850 text-slate-500 dark:text-slate-400'
                      }`}
                    >
                      {freq.label}
                    </button>
                  ))}
                </div>
              </div>

            </div>

            {/* Generated Care Card Receipt Summary Card (Right side, 5 cols) */}
            <div className="md:col-span-5 bg-slate-50 dark:bg-slate-950/95 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 space-y-4 shadow-sm flex flex-col justify-between h-full min-h-[360px]">
              
              <div className="space-y-3">
                <div className="flex justify-between items-center bg-pink-500/5 p-2 rounded-lg border border-pink-100/50 dark:border-pink-950">
                  <span className="text-[10px] font-bold text-pink-600 dark:text-pink-400 font-mono tracking-widest uppercase">
                    Care Coordination Profile
                  </span>
                  <Activity className="w-4 h-4 text-pink-500 animate-pulse" />
                </div>
                
                <div className="space-y-1">
                  <h4 className="text-xs font-bold text-slate-800 dark:text-slate-250 uppercase font-mono">
                    Client Profile Focus:
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-300 border-l-2 border-pink-500 pl-2">
                    {recipient === 'parent' ? '👵 Elderly / Aging Parent support' : 
                     recipient === 'disability' ? '♿ Mobility challenges / Physical adaptations' :
                     recipient === 'facility' ? '🏢 Resident in Care Facility community' : 
                     '🏡 In-Home Care / Multi-Tasking self-care'}
                  </p>
                </div>

                <div className="space-y-1">
                  <h4 className="text-xs font-bold text-slate-800 dark:text-slate-250 uppercase font-mono">
                    Requested Treatments:
                  </h4>
                  <div className="flex flex-wrap gap-1 leading-none">
                    {customServices.length === 0 ? (
                      <span className="text-[10px] text-slate-400">None selected yet</span>
                    ) : (
                      customServices.map(s => {
                        const itemNames: {[y: string]: string} = {
                          'hair-cut': 'Haircut',
                          'hair-roll': 'Rollers & Blowout',
                          'nail-mani': 'Manicure',
                          'nail-pedi': 'Comfort Pedicure',
                          'glow-face': 'Light Makeup',
                          'groom-trim': 'Clipper Trim'
                        };
                        return (
                          <span key={s} className="text-[9.5px] px-2 py-0.5 bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 font-medium rounded-md border border-slate-200/55 dark:border-slate-800">
                            {itemNames[s] || s}
                          </span>
                        );
                      })
                    )}
                  </div>
                </div>

                <div className="space-y-1">
                  <h4 className="text-xs font-bold text-slate-800 dark:text-slate-250 uppercase font-mono">
                    Active Accommodations:
                  </h4>
                  <ul className="text-[10px] text-slate-500 dark:text-slate-400 pl-4 list-disc space-y-0.5 leading-snug">
                    {comfortSensitivities.length === 0 ? (
                      <li>Standard unhurried layout spacing</li>
                    ) : (
                      comfortSensitivities.map(c => {
                        const sensLabels: {[z: string]: string} = {
                          'wheelchair': 'Seated wheelchair-compatible styling',
                          'low-noise': 'Use quiet hair dryer only',
                          'warmth': 'Extra shoulder warming towel',
                          'fragile': 'Hypoallergenic fragrance-free wash'
                        };
                        return <li key={c}>{sensLabels[c]}</li>;
                      })
                    )}
                  </ul>
                </div>

                <div className="space-y-1 pt-1 border-t border-slate-100 dark:border-slate-900 flex justify-between text-[11px]">
                  <span className="text-slate-400 font-sans">Cadence Target:</span>
                  <span className="font-bold text-pink-600 dark:text-pink-400 capitalize">
                    {frequency === 'once' ? 'One-time treat' : frequency === 'monthly' ? 'Once per month' : 'Every 2 weeks'}
                  </span>
                </div>
              </div>

              {/* Action Area */}
              <div className="space-y-2 pt-4 border-t border-slate-100 dark:border-slate-900">
                <button
                  type="button"
                  onClick={handleCopySummary}
                  className={`w-full py-2.5 px-3 rounded-xl font-bold text-[11px] uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all text-white cursor-pointer ${
                    copiedSummary ? 'bg-emerald-600' : 'bg-pink-600 hover:bg-pink-700'
                  }`}
                >
                  {copiedSummary ? <Check className="w-3.5 h-3.5 animate-bounce" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedSummary ? 'Profile Copied To Clipboard!' : 'Copy Care Profile Summary'}</span>
                </button>
                <div className="flex gap-1 items-center justify-center text-[9px] text-slate-400 dark:text-slate-505 font-mono">
                  <span>💡 Copy & paste inside the Registry waitlist down below</span>
                </div>
              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
