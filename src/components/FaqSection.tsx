import React, { useState } from 'react';
import { 
  Search, HelpCircle, ChevronDown, ChevronUp, Smile, AlertCircle, 
  Printer, Download, Copy, Share2, X, Eye, BookOpen, Sparkles, CheckCircle, FileText
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useAccessibility } from '../context/AccessibilityContext';
import { FaqItem } from '../types';

export default function FaqSection() {
  const { settings } = useAccessibility();
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0); // Default open the first one
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  const faqs: FaqItem[] = [
    {
      question: "What is Beauty Brought to You (BBTY)?",
      answer: "Beauty Brought to You (BBTY) is a specialized mobile beauty and wellness-care platform launching soon. Unlike standard walk-in salons, BBTY is designed specifically to dispatch certified, licensed beauty professionals directly to clients where they are located. We serve seniors, individuals with disabilities, adults in assisted day support, long-term care facilities, and general clients looking for high-quality salon convenience brought directly to their comfortable spaces.",
      category: "general"
    },
    {
      question: "Is this a medical service or treatment?",
      answer: "No. BBTY provides standard cosmetic beauty, grooming, and wellness-care support, never medical treatment, diagnostics, or therapeutic interventions. Our professional technicians do not handle clinical skin conditions, perform nail surgery, or cure medical symptoms. All services are focused entirely on helping you feel clean, elegant, seen, and comfortable in your own space of living. We refer to our team as 'wellness-aware' and 'mobility-friendly' because they understand custom safety pacing, not because they provide clinical therapy.",
      category: "safety"
    },
    {
      question: "Do you treat severe medical nail conditions or skin infections?",
      answer: "Absolutely not. In keeping with safety limits and licensing laws, our technicians cannot treat or diagnose active fungal infections, open skin lesions, ingrown nails causing inflammation, or open pressure ulcers. If a physical issue appears to need medical attention during a grooming check, our stylists will respectfully outline what they notice and advise the client or their designated caregivers/family members to consult a licensed medical clinician or podiatrist.",
      category: "safety"
    },
    {
      question: "Who are your mobile beauty technicians?",
      answer: "All technicians connected to BBTY are fully licensed cosmetologists, hair stylists, or nail technicians inside their operational state. In addition, they undergo custom BBTY training programs focused specifically on understanding geriatric hair structures, physical stability limitations, memory care triggers (for clients with dementia or Alzheimer's), sensory-friendly communication, and overall physical safety support to ensure a respectful experience.",
      category: "join-us"
    },
    {
      question: "What specific services can I book when the app launches?",
      answer: "Once the booking application goes live, we will offer premium services including: Hair Care (shampooing with mobility-friendly portable basins, blowouts, roll sets, trims, styling), Nail Care (custom files, gentle geriatric manicures & pedicures, cuticle upkeep), Makeup (application and tutorials for seniors or occasions), and general Grooming Support (beard care, facial trims, hair maintainers). All are adapted to the client’s seated or bedside alignment.",
      category: "general"
    },
    {
      question: "How can senior living or assisted day care facilities partner with BBTY?",
      answer: "Senior living, day support, and care communities can partner with us to schedule recurring 'BBTY Community Care Days.' Instead of families trying to coordinate travel, we arrange for clean, scheduled, licensed professionals to build a mini-salon right in your recreation room or attend to residents directly in their private suites. Joining our facility partner waitlist alerts you to bulk bookings, special rate configurations, and early access options.",
      category: "facilities"
    },
    {
      question: "I am a salon owner. How does the subscription partnership help my business?",
      answer: "Subscription partnerships allow local salon owners to register their own licensed stylists on the BBTY platform (up to 3 on the Basic plan, and 5 on the Plus plan). This is an outstanding mechanism for salon owners to capture weekday group bookings at nearby housing communities, build team consistency during slower mornings (such as Tuesdays & Wednesdays), gain branding exposure, and build new, high-margin, community-centric revenue streams under their salon banner.",
      category: "join-us"
    },
    {
      question: "How does the waitlist work and is there any charge today?",
      answer: "Joining the waitlist today is 100% free with no credit card required. It secures your email, profile type, and priority routing slot in our regional system. When we deploy stylists in your zip code, waitlist registrants receive priority schedule access ahead of the general public. It also helps us map local demand so we know which neighborhoods to recruit and license technicians in first!",
      category: "general"
    }
  ];

  const handleToggle = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  const filteredFaqs = faqs.filter(
    item =>
      item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Generate plain-text for download and copy actions
  const getBrochurePlaintext = () => {
    return `======================================================================
BEAUTY BROUGHT TO YOU (BBTY) - OFFLINE SERVICES BROCHURE
======================================================================
🏡 Dignified Mobile Grooming & Aesthetic Self-Care for Families
Website: www.beautybroughttoyou.com
Email: info@beautybroughttoyou.com
Phone: (555) BBTY-CARE (2273)
Live Waitlist Registry Core launch hubs: Boston, Chicago, Phoenix & New York Area
----------------------------------------------------------------------

1. ABOUT OUR DEDICATED SOCIAL MISSION:
Beauty Brought to You is a dedicated community-focused mobile platform delivering 
licensed beauty support, gentle skincare, and grooming confidence directly inside 
the residency spaces of clients with accessibility challenges. We serve seniors, 
individuals with chronic disabilities, and those who struggle to access traditional 
walk-in salons. Guided by physical safety, geriatric care pacing, and profound 
compassion, we believe self-grooming is a fundamental human right.

2. MOBILITY-FRIENDLY HAIR SERVICES:
• Portable Shampoo Basin Wash: Comfort-aligned scalp massage and cleansing 
  adapted to bedsides, seating, or special wheelchairs.
• Hair Trim & Scissor Cuts: Experienced styling, bang touchups, and grooming 
  suited to different physical stability configurations.
• Classic Roller Sets & Blowouts: Elegant set treatments and heat styling 
  that rebuild identity, energy, and confidence.

3. SOOTHING NAIL & CARE SERVICES:
• Geriatric Fingernail Files: Gentle nail trimming, non-invasive filing, 
  and deep skin-hydration moisturizing for delicate hand areas.
• Comfort Grooming & Beard Trims: Clean shaves, structural mustache details, 
  and soft aesthetic touches.

4. QUALITY STANDARDS & SAFETY ASSURANCES:
• 100% Licensed & Vetted: Every beauty professional is verified through local 
  state licensing, subject to extensive background checks, and custom-trained 
  in memory care companion methods.
• Hospital-Grade Hygiene: Strictly clean brushes, single-use nail file strips, 
  and chemically sanitized styling basins.
• Non-Clinical Care: Standard beauty cosmetology only. If a physical podiatry 
  or dermatology issue needs surgical or medical cure, we respectfully guide 
  caregivers to professional physicians.

5. UPCOMING MEMBERSHIP ESTIMATIONS:
• Comfort Care Circle: $19.99/mo (or $15.99 billed annually). Direct access to 
  local priority booking queues for private households.
• Partner Salon Tiers: Starting at $79.00/mo. Register, verify, and dispatch 
  up to 3 authorized salon stylists.

----------------------------------------------------------------------
CRITICAL SAFETY & MEDICAL DISCLAIMER:
Beauty Brought to You (BBTY) is an informational mobile beauty applet startup 
and subscription coordination platform. We do NOT provide medical treatments, 
physical-needs nursing, chiropractic manipulation, dermatology medical therapy, 
or clinical podiatric surgery. Stylists operate purely under local state professional 
licensing guidelines regarding cosmetic haircuts, grooming comfort, basic aesthetic 
nail maintenance, and skin moisturizing.
======================================================================
© ${new Date().getFullYear()} Beauty Brought To You, LLC. All Rights Reserved.
`;
  };

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(getBrochurePlaintext())
      .then(() => {
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2500);
      })
      .catch((err) => {
        console.error('Failed to copy text into clipboard', err);
      });
  };

  const handleDownloadBrochure = () => {
    const text = getBrochurePlaintext();
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'BBTY_Caregivers_Offline_Brochure.txt';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const executePrint = () => {
    window.print();
  };

  return (
    <div className="py-20 bg-transparent border-b border-white/10 dark:border-white/5 text-left transition-colors" id="faq-section">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-semibold text-rose-500 dark:text-rose-300 uppercase tracking-widest font-mono bg-rose-50 dark:bg-rose-950/25 px-3 py-1 rounded-full">
            Common Inquiries
          </span>
          <h2 className="text-3xl md:text-5xl font-serif text-slate-900 dark:text-white font-medium tracking-tight mt-3">
            Frequently Asked Questions
          </h2>
          <p className="text-slate-600 dark:text-slate-350 text-sm md:text-base mt-4 leading-relaxed font-sans">
            We believe in complete transparency, honest disclaimers, and clear standards of accessibility. 
            Search our directory below or tap any item to expand its full detail.
          </p>
        </div>

        {/* Real-time Search Box */}
        <div className="relative max-w-md mx-auto mb-10">
          <input
            type="text"
            placeholder="Search FAQs by keywords..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white dark:bg-slate-950 hover:bg-slate-50 dark:hover:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl px-5 py-3.5 pl-12 text-sm text-slate-805 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-1 focus:focus:ring-rose-450 focus:border-rose-450 transition-all shadow-sm"
          />
          <Search className="absolute left-4.5 top-4 w-4 h-4 text-slate-400 dark:text-slate-500" />
        </div>

        {/* Safety Medical Disclaimers Banner */}
        <div className="mb-8 p-4 bg-[#fefbf6] dark:bg-slate-900/90 border border-amber-250 dark:border-amber-900/60 rounded-2xl flex items-start gap-3 text-xs text-amber-900 dark:text-amber-200 transition-colors shadow-2xs">
          <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
          <div className="space-y-1">
            <strong className="text-amber-955 dark:text-amber-200 uppercase tracking-wide">IMPORTANT CLINICAL DISCLAIMER:</strong> 
            <p className="text-slate-700 dark:text-slate-300 leading-normal font-sans">
              Beauty Brought to You (BBTY) and its associated platform independent stylists do NOT offer medical diagnostics, dermatology treatment, chiropractic alignments, or podiatric clinical surgery. We offer non-therapeutic salon beauty styling, cosmetic haircuts, fingernail/toenail filing, and aesthetic maintenance centered in comfort zones.
            </p>
          </div>
        </div>

        {/* Accordions List */}
        <div className="space-y-3">
          {filteredFaqs.length === 0 ? (
            <div className="text-center py-10 text-slate-450 text-sm font-mono">
              No matching questions found for "{searchQuery}". Try searching "training", "medical" or "salon".
            </div>
          ) : (
            filteredFaqs.map((faq, index) => {
              const isOpen = expandedIndex === index;
              return (
                <div
                  key={index}
                  className={`border rounded-2xl transition-all overflow-hidden ${
                    isOpen
                      ? 'bg-[#fffcfc] dark:bg-[#1a0f12] border-rose-350 dark:border-rose-900 shadow-xs'
                      : 'bg-white hover:bg-slate-50 dark:bg-slate-900 dark:hover:bg-slate-850/80 border-slate-200 dark:border-slate-800 shadow-3xs'
                  }`}
                >
                  {/* Collapsible Trigger */}
                  <button
                    onClick={() => handleToggle(index)}
                    type="button"
                    className="w-full flex justify-between items-center px-5 py-4.5 text-left focus:outline-none cursor-pointer"
                    aria-expanded={isOpen}
                  >
                    <span className="font-serif font-medium text-sm md:text-base text-slate-950 dark:text-slate-100 pr-4 flex items-center gap-3">
                      <HelpCircle className={`w-4 h-4 flex-shrink-0 ${isOpen ? 'text-rose-500' : 'text-slate-400'}`} />
                      {faq.question}
                    </span>
                    <span className="p-1 hover:bg-white dark:hover:bg-slate-800 rounded-lg border border-transparent hover:border-slate-200 dark:hover:border-slate-700 text-slate-400 hover:text-slate-200 transition-colors">
                      {isOpen ? (
                        <ChevronUp className="w-4 h-4 text-rose-500" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )}
                    </span>
                  </button>

                  {/* Collapsible Content */}
                  {isOpen && (
                    <div className="px-5 pb-5 pt-0.5">
                      <p className="text-xs md:text-sm text-slate-600 dark:text-slate-300 leading-relaxed max-w-3xl font-sans">
                        {faq.answer}
                      </p>
                      
                      <div className="mt-3.5 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[10px] text-slate-400 dark:text-slate-500 font-mono">
                        <span className="uppercase tracking-wider">Category: {faq.category}</span>
                        <span className="flex items-center gap-1">
                          <Smile className="w-3.5 h-3.5 text-rose-400" /> Verified BBTY Standard Guidelines
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Caregiver Print Resource Card */}
        <div className="mt-12 p-8 bg-white dark:bg-slate-900 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-800 text-center space-y-4 print:hidden" id="caregiver-print-toolkit">
          <div className="max-w-xl mx-auto space-y-2">
            <span className="text-[10px] font-mono font-bold text-pink-700 dark:text-pink-300 uppercase tracking-widest bg-pink-50 dark:bg-pink-950/40 px-2.5 py-1 rounded-md border border-pink-100/60 dark:border-pink-900/30">
              Caregiver & Coordinator Tool
            </span>
            <h3 className="font-serif text-xl font-semibold text-slate-900 dark:text-white mt-2">
              Need an Offline Copy for Residents or Loved Ones?
            </h3>
            <p className="text-xs text-slate-700 dark:text-slate-355 leading-relaxed">
              If you are a family member, life enrichment coordinator, or clinic representative who wants to share these mobility-friendly services offline, click below. We have formatted a pristine, high-contrast print brochure featuring our service directories, pricing projections, and safety disclosures specifically structured for physical distribution.
            </p>
          </div>
          <button
            onClick={() => setIsPrintModalOpen(true)}
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-pink-500 via-rose-500 to-amber-500 hover:from-pink-600 hover:via-rose-600 hover:to-amber-600 text-white rounded-xl text-xs font-bold transition-all shadow-md cursor-pointer hover:scale-102 active:scale-98"
            id="print-action-btn"
          >
            🖨️ Open Print-Friendly Service Sheet
          </button>
        </div>

      </div>

      {/* Accessible Caregiver Print Station & Interactive Brochure Modal */}
      <AnimatePresence>
        {isPrintModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-[999] flex items-center justify-center p-4 overflow-y-auto"
            onClick={() => setIsPrintModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              className="relative bg-white dark:bg-slate-905 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-5xl p-6 md:p-8 shadow-2xl overflow-hidden flex flex-col space-y-6 max-h-[92vh] text-slate-800 dark:text-slate-100"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header Info */}
              <div className="flex justify-between items-start border-b border-slate-100 dark:border-slate-800 pb-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="p-1 px-2.5 bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 font-mono text-[9px] uppercase font-black tracking-wider rounded-md border border-rose-100 dark:border-rose-900/30">
                      Station Activated
                    </span>
                    <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
                  </div>
                  <h3 className="font-serif text-xl md:text-2xl font-bold text-slate-900 dark:text-white">
                    Caregiver Print & Distribution Hub
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Review and print or download this pre-formatted high-contrast brochure for residents and physical communities.
                  </p>
                </div>
                <button
                  onClick={() => setIsPrintModalOpen(false)}
                  className="p-1.5 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 rounded-full border border-transparent hover:border-slate-150 dark:hover:border-slate-700 transition-all cursor-pointer"
                  aria-label="Close Print Station"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Two-Column Workspace Layout */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 overflow-y-auto pr-1">
                
                {/* Left: Pixel-Perfect Paper Document Preview (Col Span 7) */}
                <div className="lg:col-span-7 space-y-3">
                  <span className="text-[10px] font-mono font-bold tracking-widest text-slate-400 dark:text-slate-500 uppercase block select-none">
                    📄 Live Stationary Document Preview
                  </span>
                  
                  <div className="bg-[#FAF8F5] text-stone-900 p-6 md:p-8 rounded-2xl border border-stone-200/80 shadow-inner max-h-[50vh] overflow-y-auto font-serif text-xs leading-relaxed space-y-5 print:max-h-none select-text">
                    
                    {/* Tiny Letterhead */}
                    <div className="border-b border-[#7A8D76]/65 pb-3.5 text-center space-y-1">
                      <h4 className="text-sm font-black uppercase text-slate-900 tracking-tight">
                        Beauty Brought to You (BBTY)
                      </h4>
                      <p className="text-[10px] uppercase tracking-wide text-[#7A8D76] font-mono leading-none">
                        Dignified Mobile Grooming & Aesthetic Self-Care
                      </p>
                      <div className="text-[9px] font-mono text-stone-500 flex justify-between pt-1 opacity-75">
                        <span>📧 info@beautybroughttoyou.com</span>
                        <span>📞 (555) BBTY-CARE</span>
                      </div>
                    </div>

                    {/* Mission */}
                    <div className="space-y-1.5 bg-stone-100 p-3.5 rounded-xl border border-stone-200/60 font-sans text-[11px]">
                      <h5 className="font-bold text-slate-900 flex items-center gap-1.5">
                        🏡 Our Dedicated Social Mission
                      </h5>
                      <p className="text-stone-700 leading-normal">
                        Beauty Brought to You is a dedicated community platform delivering certified mobile grooming confidence directly inside quiet residency spaces of clients with accessibility or physical mobility challenges.
                      </p>
                    </div>

                    {/* Services Grid (Miniaturized columns matching printable stylesheet) */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      
                      {/* Hair column */}
                      <div className="space-y-2">
                        <h6 className="font-mono text-[10px] font-bold text-slate-900 border-b pb-1 border-stone-200 text-[#7A8D76] uppercase">
                          💇 Hair Grooming
                        </h6>
                        <ul className="space-y-1.5 text-stone-700 text-[10px] list-disc pl-3">
                          <li><strong>Shampoo Basin:</strong> Bedside or seated water rinsing washing.</li>
                          <li><strong>Shaping & Cuts:</strong> Soft trims suited for structural ease.</li>
                          <li><strong>Roller & Blowout:</strong> Classic sets supporting skin-hydration.</li>
                        </ul>
                      </div>

                      {/* Nail column */}
                      <div className="space-y-2">
                        <h6 className="font-mono text-[10px] font-bold text-slate-900 border-b pb-1 border-stone-200 text-[#7A8D76] uppercase">
                          💅 Care & Hydration
                        </h6>
                        <ul className="space-y-1.5 text-stone-700 text-[10px] list-disc pl-3">
                          <li><strong>Geriatric File:</strong> Clean, slow trims & hand hydration.</li>
                          <li><strong>Facial Maintain:</strong> Soft mustache detail & gentle shaves.</li>
                        </ul>
                      </div>
                    </div>

                    {/* Disclaimer */}
                    <div className="p-3 bg-amber-50 rounded-lg border border-amber-100 text-[9px] text-amber-900 leading-normal font-sans">
                      <strong>CRITICAL SAFETY DISCLAIMER:</strong> BBTY is an informational mobile beauty applet startup and subscription coordination platform. We do NOT provide medical diagnostics, dermatology treatment, chiropractic alignments, or clinical podiatry surgery.
                    </div>

                    {/* Footer note */}
                    <div className="text-center pt-2 border-t border-stone-100 text-[9px] text-stone-400 font-mono">
                      © {new Date().getFullYear()} Beauty Brought To You, LLC. Verified guidelines.
                    </div>
                  </div>
                </div>

                {/* Right: Controller Actions Panel (Col Span 5) */}
                <div className="lg:col-span-5 flex flex-col justify-between space-y-4">
                  <div className="space-y-4">
                    <span className="text-[10px] font-mono font-bold tracking-widest text-slate-400 dark:text-slate-500 uppercase block select-none">
                      ⚙️ Coordinator Care Controls
                    </span>

                    {/* Main Printing Trigger Button */}
                    <button
                      onClick={executePrint}
                      className="w-full flex items-center justify-center gap-2.5 py-4 px-5 bg-gradient-to-r from-pink-500 via-rose-500 to-amber-500 hover:from-pink-600 hover:via-rose-600 hover:to-amber-600 text-white rounded-2xl text-xs font-black shadow-lg cursor-pointer transform hover:scale-[1.01] active:scale-[0.99] transition-all"
                    >
                      <Printer className="w-4 h-4 animate-bounce" />
                      <span>🖨️ Dispatch & Send to Printer Now</span>
                    </button>

                    {/* Offline File Exporter */}
                    <div className="p-3.5 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-150 dark:border-slate-800 space-y-3">
                      <div className="flex items-center gap-1.5">
                        <FileText className="w-4 h-4 text-pink-500" />
                        <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                          Offline Digital Backups
                        </h4>
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed font-sans">
                        Don't have a physical printer? Export this pre-aligned layout directly to your device as an offline text guide or copy it into newsletters.
                      </p>

                      <div className="grid grid-cols-2 gap-2">
                        {/* Download Plaintext File */}
                        <button
                          onClick={handleDownloadBrochure}
                          className="flex items-center justify-center gap-1.5 py-2.5 px-3 bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-805 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-xl text-[10px] font-bold transition-all cursor-pointer"
                          title="Download Offline Text Brochure"
                        >
                          <Download className="w-3.5 h-3.5 text-rose-500" />
                          <span>Download .TXT</span>
                        </button>

                        {/* Copy Flyer Plaintext To Clipboard */}
                        <button
                          onClick={handleCopyToClipboard}
                          className={`flex items-center justify-center gap-1.5 py-2.5 px-3 border rounded-xl text-[10px] font-bold transition-all cursor-pointer ${
                            copySuccess 
                              ? "bg-emerald-500/10 border-emerald-500 text-emerald-600 dark:text-emerald-400" 
                              : "bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-805 text-slate-800 dark:text-slate-200 border-slate-200 dark:border-slate-700"
                          }`}
                          title="Copy brochure content"
                        >
                          {copySuccess ? (
                            <CheckCircle className="w-3.5 h-3.5 text-emerald-500 animate-pulse" />
                          ) : (
                            <Copy className="w-3.5 h-3.5 text-purple-500" />
                          )}
                          <span>{copySuccess ? "Copied!" : "Copy Clipboard"}</span>
                        </button>
                      </div>
                    </div>

                    {/* Pro Printing Tips Bullet points list */}
                    <div className="p-3.5 bg-rose-50/25 dark:bg-rose-950/15 rounded-2xl border border-rose-100/40 dark:border-rose-900/15 text-[11px] space-y-2 font-sans text-slate-600 dark:text-slate-350">
                      <span className="font-bold text-rose-600 dark:text-rose-400 block uppercase tracking-wider font-mono text-[9px]">
                        💡 Professional Printing Tips
                      </span>
                      <ul className="space-y-1.5 pl-3 list-disc text-slate-500 dark:text-slate-400">
                        <li>Toggle <strong>"Background graphics"</strong> on in Chrome print options to accurately capture colored boxes.</li>
                        <li>To distribute digitally via email, select the <strong>"Save as PDF"</strong> option in your print destination.</li>
                        <li>Highly visual, contrast compliant layout optimized for standard letter sized booklet folding.</li>
                      </ul>
                    </div>
                  </div>

                  {/* Actions footer */}
                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end">
                    <button
                      onClick={() => setIsPrintModalOpen(false)}
                      className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-semibold cursor-pointer border border-transparent hover:border-slate-300 dark:hover:border-slate-600 transition-colors"
                    >
                      Close Station
                    </button>
                  </div>
                </div>

              </div>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
