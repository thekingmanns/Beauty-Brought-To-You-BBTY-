import React, { useState } from 'react';
import { Star, CheckCircle, ChevronLeft, ChevronRight, Briefcase, Award, Smile } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface Props {
  onJoinTeam?: () => void;
}

const TESTIMONIALS = [
  {
    quote: "BBTY has been a absolute blessing for my mom. The care, gentle kindness, and deep safety professionalism they bring directly into our residential home is unmatched.",
    author: "Angela R.",
    role: "Daughter of a Senior Client",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&h=200&q=80"
  },
  {
    quote: "Finding stylized hair wash setups that adapt cleanly to power-wheelchairs used to be stressful. BBTY solves it gracefully with beautiful bedside portable setups.",
    author: "Marcus K.",
    role: "Caring Husband & Caregiver",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&h=200&q=80"
  },
  {
    quote: "As an assisted senior living director, having trusted BBTY cosmetologists drop by for 'Community Care Days' is a highlight. Residents look forward to it all month!",
    author: "Sarah J.",
    role: "Director, Sunshine Senior Residency",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&h=200&q=80"
  }
];

export default function CareersAndTestimonials({ onJoinTeam }: Props) {
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  const handleNext = () => {
    setActiveTestimonial((prev) => (prev + 1) % TESTIMONIALS.length);
  };

  const handlePrev = () => {
    setActiveTestimonial((prev) => (prev - 1 + TESTIMONIALS.length) % TESTIMONIALS.length);
  };

  return (
    <section id="careers-testimonials" className="py-20 bg-white dark:bg-[#070b12] border-b border-slate-100 dark:border-slate-900 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Split Column Design */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-stretch">
          
          {/* Column A: WHAT OUR CLIENTS SAY */}
          <div className="bg-slate-50/50 dark:bg-[#0e1423] rounded-3xl p-8 border border-slate-200/50 dark:border-slate-800/80 shadow-sm flex flex-col justify-between relative overflow-hidden text-left">
            
            {/* Ambient visual overlay */}
            <div className="absolute top-0 right-0 w-36 h-36 bg-pink-500/5 dark:bg-pink-500/2 rounded-full blur-2xl" />
            
            <div className="space-y-6 relative z-10 font-sans">
              <span className="text-xs font-mono uppercase tracking-[0.2em] font-extrabold text-[#52644e] dark:text-emerald-300">
                ⭐ Community Praise
              </span>
              
              <h2 className="text-2xl md:text-3.5xl font-serif font-black text-slate-900 dark:text-white leading-tight">
                What Our Clients Say
              </h2>
              
              {/* Double Quotes Symbol */}
              <div className="text-pink-500/20 text-7xl font-serif font-bold leading-none -mt-4 select-none">
                “
              </div>

              {/* Slider Content */}
              <div className="min-h-[140px] flex flex-col justify-center">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeTestimonial}
                    initial={{ opacity: 0, x: 15 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -15 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-4"
                  >
                    <p className="text-slate-800 dark:text-slate-100 text-sm md:text-base leading-relaxed italic font-semibold">
                      "{TESTIMONIALS[activeTestimonial].quote}"
                    </p>
                    
                    {/* Star ratings */}
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star key={s} className="w-4 h-4 text-amber-500 fill-current" />
                      ))}
                    </div>

                    {/* Author Metadata */}
                    <div className="flex items-center gap-3.5 pt-2">
                      <img 
                        src={TESTIMONIALS[activeTestimonial].avatar} 
                        alt={TESTIMONIALS[activeTestimonial].author}
                        className="w-11 h-11 rounded-full object-cover border border-slate-200 dark:border-slate-800"
                        referrerPolicy="no-referrer"
                      />
                      <div>
                        <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">
                          {TESTIMONIALS[activeTestimonial].author}
                        </h4>
                        <p className="text-[11px] font-mono uppercase tracking-wider text-slate-700 dark:text-slate-300 font-extrabold">
                          {TESTIMONIALS[activeTestimonial].role}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>

            </div>

            {/* Slider Switch Controls */}
            <div className="flex items-center justify-between pt-8 border-t border-slate-200/50 dark:border-slate-800/60 mt-6 relative z-10">
              <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
                Feedback {activeTestimonial + 1} of {TESTIMONIALS.length}
              </span>
              
              <div className="flex gap-2">
                <button 
                  onClick={handlePrev}
                  className="p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-850 rounded-xl transition-all text-slate-600 dark:text-slate-300 cursor-pointer"
                  title="Previous testimonial"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button 
                  onClick={handleNext}
                  className="p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-850 rounded-xl transition-all text-slate-600 dark:text-slate-300 cursor-pointer"
                  title="Next testimonial"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

          </div>

          {/* Column B: CAREERS FOR NEW PROFESSIONALS */}
          <div className="bg-slate-50/50 dark:bg-[#0e1423] rounded-3xl p-8 border border-slate-200/50 dark:border-slate-800/80 shadow-sm flex flex-col justify-between relative overflow-hidden text-left">
            
            {/* Left and Bottom abstract styling */}
            <div className="absolute bottom-0 right-0 w-48 h-48 bg-purple-500/5 dark:bg-purple-500/2 rounded-full blur-2xl font-sans" />
            
            <div className="space-y-6 relative z-10">
              <span className="text-xs font-mono uppercase tracking-[0.2em] font-extrabold text-purple-600 dark:text-purple-400">
                💼 Join Our Mission
              </span>
              
              <h2 className="text-2xl md:text-3.5xl font-serif font-black text-slate-900 dark:text-white leading-tight">
                Careers for New Professionals
              </h2>

              <p className="text-slate-800 dark:text-slate-100 text-sm leading-relaxed font-semibold">
                Join a highly supportive mobile team making a profound difference every single day. We provide comprehensive safety training, gentle mentorship, scheduling coordination, and opportunities to build a thriving career in geriatric-friendly beauty & wellness care.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                {[
                  "Hands-on Training",
                  "Flexible Schedules",
                  "Supportive Community",
                  "Grow With Us"
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-xs text-slate-905 dark:text-slate-100">
                    <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                    <span className="font-semibold">{item}</span>
                  </div>
                ))}
              </div>

              {/* Support team group photo as requested by user mockup details */}
              <div className="pt-3">
                <div className="relative rounded-2xl overflow-hidden shadow-md border border-slate-200/60 dark:border-slate-800 aspect-[16/6] w-full">
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent z-10" />
                  <img 
                    src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=800&h=500&q=80"
                    alt="Supports BBTY Team professionals smiling wearing matching black shirts"
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute bottom-2.5 left-4 right-4 z-20 text-left">
                    <span className="text-[10px] font-mono font-bold text-pink-300 tracking-wider">CAREER PREVIEW</span>
                    <p className="text-[11px] text-white font-medium mt-0.5">Professional, compassionate cosmetologists in our active regional hub</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-6 relative z-10">
              <button
                onClick={onJoinTeam}
                className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl text-xs shadow-md transition-all cursor-pointer"
                id="careers-open-positions-btn"
              >
                <Briefcase className="w-4 h-4" />
                <span>View Open Positions</span>
              </button>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
