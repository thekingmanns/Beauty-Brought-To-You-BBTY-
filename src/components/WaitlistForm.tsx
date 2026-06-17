import React, { useState, useEffect, useRef } from 'react';
import { UserCheck, Phone, Mail, Scissors, FileText, Check, Sparkles, Building2, Trash2, ShieldCheck, Heart, X } from 'lucide-react';
import { WaitlistSubmission } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { collection, onSnapshot, addDoc, deleteDoc, doc } from 'firebase/firestore';
import { db, OperationType, handleFirestoreError } from '../lib/firebase';
import { useToast } from '../context/ToastContext';

export default function WaitlistForm() {
  const { addToast } = useToast();
  const [registrants, setRegistrants] = useState<WaitlistSubmission[]>([]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [category, setCategory] = useState<string>('client');
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [notes, setNotes] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [showAdminConsole, setShowAdminConsole] = useState(false);
  const [assignedNumber, setAssignedNumber] = useState(1);
  const seedingRef = useRef(false);

  // Auto-dismiss toast notification after 5 seconds
  useEffect(() => {
    if (showToast) {
      const timer = setTimeout(() => {
        setShowToast(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [showToast]);

  const getMockSeedData = (): WaitlistSubmission[] => {
    return [
      {
        id: 'seed-1',
        name: 'Margaret Henderson',
        email: 'margaret.h@example.com',
        phone: '(555) 341-2091',
        category: 'client',
        services: ['Hair care', 'Nail care / Manicure & Pedicures'],
        notes: 'Uses a walker, needs gentle hand massage as fingernails are thick.',
        submittedAt: new Date(Date.now() - 24 * 60 * 60 * 1000 * 3).toISOString()
      },
      {
        id: 'seed-2',
        name: 'Golden Oasis Adult Daycare',
        email: 'director@goldenoasis.org',
        phone: '(555) 789-4402',
        category: 'facility',
        services: ['Hair care', 'Nail care / Manicure & Pedicures', 'Grooming support', 'Group event interest'],
        notes: 'Interested in booking once-a-month wellness beauty mornings for 15+ attendees.',
        submittedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 'seed-3',
        name: 'Tyler Vance',
        email: 'tyler.v@vancesalon.com',
        phone: '(555) 124-9109',
        category: 'salon_owner',
        services: ['Hair care', 'Grooming support'],
        notes: 'Co-own Velvet Sage. Restructuring team for weekday community outreach services.',
        submittedAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString()
      }
    ];
  };

  // Synchronize Firestore waitlist collection in real-time
  useEffect(() => {
    let isMounted = true;
    
    const unsubscribe = onSnapshot(collection(db, "waitlist"), (snapshot) => {
      if (!isMounted) return;
      const list: WaitlistSubmission[] = [];
      snapshot.forEach((snapshotDoc) => {
        const data = snapshotDoc.data();
        list.push({
          id: snapshotDoc.id,
          name: data.name || '',
          email: data.email || '',
          phone: data.phone || '',
          category: data.category || 'client',
          services: data.services || [],
          notes: data.notes || undefined,
          submittedAt: data.submittedAt || new Date().toISOString(),
        } as WaitlistSubmission);
      });

      // Sort by submittedAt descending so new waitlist signups are listed first
      const sortedList = list.sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());

      if (sortedList.length === 0 && !seedingRef.current) {
        seedingRef.current = true;
        const seedData = getMockSeedData();
        // Seed first-time launch mock entries into remote Firestore
        Promise.all(
          seedData.map((item) => {
            const { id, ...dataToSave } = item;
            return addDoc(collection(db, "waitlist"), dataToSave);
          })
        ).then(() => {
          seedingRef.current = false;
        }).catch((err) => {
          console.error("Failed to seed initial entries into Firestore:", err);
          seedingRef.current = false;
        });
      } else {
        setRegistrants(sortedList);
        localStorage.setItem('bbty_waitlist_db', JSON.stringify(sortedList));
        window.dispatchEvent(new CustomEvent('bbty_waitlist_updated'));
      }
    }, (error) => {
      if (error && (error.message || '').toLowerCase().includes('permission')) {
        handleFirestoreError(error, OperationType.LIST, "waitlist");
      }
      console.error("Firestore real-time sync failed. Falling back to local state and local storage.", error);
      // Offline fallback: load from localStorage
      const stored = localStorage.getItem('bbty_waitlist_db');
      if (stored) {
        try {
          setRegistrants(JSON.parse(stored));
        } catch (e) {
          setRegistrants(getMockSeedData());
        }
      } else {
        const seed = getMockSeedData();
        localStorage.setItem('bbty_waitlist_db', JSON.stringify(seed));
        setRegistrants(seed);
      }
    });

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, []);

  const handleServiceChange = (service: string) => {
    if (selectedServices.includes(service)) {
      setSelectedServices(prev => prev.filter(s => s !== service));
    } else {
      setSelectedServices(prev => [...prev, service]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      addToast('Please enter your name or facility name to proceed.', 'error');
      return;
    }
    if (!email.trim()) {
      addToast('Please enter your email address to proceed.', 'error');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      addToast('Please enter a valid, complete email address (e.g. name@example.com).', 'error');
      return;
    }

    const baseQueueNumber = 142;
    const finalNumber = baseQueueNumber + registrants.length + 1;
    setAssignedNumber(finalNumber);

    const submissionData = {
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      category: category as any,
      services: selectedServices,
      notes: notes.trim() || undefined,
      submittedAt: new Date().toISOString()
    };

    try {
      // Save directly to the cloud Firestore database
      await addDoc(collection(db, "waitlist"), submissionData);
      setIsSubmitted(true);
      setShowToast(true);
      addToast(`Waitlist joined successfully! Secure spot #${finalNumber} allocated.`, 'success');
    } catch (err) {
      if (err instanceof Error && (err.message || '').toLowerCase().includes('permission')) {
        handleFirestoreError(err, OperationType.CREATE, "waitlist");
      }
      console.warn("Could not save to remote Firestore. Saving to local storage backup:", err);
      // Offline fallback mode
      const offlineId = `reg-${Date.now()}`;
      const newSub: WaitlistSubmission = {
        id: offlineId,
        ...submissionData
      };
      const updated = [newSub, ...registrants];
      setRegistrants(updated);
      localStorage.setItem('bbty_waitlist_db', JSON.stringify(updated));
      window.dispatchEvent(new CustomEvent('bbty_waitlist_updated'));
      setIsSubmitted(true);
      setShowToast(true);
      addToast(`Offline fallback saved! Secure slot #${finalNumber} logged locally on your device.`, 'success');
    }
  };

  const handleDelete = async (id: string) => {
    if (id.startsWith('seed-') || id.startsWith('reg-')) {
      // Delete from local backup/temporary mockup data directly
      const updated = registrants.filter(r => r.id !== id);
      setRegistrants(updated);
      localStorage.setItem('bbty_waitlist_db', JSON.stringify(updated));
      window.dispatchEvent(new CustomEvent('bbty_waitlist_updated'));
      addToast('Demo sandbox record removed successfully.', 'info');
      return;
    }

    try {
      // Delete from Firestore
      await deleteDoc(doc(db, "waitlist", id));
      addToast('Waitlist record deleted from remote database.', 'info');
    } catch (err) {
      if (err instanceof Error && (err.message || '').toLowerCase().includes('permission')) {
        handleFirestoreError(err, OperationType.DELETE, `waitlist/${id}`);
      }
      console.error("Failed to delete record from Firestore, removing locally:", err);
      // Fallback
      const updated = registrants.filter(r => r.id !== id);
      setRegistrants(updated);
      localStorage.setItem('bbty_waitlist_db', JSON.stringify(updated));
      window.dispatchEvent(new CustomEvent('bbty_waitlist_updated'));
      addToast('Record cleared locally (Firestore permission warning).', 'info');
    }
  };

  const handleResetForm = () => {
    setName('');
    setEmail('');
    setPhone('');
    setCategory('client');
    setSelectedServices([]);
    setNotes('');
    setIsSubmitted(false);
  };


  const getCategoryBadgeColor = (cat: string) => {
    switch (cat) {
      case 'client': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'family': return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'facility': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'salon_owner': return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'independent_pro': return 'bg-amber-50 text-amber-700 border-amber-200';
      default: return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  const getCategoryLabel = (cat: string) => {
    switch (cat) {
      case 'client': return 'Private Client';
      case 'family': return 'Family Member';
      case 'facility': return 'Care Facility Rep';
      case 'salon_owner': return 'Salon Owner/Partner';
      case 'independent_pro': return 'Independent Stylist';
      case 'graduate': return 'New Cosmetology Grad';
      default: return cat;
    }
  };

  return (
    <div className="py-20 bg-slate-900 text-white relative overflow-hidden" id="waitlist-form-block">
      {/* Soft ambient background spots */}
      <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-pink-500/15 rounded-full blur-3xl"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl"></div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10">
        
        {/* Header content */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-mono font-bold text-rose-400 uppercase tracking-widest bg-rose-500/15 px-3 py-1 rounded-full border border-rose-500/30">
            Secure Priority Queue Booking
          </span>
          <h2 className="text-3xl md:text-5xl font-serif font-medium tracking-tight text-white mt-4">
            Be Vetted & Scheduled First on Outbreak
          </h2>
          <p className="text-slate-300 text-sm md:text-base mt-4 leading-relaxed">
            We are preparing our mobile scheduling applications and vetting regional specialists. 
            Sign up below to secure your complimentary priority ticket. Vetting is processed in strict receipt sequence.
          </p>
          
          <div className="mt-6 flex justify-center gap-6 text-xs text-rose-300 font-mono">
            <span className="flex items-center gap-1.5 bg-slate-800/80 px-3.5 py-1.5 rounded-xl border border-slate-700/50">
              <span className="w-1.5 h-1.5 bg-rose-500 rounded-full animate-ping"></span>
              Join waitlist database
            </span>
            <span className="flex items-center gap-1.5 bg-slate-800/80 px-3.5 py-1.5 rounded-xl border border-slate-700/50">
              👥 <strong>{142 + registrants.length}</strong> currently in queue
            </span>
          </div>
        </div>

        {/* Outer Form Core */}
        <div className="bg-slate-950 rounded-3xl border border-slate-800 p-6 md:p-10 shadow-xl overflow-hidden relative">
          
          {/* Subtle safety header banner */}
          <div className="bg-slate-900 -mt-6 md:-mt-10 -mx-6 md:-mx-10 p-4 border-b border-slate-800 flex items-center justify-center gap-2 mb-8 text-xs text-rose-250">
            <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <span><strong>No medical claims are made:</strong> All activities are standard cosmetics/styling, not therapy. Vetted safe.</span>
          </div>

          {!isSubmitted ? (
            <form onSubmit={handleSubmit} className="space-y-6 text-left">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Name */}
                <div className="space-y-1.5">
                  <label htmlFor="full-name" className="text-xs font-bold font-mono text-slate-300 uppercase tracking-wider">
                    Your Full Name / Contact Name <span className="text-rose-400">*</span>
                  </label>
                  <div className="relative">
                    <input
                      id="full-name"
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Jane Doe"
                      className="w-full bg-slate-800/50 hover:bg-slate-800/80 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-rose-400 focus:border-rose-400 transition-all pl-11"
                    />
                    <UserCheck className="absolute left-4 top-3.5 w-4 h-4 text-slate-500" />
                  </div>
                </div>

                {/* Email */}
                <div className="space-y-1.5">
                  <label htmlFor="email-address" className="text-xs font-bold font-mono text-slate-300 uppercase tracking-wider">
                    E-mail Address <span className="text-rose-400">*</span>
                  </label>
                  <div className="relative">
                    <input
                      id="email-address"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="jane@example.com"
                      className="w-full bg-slate-800/50 hover:bg-slate-800/80 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-rose-400 focus:border-rose-400 transition-all pl-11"
                    />
                    <Mail className="absolute left-4 top-3.5 w-4 h-4 text-slate-500" />
                  </div>
                </div>

                {/* Phone */}
                <div className="space-y-1.5">
                  <label htmlFor="phone-number" className="text-xs font-bold font-mono text-slate-300 uppercase tracking-wider">
                    Phone Number <span className="text-xs text-slate-500">(Ideal for text updates)</span>
                  </label>
                  <div className="relative">
                    <input
                      id="phone-number"
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="(555) 000-0000"
                      className="w-full bg-slate-800/50 hover:bg-slate-800/80 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-rose-400 focus:border-rose-400 transition-all pl-11"
                    />
                    <Phone className="absolute left-4 top-3.5 w-4 h-4 text-slate-500" />
                  </div>
                </div>

                {/* Category Dropdown */}
                <div className="space-y-1.5">
                  <label htmlFor="category-select" className="text-xs font-bold font-mono text-slate-300 uppercase tracking-wider">
                    Primary Profile Category <span className="text-rose-400">*</span>
                  </label>
                  <div className="relative">
                    <select
                      id="category-select"
                      required
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-rose-400 focus:border-rose-400 cursor-pointer transition-all appearance-none"
                    >
                      <option value="client">Client (Need private services at home)</option>
                      <option value="family">Family/Caregiver (Booking on behalf of relative)</option>
                      <option value="facility">Senior Community / Adult Daycare Representative</option>
                      <option value="salon_owner">Salon Owner (Register up to 3/5 stylists)</option>
                      <option value="independent_pro">Independent Contractor Beauty Provider</option>
                      <option value="graduate">New Cosmetology Graduate / School Partner</option>
                    </select>
                    <span className="absolute right-4 top-4 border-l border-slate-700 pl-3 text-slate-400 text-xs">▼</span>
                  </div>
                </div>
              </div>

              {/* Service Checklists */}
              <div className="space-y-2 pt-2">
                <label className="text-xs font-bold font-mono text-slate-300 uppercase tracking-wider block">
                  Select Services of Core Interest (Check all that apply)
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {[
                    'Hair care (Wash / Trim / Rollers / Style)',
                    'Nail care / Manicure & Pedicures',
                    'Grooming support (Beard, Trim, Hygiene maintenance)',
                    'Makeup Support & Beauty Maintenance',
                    'Sew-ins (Protective Wefts & Braiding)',
                    'TCP (Therapeutic Cranial Prosthesis wig fitting)',
                    'Group event planning (Facilities only)'
                  ].map((service) => {
                    const isChecked = selectedServices.includes(service);
                    return (
                      <div
                        key={service}
                        onClick={() => handleServiceChange(service)}
                        className={`p-3 rounded-xl border text-xs cursor-pointer transition-all flex items-center gap-2.5 text-left ${
                          isChecked
                            ? 'bg-rose-500/15 border-rose-400 text-rose-200'
                            : 'bg-slate-800/30 border-slate-700 text-slate-300 hover:border-slate-500'
                        }`}
                      >
                        <div className={`w-4.5 h-4.5 rounded-md border flex items-center justify-center transition-all flex-shrink-0 ${
                          isChecked ? 'bg-rose-500 border-rose-400' : 'border-slate-600'
                        }`}>
                          {isChecked && <Check className="w-3 text-white" />}
                        </div>
                        <span className="leading-tight">{service}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Special Mobility & Sensory notes */}
              <div className="space-y-1.5">
                <label htmlFor="mobility-notes" className="text-xs font-bold font-mono text-slate-300 uppercase tracking-wider">
                  Special Physical, Sensory, or Mobility Requirements <span className="text-xs text-slate-500">(Optional)</span>
                </label>
                <div className="relative">
                  <textarea
                    id="mobility-notes"
                    rows={3}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="E.g., uses wheelchair, has dementia, requires extra patience, skin sensitivity details, or specific scheduling hours..."
                    className="w-full bg-slate-800/50 hover:bg-slate-800/80 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-rose-400 focus:border-rose-400 transition-all pl-11"
                  />
                  <FileText className="absolute left-4 top-4.5 w-4 h-4 text-slate-500" />
                </div>
              </div>

              <div className="pt-4 text-center">
                <button
                  type="submit"
                  className="w-full px-10 py-5 bg-gradient-to-r from-pink-500 via-purple-600 to-blue-600 hover:from-pink-600 hover:via-purple-700 hover:to-blue-700 text-white font-black rounded-2xl text-base uppercase tracking-wider transition-all duration-300 shadow-[0_8px_30px_rgba(219,39,119,0.35)] hover:shadow-[0_15px_40px_rgba(219,39,119,0.6)] border-2 border-white/20 hover:border-white/45 cursor-pointer hover:scale-[1.03] active:scale-[0.97]"
                  id="submit-waitlist-form"
                >
                  Submit Vetting Application & Secure My Spot ✨
                </button>
                <p className="text-slate-400 text-[10px] mt-2.5 leading-relaxed">
                  By clicking submit, you request to join the informational prioritised list. 
                  No billing is executed. We treat all personal details with secure, medical-grade compliance and care confidentiality.
                </p>
              </div>

            </form>
          ) : (
            /* Thank you success board */
            <div className="py-12 px-4 text-center space-y-6">
              <div className="w-16 h-16 bg-rose-500/10 text-rose-400 rounded-full flex items-center justify-center mx-auto border border-rose-500/30">
                <Sparkles className="w-8 h-8 text-rose-400 animate-pulse" />
              </div>

              <div>
                <h3 className="text-2xl md:text-3xl font-serif text-white font-semibold">
                  You’ve officially joined the waitlist!
                </h3>
                <p className="text-rose-200 text-sm md:text-base mt-2 max-w-lg mx-auto leading-relaxed">
                  Thank you, <strong className="text-white font-semibold">{name}</strong>. Your vetting slot has been logged.
                </p>
              </div>

              {/* Dynamic Queue Card */}
              <div className="bg-slate-800/80 max-w-md mx-auto p-6 rounded-2xl border border-slate-700/60 shadow-lg text-left relative">
                <span className="absolute top-4 right-4 text-[10px] font-mono tracking-widest text-emerald-400 uppercase bg-emerald-950/50 border border-emerald-900/50 px-2.5 py-1 rounded-md">
                  Vetting Slot Secured
                </span>
                
                <h4 className="text-xs font-bold font-mono text-slate-400 uppercase tracking-widest">Waitlist Position</h4>
                <div className="flex items-baseline gap-2 mt-2">
                  <span className="text-slate-400 text-sm">#</span>
                  <span className="text-4xl font-black font-mono text-white select-all">{assignedNumber}</span>
                  <span className="text-xs text-rose-300 font-mono">Globally</span>
                </div>

                <div className="mt-4 pt-4 border-t border-slate-700/60 text-xs text-slate-300 space-y-2.5">
                  <p><strong>Registered Email:</strong> {email}</p>
                  <p><strong>Vetting Category:</strong> {getCategoryLabel(category)}</p>
                  {selectedServices.length > 0 && (
                    <p><strong>Selected Fields:</strong> {selectedServices.map(s => s.split(' (')[0]).join(', ')}</p>
                  )}
                </div>
              </div>

              <div className="pt-6 flex flex-wrap justify-center gap-4">
                <button
                  onClick={handleResetForm}
                  className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded-xl text-xs font-medium font-mono border border-slate-700 transition-colors cursor-pointer"
                  type="button"
                >
                  ← Submit Another Registrant
                </button>
                <a
                  href="#why-brought-section"
                  className="px-5 py-2.5 bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white rounded-xl text-xs font-medium transition-colors border border-white/5"
                >
                  Read Social Mission
                </a>
              </div>
            </div>
          )}

        </div>

        {/* Private Sandbox panel for testing (Administrator View) */}
        <div className="mt-8 pt-4 border-t border-slate-800">
          <div className="flex justify-center">
            <button
              onClick={() => setShowAdminConsole(prev => !prev)}
              type="button"
              className="text-slate-500 hover:text-slate-300 text-xs font-mono underline cursor-pointer"
            >
              {showAdminConsole ? '▼ Hide Waitlist Sandbox Records Console' : '► Show Waitlist Sandbox Records Console'}
            </button>
          </div>

          {showAdminConsole && (
            <div className="mt-4 p-5 bg-slate-950 rounded-2xl border border-slate-800 text-left space-y-4">
              <div className="flex justify-between items-center bg-slate-900 -mx-5 -mt-5 p-4 rounded-t-2xl border-b border-slate-800">
                <span className="text-xs font-bold font-mono tracking-wider text-rose-300 uppercase">
                  Waitlist Database Registry Simulation (Local Storage)
                </span>
                <span className="text-[10px] bg-slate-800 text-slate-400 font-mono px-2 py-0.5 rounded-full">
                  {registrants.length} Total Sandbox Records
                </span>
              </div>

              <p className="text-slate-400 text-xs leading-relaxed max-w-2xl">
                This table shows waitlist submissions currently stored inside your internet browser’s memory (localStorage). You can test submissions in the form above and see them appended instantly!
              </p>

              {registrants.length === 0 ? (
                <div className="text-center py-6 text-slate-600 font-mono text-xs">
                  Registry is empty. Use the waitlist form above to construct a record.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-slate-300">
                    <thead>
                      <tr className="border-b border-slate-800 text-slate-500">
                        <th className="py-2.5 font-bold font-mono">Date</th>
                        <th className="py-2.5 font-bold font-mono">Full Contact Name</th>
                        <th className="py-2.5 font-bold font-mono">Category Profile</th>
                        <th className="py-2.5 font-bold font-mono">Interests / Care notes</th>
                        <th className="py-2.5 font-bold font-mono text-right">Delete</th>
                      </tr>
                    </thead>
                    <tbody>
                      {registrants.map((item) => (
                        <tr key={item.id} className="border-b border-slate-900 hover:bg-slate-900/40">
                          <td className="py-3 font-mono text-[10px] text-slate-500">
                            {new Date(item.submittedAt).toLocaleDateString()}
                          </td>
                          <td className="py-3 font-medium">
                            <div className="text-slate-100">{item.name}</div>
                            <div className="text-slate-400 text-[10px]">{item.email} • {item.phone || 'No phone'}</div>
                          </td>
                          <td className="py-3">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] border font-medium ${getCategoryBadgeColor(item.category)}`}>
                              {getCategoryLabel(item.category)}
                            </span>
                          </td>
                          <td className="py-3 max-w-[280px]">
                            {item.services.length > 0 && (
                              <div className="text-[10px] text-slate-400">
                                <strong>Services:</strong> {item.services.map(s => s.split(' (')[0]).join(', ')}
                              </div>
                            )}
                            {item.notes && (
                              <p className="text-[11px] text-rose-300/80 leading-snug mt-1 italic">
                                "{item.notes}"
                              </p>
                            )}
                          </td>
                          <td className="py-3 text-right">
                            <button
                              onClick={() => handleDelete(item.id)}
                              type="button"
                              className="p-1 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 roundedtransition-colors cursor-pointer"
                              title="Delete record from local storage memory"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>

      </div>

      {/* Floating Animated success Toast Notification */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed bottom-6 right-6 z-50 max-w-sm w-full bg-slate-900 border border-emerald-500/30 rounded-2xl shadow-2xl p-4 flex gap-3 text-left items-start backdrop-blur-md"
          >
            <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-400 border border-emerald-500/20 shrink-0">
              <Check className="w-5 h-5" />
            </div>
            <div className="flex-1 space-y-1">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold font-sans text-white">Waitlist Joined! 🌟</h4>
                <button
                  type="button"
                  onClick={() => setShowToast(false)}
                  className="text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <p className="text-xs text-slate-300 leading-normal">
                Congratulations, you are position <strong className="text-emerald-400 font-mono">#{assignedNumber}</strong> in the priority queue. A confirmation has been stored in your device.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
