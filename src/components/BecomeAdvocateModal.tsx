import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Heart, 
  Send, 
  Sparkles, 
  MapPin, 
  Megaphone, 
  UserCheck, 
  FileText,
  Users,
  CheckCircle,
  Award
} from 'lucide-react';

interface BecomeAdvocateModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface AdvocateSubmission {
  id: string;
  name: string;
  email: string;
  location: string;
  primaryMethod: string;
  notes: string;
  date: string;
}

export default function BecomeAdvocateModal({ isOpen, onClose }: BecomeAdvocateModalProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [location, setLocation] = useState('');
  const [primaryMethod, setPrimaryMethod] = useState('offline-brochure');
  const [notes, setNotes] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  const [submissionsList, setSubmissionsList] = useState<AdvocateSubmission[]>([]);

  // Load existing advocate registrations on open
  useEffect(() => {
    if (isOpen) {
      const stored = localStorage.getItem('bbty_advocate_submissions');
      if (stored) {
        setSubmissionsList(JSON.parse(stored));
      } else {
        // Initial mock supporters to make the community feel alive and active
        const initialSubmissions: AdvocateSubmission[] = [
          { 
            id: 'adv-1', 
            name: 'Sarah Jenkins (Neighbourhood Lead)', 
            email: 'sarah.j@nexthope.org', 
            location: 'Boston, MA', 
            primaryMethod: 'offline-brochure', 
            notes: 'Happy to distribute the offline print brochures to our senior center on weekends!', 
            date: 'June 10, 2026' 
          },
          { 
            id: 'adv-2', 
            name: 'Robert Diaz', 
            email: 'robert.diaz@comcast.net', 
            location: 'Phoenix, AZ', 
            primaryMethod: 'facility-connect', 
            notes: 'My grandmother lives in a local assisted living hub. I will share the PDF with their care manager.', 
            date: 'June 14, 2026' 
          }
        ];
        setSubmissionsList(initialSubmissions);
        localStorage.setItem('bbty_advocate_submissions', JSON.stringify(initialSubmissions));
      }
    }
  }, [isOpen]);

  // Handle ESC key to exit
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !location) return;

    // Create new custom advocate sheet item
    const newSubmission: AdvocateSubmission = {
      id: `adv-${Date.now()}`,
      name: name.trim(),
      email: email.trim(),
      location: location.trim(),
      primaryMethod: primaryMethod,
      notes: notes.trim() || "Excited to support homeized beauty care!",
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })
    };

    const updated = [newSubmission, ...submissionsList];
    setSubmissionsList(updated);
    localStorage.setItem('bbty_advocate_submissions', JSON.stringify(updated));
    setIsSubmitted(true);
  };

  const handleResetForm = () => {
    setName('');
    setEmail('');
    setPhone('');
    setLocation('');
    setPrimaryMethod('offline-brochure');
    setNotes('');
    setIsSubmitted(false);
  };

  // Human-friendly label resolver
  const getMethodLabel = (methodKey: string) => {
    switch (methodKey) {
      case 'offline-brochure': return 'Print & Hand Out Brochures';
      case 'facility-connect': return 'Introduce to Care Centers';
      case 'digital-share': return 'Share on Nextdoor & Local Groups';
      case 'word-of-mouth': return 'Tell Caregivers in My Circle';
      default: return 'Community Champion';
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
          
          {/* Backdrop Blur Overlay */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm"
            id="advocate-modal-overlay"
          />

          {/* Modal Card Content */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ type: "spring", duration: 0.4 }}
            className="bg-white dark:bg-slate-900 border border-slate-205 dark:border-slate-805 rounded-3xl shadow-2xl max-w-xl w-full overflow-hidden relative z-10 text-left font-sans transition-colors duration-200"
            id="advocate-modal-container"
          >
            
            {/* Header branding strip */}
            <div className="relative p-6 pb-0 flex justify-between items-start">
              <div className="space-y-1">
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 text-[9px] font-bold font-mono tracking-wider uppercase text-pink-700 dark:text-pink-300 bg-pink-50 dark:bg-pink-950/40 border border-pink-100 dark:border-pink-900/30 rounded-md">
                  📢 Advocate Network (Non-Licensed Supporters)
                </span>
                <h3 className="text-xl font-serif font-black text-slate-900 dark:text-white flex items-center gap-2">
                  <Megaphone className="w-5 h-5 text-pink-600 dark:text-pink-400" />
                  Become a Local Advocate
                </h3>
              </div>
              <button 
                onClick={onClose} 
                className="p-1 px-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-850 text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-200 cursor-pointer transition-colors"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Main Area Scrollable */}
            <div className="p-6 max-h-[82vh] overflow-y-auto space-y-6">
              
              {/* Introduction Callout */}
              <div className="bg-gradient-to-r from-pink-50/50 to-indigo-50/35 dark:from-pink-950/20 dark:to-slate-950/10 p-4 border border-pink-100/30 dark:border-pink-900/10 rounded-2xl">
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  You <strong>do not need</strong> a professional cosmetology or medical license to change lives in your area! Our core mission is driven by volunteers, family cheerleaders, and friends who distribute our printable brochures, coordinate with care settings, and secure waitlist priorities for their neighbors.
                </p>
              </div>

              {!isSubmitted ? (
                /* Registration Multi-Field Form */
                <form onSubmit={handleSubmit} className="space-y-4">
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    
                    {/* Full Name */}
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-700 dark:text-slate-350 block">Your Name <span className="text-pink-500">*</span></label>
                      <input 
                        type="text" 
                        required
                        value={name} 
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Sarah Jenkins"
                        className="w-full p-2.5 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-pink-400 dark:focus:ring-pink-800"
                      />
                    </div>

                    {/* Email */}
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-700 dark:text-slate-350 block">Your Email <span className="text-pink-500">*</span></label>
                      <input 
                        type="email" 
                        required
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="e.g. sarah@outlook.com"
                        className="w-full p-2.5 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-pink-400 dark:focus:ring-pink-800"
                      />
                    </div>

                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    
                    {/* Location Target ZIP or City */}
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-700 dark:text-slate-350 block flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-pink-500" />
                        Target Community/City <span className="text-pink-500">*</span>
                      </label>
                      <input 
                        type="text" 
                        required
                        value={location} 
                        onChange={(e) => setLocation(e.target.value)}
                        placeholder="e.g. Brookline, Boston or zipcode"
                        className="w-full p-2.5 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-pink-400 dark:focus:ring-pink-800"
                      />
                    </div>

                    {/* Contact Phone (Optional) */}
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-700 dark:text-slate-350 block">Contact Phone <span className="text-slate-400 font-normal">(Optional)</span></label>
                      <input 
                        type="tel" 
                        value={phone} 
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="e.g. (617) 555-0199"
                        className="w-full p-2.5 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-pink-400 dark:focus:ring-pink-800"
                      />
                    </div>

                  </div>

                  {/* Primary Method selection dropdown specifically for community actions */}
                  <div className="space-y-1.5 bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-3.5 rounded-xl">
                    <label className="text-[10.5px] font-bold text-slate-805 dark:text-slate-200 block">
                      How would you like to help support in your area?
                    </label>
                    <select
                      value={primaryMethod}
                      onChange={(e) => setPrimaryMethod(e.target.value)}
                      className="w-full p-2.5 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800/80 rounded-lg text-xs text-slate-850 dark:text-slate-100 focus:ring-1 focus:ring-pink-400 dark:focus:ring-pink-800 focus:outline-none cursor-pointer"
                    >
                      <option value="offline-brochure">🏡 Print & Distribute PDF offline brochures (Seniors, Community units)</option>
                      <option value="facility-connect">🏢 Connect BBTY with senior residence care home managers or clinics</option>
                      <option value="digital-share">📲 Promote on nearby local groups (Facebook Groups, Nextdoor, newsletters)</option>
                      <option value="word-of-mouth">🗣️ Spark word-of-mouth with family caregivers in my daily circles</option>
                    </select>
                  </div>

                  {/* Optional short idea or motivation */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-700 dark:text-slate-350 block">
                      Tell us why you want to act as an advocate or suggest your idea
                    </label>
                    <textarea 
                      value={notes} 
                      onChange={(e) => setNotes(e.target.value)}
                      rows={3}
                      placeholder="e.g. I have 4 neighbors who are elderly and cannot leave their home easily. I would love to place print guides in their mailbox..."
                      className="w-full p-2.5 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-xs text-slate-850 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-pink-400"
                    />
                  </div>

                  {/* Action Button */}
                  <button
                    type="submit"
                    className="w-full py-3 px-4 bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700 text-white font-medium rounded-xl text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
                  >
                    <span>Register as Local Advocate</span>
                    <Sparkles className="w-4 h-4 text-pink-200" />
                  </button>

                </form>
              ) : (
                /* Successful Submission screen with direct instructions */
                <motion.div 
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="space-y-5"
                >
                  <div className="p-4 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/30 rounded-2xl space-y-2 text-emerald-800 dark:text-emerald-300">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400 animate-bounce" />
                      <span className="text-sm font-bold font-sans">You are registered as a BBTY Community Champion!</span>
                    </div>
                    <p className="text-xs leading-relaxed opacity-90">
                      We've successfully updated your community leadership record on-device. Since you're registered, any waitlist registrations from <strong>{location || "your neighborhood"}</strong> will count towards your community advocate milestone score!
                    </p>
                  </div>

                  {/* Quick Action Plan */}
                  <div className="bg-slate-105 dark:bg-slate-950 p-4 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-3">
                    <span className="text-[10px] font-mono font-bold text-pink-700 dark:text-pink-400 tracking-wider block uppercase">
                      🚀 Your Next Tactical Actions
                    </span>

                    <ol className="list-decimal list-inside space-y-2 text-slate-700 dark:text-slate-350 text-xs">
                      <li>
                        <strong>Print offline guides:</strong> Use the <span className="text-pink-600 dark:text-pink-400 font-mono text-[11px] font-bold">🖨️ Print Offline Brochure</span> link at the footer to make quick copies on standard paper.
                      </li>
                      <li>
                        <strong>Engage neighbors:</strong> Hand these to homebound patients, active duty nurses, or senior center organizers.
                      </li>
                      <li>
                        <strong>Tell facility leads:</strong> Walk them through the interactive simulator map inside our launch hubs.
                      </li>
                    </ol>
                  </div>

                  <button
                    type="button"
                    onClick={handleResetForm}
                    className="w-full py-2.5 border border-slate-205 dark:border-slate-805 hover:bg-slate-50 dark:hover:bg-slate-850 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-semibold cursor-pointer transition-colors"
                  >
                    Register another advocate persona
                  </button>
                </motion.div>
              )}

              {/* Community Board Submissions Log */}
              <div className="border-t border-slate-100 dark:border-slate-800 pt-5 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-mono font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest block">
                    Active Support Map roster
                  </span>
                  <span className="inline-flex items-center gap-1 text-[10px] text-pink-600 dark:text-pink-400 font-medium bg-pink-50 dark:bg-pink-950/40 px-2 py-0.5 rounded-md">
                    <Users className="w-3.5 h-3.5" />
                    {submissionsList.length} Campaign Leaders
                  </span>
                </div>

                <div className="divide-y divide-slate-105 dark:divide-slate-805 max-h-[170px] overflow-y-auto pr-1 space-y-2">
                  {submissionsList.map((item) => (
                    <div key={item.id} className="py-2.5 space-y-1 text-xs">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-bold text-slate-900 dark:text-slate-250 font-serif">{item.name}</p>
                          <p className="text-[10px] text-slate-500 dark:text-slate-400 flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-pink-500 shrink-0" />
                            <span>{item.location}</span>
                          </p>
                        </div>
                        <span className="px-2 py-0.5 rounded-md text-[8.5px] font-sans bg-pink-50 dark:bg-pink-950/40 text-pink-600 dark:text-pink-300 border border-pink-100/30">
                          {getMethodLabel(item.primaryMethod)}
                        </span>
                      </div>
                      <p className="text-[10.5px] text-slate-650 dark:text-slate-355 font-sans leading-relaxed bg-slate-50 dark:bg-slate-950 border border-slate-200/50 dark:border-slate-800/80 p-2 rounded-lg italic">
                        "{item.notes}"
                      </p>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Bottom Disclaimer */}
            <div className="p-4 bg-slate-50 dark:bg-slate-950/50 border-t border-slate-100 dark:border-slate-850 flex justify-between items-center text-[10px] font-mono text-slate-400 dark:text-slate-500">
              <span className="flex items-center gap-1 text-[9.5px]">
                <Award className="w-3.5 h-3.5 text-pink-400" />
                No physical grooming activity license required.
              </span>
              <span className="hover:underline cursor-pointer flex items-center gap-0.5" onClick={onClose}>
                Close Panel
              </span>
            </div>

          </motion.div>

        </div>
      )}
    </AnimatePresence>
  );
}
