import React, { useState } from "react";
import { 
  Shield, ArrowLeft, Mail, Phone, Lock, Eye, Trash2, 
  Database, AlertCircle, FileText, CheckCircle, Scale, Globe, UserCheck
} from "lucide-react";
import { motion } from "motion/react";

interface Props {
  onBack: () => void;
}

export default function PrivacyPolicy({ onBack }: Props) {
  const [activeSection, setActiveSection] = useState<string>("all");
  const [copiedText, setCopiedText] = useState(false);

  const handleCopyContact = () => {
    navigator.clipboard.writeText("info@beautybroughttoyou.com");
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2000);
  };

  const sections = [
    { id: "all", label: "📄 Full Document" },
    { id: "data", label: "🔒 Information We Collect" },
    { id: "firebase", label: "☁️ Firebase Cloud Sync" },
    { id: "usage", label: "⚙️ How We Use Data" },
    { id: "rights", label: "⚖️ Your Rights & Access" }
  ];

  const showsSection = (sectionId: string) => {
    return activeSection === "all" || activeSection === sectionId;
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 text-left"
    >
      {/* Visual Header / Breadcrumbs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-5 border-b border-slate-100 dark:border-slate-800/80">
        <div className="space-y-1">
          <button 
            onClick={onBack}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-pink-600 dark:text-pink-400 hover:text-pink-700 dark:hover:text-pink-300 transition-colors uppercase tracking-wider mb-2 cursor-pointer focus:outline-none"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Dashboard
          </button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-pink-100/50 dark:bg-pink-950/30 flex items-center justify-center shrink-0">
              <Shield className="w-5 h-5 text-pink-500" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif font-black text-slate-900 dark:text-white tracking-tight">
              Security & Privacy Policy
            </h1>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">
            Last Updated: June 16, 2026 • Version 1.1 (Firebase Cloud Release)
          </p>
        </div>

        {/* Back Button Secondary callout */}
        <button 
          onClick={onBack}
          className="px-4 py-2 bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold rounded-xl transition-all cursor-pointer focus:outline-none flex items-center justify-center gap-1.5 shadow-4xs self-start sm:self-center"
        >
          <ArrowLeft className="w-4 h-4" /> Back Home
        </button>
      </div>

      {/* Compliance Notice Banner */}
      <div className="bg-gradient-to-r from-pink-50/70 to-purple-50/70 dark:from-pink-950/15 dark:to-purple-950/15 border border-pink-100/60 dark:border-pink-900/10 p-4 rounded-2xl mb-8 flex items-start gap-3.5 text-left">
        <Lock className="w-5 h-5 text-pink-500 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <h4 className="text-xs font-black text-slate-905 dark:text-pink-300 uppercase tracking-widest font-mono">
            Cloud Protection Guard
          </h4>
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            Your safety and control represent our highest values. Submissions saved to the **Beauty Brought to You (BBTY) Waitlist System** are synced instantly to our secure, cloud-hosted **Firebase Firestore** database. Your records are protected against local browser cache loss, allowing you to access priority placements anytime.
          </p>
        </div>
      </div>

      {/* Navigation Filter Pills */}
      <div className="flex flex-wrap gap-2 mb-8 bg-slate-50 dark:bg-slate-900/40 p-1.5 rounded-2xl border border-slate-100 dark:border-slate-850/60">
        {sections.map((sec) => (
          <button
            key={sec.id}
            onClick={() => setActiveSection(sec.id)}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer focus:outline-none ${
              activeSection === sec.id
                ? "bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm border border-slate-200/50 dark:border-slate-700/50"
                : "text-slate-500 dark:text-slate-400 hover:text-slate-850 dark:hover:text-slate-200"
            }`}
          >
            {sec.label}
          </button>
        ))}
      </div>

      {/* Policy Content Blocks */}
      <div className="space-y-8">
        
        {/* Intro Section */}
        {showsSection("all") && (
          <div className="prose prose-slate dark:prose-invert max-w-none text-xs sm:text-sm leading-relaxed space-y-4">
            <h2 className="text-lg font-serif font-black text-slate-900 dark:text-white flex items-center gap-2">
              <Globe className="w-5 h-5 text-pink-500 shrink-0" /> 1. Commitment to Accessible & Dignified Care
            </h2>
            <p className="text-slate-600 dark:text-slate-300">
              Beauty Brought to You (BBTY), LLC ("we", "us", "our") serves as an innovative mobile coordinator. We match licensed independent hair stylists, cosmetology schools, manicure specialists, and comfort-givers to private families, fragile seniors, diabetics, and residential care facilities. 
            </p>
            <p className="text-slate-600 dark:text-slate-300">
              Because our social mission caters to individuals requiring accessibility accommodations, we enforce severe security limitations. This Policy documents exactly what information we handle, how it is written to our remote databases, and how you remain in complete authorial control.
            </p>
          </div>
        )}

        {/* Data We Collect Section */}
        {showsSection("data") && (
          <div className="prose prose-slate dark:prose-invert max-w-none text-xs sm:text-sm leading-relaxed space-y-4 pt-4 border-t border-slate-50 dark:border-slate-900">
            <h2 className="text-lg font-serif font-black text-slate-900 dark:text-white flex items-center gap-2">
              <Eye className="w-5 h-5 text-purple-500 shrink-0" /> 2. Information We Actively Collect
            </h2>
            <p className="text-slate-600 dark:text-slate-300">
              When you interact with our registration dashboard, join the waiting list queues, or request service coordination, you explicitly supply the following parameters:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-2">
              <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 space-y-2">
                <span className="text-xs font-mono font-extrabold text-pink-600 dark:text-pink-400 uppercase tracking-widest block">
                  👤 Personal Identity Specs
                </span>
                <ul className="space-y-1.5 text-xs text-slate-500 dark:text-slate-400">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-500" /> Full Name & Surname
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-500" /> Email Coordinates
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-500" /> Contact Phone Number
                  </li>
                </ul>
              </div>
              
              <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 space-y-2">
                <span className="text-xs font-mono font-extrabold text-purple-600 dark:text-purple-400 uppercase tracking-widest block">
                  ⚙️ Service Settings & Requests
                </span>
                <ul className="space-y-1.5 text-xs text-slate-500 dark:text-slate-400">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-500" /> Professional Category (e.g., Client, Independent Stylist, Facility Representative)
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-500" /> Selected Comfort-Care Categories
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-500" /> Optional Custom Notes on Accessibility
                  </li>
                </ul>
              </div>
            </div>
            
            <div className="p-4 bg-amber-500/5 dark:bg-amber-500/5 border border-amber-500/20 rounded-2xl flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <h4 className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider font-mono">
                  Crucial Medical Privacy Notice
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  We match users to general non-clinical styling support. **We do not collect nor store any formal healthcare records, medical diagnoses, medication details, or physiological histories**. Under federal and state privacy statutes, we remain structured purely as an informational mobile groom coordination platform.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Database & Firebase Section */}
        {showsSection("firebase") && (
          <div className="prose prose-slate dark:prose-invert max-w-none text-xs sm:text-sm leading-relaxed space-y-4 pt-4 border-t border-slate-50 dark:border-slate-900">
            <h2 className="text-lg font-serif font-black text-slate-900 dark:text-white flex items-center gap-2">
              <Database className="w-5 h-5 text-blue-500 shrink-0" /> 3. Secure Firebase Cloud Synchronization
            </h2>
            <p className="text-slate-600 dark:text-slate-300">
              Unlike unstable websites that lose records during browser memory clear-outs, BBTY features robust integration with **Google Firebase Cloud Services**:
            </p>
            <ul className="space-y-2 text-slate-600 dark:text-slate-300 list-disc pl-5">
              <li>
                <strong>Instant Firestore Syncing:</strong> Real-time operations record items to a sandboxed Google Cloud datastore located in regional US datacenters. Every submission updates our priority live waitlist counter automatically.
              </li>
              <li>
                <strong>Security Rules Protocol:</strong> Datastore access runs strictly via Firebase rules designed specifically for high-integrity public registration queues, preventing malicious third parties from rewriting database nodes.
              </li>
              <li>
                <strong>Offline Persistence Protection:</strong> If your network loses connectivity, queue requests cache locally in your device's browser database storage. Upon establishing a steady signal, updates push straight to the remote cloud.
              </li>
            </ul>
          </div>
        )}

        {/* Use of Data Section */}
        {showsSection("usage") && (
          <div className="prose prose-slate dark:prose-invert max-w-none text-xs sm:text-sm leading-relaxed space-y-4 pt-4 border-t border-slate-50 dark:border-slate-900">
            <h2 className="text-lg font-serif font-black text-slate-900 dark:text-white flex items-center gap-2">
              <FileText className="w-5 h-5 text-emerald-500 shrink-0" /> 4. Precise Scope of Data Usage
            </h2>
            <p className="text-slate-600 dark:text-slate-300">
              We apply waitlist entries strictly for professional coordination purposes:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-slate-50 dark:bg-slate-900/40 p-4 border border-slate-100 dark:border-slate-850 rounded-2xl text-left space-y-1.5">
                <span className="text-xs font-bold text-slate-900 dark:text-white block">Queue Arrangement</span>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  Managing waitlist order, launch hubs priority slots, and regional advocate counts.
                </p>
              </div>
              <div className="bg-slate-50 dark:bg-slate-900/40 p-4 border border-slate-100 dark:border-slate-850 rounded-2xl text-left space-y-1.5">
                <span className="text-xs font-bold text-slate-900 dark:text-white block">Regional Planning</span>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  Aggregating statistical demand figures to deploy support salons and contractors where citizens need them first.
                </p>
              </div>
              <div className="bg-slate-50 dark:bg-slate-900/40 p-4 border border-slate-100 dark:border-slate-850 rounded-2xl text-left space-y-1.5">
                <span className="text-xs font-bold text-slate-900 dark:text-white block">Safety Safeguards</span>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  Preventing spam bots, malicious flooding, and duplicate registrations on the platform queues.
                </p>
              </div>
            </div>
            <p className="text-slate-600 dark:text-slate-300 font-mono text-[11px] leading-relaxed italic bg-slate-50 dark:bg-slate-900/40 p-3 rounded-xl border border-slate-100 dark:border-slate-850">
              ⚠️ **Zero-Commercial-Selling Commitment:** We absolutely do not share, lease, sell, or rent your identity, phone number, coordinates, or caregiver category to any third-party marketing companies. 
            </p>
          </div>
        )}

        {/* Your Rights / Access Section */}
        {showsSection("rights") && (
          <div className="prose prose-slate dark:prose-invert max-w-none text-xs sm:text-sm leading-relaxed space-y-4 pt-4 border-t border-slate-50 dark:border-slate-900">
            <h2 className="text-lg font-serif font-black text-slate-900 dark:text-white flex items-center gap-2">
              <Scale className="w-5 h-5 text-amber-500 shrink-0" /> 5. Data Access Control, Erasure & Deletion
            </h2>
            <p className="text-slate-600 dark:text-slate-300">
              We respect complete data autonomy. Users maintain several concrete rights over their synchronized waitlist data points:
            </p>
            <div className="space-y-3.5">
              <div className="flex gap-3 items-start text-left">
                <div className="w-6 h-6 rounded-lg bg-pink-100/50 dark:bg-pink-950/20 text-pink-600 dark:text-pink-400 flex items-center justify-center shrink-0 mt-0.5 font-bold font-mono text-xs">
                  I
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">Inspection & Verification</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    You can confirm your queue location and registered name on our live waitlist console block at any time.
                  </p>
                </div>
              </div>

              <div className="flex gap-3 items-start text-left">
                <div className="w-6 h-6 rounded-lg bg-purple-100/50 dark:bg-purple-950/20 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0 mt-0.5 font-bold font-mono text-xs">
                  II
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">Secure Data Erasure</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    If you decide to withdraw from the waitlist, your submission details can be removed completely. On-duty administrators can run deletions directly from our secure waitlist board, removing the corresponding Document ID from Firebase permanently.
                  </p>
                </div>
              </div>

              <div className="flex gap-3 items-start text-left">
                <div className="w-6 h-6 rounded-lg bg-cyan-100/50 dark:bg-cyan-950/20 text-cyan-600 dark:text-cyan-450 flex items-center justify-center shrink-0 mt-0.5 font-bold font-mono text-xs">
                  III
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">Support desk contact</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    For manual deletion, specific corrections, or privacy consultations, directly interface with our administrative team.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* Interactive Contact & Support Section Cards */}
      <div className="mt-12 pt-8 border-t border-slate-100 dark:border-slate-800/80 text-center space-y-6">
        <h3 className="text-base sm:text-lg font-serif font-black text-slate-950 dark:text-white">
          Have Questions Regarding Our Security Protocols?
        </h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
          {/* Email Support Card */}
          <div className="bg-slate-50 dark:bg-slate-900/40 p-5 rounded-2xl border border-slate-100 dark:border-slate-850 flex flex-col items-center gap-2.5 text-center">
            <div className="w-10 h-10 rounded-xl bg-pink-100/50 dark:bg-pink-950/30 flex items-center justify-center text-pink-500">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-900 dark:text-white block uppercase tracking-wider font-mono">
                Email Admin Console
              </span>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mt-1">
                Reach our secure data desks for administrative audits.
              </p>
            </div>
            <button
              onClick={handleCopyContact}
              className="mt-2 text-xs font-bold font-mono px-3.5 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-750 text-slate-700 dark:text-slate-300 rounded-lg hover:border-pink-300 transition-all cursor-pointer focus:outline-none"
            >
              {copiedText ? "✅ Copied!" : "📋 Copy Email Address"}
            </button>
          </div>

          {/* Hotline Card */}
          <div className="bg-slate-50 dark:bg-slate-900/40 p-5 rounded-2xl border border-slate-100 dark:border-slate-850 flex flex-col items-center gap-2.5 text-center">
            <div className="w-10 h-10 rounded-xl bg-purple-100/50 dark:bg-purple-950/30 flex items-center justify-center text-brand-purple">
              <Phone className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-900 dark:text-white block uppercase tracking-wider font-mono">
                Advisory Hotline
              </span>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mt-1">
                Available Mon–Fri, 9:00 AM–5:00 PM EST for security consulting.
              </p>
            </div>
            <a
              href="tel:5552273227"
              className="mt-2 text-xs font-bold font-mono px-3.5 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-750 text-slate-700 dark:text-slate-300 rounded-lg hover:border-purple-300 transition-all text-center inline-block"
            >
              📞 Call (555) BBTY-CARE
            </a>
          </div>
        </div>

        {/* Return Button inside main page block */}
        <div className="pt-4">
          <button
            onClick={onBack}
            className="px-8 py-3 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 hover:from-pink-600 hover:via-purple-600 hover:to-blue-600 text-white rounded-xl text-xs font-extrabold uppercase tracking-widest transition-all shadow-md shadow-pink-500/15 cursor-pointer hover:scale-103 active:scale-98 focus:outline-none"
          >
            ← Return to Launch Hub
          </button>
        </div>
      </div>
    </motion.div>
  );
}
