import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { safeLocalStorage } from '../lib/safeStorage';
import { safeCopyToClipboard } from '../lib/safeCopyToClipboard';
import { 
  X, 
  Gift, 
  Copy, 
  Check, 
  Share2, 
  Mail, 
  Users, 
  Sparkles, 
  CheckCircle,
  ExternalLink,
  ArrowRight,
  UserCheck
} from 'lucide-react';

interface ReferFriendModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ReferFriendModal({ isOpen, onClose }: ReferFriendModalProps) {
  const [referrerName, setReferrerName] = useState('');
  const [referrerEmail, setReferrerEmail] = useState('');
  const [friendName, setFriendName] = useState('');
  const [friendEmail, setFriendEmail] = useState('');
  const [generatedLink, setGeneratedLink] = useState('');
  const [isGenerated, setIsGenerated] = useState(false);
  const [copied, setCopied] = useState(false);
  const [referralsList, setReferralsList] = useState<{ id: string; name: string; date: string; status: string }[]>([]);

  // Load existing mock/saved referrals upon opening
  useEffect(() => {
    if (isOpen) {
      try {
        const stored = safeLocalStorage.getItem('bbty_referral_history');
        if (stored) {
          setReferralsList(JSON.parse(stored));
        } else {
          // Initial realistic data of successful caregiver coordination shares
          const initial = [
            { id: 'ref-1', name: 'Margaret Fletcher (Caregiver)', date: 'June 02, 2026', status: 'Joined Waitlist' },
            { id: 'ref-2', name: 'Lydia Bennett (Seniors Clinic)', date: 'May 28, 2026', status: 'Priority Hub Invited' }
          ];
          setReferralsList(initial);
          safeLocalStorage.setItem('bbty_referral_history', JSON.stringify(initial));
        }
      } catch (err) {
        console.warn('Failed to access referral history:', err);
      }
    }
  }, [isOpen]);

  // Handle ESC key to exit easily
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const handleGenerateLink = (e: React.FormEvent) => {
    e.preventDefault();
    if (!referrerName) return;

    // Build unique customized link
    const base = typeof window !== 'undefined' ? window.location.origin + window.location.pathname : 'https://beautybroughttoyou.com';
    const nameSlug = encodeURIComponent(referrerName.trim().toLowerCase().replace(/\s+/g, '-'));
    const uniqueId = Math.random().toString(36).substring(2, 6);
    
    const savedHl = safeLocalStorage.getItem('bbty_saved_headline');
    const savedTl = safeLocalStorage.getItem('bbty_saved_tagline');
    
    const params = new URLSearchParams();
    params.set('ref', `${nameSlug || 'ambassador'}-${uniqueId}`);
    if (savedHl) params.set('hl', savedHl);
    if (savedTl) params.set('tl', savedTl);
    
    const link = `${base}?${params.toString()}`;
    
    setGeneratedLink(link);
    setIsGenerated(true);

    // Save as dynamic action item to history if friend name is entered
    if (friendName) {
      const newRef = {
        id: `ref-${Date.now()}`,
        name: `${friendName} (${friendEmail || 'Caregiver Circle'})`,
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
        status: 'Link Shared'
      };
      const updated = [newRef, ...referralsList];
      setReferralsList(updated);
      try {
        safeLocalStorage.setItem('bbty_referral_history', JSON.stringify(updated));
      } catch (err) {
        console.warn('Failed to store referral history:', err);
      }
    }
  };

