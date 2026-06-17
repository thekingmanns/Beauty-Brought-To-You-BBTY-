import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Sparkles, 
  Heart, 
  Award, 
  GraduationCap, 
  HelpCircle, 
  Layers, 
  Eye, 
  Leaf, 
  UserCheck, 
  CheckCircle2, 
  Moon,
  VolumeX,
  Smartphone
} from 'lucide-react';

interface TrainingPillar {
  id: string;
  title: string;
  icon: React.ComponentType<any>;
  subtitle: string;
  summary: string;
  methods: string[];
  vibeText: string;
}

export default function TechQualifications() {
  const [activePillar, setActivePillar] = useState<string>('cognitive');

  const pillars: TrainingPillar[] = [
    {
      id: 'cognitive',
      title: 'Dignified Communication & Cognitive Pacing',
      icon: Heart,
      subtitle: 'Patience-First Pacing & Sensory Accommodation',
      summary: 'Our beauty professionals are trained to work slowly and speak clearly, building quiet rapport. They are coached to adjust to individual cognitive speeds, supporting seniors with memory support needs, dementia, or sensory processing fatigue.',
      methods: [
        'Cognitive Pacing: Allowing extra time for transitions, reducing surprise movements, and mirroring the client’s comfort speed.',
        'Sensory-Friendly Space Setup: Minimizing background noise, avoiding overlapping conversations, and limiting high-frequency hair-dryer runtimes.',
        'Dementia-Friendly Validation: Conversational techniques designed to soothe anxiety, reduce confusion, and restore calm during service steps.',
        'Active Listening & Story Preservation: Welcoming client memories, stories, and individual style desires with genuine, unhurried warmth.'
      ],
      vibeText: 'Establishing high emotional safety and sensory comfort is just as important as the perfect hair set.'
    },
    {
      id: 'mobility',
      title: 'Mobility & Physical Ergonomics Integration',
      icon: Layers,
      subtitle: 'Adaptive Positioning & Safe physical setups',
      summary: 'Traditional salons require climbing high-pedestal chairs or leaning over hard sinks. We train our stylists to bring flexible, high-care setups that adapt fully to wheelchairs, standard armchairs, hospital beds, or custom living environments.',
      methods: [
        'Wheelchair Compatibility: Styling, washing, and nail trims adapted to standard or power chairs, avoiding unnecessary transfers.',
        'Support Bar & Walker Synergy: Arranging equipment so clients can maintain physical handholds and stability supports throughout.',
        'Zero-Strain Portable Washers: High-utility splash guards and adaptive portable blowouts designed to eliminate hard postural bending.',
        'Home Space Respect: Setting clean-swept workspaces that protect rugs, hardwood floors, and keep walkways open for caregivers.'
      ],
      vibeText: 'We fit our beauty tools to the user’s preferred seating, never forcing the client to fit our tools.'
    },
    {
      id: 'gentle',
      title: 'Gentle Cosmetic Touch & Product Safety',
      icon: Leaf,
      subtitle: 'Fragile Skin, Thinning Hair, & Clean Hypoallergenic Practice',
      summary: 'Cosmetic grooming for seniors and mobility-limited clients requires specialized manual techniques. We emphasize extra-gentle handling, protective manicures, and hypoallergenic formulas that nourish thin and delicate dermal areas.',
      methods: [
        'Thinning Hair Restoration: Soft scalp tension, low-heat thermal styling, and using natural-bristle brushes to protect hair roots.',
        'Gentle Nails & Skin Hydration: Podiatric-aware hand/foot filing (strictly cosmetic hygiene only) without sharp metal instruments or aggressive clipping.',
        'Hypoallergenic & Scent-Free Options: Utilizing mild, plant-derived, paraben-free formulas that are non-irritating to sensitive airways or delicate dry skin.',
        'Sanitized & Single-Use Instruments: Hospital-grade autoclave sterilization for all metal instruments, plus single-use consumable files.'
      ],
      vibeText: 'Every brush, file, and cream is chosen for physical gentleness, keeping skin protected and comfortable.'
    },
    {
      id: 'vetting',
      title: 'Professional Licensing & Empathy Vetting',
      icon: UserCheck,
      subtitle: 'Rigorous National Checks & Compassion-Aligned Audits',
      summary: 'Only the top tier of local beauty professionals join our waitlist rollout team. Beyond verifying active professional state board licenses, we screen candidates extensively for exceptional empathy, patience levels, and natural caregiving alignment.',
      methods: [
        'Active State Cosmetology/Manicurist Licenses: Authenticated background filings with no past state board disciplinary actions.',
        'Background & Registry Screenings: National criminal, sex offender, and protective care registry checkouts before deployment.',
        'Continuous Empathy Audits: Periodic caregiver feedback loops ensuring stylists uphold our strict standard of warm, patient conduct.',
        'Ongoing Accessibility Education: Lifelong study courses regarding mobility aids, age-related skin care, and gentle communication techniques.'
      ],
      vibeText: 'Our professionals do more than excel in beauty—they are chosen for how deeply they care.'
    }
  ];

  const currentPillar = pillars.find(p => p.id === activePillar) || pillars[0];
  const CurrentIcon = currentPillar.icon;

  return (
    <section className="py-24 bg-transparent border-b border-white/10 dark:border-white/5 transition-colors duration-200" id="tech-qualifications-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-purple-600 dark:text-purple-300 uppercase tracking-widest font-mono bg-purple-50 dark:bg-purple-950/30 px-3.5 py-1.5 rounded-full border border-purple-100/40 dark:border-purple-900/10 shadow-3xs">
            <Award className="w-3.5 h-3.5 text-purple-500" />
            The BBTY Professional Standard
          </span>
          <h2 className="text-3xl md:text-5xl font-serif text-slate-900 dark:text-white font-bold tracking-tight mt-3">
            Trained in Respect, Certified in Safety
          </h2>
          <p className="text-slate-600 dark:text-slate-350 mt-4 text-sm md:text-lg leading-relaxed">
            Beautiful styling begins with professional trust. Because welcoming someone into your home or assisted care space is deeply personal, our technicians are certified in a premium curriculum focusing on safety-first physical mobility and cognitive empathy.
          </p>
        </div>

        {/* Dynamic Interactive Panel / Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Navigation Tab Pillar Selectors (Left Side, col-span-4) */}
          <div className="lg:col-span-4 space-y-3 font-sans">
            <span className="text-[11px] font-mono font-extrabold text-purple-700 dark:text-purple-300 uppercase tracking-widest block text-left pl-1">
              Safety & Care Curriculum Pillars
            </span>
            <div className="flex flex-col gap-2.5">
              {pillars.map((pillar) => {
                const Icon = pillar.icon;
                const active = pillar.id === activePillar;
                return (
                  <button
                    key={pillar.id}
                    onClick={() => setActivePillar(pillar.id)}
                    type="button"
                    className={`w-full text-left p-4 rounded-2xl border transition-all cursor-pointer flex items-center gap-3.5 outline-none relative ${
                      active 
                        ? 'bg-purple-100/50 dark:bg-purple-950/80 border-purple-500 dark:border-purple-800'
                        : 'bg-white hover:bg-slate-100 dark:bg-slate-900 dark:hover:bg-slate-850 border-slate-350 dark:border-slate-800 text-slate-800 dark:text-slate-350'
                    }`}
                  >
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors ${
                      active 
                        ? 'bg-purple-600 text-white' 
                        : 'bg-slate-200 dark:bg-slate-950 text-slate-600'
                    }`}>
                      <Icon className="w-4.5 h-4.5" />
                    </div>
                    <div className="leading-tight">
                      <h4 className={`text-xs font-black font-sans tracking-tight ${active ? 'text-purple-950 dark:text-white' : 'text-slate-900 dark:text-slate-100'}`}>
                        {pillar.title}
                      </h4>
                      <p className={`text-[10px] font-bold mt-0.5 line-clamp-1 ${active ? 'text-purple-800 dark:text-purple-300' : 'text-slate-700 dark:text-slate-405'}`}>
                        {pillar.subtitle}
                      </p>
                    </div>
                    {active && (
                      <span className="absolute right-4 w-1.5 h-1.5 bg-purple-600 rounded-full"></span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Credibility Seal Card */}
            <div className="mt-6 p-5 bg-slate-50 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-2xl text-left space-y-3">
              <span className="text-[10px] font-mono font-bold text-purple-700 dark:text-purple-300 uppercase tracking-widest block">
                ⭐ Trust & Professional Integrity
              </span>
              <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed font-sans">
                Our services are limited entirely to cosmetic, wellness, and self-esteem hygiene support. Our staff works closely with primary caregivers to ensure a supportive environment, and we make no medical diagnoses, disease treatments, or clinical physical therapy claims.
              </p>
            </div>
          </div>

          {/* Core Feature Detail Block (Right Side, col-span-8) */}
          <div className="lg:col-span-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-8 shadow-xs text-left flex flex-col justify-between transition-all duration-300 min-h-[460px]">
            
            <div className="space-y-6">
              
              {/* Pillar Header Card */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-900 pb-5">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="p-1 px-2.5 bg-purple-50 dark:bg-purple-950 text-purple-600 dark:text-purple-300 rounded-lg text-[9.5px] font-bold font-mono uppercase tracking-widest">
                      Module Training Active
                    </span>
                  </div>
                  <h3 className="text-xl md:text-2xl font-serif text-slate-900 dark:text-white font-bold leading-tight mt-1.5">
                    {currentPillar.title}
                  </h3>
                  <p className="text-xs text-purple-600 dark:text-purple-400 font-medium italic">
                    {currentPillar.subtitle}
                  </p>
                </div>
                <div className="w-12 h-12 rounded-full bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center border border-purple-100/30 dark:border-purple-900/40 flex-shrink-0">
                  <CurrentIcon className="w-6 h-6 animate-pulse" />
                </div>
              </div>

              {/* Summary paragraph */}
              <div className="space-y-2">
                <span className="text-[10px] font-mono font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest block">
                  Curriculum Overview
                </span>
                <p className="text-slate-700 dark:text-slate-300 text-sm md:text-base leading-relaxed">
                  {currentPillar.summary}
                </p>
              </div>

              {/* Concrete Training Solutions checklist */}
              <div className="space-y-3.5">
                <span className="text-[10px] font-mono font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest block">
                  Core Competence Guidelines Tested
                </span>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {currentPillar.methods.map((method, index) => {
                    const [bulletTitle, bulletDesc] = method.split(': ');
                    return (
                      <div key={index} className="flex gap-2.5 items-start bg-slate-100/40 dark:bg-slate-900/50 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800">
                        <CheckCircle2 className="w-4.5 h-4.5 text-emerald-600 mt-0.5 flex-shrink-0" />
                        <div className="text-xs font-sans leading-relaxed">
                          <strong className="text-slate-950 dark:text-white block mb-0.5 font-black text-xs sm:text-sm">{bulletTitle}</strong>
                          <span className="text-slate-800 dark:text-slate-205 font-bold">{bulletDesc}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>

            {/* Bottom beautiful Vibe Bar */}
            <div className="mt-8 pt-5 border-t border-slate-100 dark:border-slate-900 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-purple-50/20 dark:bg-purple-950/10 p-4 rounded-2xl">
              <div className="flex items-center gap-2">
                <GraduationCap className="w-4.5 h-4.5 text-purple-500 flex-shrink-0" />
                <span className="text-[11px] text-slate-600 dark:text-slate-300 leading-snug">
                  <strong>Specialized Focus:</strong> "{currentPillar.vibeText}"
                </span>
              </div>
              <span className="text-[9px] font-mono whitespace-nowrap text-purple-600 dark:text-purple-400 font-bold bg-white dark:bg-slate-900 px-2 py-1 rounded-md border border-purple-105 dark:border-purple-900/30">
                100% Non-Medical Care
              </span>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
