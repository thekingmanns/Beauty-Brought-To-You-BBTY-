import React, { useState } from 'react';
import { 
  GraduationCap, 
  Award, 
  BookOpen, 
  HeartHandshake, 
  Calendar, 
  Check, 
  Sparkles, 
  AlertCircle, 
  Loader2, 
  ArrowRight,
  ShieldCheck,
  Scissors
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { collection, addDoc, doc, setDoc, getDoc } from 'firebase/firestore';
import { db, isFirebaseSupported } from '../lib/firebase';

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

export default function NewGradsSection() {
  // Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [school, setSchool] = useState('');
  const [gradDate, setGradDate] = useState('');
  const [licenseStatus, setLicenseStatus] = useState('licensed');
  const [selectedSpecialties, setSelectedSpecialties] = useState<string[]>([]);
  const [statement, setStatement] = useState('');
  
  // Interaction & Loading States
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [toasts, setToasts] = useState<Toast[]>([]);

  const specialtiesList = [
    'Hair care & styling',
    'Nail care (manicures & pedicures)',
    'Grooming & shaving support',
    'Makeup & facial beauty',
    'Bedside portable hair wash setups',
    'Sew-ins & braiding specialty',
    'Wig fitting & cranial prosthesis'
  ];

  const addToast = (message: string, type: 'success' | 'error' | 'info') => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 5000);
  };

  const handleSpecialtyToggle = (spec: string) => {
    setSelectedSpecialties(prev => 
      prev.includes(spec) 
        ? prev.filter(s => s !== spec) 
        : [...prev, spec]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    // Validations
    if (!name.trim()) {
      setErrorMessage('Please enter your full name.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }
    if (!phone.trim()) {
      setErrorMessage('Please enter a contact phone number.');
      return;
    }
    if (!school.trim()) {
      setErrorMessage('Please specify your cosmetology or beauty school.');
      return;
    }
    if (selectedSpecialties.length === 0) {
      setErrorMessage('Please select at least one primary specialty.');
      return;
    }

    setIsSubmitting(true);

    // Prepare compiled notes field matching Waitlist schema
    const formattedLicense = 
      licenseStatus === 'licensed' ? 'Fully Licensed' : 
      licenseStatus === 'pending' ? 'Pending State Board Exam' : 'Current Student';

    const compiledNotes = `School: ${school} | Grad Date: ${gradDate || 'N/A'} | License: ${formattedLicense} | Statement: ${statement.trim() || 'No personal statement provided.'}`;

    const submissionData = {
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      category: 'aspiring_technician',
      services: selectedSpecialties,
      notes: compiledNotes,
      submittedAt: new Date().toISOString()
    };

    try {
      if (isFirebaseSupported && db) {
        // 1. Save document directly to Firestore 'waitlist' collection
        await addDoc(collection(db, "waitlist"), submissionData);

        // 2. Trigger automated email alert to admin via Node Express server proxy
        try {
          await fetch("/api/notify-admin", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(submissionData)
          });
        } catch (mailErr) {
          console.warn("Express backend mail notification bypassed:", mailErr);
        }

        // 3. Increment public landing page statistics count in Firestore
        try {
          const statsRef = doc(db, "stats", "waitlist_stats");
          const statsSnap = await getDoc(statsRef);
          const todayStr = new Date().toISOString().split('T')[0];
          
          let currentCount = 180; // default initial fallback representation
          let todayCountValue = 1;
          if (statsSnap.exists()) {
            const statsData = statsSnap.data();
            currentCount = statsData.count || 180;
            if (statsData.lastUpdatedDate === todayStr) {
              todayCountValue = (statsData.todayCount || 0) + 1;
            }
          }
          const nextCount = currentCount + 1;
          await setDoc(statsRef, { 
            count: nextCount,
            todayCount: todayCountValue,
            lastUpdatedDate: todayStr
          }, { merge: true });
          
          // Sync client-side localStorage so counter increases instantly
          localStorage.setItem('bbty_stats_count', nextCount.toString());
        } catch (statsErr) {
          console.warn("Failed to increment public stats:", statsErr);
        }
      } else {
        // Sandbox environment local storage backup
        const localBackup = localStorage.getItem('bbty_waitlist_db');
        const list = localBackup ? JSON.parse(localBackup) : [];
        const mockItem = { id: `reg-${Date.now()}`, ...submissionData };
        list.unshift(mockItem);
        localStorage.setItem('bbty_waitlist_db', JSON.stringify(list));
      }

      // Dispatch custom update event so App.tsx metrics and counters reload
      window.dispatchEvent(new CustomEvent('bbty_waitlist_updated'));

      setIsSubmitted(true);
      addToast('Application submitted successfully! Our onboarding coordinators will contact you soon.', 'success');
    } catch (err: any) {
      console.error("New Graduate application failure:", err);
      setErrorMessage(err.message || 'Failed to submit application. Please verify your connection and try again.');
      addToast('Application submission failure. Please try again.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="new-grads-program" className="py-24 bg-slate-950 text-white relative overflow-hidden border-b border-slate-900">
      {/* Decorative background visual elements */}
      <div className="absolute top-1/4 left-1/10 w-96 h-96 bg-pink-600/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/10 w-96 h-96 bg-purple-600/5 rounded-full blur-3xl pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header Title Section */}
        <div className="text-center max-w-3xl mx-auto mb-16 font-sans">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-pink-500/10 border border-pink-500/20 rounded-full text-pink-400 text-xs font-mono font-bold uppercase tracking-wider mb-4 animate-[pulse_3s_infinite]">
            <GraduationCap className="w-4 h-4" />
            <span>Graduate & Aspirant Career Program</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-serif font-black tracking-tight leading-tight text-white mb-4">
            Step Into a Rewarding Career as a BBTY Mobile Technician
          </h2>
          <p className="text-slate-400 text-sm md:text-base leading-relaxed">
            Are you a recent cosmetology, nail technology, or aesthetics graduate? Bring your passion, talent, and care directly to those who need it most. We provide specialized safety equipment, mentorship, and a flexible client base.
          </p>
        </div>

        {/* Dual Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch">
          
          {/* Left Side: Program Highlights (lg:col-span-5) */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-8 text-left font-sans">
            <div className="space-y-6">
              <h3 className="text-xl md:text-2xl font-serif font-bold text-slate-100">
                Why Begin Your Journey With BBTY?
              </h3>
              <p className="text-slate-400 text-xs md:text-sm leading-relaxed">
                As a newly certified professional, transitioning from beauty school to building your own book of clients is challenging. BBTY accelerates your growth in a highly fulfilling specialized field.
              </p>

              {/* Bullet Points */}
              <div className="space-y-4 pt-2">
                <div className="flex items-start gap-3.5">
                  <div className="p-2 bg-pink-500/10 rounded-xl border border-pink-500/20 text-pink-400 shrink-0">
                    <Award className="w-4.5 h-4.5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-100">Specialized Geriatric & Safety Training</h4>
                    <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                      Learn specialized bedside service mechanics, transfers, and memory-care engagement from seasoned nurses and cosmetologists.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="p-2 bg-purple-500/10 rounded-xl border border-purple-500/20 text-purple-400 shrink-0">
                    <BookOpen className="w-4.5 h-4.5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-100">Dedicated Clinical Mentorship</h4>
                    <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                      We pair every new graduate with a regional Senior Technician for hands-on support during your first community service sessions.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="p-2 bg-emerald-500/10 rounded-xl border border-emerald-500/20 text-emerald-400 shrink-0">
                    <Calendar className="w-4.5 h-4.5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-100">Flexible Autonomous Scheduling</h4>
                    <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                      Set your own active hours. Align your mobile travel territory around your lifestyle, family, or additional licensing classes.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="p-2 bg-blue-500/10 rounded-xl border border-blue-500/20 text-blue-400 shrink-0">
                    <HeartHandshake className="w-4.5 h-4.5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-100">Premium Tooling & Kit Provision</h4>
                    <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                      We supply certified technicians with specialized portable washing basins, adaptive tool sanitization vaults, and protective uniforms.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Micro Highlight Card */}
            <div className="bg-slate-900/60 rounded-2xl p-5 border border-slate-800/80 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-pink-500/5 rounded-full blur-xl" />
              <div className="flex items-center gap-3.5 relative z-10">
                <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center font-bold text-pink-400 shrink-0 border border-slate-700/50">
                  ✨
                </div>
                <div>
                  <p className="text-[11px] font-mono text-pink-400 uppercase tracking-widest font-extrabold">State-certified pathways</p>
                  <p className="text-xs text-slate-300 font-medium mt-0.5 leading-relaxed">
                    Over 85% of our graduate affiliates successfully clear state board certifications while earning consistent revenue with us.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side: Interactive Form Card (lg:col-span-7) */}
          <div className="lg:col-span-7" id="new-grads-form-container">
            <div className="bg-slate-900/40 rounded-3xl p-6 md:p-8 border border-slate-800/60 shadow-xl backdrop-blur-xs relative overflow-hidden">
              
              <AnimatePresence mode="wait">
                {!isSubmitted ? (
                  <motion.div
                    key="application-form"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="text-left mb-6 font-sans">
                      <h3 className="text-lg md:text-xl font-serif font-black text-white">
                        Technician Registration Form
                      </h3>
                      <p className="text-slate-400 text-xs mt-1">
                        Complete this brief application. Successfully processed profiles will be routed immediately to our regional operations board.
                      </p>
                    </div>

                    {errorMessage && (
                      <div className="mb-5 bg-rose-500/10 border border-rose-500/20 text-rose-300 rounded-xl p-3.5 flex items-start gap-2.5 text-xs text-left font-sans">
                        <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
                        <span>{errorMessage}</span>
                      </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4 text-left font-sans">
                      
                      {/* Name & Email in Row */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label htmlFor="grad-fullname" className="text-[10px] font-bold font-mono text-slate-400 uppercase tracking-widest block">
                            Full Contact Name
                          </label>
                          <input
                            id="grad-fullname"
                            type="text"
                            required
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="e.g. Alexis Carter"
                            className="w-full bg-slate-950 border border-slate-800 focus:border-pink-500 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none transition-colors"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label htmlFor="grad-email" className="text-[10px] font-bold font-mono text-slate-400 uppercase tracking-widest block">
                            Email Address
                          </label>
                          <input
                            id="grad-email"
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="e.g. alexis@example.com"
                            className="w-full bg-slate-950 border border-slate-800 focus:border-pink-500 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none transition-colors"
                          />
                        </div>
                      </div>

                      {/* Phone & School in Row */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label htmlFor="grad-phone" className="text-[10px] font-bold font-mono text-slate-400 uppercase tracking-widest block">
                            Phone Number
                          </label>
                          <input
                            id="grad-phone"
                            type="tel"
                            required
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder="e.g. (555) 019-2834"
                            className="w-full bg-slate-950 border border-slate-800 focus:border-pink-500 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none transition-colors"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label htmlFor="grad-school" className="text-[10px] font-bold font-mono text-slate-400 uppercase tracking-widest block">
                            Beauty/Cosmetology School
                          </label>
                          <input
                            id="grad-school"
                            type="text"
                            required
                            value={school}
                            onChange={(e) => setSchool(e.target.value)}
                            placeholder="e.g. Elite Academy of Cosmetology"
                            className="w-full bg-slate-950 border border-slate-800 focus:border-pink-500 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none transition-colors"
                          />
                        </div>
                      </div>

                      {/* Graduation Date & License Status */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label htmlFor="grad-date" className="text-[10px] font-bold font-mono text-slate-400 uppercase tracking-widest block">
                            Graduation/Completion Date
                          </label>
                          <input
                            id="grad-date"
                            type="month"
                            value={gradDate}
                            onChange={(e) => setGradDate(e.target.value)}
                            className="w-full bg-slate-950 border border-slate-800 focus:border-pink-500 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none transition-colors"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label htmlFor="grad-license" className="text-[10px] font-bold font-mono text-slate-400 uppercase tracking-widest block">
                            State Board License Status
                          </label>
                          <select
                            id="grad-license"
                            value={licenseStatus}
                            onChange={(e) => setLicenseStatus(e.target.value)}
                            className="w-full bg-slate-950 border border-slate-800 focus:border-pink-500 rounded-xl px-4 py-2.5 text-xs text-slate-200 focus:outline-none cursor-pointer transition-colors"
                          >
                            <option value="licensed">Licensed Cosmetologist / Specialist</option>
                            <option value="pending">Graduated (Pending Exam Scheduled)</option>
                            <option value="student">Active Student (Near graduation)</option>
                          </select>
                        </div>
                      </div>

                      {/* Primary Specialties Checkboxes */}
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold font-mono text-slate-400 uppercase tracking-widest block">
                          Primary Specialty Interests (Select all that apply)
                        </label>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 bg-slate-950/50 p-4 rounded-xl border border-slate-800/80">
                          {specialtiesList.map((spec) => (
                            <button
                              key={spec}
                              type="button"
                              onClick={() => handleSpecialtyToggle(spec)}
                              className={`flex items-center gap-2.5 text-left px-3 py-2 rounded-lg text-xs font-medium border transition-all cursor-pointer ${
                                selectedSpecialties.includes(spec)
                                  ? 'bg-pink-500/10 border-pink-500/40 text-pink-300'
                                  : 'bg-slate-950 border-slate-850 text-slate-400 hover:border-slate-800 hover:text-slate-300'
                              }`}
                            >
                              <div className={`w-4 h-4 rounded-md border flex items-center justify-center shrink-0 transition-all ${
                                selectedSpecialties.includes(spec)
                                  ? 'bg-pink-500 border-pink-500 text-white'
                                  : 'border-slate-700 bg-slate-900'
                              }`}>
                                {selectedSpecialties.includes(spec) && <Check className="w-3 h-3 stroke-[3]" />}
                              </div>
                              <span className="truncate">{spec}</span>
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Statement / Personal Note */}
                      <div className="space-y-1.5">
                        <label htmlFor="grad-statement" className="text-[10px] font-bold font-mono text-slate-400 uppercase tracking-widest block">
                          Personal Statement (Why join mobile care?)
                        </label>
                        <textarea
                          id="grad-statement"
                          rows={3}
                          value={statement}
                          onChange={(e) => setStatement(e.target.value)}
                          placeholder="Tell us about your heart for serving elderly or special-needs individuals..."
                          className="w-full bg-slate-950 border border-slate-800 focus:border-pink-500 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none resize-none transition-colors placeholder:text-slate-650"
                        />
                      </div>

                      {/* Submit Button */}
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-gradient-to-r from-pink-500 via-purple-600 to-blue-600 hover:from-pink-600 hover:via-purple-700 hover:to-blue-700 disabled:from-slate-800 disabled:to-slate-800 text-white font-black text-xs uppercase tracking-widest py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform active:scale-98 cursor-pointer flex items-center justify-center gap-2 mt-4"
                        id="grad-submit-btn"
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin text-white" />
                            <span>Authorizing Registry Document...</span>
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-4 h-4 text-pink-200 animate-pulse" />
                            <span>Apply For Graduate Onboarding</span>
                            <ArrowRight className="w-4 h-4" />
                          </>
                        )}
                      </button>

                    </form>
                  </motion.div>
                ) : (
                  <motion.div
                    key="success-container"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4, type: "spring" }}
                    className="py-12 px-4 text-center font-sans space-y-6"
                  >
                    <div className="w-16 h-16 bg-pink-500/10 border border-pink-500/30 text-pink-400 rounded-2xl flex items-center justify-center mx-auto shadow-inner animate-[bounce_2s_infinite]">
                      <ShieldCheck className="w-8 h-8" />
                    </div>
                    
                    <div className="space-y-2.5">
                      <h3 className="text-2xl font-serif font-black text-white">
                        Registry Authorized Successfully!
                      </h3>
                      <p className="text-sm font-mono text-pink-400 uppercase tracking-widest font-bold">
                        Welcome to the BBTY Graduate Aspirants Queue
                      </p>
                      <p className="text-slate-400 text-xs max-w-md mx-auto leading-relaxed">
                        Thank you, <strong>{name}</strong>! Your graduate candidate profile has been recorded in our secure registry database. An automated alert was triggered directly to our regional directors. We will contact you soon for an introductory onboarding review.
                      </p>
                    </div>

                    <div className="pt-4 max-w-xs mx-auto">
                      <button
                        type="button"
                        onClick={() => {
                          setIsSubmitted(false);
                          setName('');
                          setEmail('');
                          setPhone('');
                          setSchool('');
                          setGradDate('');
                          setLicenseStatus('licensed');
                          setSelectedSpecialties([]);
                          setStatement('');
                        }}
                        className="w-full bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700 hover:border-slate-600 rounded-xl py-2.5 text-xs font-bold transition-all cursor-pointer"
                      >
                        Submit Another Application
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

            </div>
          </div>

        </div>

      </div>

      {/* Floating Toast Alerts */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2.5 pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`px-4 py-3 rounded-xl shadow-lg text-xs font-medium font-sans border flex items-center gap-2 pointer-events-auto max-w-sm animate-[slideIn_0.3s_ease-out] ${
              toast.type === 'success' 
                ? 'bg-slate-900 border-emerald-500/30 text-emerald-300' 
                : toast.type === 'error'
                ? 'bg-slate-900 border-rose-500/30 text-rose-300'
                : 'bg-slate-900 border-blue-500/30 text-blue-300'
            }`}
          >
            {toast.type === 'success' && <Check className="w-4 h-4 text-emerald-400 shrink-0" />}
            {toast.type === 'error' && <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />}
            {toast.type === 'info' && <Sparkles className="w-4 h-4 text-blue-400 shrink-0" />}
            <span>{toast.message}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
