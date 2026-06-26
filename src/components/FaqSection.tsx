import React, { useState } from 'react';
import { 
  Search, HelpCircle, ChevronDown, ChevronUp, Smile, AlertCircle, 
  Printer, Download, Copy, Share2, X, Eye, BookOpen, Sparkles, CheckCircle, FileText, ShieldCheck
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useAccessibility } from '../context/AccessibilityContext';
import { FaqItem } from '../types';
import { safeCopyToClipboard } from '../lib/safeCopyToClipboard';

export default function FaqSection({ onOpenSecurity }: { onOpenSecurity?: () => void }) {
  const { settings } = useAccessibility();
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0); // Default open the first one
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  const faqs: FaqItem[] = [
    {
      question: "What is Beauty Brought to You (BBTY)?",
      answer: "BBTY is a mobile beauty and wellness platform. We send certified, licensed beauty professionals directly to you. We serve seniors, people with disabilities, and anyone seeking convenient salon services at home or in Care Facilities.",
      category: "general"
    },
    {
      question: "Is this a medical service or treatment?",
      answer: "No. BBTY provides standard cosmetic beauty and wellness care. We do not provide medical treatments, therapy, or diagnostics. Our services help you feel clean and comfortable. Our team is 'wellness-aware' and 'mobility-friendly', focusing on safety and patience.",
      category: "safety"
    },
    {
      question: "Do you treat medical nail conditions or skin infections?",
      answer: "No. Our technicians cannot treat fungal infections, open lesions, or ingrown nails causing inflammation. If they notice a physical issue, they will respectfully suggest that you consult a medical clinician or podiatrist.",
      category: "safety"
    },
    {
      question: "Who are your mobile beauty technicians?",
      answer: "Our technicians are licensed cosmetologists, hair stylists, or nail technicians. They also complete custom training focused on seniors, memory care, and sensory-friendly communication.",
      category: "join-us"
    },
    {
      question: "What specific services can I book when the app launches?",
      answer: "We will offer Hair Care (shampooing with portable basins, blowouts, cuts, styling), Nail Care (gentle manicures and pedicures), Makeup, and basic Grooming. All services are adapted to be comfortable while seated or in bed.",
      category: "general"
    },
    {
      question: "How can senior living or care facilities partner with BBTY?",
      answer: "Care communities can partner with us to schedule recurring 'Community Care Days'. We set up a mini-salon in your space, or attend to residents directly in their suites. Join our waiting list for early access and block booking options.",
      category: "facilities"
    },
    {
      question: "I am a salon owner. How does the subscription partnership help my business?",
      answer: "Salon owners can register their stylists on the BBTY platform (up to 3 on the Basic plan, and 5 on the Plus plan). This helps you fill slow weekday mornings with group bookings at nearby housing communities, build your brand, and create new revenue streams.",
      category: "join-us"
    },
    {
      question: "How does the waitlist work and is there any charge today?",
      answer: "Joining the waitlist is 100% free with no credit card required. It secures your priority slot. Waitlist members get early access when we launch in your area.",
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
BEAUTY BROUGHT TO YOU (BBTY) - SERVICES BROCHURE
======================================================================
🏡 Mobile Grooming & Self-Care
Website: www.beautybroughttoyou.com
Email: info@beautybroughttoyou.com
Phone: (555) BBTY-CARE (2273)
Launch hubs: Boston, Chicago, Phoenix & New York Area
----------------------------------------------------------------------

1. ABOUT US:
Beauty Brought to You (BBTY) is a mobile platform delivering licensed beauty support, gentle skincare, and grooming directly to clients at home. We serve seniors, individuals with disabilities, and anyone seeking convenient salon services within their comfort zone.

2. MOBILE HAIR SERVICES:
• Portable Wash: Comfortable scalp massage and cleansing adapted to bedsides or wheelchairs.
• Hair Trims & Cuts: Experienced styling suited to various mobility needs.
• Blowouts & Styling: Heat styling to boost confidence.

3. NAIL & CARE SERVICES:
• Gentle Manicures & Pedicures: Gentle nail filing and deep skin-hydration.
• Grooming: Clean shaves and beard trims.

4. SAFETY & QUALITY:
• Licensed & Vetted: Every professional is licensed, background checked, and trained in gentle care.
• Clean & Safe: Single-use files, sterilized tools, and clean workspaces.
• Non-Clinical: We provide cosmetic beauty services only. We do not provide medical treatments.

5. PRICING PREVIEW:
• Care Circle: $19.99/mo for priority home bookings.
• Partner Salons: Starting at $79.00/mo to register up to 3 stylists.

----------------------------------------------------------------------
SAFETY MEDICAL DISCLAIMER:
Beauty Brought to You (BBTY) is an informational mobile platform. We do not provide medical treatments, physical therapy, or medical dermatology. Stylists operate within their local cosmetic licensing guidelines.
======================================================================
© ${new Date().getFullYear()} Beauty Brought To You, LLC. All Rights Reserved.
`;
  };

  const handleCopyToClipboard = () => {
    safeCopyToClipboard(getBrochurePlaintext())
      .then((success) => {
        if (success) {
          setCopySuccess(true);
          setTimeout(() => setCopySuccess(false), 2500);
        } else {
          console.warn('Failed to copy text into clipboard (safeCopyToClipboard returned false)');
        }
      })
      .catch((err) => {
        console.warn('Failed to copy text into clipboard', err);
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
    try {
      window.print();
    } catch (e) {
      console.warn("Printing is not supported in this iframe sandbox.", e);
    }
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
            <strong className="text-amber-955 dark:text-amber-200 uppercase tracking-wide">IMPORTANT DISLAIMER:</strong> 
            <p className="text-slate-700 dark:text-slate-300 leading-normal font-sans">
              Beauty Brought to You (BBTY) and its independent stylists provide cosmetic and grooming services. We do NOT provide medical diagnostics, therapeutic treatments, or clinical therapy.
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

        {/* Security / SSL Badge */}
        <div className="mt-6 flex justify-center print:hidden">
          <button 
            onClick={onOpenSecurity}
            className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 dark:bg-emerald-500/10 hover:bg-emerald-100 dark:hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 rounded-xl border border-emerald-200 dark:border-emerald-500/20 hover:border-emerald-300 dark:hover:border-emerald-500/40 transition-all text-xs font-semibold cursor-pointer"
          >
            <ShieldCheck className="w-4 h-4" />
            Verified Secure Profile
          </button>
        </div>

        {/* Caregiver Print Resource Card */}
        <div className="mt-8 p-8 bg-white dark:bg-slate-900 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-800 text-center space-y-4 print:hidden" id="caregiver-print-toolkit">
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
          <div className="flex flex-wrap items-center justify-center gap-3.5 mt-4">
            <button
              onClick={executePrint}
              type="button"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-pink-500 via-rose-500 to-amber-500 hover:from-pink-600 hover:via-rose-600 hover:to-amber-600 text-white rounded-xl text-xs font-bold transition-all shadow-md cursor-pointer hover:scale-102 active:scale-98"
              id="download-printable-brochure-faq-btn"
            >
              🖨️ Download Printable Brochure
            </button>
            <button
              onClick={() => setIsPrintModalOpen(true)}
              type="button"
              className="inline-flex items-center gap-2 px-5 py-3 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-xl text-xs font-bold transition-all border border-slate-200 dark:border-slate-700 cursor-pointer hover:scale-102 active:scale-98"
              id="preview-offline-doc-faq-btn"
            >
              📄 Preview Offline Document
            </button>
          </div>
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
