/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, ArrowRight, ShieldCheck, Menu, X, Sun, Moon, Gift, Home, Check, CheckCircle, Heart, Star, Calendar, MessageSquare, Briefcase, ZoomIn, Contrast, Type, Volume2, VolumeX, TrendingUp, ArrowUp } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useAccessibility } from './context/AccessibilityContext';
import BrandKit from './components/BrandKit';
import WhyNeedsBrought from './components/WhyNeedsBrought';
import Facilitators from './components/Facilitators';
import PricingTiers from './components/PricingTiers';
import WaitlistForm from './components/WaitlistForm';
import FaqSection from './components/FaqSection';
import ShareWidget from './components/ShareWidget';
import ReferralProgram from './components/ReferralProgram';
import ReferFriendModal from './components/ReferFriendModal';
import BecomeAdvocateModal from './components/BecomeAdvocateModal';
import TechQualifications from './components/TechQualifications';
import ServicesCatalog from './components/ServicesCatalog';
import CoreValueGrid from './components/CoreValueGrid';
import GurleyBearSection from './components/GurleyBearSection';
import CareersAndTestimonials from './components/CareersAndTestimonials';
import PrivacyPolicy from './components/PrivacyPolicy';

// Exact premium match of the customized fuchsia-purple-blue-cyan gradient scissor, road, and house brand logo
const BrandLogoIcon = ({ className = "w-11 h-11" }: { className?: string }) => (
  <svg 
    viewBox="0 0 100 100" 
    className={className} 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <filter id="scissors-shadow" x="-30%" y="-30%" width="160%" height="160%">
        <feDropShadow dx="1.5" dy="2.5" stdDeviation="1.8" floodColor="#5c5fc5" floodOpacity="0.22" />
      </filter>
    </defs>

    {/* Circle 1: Large Light Periwinkle Background Circle (with decorative stitching like a pincushion) */}
    <circle cx="70" cy="42" r="26" fill="#e8ecfb" stroke="#a3b8f0" strokeWidth="1.5" strokeDasharray="3,3" />

    {/* Scissors Group with shadow filter for distinguished hovering appearance */}
    <g filter="url(#scissors-shadow)">
      {/* Circle 2: Left handle loop (styled like a glossy pink pinhead) */}
      <circle cx="51" cy="32" r="5" stroke="#ec4899" strokeWidth="2.2" fill="#fdf2f8" />
      
      {/* Circle 3: Right handle loop */}
      <circle cx="68" cy="21" r="5" stroke="#ec4899" strokeWidth="2.2" fill="#fdf2f8" />
      
      {/* Circle 4: Pivot screw pins of the scissors */}
      <circle cx="71.5" cy="42.5" r="1.5" fill="#ec4899" />
      
      {/* Scissor metallic parts & finger tang hook */}
      <path d="M 68.5,16 C 68,12 72,13 71.5,16.5" stroke="#ec4899" strokeWidth="1.8" strokeLinecap="round" fill="none" />
      <path d="M 52.5,36.5 L 71.5,42.5" stroke="#ec4899" strokeWidth="2.4" strokeLinecap="round" />
      <path d="M 67,25.5 L 71.5,42.5" stroke="#ec4899" strokeWidth="2.6" strokeLinecap="round" />
      
      {/* Scissors Crossing Blades (Elegant open scissor blades crossing diagonally) */}
      <path d="M 71.5,42.5 L 90,52" stroke="#ec4899" strokeWidth="2.4" strokeLinecap="round" />
      <path d="M 71.5,42.5 L 79,64" stroke="#ec4899" strokeWidth="2.4" strokeLinecap="round" />
    </g>

    {/* Hand-lettered stylized "BBTY" text overlay with high fallback support */}
    <text 
      x="7" 
      y="58" 
      fill="#5c5fc5" 
      fontSize="28" 
      fontFamily="'Georgia', 'Times New Roman', 'Playfair Display', serif"
      fontStyle="italic"
      fontWeight="bold"
      letterSpacing="-1.5"
    >
      B
    </text>
    <text 
      x="28" 
      y="56" 
      fill="#5c5fc5" 
      fontSize="28" 
      fontFamily="'Georgia', 'Times New Roman', 'Playfair Display', serif"
      fontStyle="italic"
      fontWeight="bold"
      letterSpacing="-1.5"
    >
      B
    </text>
    <text 
      x="49" 
      y="55" 
      fill="#5c5fc5" 
      fontSize="28" 
      fontFamily="'Georgia', 'Times New Roman', 'Playfair Display', serif"
      fontStyle="italic"
      fontWeight="bold"
      letterSpacing="-1.5"
    >
      T
    </text>
    <text 
      x="69" 
      y="56" 
      fill="#5c5fc5" 
      fontSize="28" 
      fontFamily="'Georgia', 'Times New Roman', 'Playfair Display', serif"
      fontStyle="italic"
      fontWeight="bold"
      letterSpacing="-1.5"
    >
      Y
    </text>


  </svg>
);

const getWaitlistSize = () => {
  const BASE_WAITLIST_NUMBER = 142;
  try {
    const stored = localStorage.getItem('bbty_waitlist_db');
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed)) {
        return BASE_WAITLIST_NUMBER + parsed.length;
      }
    }
    return BASE_WAITLIST_NUMBER + 3; // base 142 + 3 initial seed entries
  } catch (e) {
    return BASE_WAITLIST_NUMBER + 3;
  }
};

