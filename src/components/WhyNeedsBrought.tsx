import React from 'react';
import { Home, ShieldCheck, Heart, Users, Compass, EyeOff, Sparkles, Smile } from 'lucide-react';

export default function WhyNeedsBrought() {
  const challenges = [
    {
      title: "Traditional Space Limitations",
      desc: "Many commercial salons claim accessibility compliance, but are rarely designed with the space needed to comfortably position a heavy power-wheelchair, secure walkers, or accommodate limited movement comfortably around standard formatting basins.",
      icon: EyeOff,
      badge: "The salon barrier"
    },
    {
      title: "Sensory & Cognitive Fatigue",
      desc: "Commercial salons are often highly stimulating, filled with loud hair-dryers, overlapping sound levels, strong synthetic smells, and rushing footsteps, which can trigger stress for neurodivergent individuals, people with autism, or dementia senior populations.",
      icon: Compass,
      badge: "The environment barrier"
    },
    {
      title: "Lack of Specialized Training",
      desc: "A typical stylist is qualified to style, but may not be trained in working gently or safely with seniors, clients with tremors, geriatric foot sensitivity, or people who face severe mental or mobility exhaustion.",
      icon: ShieldCheck,
      badge: "The safety barrier"
    },
    {
      title: "Social Disconnection & Isolation",
      desc: "When self-grooming is neglected due to difficult travel steps, it can erode individual confidence. Everyone deserves to feel clean, respected, and heard. Neglected grooming can lead to feeling unseen or separate from the community.",
      icon: Users,
      badge: "The dignity barrier"
    }
  ];

  const solutions = [
    {
      title: "Comfort Zone Servicing",
      desc: "We align hair, nail, or grooming support with the client's home, assisted facility room, or preferred surroundings. Our safety protocols keep tasks zero-stress.",
      icon: Home,
    },
    {
      title: "Wellness-Aware Specialists",
      desc: "Our independent pros and technicians learn mobility-friendly, sensory-aware techniques specifically tailored to honor senior limits, disabilities, and individual pacing.",
      icon: Heart,
    },
    {
      title: "Convenient Beauty Support",
      desc: "Weekly physical therapy, medical schedules, or simple timing can conflict with long salons. BBTY books around the client, fitting services to their exact needs.",
      icon: Sparkles,
    },
    {
      title: "Dignity & Respect First",
      desc: "Every touch is centered on human connection. We listen, share stories, and bring respectful care that does not make claims of medical cure but supports high quality of life.",
      icon: Smile,
    }
  ];

  return (
    <div className="py-20 bg-transparent border-y border-white/10 dark:border-white/5 transition-colors duration-200" id="why-brought-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-semibold text-rose-600 dark:text-pink-300 uppercase tracking-widest font-mono bg-rose-50 dark:bg-pink-950/40 px-3 py-1 rounded-full">
            Restoring Dignity through Care
          </span>
          <h2 className="text-3xl md:text-5xl font-serif text-slate-900 dark:text-white font-medium tracking-tight mt-3">
            Why Beauty Needs to Be Brought to the Community
          </h2>
          <p className="text-slate-600 dark:text-slate-350 text-base md:text-lg mt-4 leading-relaxed">
            Going into a high-end salon can be satisfying, but for many, it is physically, sensory, or emotionally impossible. BBTY redefines beauty care as accessible, supportive, and completely centered in the client's space of emotional and physical comfort.
          </p>
        </div>
 
        {/* Visual Comparison Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-stretch">
          
          {/* Side A: Salons Can Be Difficult */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between transition-colors duration-200">
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider font-mono border-b border-slate-100 dark:border-slate-800 pb-2 mb-6">
                <span className="w-2 h-2 bg-slate-300 dark:bg-slate-600 rounded-full"></span>
                The Standard Salon Experience
              </div>
              
              <h3 className="text-xl md:text-2xl font-serif font-medium text-slate-950 dark:text-white mb-6 text-left">
                Where Traditional Salons Fall Short
              </h3>
 
              <div className="space-y-6">
                {challenges.map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <div key={idx} className="flex gap-4 items-start text-left">
                      <div className="p-2.5 bg-slate-100 dark:bg-slate-950 text-slate-600 dark:text-slate-300 rounded-xl mt-1 flex-shrink-0">
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="text-[10px] font-bold font-mono text-slate-500 dark:text-slate-400 uppercase tracking-widest">{item.badge}</span>
                        <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mt-0.5">{item.title}</h4>
                        <p className="text-xs md:text-sm text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">{item.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
 
            <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/40 -mx-8 -mb-8 p-6 rounded-b-3xl">
              <p className="text-xs text-slate-600 dark:text-slate-305 italic text-center leading-relaxed">
                "Many salons may have entry ramps, but actual hairwashing basins, crowded seating, and tight corridors make true comfort and safe wheelchair mobility extremely difficult."
              </p>
            </div>
          </div>
 
          {/* Side B: The BBTY Solution */}
          <div className="bg-[#fff9fb] dark:bg-slate-900 rounded-3xl p-8 border border-rose-200/60 dark:border-purple-900/50 shadow-md flex flex-col justify-between relative overflow-hidden transition-colors duration-200">
            <div className="absolute -top-12 -right-12 w-48 h-48 bg-pink-100/20 dark:bg-pink-905/5 rounded-full blur-3xl"></div>
            
            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 text-xs font-semibold text-rose-600 dark:text-pink-300 uppercase tracking-wider font-mono border-b border-rose-100 dark:border-purple-900/30 pb-2 mb-6">
                <span className="w-2 h-2 bg-rose-400 rounded-full animate-pulse"></span>
                The BBTY Solution
              </div>
              
              <h3 className="text-xl md:text-2xl font-serif font-medium text-rose-950 dark:text-purple-100 mb-6 text-left">
                Beauty Brought to Your Comfort Zone
              </h3>
 
              <div className="space-y-6">
                {solutions.map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <div key={idx} className="flex gap-4 items-start text-left">
                      <div className="p-2.5 bg-rose-100 dark:bg-purple-950/60 text-rose-700 dark:text-pink-300 rounded-xl mt-1 flex-shrink-0 shadow-sm border border-rose-200/50 dark:border-purple-800/20">
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-rose-950 dark:text-white mt-0.5">{item.title}</h4>
                        <p className="text-xs md:text-sm text-slate-800 dark:text-slate-200 mt-1 leading-relaxed">{item.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
 
            <div className="mt-8 pt-6 border-t border-rose-100 dark:border-purple-900/30 bg-rose-100/20 dark:bg-purple-950/30 -mx-8 -mb-8 p-6 rounded-b-3xl relative z-10">
              <p className="text-xs text-rose-900/90 dark:text-pink-250 font-bold text-center leading-relaxed">
                ✅ Pure Beauty and Wellness Support—Specifically safety-aware, zero-pressure, and mobility-friendly.
              </p>
            </div>
          </div>
 
        </div>

      </div>
    </div>
  );
}
