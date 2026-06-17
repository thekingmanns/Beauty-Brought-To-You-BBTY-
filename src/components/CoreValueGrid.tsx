import React from 'react';
import { 
  Heart, Shield, Sparkles, Smile, Star, Check, Calendar, Activity, 
  Users, Award, HelpCircle, ArrowRight 
} from 'lucide-react';

interface Props {
  onLearnMore?: (target: string) => void;
  onPlanEvent?: () => void;
}

export default function CoreValueGrid({ onLearnMore, onPlanEvent }: Props) {
  return (
    <section id="core-values-grid" className="py-20 bg-transparent border-y border-white/10 dark:border-white/5 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Dynamic 4-Column Grid matching UI Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
          
          {/* Card 1: Specialized Care */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-md hover:shadow-lg transition-all flex flex-col justify-between group">
            <div className="space-y-4 text-left">
              {/* Icon & Title */}
              <div className="w-12 h-12 rounded-2xl bg-pink-100/50 dark:bg-pink-950/20 flex items-center justify-center">
                <Heart className="w-6 h-6 text-pink-500" />
              </div>
              <h3 className="text-xl font-serif font-black text-slate-950 dark:text-white group-hover:text-pink-600 dark:group-hover:text-pink-400 transition-colors">
                Specialized Care
              </h3>
              
              <ul className="space-y-3 pt-2">
                {[
                  "Diabetic Foot & Nail Care",
                  "Senior Wellness Grooming",
                  "Disability Support Services",
                  "Post-Surgery & Recovery Care",
                  "Personalized One-on-One Care"
                ].map((item, idx) => (
                  <li key={idx} className="flex items-center gap-2.5 text-xs text-slate-700 dark:text-slate-200">
                    <span className="w-1.5 h-1.5 rounded-full bg-pink-400 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="pt-6">
              <button 
                onClick={() => onLearnMore?.('specialized-care')}
                className="w-full inline-flex items-center justify-center gap-1.5 px-4 py-2.5 bg-slate-100 dark:bg-slate-950 hover:bg-pink-100 dark:hover:bg-pink-950/40 text-xs font-extrabold text-slate-950 dark:text-slate-100 hover:text-pink-600 dark:hover:text-pink-400 rounded-xl border border-slate-300 dark:border-slate-800 transition-all cursor-pointer"
              >
                <span>Learn More</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>
          </div>

          {/* Card 2: Who We Serve */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-md hover:shadow-lg transition-all flex flex-col justify-between group">
            <div className="space-y-4 text-left">
              {/* Icon & Title */}
              <div className="w-12 h-12 rounded-2xl bg-purple-100/50 dark:bg-purple-950/20 flex items-center justify-center">
                <Users className="w-6 h-6 text-brand-purple" />
              </div>
              <h3 className="text-xl font-serif font-black text-slate-955 dark:text-white group-hover:text-brand-purple transition-colors">
                Who We Serve
              </h3>
              
              <ul className="space-y-3 pt-2">
                {[
                  "Seniors",
                  "Diabetics",
                  "Disabled Clients",
                  "Busy Professionals & Families",
                  "Special Needs Clients"
                ].map((item, idx) => (
                  <li key={idx} className="flex items-center gap-2.5 text-xs text-slate-700 dark:text-slate-200">
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-400 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="pt-6">
              <button 
                onClick={() => onLearnMore?.('who-we-serve')}
                className="w-full inline-flex items-center justify-center gap-1.5 px-4 py-2.5 bg-slate-50 dark:bg-slate-955 hover:bg-purple-50 dark:hover:bg-purple-950/30 text-xs font-bold text-slate-800 dark:text-slate-250 hover:text-brand-purple rounded-xl border border-slate-200/60 dark:border-slate-800/80 transition-all cursor-pointer"
              >
                <span>Learn More</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>
          </div>

          {/* Card 3: Services & Treatments */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border-2 border-cyan-500/20 dark:border-cyan-500/10 shadow-lg hover:shadow-xl hover:shadow-cyan-500/5 hover:-translate-y-1 transition-all duration-350 flex flex-col justify-between group lg:col-span-1 border-t-8 border-t-cyan-500" id="services-treatments-card-box">
            <div className="space-y-4 text-left">
              {/* Icon & Title */}
              <div className="w-12 h-12 rounded-2xl bg-cyan-100/50 dark:bg-cyan-950/20 flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-brand-cyan animate-pulse" />
              </div>
              <h3 className="text-xl font-serif font-black text-slate-950 dark:text-white group-hover:text-brand-cyan transition-colors">
                Services & Treatments
              </h3>
              
              <p className="text-[11px] font-bold text-brand-purple dark:text-purple-300 leading-tight">
                Wellness Nail Care & adaptive hairstyles by top certified crews
              </p>

              <ul className="space-y-2 pt-2 bg-slate-50 dark:bg-slate-950 p-3 rounded-2xl border border-slate-200/60 dark:border-slate-800 shadow-3xs" id="services-treatments-list-ul">
                {[
                  "Hair Care & Styling",
                  "Skincare & Facials",
                  "Wellness & Relaxation",
                  "Makeup • Massage Therapy",
                  "Hair Growth Systems",
                  "Sew-ins (Protective Wefts)",
                  "TCP (Therapeutic Cranial Prosthesis)"
                ].map((item, idx) => (
                  <li key={idx} className="flex items-center gap-2.5 text-xs text-slate-700 dark:text-slate-200">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shrink-0" />
                    <span className={idx === 1 ? "font-black text-teal-600 dark:text-teal-400 font-sans tracking-wide scale-[1.03] origin-left transition-all underline decoration-cyan-500 decoration-wavy underline-offset-2" : ""}>
                      {item}
                    </span>
                  </li>
                ))}
              </ul>

              {/* Special TCP block */}
              <div className="p-3 bg-fuchsia-500/5 dark:bg-fuchsia-950/20 border border-fuchsia-200/50 dark:border-fuchsia-800/30 rounded-xl space-y-1">
                <span className="text-[9px] font-bold font-mono text-fuchsia-600 dark:text-fuchsia-300 uppercase tracking-widest block">TCP Services for Qualifying Candidates</span>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-relaxed">
                  • TCP = Therapeutic Cranial Prosthesis <br/>
                  • Special: <strong className="text-slate-850 dark:text-slate-200">50% off</strong> your regrowth system for qualifying TCP candidates
                </p>
              </div>
            </div>
            
            <div className="pt-6">
              <button 
                onClick={() => onLearnMore?.('services-catalog')}
                className="w-full inline-flex items-center justify-center gap-1.5 px-4 py-2.5 bg-slate-100 dark:bg-slate-950 hover:bg-[#d6f6fa] dark:hover:bg-cyan-950/40 text-xs font-extrabold text-slate-950 dark:text-slate-100 hover:text-brand-cyan rounded-xl border border-slate-300 dark:border-slate-800 transition-all cursor-pointer"
              >
                <span>View All Services</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>
          </div>

          {/* Card 4: Events & Special Occasions */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-md hover:shadow-lg transition-all flex flex-col justify-between group relative overflow-hidden">
            {/* Ambient decorative balloon/calendar elements */}
            <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-brand-pink/10 rounded-full blur-xl pointer-events-none" />
            
            <div className="space-y-4 text-left relative z-10">
              {/* Icon & Title */}
              <div className="w-12 h-12 rounded-2xl bg-amber-100/50 dark:bg-amber-950/20 flex items-center justify-center">
                <Calendar className="w-6 h-6 text-amber-500" />
              </div>
              <h3 className="text-xl font-serif font-black text-gray-950 dark:text-white group-hover:text-amber-500 transition-colors">
                Events & Special Occasions
              </h3>
              
              <p className="text-xs text-slate-800 dark:text-slate-100 leading-relaxed pt-2 font-semibold">
                From group events at care homes to private celebrations, warm anniversaries, or birthdays, we bring beauty, joy, laughter, and premium self-care to every special moment.
              </p>

              {/* Decorative mini element */}
              <div className="pt-3 flex justify-center">
                <div className="bg-white/80 dark:bg-[#0c111c] border border-slate-200/60 dark:border-slate-800/80 rounded-2xl p-4 shadow-sm flex items-center gap-3 w-full">
                  <div className="w-10 h-10 rounded-lg bg-pink-100 dark:bg-pink-950/30 flex items-center justify-center font-bold text-pink-600 text-lg">
                    🎈
                  </div>
                  <div>
                    <span className="text-[10px] font-mono tracking-wider font-bold text-slate-400 uppercase">Interactive Scheduler</span>
                    <span className="text-xs font-bold text-slate-800 dark:text-white block mt-0.5">Group Events Packages</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="pt-6 relative z-10">
              <button 
                onClick={onPlanEvent}
                className="w-full inline-flex items-center justify-center gap-1.5 px-4 py-3 bg-gradient-to-r from-brand-pink to-brand-purple text-white text-xs font-bold rounded-xl shadow-md shadow-pink-500/10 hover:opacity-95 active:scale-98 transition-all cursor-pointer"
              >
                <span>Plan Your Event</span>
                <Calendar className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