export default function App() {
  const [headline, setHeadline] = useState("Compassionate Beauty & Wellness Care, Brought To You");
  const [tagline, setTagline] = useState("Private in-home care. Professional mobile services. We bring comfort, confidence, and quality care to seniors, diabetics, disabled clients, and busy households.");
  const [activeTab, setActiveTab] = useState('clients');
  const [currentPage, setCurrentPage] = useState<'home' | 'privacy'>('home');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [referModalOpen, setReferModalOpen] = useState(false);
  const [advocateModalOpen, setAdvocateModalOpen] = useState(false);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [waitlistCount, setWaitlistCount] = useState<number>(145);
  const [prevCount, setPrevCount] = useState<number | null>(null);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    setWaitlistCount(getWaitlistSize());

    const handleWaitlistUpdate = () => {
      setWaitlistCount(getWaitlistSize());
    };

    window.addEventListener('bbty_waitlist_updated', handleWaitlistUpdate);
    window.addEventListener('storage', handleWaitlistUpdate);

    return () => {
      window.removeEventListener('bbty_waitlist_updated', handleWaitlistUpdate);
      window.removeEventListener('storage', handleWaitlistUpdate);
    };
  }, []);

  useEffect(() => {
    if (prevCount !== null && waitlistCount > prevCount) {
      const isMultipleOf50 = waitlistCount % 50 === 0;
      const isMultipleOf5 = waitlistCount % 5 === 0;

      if (isMultipleOf50) {
        // Premium Milestone Dual-Cascade Celebration
        const duration = 4.5 * 1000;
        const animationEnd = Date.now() + duration;
        const defaults = { startVelocity: 35, spread: 360, ticks: 75, zIndex: 10000 };

        const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

        const interval: any = setInterval(() => {
          const timeLeft = animationEnd - Date.now();

          if (timeLeft <= 0) {
            return clearInterval(interval);
          }

          const particleCount = 60 * (timeLeft / duration);
          confetti({ ...defaults, particleCount, colors: ['#ec4899', '#a855f7', '#3b82f6', '#10b981', '#fbbf24'], origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
          confetti({ ...defaults, particleCount, colors: ['#ec4899', '#a855f7', '#3b82f6', '#10b981', '#fbbf24'], origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
        }, 250);
      } else if (isMultipleOf5) {
        // High-end milestone interval blast
        confetti({
          particleCount: 160,
          spread: 90,
          origin: { y: 0.6 },
          colors: ['#ec4899', '#a855f7', '#3b82f6', '#10b981', '#fbbf24'],
          zIndex: 10000
        });
      } else {
        // Classic responsive signup burst
        confetti({
          particleCount: 90,
          spread: 60,
          origin: { y: 0.65 },
          colors: ['#ec4899', '#a855f7', '#3b82f6'],
          zIndex: 10000
        });
      }
    }
    setPrevCount(waitlistCount);
  }, [waitlistCount]);

  const { settings, toggleHighContrast: toggleHighContrastMode, toggleReadability: toggleReadabilityMode, toggleDarkMode } = useAccessibility();
  const isDarkMode = settings.darkMode;
  const isHighContrast = settings.highContrast;
  const isReadabilityMode = settings.readabilityMode;

  // Play Out Loud state using Speech Synthesis for interactive assistance
  const [isSpeaking, setIsSpeaking] = useState(false);

  useEffect(() => {
    // Graceful cleanup to stop reading if the user navigates away or unmounts
    return () => {
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const togglePlayOutLoud = () => {
    if (typeof window === 'undefined' || !window.speechSynthesis) {
      alert("Text to speech is not supported in this browser.");
      return;
    }

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    } else {
      window.speechSynthesis.cancel(); // Stop any pending or legacy speaking queue elements
      
      const textToRead = `Welcome to BBTY. Compassionate Beauty and Wellness Care, Brought To You. ` +
                         `${headline}. ` +
                         `${tagline}. ` +
                         `We provide premium, personalized in-home cosmetics, hairdressing, and full body wellness therapies customized to seniors, diabetic comfort needs, and disabled client care. ` +
                         `Use our accessibility panel to toggle High Contrast, adjust text Readability size, or book your private clinical styling consultation today!`;

      const utterance = new SpeechSynthesisUtterance(textToRead);
      
      // Warm, accessible, highly clear slow pacing for elderly or visually impaired users
      utterance.rate = 0.88;
      utterance.pitch = 1.0;

      utterance.onend = () => {
        setIsSpeaking(false);
      };

      utterance.onerror = (e) => {
        console.error("Speech Synthesis failure:", e);
        setIsSpeaking(false);
      };

      setIsSpeaking(true);
      window.speechSynthesis.speak(utterance);
    }
  };

  // Subtle scroll progress calculation
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight;
      const clientHeight = document.documentElement.clientHeight;
      const totalHeight = scrollHeight - clientHeight;
      if (totalHeight > 0) {
        const progress = (window.scrollY / totalHeight) * 100;
        setScrollProgress(progress);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    if (currentPage !== 'home') {
      setCurrentPage('home');
      setTimeout(() => {
        const element = document.getElementById(id);
        if (element) {
          const offset = 80; // height of sticking header
          const bodyRect = document.body.getBoundingClientRect().top;
          const elementRect = element.getBoundingClientRect().top;
          const elementPosition = elementRect - bodyRect;
          const offsetPosition = elementPosition - offset;

          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        }
      }, 50);
      return;
    }

    const element = document.getElementById(id);
    if (element) {
      const offset = 80; // height of sticking header
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  const handleTabScroll = (tabId: string) => {
    setActiveTab(tabId);
    scrollToSection('audience-explorer');
  };

  return (
    <div className="min-h-screen max-w-full overflow-x-hidden bg-transparent text-slate-800 dark:text-slate-100 font-sans selection:bg-pink-100 selection:text-pink-900 scroll-smooth antialiased transition-colors duration-200">
      
      {/* Scroll Progress Bar at the very top of the viewport */}
      <div className="fixed top-0 left-0 w-full h-[4px] bg-slate-200/20 dark:bg-slate-900/30 z-[100] pointer-events-none">
        <div 
          className="h-full bg-gradient-to-r from-pink-500 via-purple-600 to-cyan-500 transition-all duration-75 ease"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* Interactive Web Portal Content (Automatic offline printing filter) */}
      <div className="print:hidden relative min-h-screen max-w-full overflow-x-hidden">
        
        {/* Full Viewport Cosmic Luxury Watermarked Backdrop */}
        <div className="fixed inset-0 pointer-events-none z-[-1] overflow-hidden bg-gradient-to-br from-[#f263c9] via-[#a352ff] to-[#5194ff]" id="full-viewport-cosmic-backdrop">
          {/* Repeating Watermarks & Glowing Swirls resembling uploaded image */}
          <svg className="absolute inset-0 w-full h-full mix-blend-overlay opacity-35 sm:opacity-45" xmlns="http://www.w3.org/2000/svg">
            <defs>
              {/* Pattern definition for repeating logo tiles with diagonal slant */}
              <pattern id="bbty-full-grid-pattern" width="280" height="190" patternUnits="userSpaceOnUse" patternTransform="rotate(-15)">
                {/* Subtle Logo Group */}
                <g transform="translate(15, 15) scale(0.4)" stroke="currentColor" strokeWidth="2.5" fill="none" className="text-white opacity-40">
                  {/* Cozy house */}
                  <path d="M 52,53 L 72,53 L 72,70 L 52,70 Z" />
                  <path d="M 48,53 L 62,41 L 76,53" />
                  <line x1="62" y1="56" x2="62" y2="70" />
                  {/* Scissors */}
                  <circle cx="34" cy="38" r="8" />
                  <circle cx="48" cy="26" r="8" />
                  <line x1="38" y1="44" x2="62" y2="56" />
                  <line x1="44" y1="32" x2="26" y2="62" />
                </g>
                <text x="50" y="62" fill="currentColor" fontSize="16" fontFamily="sans-serif" fontWeight="900" className="text-white opacity-50 tracking-widest leading-none">BBTY</text>
                <text x="32" y="74" fill="currentColor" fontSize="6.5" fontFamily="sans-serif" fontWeight="700" className="text-white opacity-40 tracking-wider">BEAUTY BROUGHT TO YOU!</text>
                
                {/* Sub-icons Group */}
                <g transform="translate(140, 30) scale(0.32)" stroke="currentColor" strokeWidth="2.5" fill="none" className="text-white opacity-40">
                  {/* Circle 1: Hair - headphones/comb/blowout representation */}
                  <circle cx="20" cy="20" r="14" />
                  <path d="M11 20 a9 9 0 0 1 18 0 m-12 -6 a3 3 0 0 1 6 0" />
                  <text x="20" y="47" className="text-white opacity-95 text-[15px] font-sans font-bold select-none text-center" textAnchor="middle" stroke="none" fill="currentColor">Hair</text>

                  {/* Circle 2: Nails - safe-trim / hand outline representation */}
                  <circle cx="65" cy="20" r="14" />
                  <path d="M62 25 L68 25 L65 14 Z M57 18 a2 2 0 0 1 4 0" />
                  <text x="65" y="47" className="text-white opacity-95 text-[15px] font-sans font-bold select-none text-center" textAnchor="middle" stroke="none" fill="currentColor">Nails</text>

                  {/* Circle 3: Skin - moisturizer drop representation */}
                  <circle cx="110" cy="20" r="14" />
                  <path d="M110 9 Q103 18 110 27 Q117 18 110 9 Z" />
                  <text x="110" y="47" className="text-white opacity-95 text-[15px] font-sans font-bold select-none text-center" textAnchor="middle" stroke="none" fill="currentColor">Skin</text>

                  {/* Circle 4: Makeup - stylist wand representation */}
                  <circle cx="155" cy="20" r="14" />
                  <line x1="149" y1="26" x2="161" y2="14" />
                  <circle cx="161" cy="14" r="2.5" fill="currentColor" />
                  <text x="155" y="47" className="text-white opacity-95 text-[15px] font-sans font-bold select-none text-center" textAnchor="middle" stroke="none" fill="currentColor">Makeup</text>

                  {/* Circle 5: Wellness - lotus representation */}
                  <circle cx="200" cy="20" r="14" />
                  <path d="M194 24 Q200 12 201 24 Q202 12 208 24 Z" />
                  <text x="200" y="47" className="text-white opacity-95 text-[15px] font-sans font-bold select-none text-center" textAnchor="middle" stroke="none" fill="currentColor">Wellness</text>
                </g>

                {/* Tiny background twinkles / starbursts */}
                <path d="M100,120 L102,125 L107,127 L102,129 L100,134 L98,129 L93,127 L98,125 Z" fill="currentColor" className="text-white opacity-40" />
                <path d="M230,70 L231.5,74 L235.5,75.5 L231.5,77 L230,81 L228.5,77 L224.5,75.5 L228.5,74 Z" fill="currentColor" className="text-white opacity-45" />
              </pattern>
              
              {/* Soft blur filter to mimic camera bokeh glow and glowing line paths */}
              <filter id="full-glow-edge" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="8" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            {/* Seamless repeating logo sheet fill */}
            <rect width="100%" height="100%" fill="url(#bbty-full-grid-pattern)" />

            {/* Fluid swirling light beams matching the soft curved elements in background */}
            <path d="M -100,300 C 150,150 400,-100 900,-50 C 1100,-20 1300,150 1500,250" fill="none" stroke="white" strokeWidth="4" className="opacity-15" filter="url(#full-glow-edge)" />
            <path d="M -50,220 C 300,120 700,-50 1200,20 C 1400,50 1600,160 1700,290" fill="none" stroke="white" strokeWidth="2.5" className="opacity-20" />
            <path d="M 100,350 C 500,100 800,200 1200,80 Q 1400,20 1600,100" fill="none" stroke="white" strokeWidth="1.5" className="opacity-12" />
            
            {/* Star sparkle/glare decorations aligned with the design pattern */}
            <g className="text-white opacity-35">
              <circle cx="150" cy="45" r="2.5" />
              <circle cx="850" cy="120" r="3" />
              <circle cx="1150" cy="35" r="1.5" />
              <circle cx="450" cy="180" r="3.5" className="animate-pulse" />
            </g>
          </svg>

          {/* Radial mask for extra premium gradient depth and readability vignette */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.15),rgba(0,0,0,0.25))]" />
        </div>
      
      {/* ⚠️ Critical Medical Disclaimer Banner - Sticky Alert */}
      <div className="bg-amber-500 text-slate-950 px-4 py-2 text-xs font-medium text-center relative z-50 flex items-center justify-center gap-2 border-b border-amber-600/20">
        <Sparkles className="w-3.5 h-3.5 text-slate-950 flex-shrink-0" />
        <span>
          <strong>COMMUNITY INSIGHT:</strong> We represent beauty, hydration, hair styling, and comfort care. No clinical diagnoses, physical therapy or medical services are offered or promised.
        </span>
      </div>

      {/* Modern Fixed Header Navigation */}
      <header className={`sticky top-0 z-40 backdrop-blur-md transition-all duration-300 ease-in-out ${
        scrollY > 15
          ? "bg-white/98 dark:bg-slate-950/98 border-b border-pink-100/60 dark:border-slate-800/60 shadow-md md:shadow-lg lg:shadow-xl shadow-slate-200/40 dark:shadow-slate-950/70"
          : "bg-white/95 dark:bg-slate-950/95 border-b border-pink-50/40 dark:border-slate-850/20 shadow-none"
      }`}>
        <div className="w-full px-4 sm:px-6 lg:px-10">
          <div className="flex justify-between items-center h-20">
            
            {/* Branding Logo */}
            <div 
              className="flex items-center gap-3 px-3.5 py-2 bg-slate-50/80 dark:bg-slate-900/40 border border-slate-100/80 dark:border-slate-800/50 rounded-2xl hover:bg-slate-100/60 dark:hover:bg-slate-900/60 hover:border-slate-200/50 dark:hover:border-slate-800/85 transition-all duration-300 hover:shadow-xs cursor-pointer select-none" 
              onClick={() => {
                setCurrentPage('home');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            >
              <div className="w-11 h-11 flex items-center justify-center relative bg-white dark:bg-slate-950 rounded-xl p-0.5 shadow-4xs border border-slate-100/40 dark:border-slate-850/20 hover:scale-105 transition-transform duration-300 flex-shrink-0">
                <BrandLogoIcon className="w-full h-full" />
              </div>
              <div className="flex flex-col justify-center text-left">
                <div className="flex items-center gap-1.5 leading-none">
                  <span className="text-base sm:text-lg font-serif font-black tracking-wider bg-gradient-to-r from-brand-pink via-brand-purple to-brand-cyan bg-clip-text text-transparent uppercase leading-none">
                    BBTY
                  </span>
                  <span className="text-[8px] font-sans font-extrabold bg-gradient-to-r from-brand-pink to-brand-cyan text-white px-1.5 py-0.5 rounded-md uppercase tracking-widest leading-none scale-90 origin-left">
                    Mobile
                  </span>
                </div>
                <span className="text-[8.5px] sm:text-[9.5px] text-brand-purple dark:text-purple-300 uppercase tracking-[0.14em] font-sans font-black mt-1 leading-none">
                  Beauty Brought To You
                </span>
              </div>
            </div>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-1">
              <button 
                onClick={() => {
                  setCurrentPage('home');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="px-3 py-2 text-slate-600 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
              >
                Home
              </button>
              <button 
                onClick={() => scrollToSection('why-brought-section')}
                className="px-3 py-2 text-slate-600 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
              >
                Wellness Care
              </button>
              <button 
                onClick={() => scrollToSection('core-values-grid')}
                className="px-3 py-2 text-slate-600 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
              >
                Special Care
              </button>
              <button 
                onClick={() => scrollToSection('careers-testimonials')}
                className="px-3 py-2 text-slate-600 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
              >
                Events
              </button>
              <button 
                onClick={() => scrollToSection('gurley-bear-foundation')}
                className="px-3 py-2 text-slate-600 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
              >
                Foundation
              </button>
              <button 
                onClick={() => scrollToSection('careers-testimonials')}
                className="px-3 py-2 text-slate-600 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
              >
                Careers
              </button>
              <button 
                onClick={() => scrollToSection('waitlist-form-block')}
                className="px-3 py-2 text-slate-600 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
              >
                Contact
              </button>
            </nav>

            {/* Right Side Header Action */}
            <div className="hidden lg:flex items-center gap-4">
              
              {/* Premium Accessibility & Preference Control Center with Accent Border */}
              <div className="flex items-center gap-2 bg-pink-50/50 dark:bg-slate-900/60 p-1.5 rounded-2xl border-2 border-pink-100/40 dark:border-slate-800/80 shadow-[0_2px_12px_rgba(219,39,119,0.05)]" id="desktop-accessibility-suite">
                {/* 1. Theme Selector (Dark/Light) */}
                <button
                  onClick={toggleDarkMode}
                  className={`px-3.5 py-2.5 rounded-xl border transition-all duration-300 cursor-pointer flex items-center justify-center gap-1.5 ${
                    isDarkMode
                      ? "border-amber-500/40 bg-amber-500/10 text-amber-500 hover:bg-amber-500/20 shadow-xs"
                      : "border-slate-200/80 bg-white/95 text-slate-750 hover:bg-white hover:text-slate-900 hover:shadow-xs"
                  }`}
                  aria-label="Toggle Night Mode"
                  title={isDarkMode ? "Switch to Light Mode" : "Switch to Night Mode"}
                >
                  {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-500" />}
                  <span className="text-[10px] font-mono font-black tracking-wider uppercase leading-none select-none">
                    {isDarkMode ? "Light Look" : "Night Look"}
                  </span>
                </button>

                {/* 2. High Contrast Selector */}
                <button
                  onClick={toggleHighContrastMode}
                  className={`px-3.5 py-2.5 rounded-xl border transition-all duration-300 cursor-pointer flex items-center justify-center gap-1.5 ${
                    isHighContrast 
                      ? "border-pink-500 bg-pink-500/20 text-pink-600 dark:text-pink-400 font-black shadow-xs scale-[1.02]" 
                      : "border-slate-200/80 bg-white/95 text-slate-600 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-900 hover:text-slate-900 dark:hover:text-white hover:shadow-xs"
                  }`}
                  aria-label="Toggle High Contrast Mode"
                  aria-pressed={isHighContrast}
                  title={isHighContrast ? "Disable High Contrast mode" : "Enable High Contrast mode"}
                >
                  <Contrast className={`w-4 h-4 transition-transform duration-300 ${isHighContrast ? "rotate-180 text-pink-500" : "text-slate-500"}`} />
                  <span className="text-[10px] font-mono font-black tracking-wider uppercase leading-none select-none">Contrast</span>
                </button>

                {/* 3. Readability Fonts Mode */}
                <button
                  onClick={toggleReadabilityMode}
                  className={`px-3.5 py-2.5 rounded-xl border transition-all duration-300 cursor-pointer flex items-center justify-center gap-1.5 ${
                    isReadabilityMode 
                      ? "border-pink-500 bg-pink-500/20 text-pink-600 dark:text-pink-400 font-black shadow-xs scale-[1.02]" 
                      : "border-slate-200/80 bg-white/95 text-slate-600 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-900 hover:text-slate-900 dark:hover:text-white hover:shadow-xs"
                  }`}
                  aria-label="Toggle Readability Mode"
                  aria-pressed={isReadabilityMode}
                  title={isReadabilityMode ? "Disable Readability Mode" : "Enable Readability Mode"}
                >
                  <Type className={`w-4 h-4 transition-transform ${isReadabilityMode ? "scale-110 text-pink-500 animate-pulse" : "text-slate-500"}`} />
                  <span className="text-[10px] font-mono font-black tracking-wider uppercase leading-none select-none">Readability</span>
                </button>

                {/* 4. Text-to-Speech Audio */}
                <button
                  onClick={togglePlayOutLoud}
                  className={`px-3.5 py-2.5 rounded-xl border transition-all duration-300 cursor-pointer flex items-center justify-center gap-1.5 ${
                    isSpeaking 
                      ? "border-pink-500 bg-pink-500/20 text-pink-600 dark:text-pink-400 font-black shadow-xs scale-[1.02] animate-[pulse_2s_infinite]" 
                      : "border-slate-200/80 bg-white/95 text-slate-600 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-900 hover:text-slate-900 dark:hover:text-white hover:shadow-xs"
                  }`}
                  aria-label="Toggle Play Out Loud"
                  aria-pressed={isSpeaking}
                  title={isSpeaking ? "Stop read out loud" : "Play out loud"}
                >
                  {isSpeaking ? (
                    <VolumeX className="w-4 h-4 text-pink-500 animate-[bounce_1s_infinite]" />
                  ) : (
                    <Volume2 className="w-4 h-4 text-slate-500" />
                  )}
                  <span className="text-[10px] font-mono font-black tracking-wider uppercase leading-none select-none">Read Aloud</span>
                </button>
              </div>

              <button
                onClick={() => setReferModalOpen(true)}
                className="px-4.5 py-2.5 border-2 border-purple-300 dark:border-purple-800/80 hover:border-purple-500 dark:hover:border-purple-700 bg-purple-50/50 hover:bg-purple-500 hover:text-white dark:bg-purple-955/30 text-purple-700 dark:text-purple-300 rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition-all duration-300 cursor-pointer hover:scale-[1.04] active:scale-[0.96] shadow-3xs"
              >
                <Gift className="w-4 h-4 shrink-0" />
                <span>Refer a Friend</span>
              </button>
              <button
                onClick={() => scrollToSection('brand-kit-section')}
                className="px-4.5 py-2.5 border-2 border-slate-250 dark:border-slate-800 hover:border-pink-500 dark:hover:border-pink-450 text-slate-705 dark:text-slate-300 rounded-xl text-xs font-extrabold transition-all duration-300 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-900 hover:scale-[1.04] active:scale-[0.96] shadow-3xs"
              >
                🎨 View Brand Kit
              </button>
              <button
                onClick={() => scrollToSection('waitlist-form-block')}
                className="px-6 py-2.5 bg-gradient-to-r from-pink-500 via-purple-600 to-blue-600 hover:from-pink-600 hover:via-purple-700 hover:to-blue-700 text-white rounded-xl text-xs font-black uppercase tracking-widest transition-all duration-300 shadow-[0_4px_16px_rgba(219,39,119,0.25)] hover:shadow-[0_12px_28px_rgba(219,39,119,0.55)] border border-t-white/30 border-pink-400/40 hover:scale-[1.05] active:scale-[0.95] cursor-pointer"
              >
                Book Now
              </button>
            </div>

            {/* Mobile Burger Menu Icon */}
            <div className="lg:hidden flex items-center gap-2.5">
              
              {/* Premium Interactive Accessibility Control Badge For Mobile Shortcuts */}
              <div className="flex items-center gap-1.5 bg-pink-50/70 dark:bg-slate-900/60 p-1.5 rounded-2xl border border-pink-100/60 dark:border-slate-800/80 shadow-[0_1px_8px_rgba(219,39,119,0.03)]" id="mobile-accessibility-shortcuts">
                {/* Mobile quick theme click */}
                <button
                  onClick={toggleDarkMode}
                  className={`p-2 rounded-xl border focus:outline-none cursor-pointer transition-all active:scale-[0.88] ${
                    isDarkMode
                      ? "border-amber-500/30 bg-amber-500/15 text-amber-500"
                      : "border-slate-200/50 bg-white/90 text-slate-500"
                  }`}
                  aria-label="Toggle Theme"
                  title="Toggle light/dark mode"
                >
                  {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
                </button>

                {/* Mobile quick high contrast click */}
                <button
                  onClick={toggleHighContrastMode}
                  className={`p-2 rounded-xl border focus:outline-none cursor-pointer flex items-center justify-center transition-all active:scale-[0.88] ${
                    isHighContrast
                      ? "border-pink-500 bg-pink-500/15 text-pink-600 dark:text-pink-400 font-extrabold"
                      : "border-slate-200/50 bg-white/90 text-slate-500 dark:text-slate-400"
                  }`}
                  aria-label="Toggle High Contrast Mode"
                  aria-pressed={isHighContrast}
                  title={isHighContrast ? "Disable High Contrast" : "Enable High Contrast"}
                >
                  <Contrast className={`w-4 h-4 ${isHighContrast ? "rotate-180 text-pink-500" : ""}`} />
                </button>

                {/* Mobile quick readability click */}
                <button
                  onClick={toggleReadabilityMode}
                  className={`p-2 rounded-xl border focus:outline-none cursor-pointer flex items-center justify-center transition-all active:scale-[0.88] ${
                    isReadabilityMode
                      ? "border-pink-500 bg-pink-500/15 text-pink-600 dark:text-pink-400 font-extrabold"
                      : "border-slate-200/50 bg-white/90 text-slate-500 dark:text-slate-400"
                  }`}
                  aria-label="Toggle Readability Mode"
                  aria-pressed={isReadabilityMode}
                  title={isReadabilityMode ? "Disable Readability" : "Enable Readability"}
                >
                  <Type className={`w-4 h-4 ${isReadabilityMode ? "text-pink-500" : ""}`} />
                </button>

                {/* Mobile quick play out loud click */}
                <button
                  onClick={togglePlayOutLoud}
                  className={`p-2 rounded-xl border focus:outline-none cursor-pointer flex items-center justify-center transition-all active:scale-[0.88] ${
                    isSpeaking
                      ? "border-pink-500 bg-pink-500/15 text-pink-600 dark:text-pink-400 animate-pulse"
                      : "border-slate-200/50 bg-white/90 text-slate-500 dark:text-slate-400"
                  }`}
                  aria-label="Toggle Play Out Loud"
                  aria-pressed={isSpeaking}
                  title={isSpeaking ? "Stop Play Out Loud" : "Play Out Loud"}
                >
                  {isSpeaking ? (
                    <VolumeX className="w-4 h-4 text-pink-400 animate-bounce" />
                  ) : (
                    <Volume2 className="w-4 h-4" />
                  )}
                </button>
              </div>

              {/* Hamburger Button */}
              <button
                onClick={() => setMobileMenuOpen(prev => !prev)}
                type="button"
                className="p-3 bg-white/90 dark:bg-slate-900/90 border-2 border-slate-200 dark:border-slate-800 text-slate-705 dark:text-slate-300 rounded-[14px] focus:outline-none transition-all cursor-pointer active:scale-[0.92] shadow-3xs hover:border-pink-500/60 dark:hover:border-pink-500/50"
                title="Toggle menu"
              >
                {mobileMenuOpen ? <X className="w-5 h-5 font-black" /> : <Menu className="w-5 h-5 font-black" />}
              </button>
            </div>

          </div>
        </div>

        {/* Mobile Navigation Dropdown Panel */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white dark:bg-slate-950 border-b border-slate-200/60 dark:border-slate-900 px-6 sm:px-10 pt-4 pb-8 space-y-3.5 text-left shadow-xl transition-all duration-300">
            <span className="text-[10px] font-bold font-mono text-slate-400 dark:text-slate-500 uppercase tracking-widest block px-4 py-1">Audience Profiles</span>
            <button
              onClick={() => handleTabScroll('clients')}
              className="w-full text-left block px-4 py-3.5 rounded-xl text-xs font-medium text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-850 hover:bg-slate-100 dark:hover:bg-slate-850"
            >
              🏡 Clients, Caregivers & Families
            </button>
            <button
              onClick={() => handleTabScroll('facilities')}
              className="w-full text-left block px-4 py-3.5 rounded-xl text-xs font-medium text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-850 hover:bg-slate-100 dark:hover:bg-slate-850"
            >
              🏢 Senior living & Care facilities
            </button>
            <button
              onClick={() => handleTabScroll('salons')}
              className="w-full text-left block px-4 py-3.5 rounded-xl text-xs font-medium text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-850 hover:bg-slate-100 dark:hover:bg-slate-850"
            >
              💇 Salon Owners & partnerships
            </button>
            <button
              onClick={() => handleTabScroll('independent')}
              className="w-full text-left block px-4 py-3.5 rounded-xl text-xs font-medium text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-850 hover:bg-slate-100 dark:hover:bg-slate-850"
            >
              💼 Independent contractors
            </button>
            
            <div className="border-t border-slate-100 dark:border-slate-900 pt-4 flex flex-col gap-3">
              <button
                onClick={() => scrollToSection('why-brought-section')}
                className="w-full text-left block px-4 py-3 rounded-xl text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900/40"
              >
                Why Beauty Needs to Be Brought
              </button>
              <button
                onClick={() => scrollToSection('membership-tiers')}
                className="w-full text-left block px-4 py-3 rounded-xl text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900/40"
              >
                Subscription Tiers
              </button>
              <button
                onClick={() => scrollToSection('faq-section')}
                className="w-full text-left block px-4 py-3 rounded-xl text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900/40"
              >
                Frequently Asked FAQs
              </button>
              
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setReferModalOpen(true);
                }}
                className="w-full text-center flex items-center justify-center gap-2 px-4 py-3.5 bg-purple-500/10 dark:bg-purple-500/15 border border-purple-250 dark:border-purple-900 rounded-xl text-xs font-bold text-purple-800 dark:text-purple-300 hover:bg-purple-150/80 dark:hover:bg-purple-900/30"
              >
                <Gift className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                <span>Refer a Friend Ambassador</span>
              </button>

              <div className="grid grid-cols-2 gap-3 pt-3">
                <button
                  onClick={() => scrollToSection('brand-kit-section')}
                  className="px-4 py-3 text-center border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-900"
                >
                  🎨 Brand Kit Tool
                </button>
                <button
                  onClick={() => scrollToSection('waitlist-form-block')}
                  className="px-4 py-3 text-center bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 hover:from-pink-600 hover:via-purple-600 hover:to-blue-600 text-white rounded-xl text-xs font-bold uppercase tracking-wider"
                >
                  Join Waitlist
                </button>
              </div>

              {/* COMPREHENSIVE DETAILED ACCESSIBILITY PANEL INSIDE MOBILE MODAL */}
              <div className="border-t border-slate-100 dark:border-slate-900 pt-5 mt-2.5 space-y-3" id="mobile-dropdown-accessibility-hub">
                <span className="text-[10px] font-black font-mono text-slate-400 dark:text-slate-500 uppercase tracking-widest block px-4 py-1">
                  ♿ Accessibility Assistance
                </span>

                {/* 1. Theme Selector */}
                <button
                  onClick={toggleDarkMode}
                  className="flex items-center justify-between w-full px-4.5 py-4 bg-slate-50/80 dark:bg-slate-900/60 border border-slate-150 dark:border-slate-850 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-205 transition-colors hover:bg-slate-100 dark:hover:bg-slate-850 cursor-pointer"
                >
                  <span className="flex items-center gap-2.5 font-sans text-xs">
                    {isDarkMode ? <Sun className="w-4.5 h-4.5 text-amber-500" /> : <Moon className="w-4.5 h-4.5 text-slate-450 dark:text-slate-500" />}
                    <span>Theme: {isDarkMode ? 'Light Look' : 'Night Mode'}</span>
                  </span>
                  <span className="text-[10px] font-mono font-black text-pink-500 uppercase tracking-wider">
                    {isDarkMode ? 'Night Active' : 'Light Active'}
                  </span>
                </button>

                {/* 2. High Contrast Control */}
                <button
                  onClick={toggleHighContrastMode}
                  className={`flex items-center justify-between w-full px-4.5 py-4 border rounded-xl text-xs font-bold transition-all duration-300 cursor-pointer ${
                    isHighContrast
                      ? "bg-pink-500/10 border-pink-500 text-pink-600 dark:text-pink-400"
                      : "bg-slate-50/80 dark:bg-slate-900/60 border-slate-150 dark:border-slate-850 text-slate-700 dark:text-slate-205 hover:bg-slate-100 dark:hover:bg-slate-850"
                  }`}
                >
                  <span className="flex items-center gap-2.5 font-sans text-xs">
                    <Contrast className={`w-4.5 h-4.5 ${isHighContrast ? "rotate-180 text-pink-500" : "text-slate-450 dark:text-slate-500"}`} />
                    <span>High Contrast Visuals</span>
                  </span>
                  <span className={`text-[10px] font-mono font-black uppercase tracking-wider ${isHighContrast ? "text-pink-500" : "text-slate-400"}`}>
                    {isHighContrast ? 'Activated' : 'Off'}
                  </span>
                </button>

                {/* 3. Readability Fonts Mode */}
                <button
                  onClick={toggleReadabilityMode}
                  className={`flex items-center justify-between w-full px-4.5 py-4 border rounded-xl text-xs font-bold transition-all duration-300 cursor-pointer ${
                    isReadabilityMode
                      ? "bg-pink-500/10 border-pink-500 text-pink-600 dark:text-pink-400"
                      : "bg-slate-50/80 dark:bg-slate-900/60 border-slate-150 dark:border-slate-850 text-slate-700 dark:text-slate-205 hover:bg-slate-100 dark:hover:bg-slate-850"
                  }`}
                >
                  <span className="flex items-center gap-2.5 font-sans text-xs">
                    <Type className={`w-4.5 h-4.5 ${isReadabilityMode ? "text-pink-500 animate-pulse" : "text-slate-450 dark:text-slate-500"}`} />
                    <span>Dyslexic Font Sizing</span>
                  </span>
                  <span className={`text-[10px] font-mono font-black uppercase tracking-wider ${isReadabilityMode ? "text-pink-500" : "text-slate-400"}`}>
                    {isReadabilityMode ? 'Extended' : 'Normal'}
                  </span>
                </button>

                {/* 4. Play Out Loud Audio Reading */}
                <button
                  onClick={togglePlayOutLoud}
                  className={`flex items-center justify-between w-full px-4.5 py-4 border rounded-xl text-xs font-bold transition-all duration-300 cursor-pointer ${
                    isSpeaking
                      ? "bg-pink-500/10 border-pink-500 text-pink-600 dark:text-pink-400 animate-pulse"
                      : "bg-slate-50/80 dark:bg-slate-900/60 border-slate-150 dark:border-slate-850 text-slate-700 dark:text-slate-205 hover:bg-slate-100 dark:hover:bg-slate-850"
                  }`}
                >
                  <span className="flex items-center gap-2.5 font-sans text-xs text-left">
                    {isSpeaking ? (
                      <VolumeX className="w-4.5 h-4.5 text-pink-500 animate-bounce" />
                    ) : (
                      <Volume2 className="w-4.5 h-4.5 text-slate-450 dark:text-slate-500" />
                    )}
                    <span>Read Aloud Out Loud</span>
                  </span>
                  <span className={`text-[10px] font-mono font-black uppercase tracking-wider ${isSpeaking ? "text-pink-500" : "text-slate-400"}`}>
                    {isSpeaking ? 'Speaking' : 'Muted'}
                  </span>
                </button>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Main Container Core */}
      {currentPage === 'home' ? (
        <main>
        
        {/* Elegant Hero Section with dynamic properties */}
        <section className="relative pt-10 pb-20 md:py-28 bg-transparent overflow-hidden border-b border-white/5 text-left">
          {/* Circular abstract backgrounds */}
          <div className="absolute top-1/4 -left-20 w-72 h-72 bg-pink-200/20 dark:bg-pink-900/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 -right-12 w-96 h-96 bg-amber-200/20 dark:bg-amber-900/5 rounded-full blur-3xl"></div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 md:gap-8 lg:gap-12 items-center">
              
              {/* Left Column: Bold Copy & Actions - Col Span 7 */}
              <div className="md:col-span-1 lg:col-span-7 space-y-6">
                
                {/* App Announcement Badging */}
                <div className="inline-flex items-center gap-2.5 px-4 py-2 bg-pink-100/60 dark:bg-pink-950/30 rounded-full text-pink-700 dark:text-pink-300 text-xs font-bold border border-pink-200/30 dark:border-pink-900/10 animate-fade-in shadow-xs">
                  <span className="flex h-2.5 w-2.5 rounded-full bg-pink-500 animate-pulse"></span>
                  <span className="font-mono uppercase tracking-wider">Coming Soon to Your Region</span>
                  <span className="text-pink-400 font-mono">|</span>
                  <span>Waitlist Priority Active</span>
                </div>

                {/* Display Headline */}
                <motion.h1 
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1, ease: [0.21, 0.45, 0.15, 1.0] }}
                  className="text-3xl sm:text-4xl md:text-4xl lg:text-5xl xl:text-6xl font-serif text-slate-900 dark:text-white font-black tracking-tight leading-[1.08] select-all"
                >
                  {headline}
                </motion.h1>

                {/* Description Tagline */}
                <motion.p 
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2, ease: [0.21, 0.45, 0.15, 1.0] }}
                  className="text-slate-600 dark:text-slate-350 text-sm md:text-base lg:text-lg font-normal leading-relaxed max-w-2xl"
                >
                  {tagline}
                </motion.p>

                {/* Real-time Waitlist Counter Chip */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.25 }}
                  className="p-5 bg-slate-950/85 dark:bg-slate-950/95 border border-purple-500/30 rounded-3xl flex flex-col gap-3.5 max-w-sm sm:max-w-md shadow-2xl backdrop-blur-md relative overflow-hidden text-left"
                >
                  {/* Subtle Background Glow behind the chart */}
                  <div className="absolute right-0 bottom-0 w-32 h-20 bg-purple-500/10 dark:bg-purple-500/5 rounded-full blur-2xl pointer-events-none" />

                  {/* Row 1: Badges Row */}
                  <div className="flex items-center justify-between gap-2 border-b border-slate-800/50 pb-2.5">
                    <div className="flex items-center gap-2">
                      <div className="relative flex h-2.5 w-2.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                      </div>
                      <span className="text-[11px] font-mono font-extrabold text-emerald-400 tracking-wider uppercase">Live Activity</span>
                    </div>

                    {/* Growth Velocity Indicator Pill */}
                    <div className="flex items-center gap-1.5 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20 shadow-sm">
                      <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-[10px] font-mono font-black text-emerald-400 tracking-wide">+5 signups today</span>
                    </div>
                  </div>

                  {/* Row 2: Statistics & Chart block */}
                  <div className="flex items-center justify-between gap-4 py-0.5">
                    <div className="flex items-center gap-2.5 font-sans">
                      <div className="flex flex-col">
                        <div className="flex items-baseline gap-1.5">
                          <AnimatePresence mode="popLayout">
                            <motion.span
                              key={waitlistCount}
                              initial={{ opacity: 0, y: -10, scale: 0.8 }}
                              animate={{ opacity: 1, y: 0, scale: 1 }}
                              exit={{ opacity: 0, y: 10, scale: 0.8 }}
                              transition={{ type: "spring", stiffness: 300, damping: 20 }}
                              className="text-3xl font-black font-mono text-white tracking-tight inline-block"
                            >
                              {waitlistCount}
                            </motion.span>
                          </AnimatePresence>
                        </div>
                        <span className="text-xs font-semibold text-slate-350">registered on waitlist</span>
                      </div>
                    </div>

                    {/* Subtle Upward-Trending Chart Animation */}
                    <div className="w-24 h-10 flex items-center justify-center relative bg-slate-900/40 px-2 py-1 rounded-xl border border-slate-800/30">
                      <svg viewBox="0 0 100 40" className="w-full h-full overflow-visible">
                        <defs>
                          <linearGradient id="sparkline-gradient" x1="0" y1="1" x2="1" y2="0">
                            <stop offset="0%" stopColor="#ec4899" />
                            <stop offset="50%" stopColor="#a855f7" />
                            <stop offset="100%" stopColor="#3b82f6" />
                          </linearGradient>
                          <linearGradient id="sparkline-fill" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#a855f7" stopOpacity="0.2" />
                            <stop offset="100%" stopColor="#a855f7" stopOpacity="0" />
                          </linearGradient>
                        </defs>
                        {/* Shaded Area Below Line */}
                        <motion.path
                          d="M 5,35 Q 25,31 42,24 T 75,11 T 95,4 L 95,40 L 5,40 Z"
                          fill="url(#sparkline-fill)"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 1 }}
                        />
                        {/* Animated Line */}
                        <motion.path
                          d="M 5,35 Q 25,31 42,24 T 75,11 T 95,4"
                          fill="none"
                          stroke="url(#sparkline-gradient)"
                          strokeWidth="3"
                          strokeLinecap="round"
                          initial={{ pathLength: 0 }}
                          animate={{ pathLength: 1 }}
                          transition={{ duration: 1.8, ease: "easeOut" }}
                        />
                        {/* Pulsing Target Node */}
                        <motion.circle
                          cx="95"
                          cy="4"
                          r="3"
                          fill="#3b82f6"
                          initial={{ scale: 0.5, opacity: 0 }}
                          animate={{ scale: [0.8, 1.4, 0.8], opacity: [0.6, 1, 0.6] }}
                          transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                        />
                      </svg>
                    </div>
                  </div>

                  {/* Row 3: Next Slot & Milestone Marker */}
                  <div className="flex items-center justify-between gap-2 border-t border-slate-800/30 pt-2.5">
                    <span className="text-[10px] text-purple-300 font-mono font-extrabold tracking-wide uppercase">
                      🚀 Next Slot: #{waitlistCount + 1}
                    </span>
                    <span className="text-[9px] text-slate-500 font-mono uppercase tracking-wider">
                      Milestone: {Math.ceil((waitlistCount + 1) / 50) * 50} 🎯
                    </span>
                  </div>
                </motion.div>

                {/* Core Action Callouts */}
                <motion.div 
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3, ease: [0.21, 0.45, 0.15, 1.0] }}
                  className="pt-2 flex flex-wrap gap-4"
                >
                  <button
                    onClick={() => scrollToSection('waitlist-form-block')}
                    className="inline-flex items-center justify-center gap-2.5 px-8 py-4 bg-gradient-to-r from-pink-500 via-purple-600 to-blue-650 text-white font-extrabold rounded-2xl text-base transition-all duration-300 shadow-[0_4px_25px_rgba(219,39,119,0.3)] hover:shadow-[0_12px_35px_rgba(219,39,119,0.55)] border border-white/20 hover:border-white/40 group cursor-pointer hover:scale-[1.04] active:scale-[0.96] tracking-wide"
                    id="hero-primary-cta"
                  >
                    <span>Book Your Appointment</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform text-white/90" />
                  </button>
                  
                  <button
                    onClick={() => scrollToSection('services-catalog')}
                    className="px-8 py-4 bg-white/90 dark:bg-slate-900/90 hover:bg-white dark:hover:bg-slate-800 text-slate-800 dark:text-slate-100 font-extrabold rounded-2xl text-base border-2 border-slate-800/85 dark:border-slate-400/80 hover:border-pink-500 dark:hover:border-pink-400 transition-all duration-300 cursor-pointer shadow-md hover:shadow-lg hover:scale-[1.04] active:scale-[0.96]"
                    id="hero-secondary-cta"
                  >
                    Explore Services
                  </button>
                </motion.div>

                {/* 4 Brand Quick Badges matching UI layout */}
                <div className="pt-6 grid grid-cols-2 gap-3 max-w-lg">
                  {[
                    { label: "Trusted & Professional", d: "Licensed & Insured", icon: "🛡️" },
                    { label: "Compassionate Care", d: "You're in Caring Hands", icon: "💖" },
                    { label: "We Come to You", d: "Comfort of Home", icon: "🏡" },
                    { label: "Personalized Support", d: "Every Client Matters", icon: "✨" }
                  ].map((badge, idx) => (
                    <div key={idx} className="p-3 bg-white/70 dark:bg-[#0e1423]/70 border border-slate-200/50 dark:border-slate-800/80 rounded-2xl flex items-center gap-2.5">
                      <span className="text-xl shrink-0">{badge.icon}</span>
                      <div className="text-left">
                        <span className="text-xs font-bold text-slate-800 dark:text-slate-100 block">{badge.label}</span>
                        <span className="text-[10px] text-slate-500 dark:text-slate-400 block font-mono">{badge.d}</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Brand Strat Alert helper */}
                <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-2 font-mono italic">
                  💡 DESIGNER TOOLKIT ENABLED: Scroll down to the Brand Identity section to test custom headlines in real-time!
                </p>

              </div>

              {/* Right Column: Creative Layout Mask with Floating Card - Col Span 5 */}
              <div className="md:col-span-1 lg:col-span-5 flex justify-center relative mt-12 md:mt-0">
                
                {/* Image Frame Container */}
                <div 
                  id="hero-image-lightbox-trigger"
                  onClick={() => setIsLightboxOpen(true)}
                  className="relative rounded-[36px] overflow-hidden shadow-2xl border-4 border-white/90 dark:border-[#0e1423]/90 aspect-[4/5] w-full max-w-md group cursor-zoom-in transition-all duration-300 hover:scale-[1.01]"
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-950/20 to-transparent z-10" />
                  
                  {/* Click to Enlarge Overlay Indicator */}
                  <div className="absolute top-4 right-4 bg-slate-955/80 backdrop-blur-md text-white text-[10px] font-mono py-1 px-2.5 rounded-full z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center gap-1.5 border border-white/10 shadow-lg">
                    <ZoomIn className="w-3 h-3 text-pink-300 animate-pulse" />
                    <span>View Detail</span>
                  </div>

                  {/* Public placeholder styled photo as fallback */}
                  <img 
                    src="https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&h=1000&q=80"
                    alt="Professional beauty and wellness stylist smiling warmly with client in bright sunny setting"
                    className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-700"
                    referrerPolicy="no-referrer"
                  />
                  
                  {/* Soft caption overlay */}
                  <div className="absolute bottom-6 left-6 right-6 z-20 space-y-0.5">
                    <span className="text-[10px] font-mono tracking-widest font-black text-pink-300 uppercase">Click to Inspect Detail</span>
                    <h4 className="text-sm font-serif font-bold text-white leading-tight">Dignified, professional styling delivered directly inside residency comfort zones.</h4>
                  </div>
                </div>

                {/* Floating Card: Available 7 Days a Week */}
                <div className="absolute -bottom-6 -left-4 md:-left-8 bg-white dark:bg-[#0c1221] border border-slate-205 dark:border-slate-800 p-4 rounded-3xl shadow-xl w-60 text-left space-y-2.5 animate-bounce-slow">
                  <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-850 pb-2">
                    <span className="text-base">📅</span>
                    <div>
                      <strong className="text-xs text-slate-900 dark:text-white block">Available 7 Days a Week</strong>
                      <span className="text-[9px] font-mono font-bold text-emerald-500 uppercase flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block animate-ping"></span>
                        Active Dispatch
                      </span>
                    </div>
                  </div>

                  <ul className="space-y-1.5 pt-0.5">
                    {[
                      "In-Home Care",
                      "Mobile Professionals",
                      "Specialized Support",
                      "Group & Events"
                    ].map((feat, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300">
                        <Check className="w-3.5 h-3.5 text-pink-500 shrink-0" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

              </div>

            </div>

            {/* Heartfelt About BBTY Pitch Segment */}
            <div className="mt-28 pt-12 border-t border-slate-200/50 dark:border-slate-900 max-w-4xl mx-auto text-left gap-8 grid grid-cols-1 md:grid-cols-2 items-center" id="about-us-block">
              <div className="space-y-4">
                <span className="text-xs font-extrabold font-mono text-purple-700 dark:text-purple-300 uppercase tracking-widest pl-1">
                  Our Identity
                </span>
                <h2 className="text-2xl md:text-3xl font-serif text-slate-950 dark:text-white font-extrabold tracking-tight">
                  Who is Beauty Brought to You?
                </h2>
                <p className="text-slate-800 dark:text-slate-100 text-sm md:text-base leading-relaxed font-semibold">
                  Beauty Brought to You (BBTY) is more than just a convenience. We are a dedicated <strong>mobile beauty and wellness-care platform</strong> delivering professional grooming and restorative styling directly to clients in their comfort zones. 
                </p>
                <p className="text-slate-800 dark:text-slate-100 text-sm md:text-base leading-relaxed font-semibold">
                  We serve seniors, diabetics, people with lifelong physical disabilities, individuals experiencing severe mobility setbacks, memory care residents, and general busy households who deserve respectful pampering right at home.
                </p>
              </div>

              {/* Graphic stats boxes */}
              <div className="bg-gradient-to-br from-pink-50 to-amber-50/45 dark:from-pink-950/20 dark:to-amber-950/10 rounded-3xl p-6 border border-pink-100/50 dark:border-pink-900/10 space-y-4 shadow-sm">
                <h3 className="font-serif font-semibold text-slate-950 dark:text-white text-base">Key Pillars of Dignified Care</h3>
                
                <div className="space-y-3 font-sans text-xs">
                  <div className="flex gap-2.5 items-start">
                    <span className="text-lg">♿</span>
                    <div className="text-slate-600 dark:text-slate-300">
                      <strong className="text-slate-800 dark:text-slate-200">Accessibility First:</strong> Traditional salons often contain entries with steps, tight wash bowls, and high chairs. BBTY brings the entire beauty lounge into the safety of your living couch.
                    </div>
                  </div>
                  <div className="flex gap-2.5 items-start">
                    <span className="text-lg">🌿</span>
                    <div className="text-slate-600 dark:text-slate-300">
                      <strong className="text-slate-800 dark:text-slate-200">Wellness-Aware Care:</strong> Our partners are vetted independent professionals trained to operate respectfully with fragile hand joints, dementia triggers, and customized spacing.
                    </div>
                  </div>
                  <div className="flex gap-2.5 items-start">
                    <span className="text-lg">✨</span>
                    <div className="text-slate-600 dark:text-slate-300">
                      <strong className="text-slate-800 dark:text-slate-200">Convenience and Joy:</strong> From quick fixes like repairing a painful broken acrylic nail on a lunch break, to regular monthly shampoo settings for seniors, we preserve quality of life.
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* 4-Card Proposition Grid representing Specialized Care, Who We Serve, Services and Occasions */}
        <CoreValueGrid 
          onLearnMore={(sec) => scrollToSection(sec === 'services-catalog' ? 'services-catalog' : 'audience-explorer')} 
          onPlanEvent={() => scrollToSection('careers-testimonials')} 
        />

        {/* Subtle, full-width horizontal divider with a soft gradient effect */}
        <div className="w-full h-px bg-gradient-to-r from-transparent via-pink-400/20 via-purple-400/20 via-blue-400/10 to-transparent dark:via-pink-500/10 dark:via-purple-500/10 dark:via-blue-500/5" />

        {/* 1. Why traditional salons fail mobile clients vs how BBTY solves it */}
        <WhyNeedsBrought />

        {/* Specialized Training, Safety Standards & Professional Qualifications of our Technicians */}
        <TechQualifications />

        {/* Detailed services catalog with haircuts, blowouts, gentle manicures/pedicures, makeup, and custom profile planner */}
        <ServicesCatalog />

        {/* 2. Group Personas Selector (Clients, Facilities, Salons, Independent Contractors, Graduates) */}
        <div className="bg-transparent transition-colors">
          <Facilitators 
            activeTab={activeTab} 
            setActiveTab={setActiveTab} 
            onJoinWaitlistClick={() => scrollToSection('waitlist-form-block')}
          />
        </div>

        {/* Supporting Community Wellness with the Gurley Bear Foundation */}
        <GurleyBearSection onLearnMore={() => scrollToSection('waitlist-form-block')} />

        {/* Dedicated Social Media Sharing Center for Caregivers & Allies */}
        <ShareWidget onOpenReferral={() => setReferModalOpen(true)} />

        {/* Detailed Referral Program Outline */}
        <ReferralProgram />

        {/* 3. Subscription Pricing projection lists */}
        <PricingTiers onJoinWaitlistClick={() => {
          scrollToSection('waitlist-form-block');
        }} />

        {/* 4. Careers for New Professionals & Client Testimonials Slider */}
        <CareersAndTestimonials onJoinTeam={() => scrollToSection('waitlist-form-block')} />

        {/* 4. Strategic brand copywriter tool (Interactive selection panel) */}
        <section className="py-20 bg-slate-50 dark:bg-slate-900/30 border-y border-slate-105 dark:border-slate-850 transition-colors">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-10">
              <span className="text-xs font-semibold text-pink-600 dark:text-pink-300 uppercase tracking-widest font-mono bg-pink-50 dark:bg-pink-950/30 px-3 py-1 rounded-full">
                Interactive Planners
              </span>
              <h2 className="text-3xl md:text-5xl font-serif text-slate-950 dark:text-white font-medium tracking-tight mt-3">
                Live Brand Identity Tool
              </h2>
              <p className="text-slate-600 dark:text-slate-300 mt-4 text-sm md:text-base leading-relaxed">
                As a designated brand developer, we included a mechanical toolkit. Select a headline and tagline below to instantly synchronize, adjust, and evaluate their aesthetic placement inside our main hero section!
              </p>
            </div>

            <BrandKit 
              onSelectHeadline={setHeadline}
              onSelectTagline={setTagline}
              currentHeadline={headline}
              currentTagline={tagline}
            />
          </div>
        </section>

        {/* 5. Safe Interactive Waitlist signup + live database simulator */}
        <WaitlistForm />

        {/* 7. Fully Expandable accordion FAQ system with real-time text-search query */}
        <FaqSection />

        {/* Final call to action banners */}
        <section className="bg-gradient-to-tr from-pink-500 via-purple-600 to-cyan-500 text-white py-20 relative overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-white/5 rounded-full blur-3xl"></div>
          
          <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-6 relative z-10">
            <span className="text-xs font-mono uppercase font-bold tracking-widest bg-white/20 px-3 py-1 rounded-full text-white border border-white/10">
              Dignified Self-Care
            </span>
            <h2 className="text-3xl md:text-5.5xl font-serif font-black tracking-tight leading-tight">
              Self-grooming and respect are not luxuries. They are fundamental rights of living.
            </h2>
            <p className="text-pink-100 text-base md:text-lg max-w-2xl mx-auto leading-relaxed font-sans">
              Help us deliver comfort, confidence, beauty, and emotional companionship directly to seniors, disabled populations, and hardworking household members inside their safe spaces. Secure your waitlist slot today in just 60 seconds.
            </p>

            <div className="pt-6 flex flex-wrap justify-center gap-4">
              <button
                onClick={() => scrollToSection('waitlist-form-block')}
                className="px-8 py-4 bg-white hover:bg-slate-50 text-pink-600 font-semibold rounded-xl text-sm transition-all shadow-md cursor-pointer"
              >
                Join Waitlist Now (Priority Slot)
              </button>
              <button
                onClick={() => scrollToSection('faq-section')}
                className="px-6 py-4 bg-white/10 hover:bg-white/20 border border-white/25 text-white font-medium rounded-xl text-sm transition-colors cursor-pointer"
              >
                Read safety protocols
              </button>
            </div>
          </div>
        </section>

      </main>
      ) : (
        <PrivacyPolicy onBack={() => {
          setCurrentPage('home');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }} />
      )}

      {/* Fully Informational Heartfelt Footer */}
      <footer className="bg-slate-950 text-slate-400 py-16 border-t border-slate-900 text-xs md:text-sm text-left">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-12">
            
            {/* Branding col */}
            <div className="md:col-span-4 space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 flex items-center justify-center relative">
                  <BrandLogoIcon className="w-9 h-9" />
                </div>
                <span className="text-sm font-serif font-bold bg-gradient-to-r from-brand-pink via-brand-purple to-brand-cyan bg-clip-text text-transparent tracking-tight uppercase">
                  Beauty Brought to You (BBTY)
                </span>
              </div>
              <p className="text-slate-500 text-xs leading-relaxed max-w-xs">
                A community-backed mobilised beauty service delivering professional, safe hair care, podiatric filing, skin moisturizing, and makeup setups directly into safe spaces of residency.
              </p>
              <div className="text-slate-500 font-mono text-[11px] space-y-1">
                <p className="flex items-center gap-1">📨 info@beautybroughttoyou.com • (555) BBTY-CARE</p>
                <p>📍 Establishing Vetted Launch Hubs: Boston, Chicago, Phoenix & New York Area</p>
              </div>
            </div>

            {/* Navigation links cols */}
            <div className="md:col-span-2 space-y-3">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">Platform Pathways</h4>
              <ul className="space-y-2 text-xs">
                <li><button onClick={() => handleTabScroll('clients')} className="hover:text-white transition-colors cursor-pointer text-left focus:outline-none">🏡 For Private Families</button></li>
                <li><button onClick={() => handleTabScroll('facilities')} className="hover:text-white transition-colors cursor-pointer text-left focus:outline-none">🏢 For Senior Care Facilities</button></li>
                <li><button onClick={() => handleTabScroll('salons')} className="hover:text-white transition-colors cursor-pointer text-left focus:outline-none">💇 For Salon Partners</button></li>
                <li><button onClick={() => handleTabScroll('independent')} className="hover:text-white transition-colors cursor-pointer text-left focus:outline-none">💼 Independent Contractors</button></li>
                <li><button onClick={() => handleTabScroll('graduates')} className="hover:text-white transition-colors cursor-pointer text-left focus:outline-none">🎓 Cosmetology School Grads</button></li>
              </ul>
            </div>

            <div className="md:col-span-2 space-y-3">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">Company Details</h4>
              <ul className="space-y-2 text-xs">
                <li><button onClick={() => scrollToSection('why-brought-section')} className="hover:text-white transition-colors cursor-pointer text-left focus:outline-none">About Core Social Mission</button></li>
                <li><button onClick={() => scrollToSection('membership-tiers')} className="hover:text-white transition-colors cursor-pointer text-left focus:outline-none">Predicted Launch Costs</button></li>
                <li><button onClick={() => scrollToSection('faq-section')} className="hover:text-white transition-colors cursor-pointer text-left focus:outline-none">Sanitization & Safety FAQs</button></li>
                <li><button onClick={() => scrollToSection('brand-kit-section')} className="hover:text-white transition-colors cursor-pointer text-left focus:outline-none">View Asset Brand Kit</button></li>
                <li><button onClick={() => setAdvocateModalOpen(true)} className="text-pink-400 hover:text-pink-300 font-bold transition-colors cursor-pointer text-left focus:outline-none">📢 Become a Local Advocate</button></li>
                <li><button onClick={() => window.print()} className="text-rose-300 hover:text-white font-medium transition-colors cursor-pointer text-left focus:outline-none">🖨️ Print Offline Brochure</button></li>
              </ul>
            </div>

            {/* Contact Newsletter info */}
            <div className="md:col-span-4 space-y-3">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">Vetting Advisory Status</h4>
              <p className="text-slate-500 text-xs leading-relaxed">
                BBTY continues to recruit licensed independent contractors, state cosmetology advisers, and geriatric accessibility experts. Feel free to contact our administrative desk for advisory, sponsorship, or pilot partner relations.
              </p>
              
              <div className="pt-2 flex flex-wrap gap-2">
                <button
                  onClick={() => scrollToSection('waitlist-form-block')}
                  className="px-4 py-2 bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-xl text-xs font-semibold text-rose-300 leading-none transition-all cursor-pointer"
                >
                  Join Vetting Queue Online
                </button>
                <button
                  onClick={() => setAdvocateModalOpen(true)}
                  className="px-4 py-2 bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 text-white rounded-xl text-xs font-bold leading-none transition-all cursor-pointer shadow-md flex items-center gap-1 hover:scale-105 active:scale-95"
                  id="advocate-footer-trigger-btn"
                >
                  📢 Become a Local Advocate
                </button>
              </div>
            </div>

          </div>

          {/* Legal Fine Print - Safety disclaimer */}
          <div className="pt-8 border-t border-slate-900 text-[10px] text-slate-600 space-y-2 leading-relaxed">
            <p>
              <strong>IMPORTANT EXPLICIT DISCLAIMER:</strong> Beauty Brought to You (BBTY) is an informational mobile beauty applet startup. No medical treatments, chemical cures for chronic podiatry issues, dermatology therapeutic surgical intervention, or home physical-needs assistance are executed of any kind. Stylists and manicurists operating under independent subscription paths or employee listings work strictly within standard licensing laws regarding grooming, hair cuts, basic cosmetic care, and general physical comfort-massages of safe extremities.
            </p>
            <div className="flex flex-wrap items-center gap-3.5 text-slate-500 font-mono mt-2">
              <span>© {new Date().getFullYear()} Beauty Brought To You, LLC. All rights or trademarks reserved.</span>
              <span className="text-slate-800">•</span>
              <button 
                onClick={() => {
                  setCurrentPage('privacy');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="hover:text-pink-400 font-bold transition-colors cursor-pointer text-left focus:outline-none flex items-center gap-1"
              >
                🔒 Security & Privacy Policy
              </button>
              <span className="text-slate-800">•</span>
              <span>Custom brand positioning prepared securely inside the AI Studio Launch ecosystem.</span>
            </div>
          </div>



        </div>
      </footer>
      </div>

      {/* Pristine Offline Printable Brochure Section (Only visible when printing) */}
      <div className="hidden print:block bg-white text-stone-900 p-10 max-w-4xl mx-auto font-serif text-sm leading-relaxed" id="offline-print-brochure">
        
        {/* Sleek Header styled like professional stationery */}
        <div className="border-b-2 border-[#7A8D76] pb-6 mb-8 text-center space-y-2">
          <div className="flex items-center justify-center gap-3 animate-fade-in">
            <div className="w-12 h-12 bg-[#7A8D76] text-white rounded-2xl flex items-center justify-center font-serif font-black text-2xl shadow-sm">
              B
            </div>
            <div className="text-left">
              <h1 className="text-2xl font-black uppercase text-slate-900 tracking-tight leading-none">
                Beauty Brought to You (BBTY)
              </h1>
              <p className="text-xs font-mono uppercase tracking-widest text-[#7A8D76] mt-1">
                Dignified Mobile Grooming & Aesthetic Self-Care
              </p>
            </div>
          </div>
          
          <div className="pt-3 flex justify-between items-center text-[11px] font-mono text-stone-500 border-t border-stone-100 mt-4">
            <span>🌐 www.beautybroughttoyou.com</span>
            <span>📧 info@beautybroughttoyou.com</span>
            <span>📞 (555) BBTY-CARE (2273)</span>
          </div>
        </div>

        {/* Introduction Panel */}
        <div className="space-y-3 mb-6 bg-stone-50 p-5 rounded-2xl border border-stone-200">
          <h2 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
            🏡 About Our Dedicated Social Mission
          </h2>
          <p className="text-xs text-stone-700 leading-relaxed">
            Beauty Brought to You is a dedicated community-focused mobile platform delivering licensed beauty support, gentle skincare, and grooming confidence directly inside the residency spaces of clients with accessibility challenges. We serve seniors, individuals with chronic disabilities, and those who struggle to access traditional walk-in salons. Guided by physical safety, geriatric care pacing, and profound compassion, we believe self-grooming is a fundamental human right.
          </p>
        </div>

        {/* Print Columns */}
        <div className="grid grid-cols-2 gap-8 mb-8">
          
          {/* Services Column */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider font-mono border-b pb-1.5 border-stone-200 text-[#7A8D76]">
              💇 Mobility-Friendly Hair Services
            </h3>
            <ul className="space-y-3 text-xs text-stone-700">
              <li>
                <strong>• Portable Shampoo Basin Wash:</strong> Comfort-aligned scalp massage and cleansing adapted to bedsides, seating, or special wheelchairs.
              </li>
              <li>
                <strong>• Hair Trim & Scissor Cuts:</strong> Experienced styling, bang touchups, and grooming suited to different physical stability configurations.
              </li>
              <li>
                <strong>• Classic Roller Sets & Blowouts:</strong> Elegant set treatments and heat styling that rebuild identity, energy, and confidence.
              </li>
            </ul>

            <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider font-mono border-b pb-1.5 border-stone-200 text-[#7A8D76] pt-2">
              💅 Soothing Nail & Care Services
            </h3>
            <ul className="space-y-3 text-xs text-stone-700">
              <li>
                <strong>• Geriatric Fingernail Files:</strong> Gentle nail trimming, non-invasive filing, and deep skin-hydration moisturizing for delicate hand areas.
              </li>
              <li>
                <strong>• Comfort Grooming & Beard Trims:</strong> Clean facial shaves, structural mustache details, and soft aesthetic touches.
              </li>
            </ul>
          </div>

          {/* Safety and Booking Column */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider font-mono border-b pb-1.5 border-stone-200 text-[#7A8D76]">
              🩺 Quality Standards & Safety
            </h3>
            <ul className="space-y-3 text-xs text-stone-700">
              <li>
                <strong>• 100% Licensed & Vetted:</strong> Every beauty professional is verified through local state licensing, subject to extensive safety screening, and trained in dementia companion care.
              </li>
              <li>
                <strong>• Hospital-Grade Hygiene:</strong> Strictly clean brushes, single-use nail file strips, and chemically sanitized styling basins.
              </li>
              <li>
                <strong>• Non-Clinical Care:</strong> Standard beauty cosmetology only. If a physical podiatry or dermatology issue needs surgical or medical cure, we immediately guide carers to professional physicians.
              </li>
            </ul>

            <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider font-mono border-b pb-1.5 border-stone-200 text-[#7A8D76] pt-2">
              📊 Upcoming Membership Estimations
            </h3>
            <ul className="space-y-2 text-xs text-stone-700">
              <li>
                <strong>• Comfort Care Circle:</strong> $19.99/mo (or $15.99 billed annually). Direct access to local priority booking queues for private households.
              </li>
              <li>
                <strong>• Partner Salon Tiers:</strong> Starting at $79.00/mo. Register, verify, and dispatch up to 3 authorized salon stylists.
              </li>
            </ul>
          </div>

        </div>

        {/* Clear Medical Exclusions Disclaimer (Crucial Offline Disclaimer) */}
        <div className="p-4 bg-amber-50/40 rounded-xl border border-amber-200 text-[10px] text-amber-900 leading-normal mb-8">
          <strong>CRITICAL SAFETY & MEDICAL DISCLAIMER:</strong> Beauty Brought to You (BBTY) is an informational mobile beauty applet startup and subscription coordination platform. We do NOT provide medical treatments, physical-needs nursing, chiropractic manipulation, dermatology medical therapy, or clinical podiatric surgery. Stylists operate purely under local state professional licensing guidelines regarding cosmetic haircuts, grooming comfort, basic aesthetic nail maintenance, and skin moisturizing.
        </div>

        {/* Footer of Flyer */}
        <div className="border-t border-stone-200 pt-5 text-center space-y-1 text-xs">
          <p className="font-semibold text-slate-900 text-sm">
            Secure Your Priority Waiting Spot On the Queue Today
          </p>
          <p className="text-stone-500 font-mono text-[10px]">
            No credit card is required to join our waitlist. Secures regional priority allocation when regional providers are activated.
          </p>
          <div className="pt-3 text-[10px] text-stone-400 font-mono">
            © {new Date().getFullYear()} Beauty Brought To You, LLC. Designed for offline resident distribution.
          </div>
        </div>

      </div>

      <ReferFriendModal isOpen={referModalOpen} onClose={() => setReferModalOpen(false)} />
      <BecomeAdvocateModal isOpen={advocateModalOpen} onClose={() => setAdvocateModalOpen(false)} />

      {/* Smooth Premium Back to Top Button */}
      <AnimatePresence>
        {scrollY > 500 && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 30 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="fixed bottom-8 right-8 z-[45] flex items-center gap-2 px-4 py-3 rounded-full bg-gradient-to-r from-pink-500 via-purple-600 to-blue-600 hover:from-pink-600 hover:via-purple-700 hover:to-blue-700 text-white font-extrabold text-xs uppercase tracking-widest shadow-[0_8px_30px_rgba(219,39,119,0.35)] hover:shadow-[0_15px_40px_rgba(219,39,119,0.55)] border border-white/20 hover:border-white/40 cursor-pointer transition-all duration-300 hover:scale-110 active:scale-95 group"
            id="back-to-top-btn"
            title="Scroll back to top of page"
            aria-label="Scroll back to top of page"
          >
            <ArrowUp className="w-4 h-4 shrink-0 transition-transform duration-300 group-hover:-translate-y-1 stroke-[3]" />
            <span className="font-mono font-black text-[10px] leading-none select-none tracking-wider">Top</span>
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isLightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-950/95 backdrop-blur-xl z-[999] flex flex-col items-center justify-center p-4 md:p-8 select-none"
            onClick={() => setIsLightboxOpen(false)}
          >
            {/* Close Button */}
            <button 
              onClick={() => setIsLightboxOpen(false)}
              className="absolute top-6 right-6 p-3 bg-white/10 hover:bg-white/20 hover:scale-105 active:scale-95 text-white rounded-full transition-all border border-white/10 cursor-pointer z-50 shadow-lg"
              aria-label="Close lightbox"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Lightbox Content Card */}
            <motion.div
              initial={{ scale: 0.95, y: 10 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 10 }}
              transition={{ type: "spring", damping: 25, stiffness: 350 }}
              className="relative max-w-4xl w-full max-h-[85vh] flex flex-col items-center justify-center bg-[#070b12] rounded-[32px] overflow-hidden border border-white/10 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative w-full h-full overflow-hidden flex items-center justify-center bg-slate-900 group">
                <img 
                  src="https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=1600&h=1200&q=90"
                  alt="Professional beauty stylist styling the hair of styled smiling client in home"
                  className="max-h-[60vh] md:max-h-[68vh] w-full object-contain"
                  referrerPolicy="no-referrer"
                />
                
                {/* Overlay card for high contrast visual styling */}
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent p-6 text-left" />
              </div>

              {/* Lightbox Details bar */}
              <div className="w-full bg-[#0d1322] p-5 sm:p-6 text-left border-t border-white/10 space-y-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <span className="text-[10px] sm:text-xs font-mono font-bold text-pink-400 uppercase tracking-widest block font-sans">
                    ✨ Comfort & Quality Styling In-Home
                  </span>
                  <h3 className="text-sm sm:text-lg font-serif text-white font-bold leading-tight">
                    Professional Cosmopolitan Stylist and Client Alignment
                  </h3>
                  <p className="text-xs text-slate-400 max-w-2xl leading-relaxed">
                    Our carefully vetted mobile cosmetology experts come equipped with specialized, portable equipment (wash bowls, lightweight chairs, skin-friendly products) to offer complete wellness treatment directly in your favorite living space.
                  </p>
                </div>
                
                <div className="shrink-0 flex items-center gap-2 px-3 py-2 bg-pink-500/10 border border-pink-500/20 rounded-xl">
                  <span className="text-lg">🛡️</span>
                  <div className="text-left font-mono">
                    <span className="text-[9px] text-pink-300 font-bold block whitespace-nowrap">FULLY INSURED</span>
                    <span className="text-[8px] text-slate-400 block whitespace-nowrap">State Licensed Pros</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Backdrop helper label */}
            <p className="absolute bottom-4 text-[10px] text-slate-500 font-mono tracking-wider">
              Click anywhere on the background to exit preview
            </p>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}