  const copyLinkToClipboard = () => {
    if (!generatedLink) return;
    
    const inviteMessage = `Join the Beauty Brought to You (BBTY) priority launching waitlist! My friend ${referrerName || 'Caregiving Ally'} invited us so we can coordinate salon-grade wellness and gentle styling visits directly at home. Grab priority reservation access here:\n\n${generatedLink}`;
    
    safeCopyToClipboard(inviteMessage).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const resetForm = () => {
    setFriendName('');
    setFriendEmail('');
    setGeneratedLink('');
    setIsGenerated(false);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          
          {/* Backdrop Overlay */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm"
            id="referral-backdrop-overlay"
          />

          {/* Modal Container */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ type: "spring", duration: 0.4 }}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden relative z-10 text-left font-sans transition-colors duration-200"
            id="referral-modal-box"
          >
            
            {/* Elegant Header with Diagonal styling strip */}
            <div className="relative p-6 pb-0 flex justify-between items-start">
              <div className="space-y-1">
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 text-[9px] font-bold font-mono tracking-wider uppercase text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-950/40 border border-purple-100 dark:border-purple-900/30 rounded-md">
                  🤝 Caregiver Ambassador Circle
                </span>
                <h3 className="text-xl font-serif font-black text-slate-900 dark:text-white flex items-center gap-1.5">
                  <Gift className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                  Refer a Caregiving Friend
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

            {/* Modal Scrollable Core Content */}
            <div className="p-6 max-h-[80vh] overflow-y-auto space-y-5">
              
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-sans">
                Grow the waitlist density in your vicinity! When you share unique referral codes with other home caregivers, family members, or nursing facility directors, our rollout coordinators prioritize your zipcode sector.
              </p>

              {!isGenerated ? (
                /* Step 1: Input details to produce link */
                <form onSubmit={handleGenerateLink} className="space-y-4">
                  
                  {/* Your details section */}
                  <div className="space-y-3 bg-slate-50/70 dark:bg-slate-950/30 p-4 rounded-xl border border-slate-100 dark:border-slate-850">
                    <span className="text-[9px] font-mono font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest block">
                      Step 1. Your Ambassador Info
                    </span>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-700 dark:text-slate-350 block">Your Name <span className="text-pink-500">*</span></label>
                        <input 
                          type="text" 
                          required
                          value={referrerName} 
                          onChange={(e) => setReferrerName(e.target.value)}
                          placeholder="e.g. Jane Smith, CNA"
                          className="w-full p-2.5 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-purple-300 dark:focus:ring-purple-800"
                        />
                      </div>
                      
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-700 dark:text-slate-350 block">Your Email <span className="text-slate-400 font-normal">(Optional)</span></label>
                        <input 
                          type="email" 
                          value={referrerEmail} 
                          onChange={(e) => setReferrerEmail(e.target.value)}
                          placeholder="e.g. jane@homecare.org"
                          className="w-full p-2.5 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-purple-300 dark:focus:ring-purple-800"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Friend's details section (optional tracking) */}
                  <div className="space-y-3 bg-slate-50/70 dark:bg-slate-950/30 p-4 rounded-xl border border-slate-100 dark:border-slate-850">
                    <div className="flex justify-between items-center">
                      <span className="text-[9px] font-mono font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                        Step 2. Recipient Friend <span className="text-slate-450 normal-case font-normal">(Optional)</span>
                      </span>
                      <span className="text-[9px] italic text-purple-600 dark:text-purple-400 font-sans">Helps custom greeting</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-700 dark:text-slate-350 block">Friend's Name</label>
                        <input 
                          type="text" 
                          value={friendName} 
                          onChange={(e) => setFriendName(e.target.value)}
                          placeholder="e.g. Eleanor Vance, Caregiver"
                          className="w-full p-2.5 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-purple-300 dark:focus:ring-purple-800"
                        />
                      </div>
                      
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-700 dark:text-slate-350 block">Friend's Email or Phone</label>
                        <input 
                          type="text" 
                          value={friendEmail} 
                          onChange={(e) => setFriendEmail(e.target.value)}
                          placeholder="e.g. eleanor@caremail.com"
                          className="w-full p-2.5 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-purple-300 dark:focus:ring-purple-800"
                        />
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 px-4 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-xl text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <span>Generate Unique Shareable Invitation Link</span>
                    <Sparkles className="w-3.5 h-3.5 text-purple-200" />
                  </button>
                </form>
              ) : (
                /* Step 2: Unique Link Generated & Ready */
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-4"
                >
                  <div className="p-4 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/30 rounded-xl space-y-2 text-emerald-800 dark:text-emerald-350">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                      <span className="text-xs font-bold font-sans">Unique Ambassador Link Ready!</span>
                    </div>
                    <p className="text-[11px] leading-relaxed opacity-90">
                      We customized the invitation metadata with your handle. Anyone who registries through this URL counts toward your Ambassador coordinator score.
                    </p>
                  </div>

                  {/* Copy Link visual block */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-mono font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest block">
                      Customized Invite URL
                    </label>
                    <div className="flex gap-2">
                      <div className="flex-1 p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl font-mono text-[10px] text-slate-600 dark:text-slate-350 overflow-x-auto whitespace-nowrap scrollbar-none h-[42px] leading-tight flex items-center">
                        {generatedLink}
                      </div>
                      <button
                        type="button"
                        onClick={copyLinkToClipboard}
                        className={`px-4 rounded-xl font-medium text-xs flex items-center justify-center gap-1.5 transition-all text-white cursor-pointer ${
                          copied ? 'bg-emerald-600' : 'bg-purple-600 hover:bg-purple-700'
                        }`}
                      >
                        {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                        <span>{copied ? 'Copied!' : 'Copy'}</span>
                      </button>
                    </div>
                  </div>

                  {/* Template copy preview */}
                  <div className="bg-slate-50/50 dark:bg-slate-950/20 p-3 rounded-xl border border-slate-100 dark:border-slate-850 space-y-1.5">
                    <span className="text-[9.5px] font-mono font-bold text-slate-400 block uppercase">
                      What is copied on clipboard:
                    </span>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-relaxed italic">
                      "Join the Beauty Brought to You waitlist! My friend {referrerName} invited us so we can coordinate in-home salon-grade wellness and gentle styling visits. Grab priority reservation here: {generatedLink}"
                    </p>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <button
                      type="button"
                      onClick={resetForm}
                      className="flex-1 py-2.5 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-850 text-slate-600 dark:text-slate-300 rounded-xl text-xs font-medium cursor-pointer transition-colors"
                    >
                      Create Another Link
                    </button>
                    <a
                      href={`mailto:?subject=Salon%20Service%20Direct%20To%20Home&body=Grab%20your%2520private%2520waitlist%2520access%2520for%2520Beauty%2520Brought%2520To%2520You%2520here%3A%20${encodeURIComponent(generatedLink)}`}
                      className="flex-1 py-2.5 bg-slate-900 hover:bg-black dark:bg-black dark:hover:bg-slate-900 text-white rounded-xl text-xs font-medium text-center flex items-center justify-center gap-1.5 transition-colors cursor-pointer border border-slate-850"
                    >
                      <Mail className="w-3.5 h-3.5" />
                      <span>Send via Email</span>
                    </a>
                  </div>
                </motion.div>
              )}

              {/* Real-time Waitlist Referral History Logs */}
              <div className="border-t border-slate-100 dark:border-slate-800 pt-4 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-mono font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest block">
                    Your Coordinator History
                  </span>
                  <span className="inline-flex items-center gap-1 text-[10px] text-purple-600 dark:text-purple-400 font-medium">
                    <UserCheck className="w-3.5 h-3.5" />
                    +{referralsList.length} Network Nodes
                  </span>
                </div>

                <div className="divide-y divide-slate-100 dark:divide-slate-800/60 max-h-[140px] overflow-y-auto pr-1">
                  {referralsList.map((item) => (
                    <div key={item.id} className="py-2 flex justify-between items-center text-[11px] font-sans">
                      <div className="space-y-0.5">
                        <p className="font-bold text-slate-800 dark:text-slate-200">{item.name}</p>
                        <p className="text-[9.5px] text-slate-400 dark:text-slate-500">{item.date}</p>
                      </div>
                      <span className="px-2 py-0.5 rounded-full text-[9px] font-mono font-bold bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-300 border border-purple-100/40 dark:border-purple-900/30">
                        {item.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Modal Bottom confirmation */}
            <div className="p-4 bg-slate-50 dark:bg-slate-950/50 border-t border-slate-100 dark:border-slate-850 flex justify-between items-center text-[10px] font-mono text-slate-400 dark:text-slate-500">
              <span className="flex items-center gap-1">
                <Users className="w-3.5 h-3.5 text-purple-400" />
                Durable local persistence active.
              </span>
              <span className="hover:underline cursor-pointer flex items-center gap-0.5" onClick={onClose}>
                Dismiss Panel <ArrowRight className="w-3 h-3" />
              </span>
            </div>

          </motion.div>

        </div>
      )}
    </AnimatePresence>
  );
}
