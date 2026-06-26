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
import { Sparkles, ArrowRight, ShieldCheck, Menu, X, Sun, Moon, Gift, Home, Check, CheckCircle, Heart, Star, Calendar, MessageSquare, Briefcase, ZoomIn, Contrast, Type, Volume2, VolumeX, TrendingUp, ArrowUp, Building, Scissors, Users, QrCode, Smartphone } from 'lucide-react';
import { safeConfetti } from './lib/safeConfetti';

import { collection, onSnapshot, doc } from 'firebase/firestore';
import { db, isFirebaseSupported } from './lib/firebase';

import { useAccessibility } from './context/AccessibilityContext';
import { safeLocalStorage } from './lib/safeStorage';
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
import NewGradsSection from './components/NewGradsSection';
import PrivacyPolicy from './components/PrivacyPolicy';
import SecurityModal from './components/SecurityModal';

import WelcomePage from './components/WelcomePage';

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

const getWaitlistData = () => {
  try {
    const stored = safeLocalStorage.getItem('bbty_waitlist_db');
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed)) {
        return parsed;
      }
    }
  } catch (e) {
  }
  return [];
};

const getInitialHeadline = () => {
  try {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const hlParam = params.get('hl');
      if (hlParam) {
        const decoded = decodeURIComponent(hlParam);
        safeLocalStorage.setItem('bbty_saved_headline', decoded);
        return decoded;
      }
    }
  } catch (e) {
    console.warn("Failed to parse hl query param:", e);
  }
  try {
    const stored = safeLocalStorage.getItem('bbty_saved_headline');
    if (stored) return stored;
  } catch (e) {}
  return "Experience \"Beauty Brought To You!\"";
};

const getInitialTagline = () => {
  try {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const tlParam = params.get('tl');
      if (tlParam) {
        const decoded = decodeURIComponent(tlParam);
        safeLocalStorage.setItem('bbty_saved_tagline', decoded);
        return decoded;
      }
    }
  } catch (e) {
    console.warn("Failed to parse tl query param:", e);
  }
  try {
    const stored = safeLocalStorage.getItem('bbty_saved_tagline');
    if (stored) {
      if (
        stored.includes("At BBTY Pros, our mission is to make professional") ||
        stored.includes("privacy of our clients' homes or any place that is convenient")
      ) {
        const newDefault = "At BBTY, our mission is to make professional Beauty & Wellness services accessible, convenient by bringing trusted salon-quality experiences directly to the privacy of our clients homes or  to any desired place that is convenient and suitable to provide adequate service.";
        safeLocalStorage.setItem('bbty_saved_tagline', newDefault);
        return newDefault;
      }
      return stored;
    }
  } catch (e) {}
  return "At BBTY, our mission is to make professional Beauty & Wellness services accessible, convenient by bringing trusted salon-quality experiences directly to the privacy of our clients homes or  to any desired place that is convenient and suitable to provide adequate service.";
};

const safeScrollTo = (options: ScrollToOptions | number, y?: number) => {
  try {
    if (typeof window !== 'undefined' && typeof window.scrollTo === 'function') {
      if (typeof options === 'number') {
        window.scrollTo(options, y ?? 0);
      } else {
        window.scrollTo(options);
      }
    }
  } catch (e) {
    console.warn("window.scrollTo is not fully supported or is blocked in this environment.", e);
  }
};

export default function App() {
  const [showWelcome, setShowWelcome] = useState(true);
  const [headline, setHeadline] = useState(getInitialHeadline);
  const [tagline, setTagline] = useState(getInitialTagline);
  const [activeTab, setActiveTab] = useState('clients');
  const [currentPage, setCurrentPage] = useState<'home' | 'privacy'>('home');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [referModalOpen, setReferModalOpen] = useState(false);
  const [advocateModalOpen, setAdvocateModalOpen] = useState(false);
  const [securityModalOpen, setSecurityModalOpen] = useState(false);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [waitlistCount, setWaitlistCount] = useState<number>(0);
  const [todaySignupsCount, setTodaySignupsCount] = useState<number>(0);
  const [prevCount, setPrevCount] = useState<number | null>(null);
  const [particles, setParticles] = useState<{ id: number; left: number; top: number; delay: number; color: string; size: number }[]>([]);
  const [floatingEmojis, setFloatingEmojis] = useState<{ id: number; left: number; top: number; text: string; delay: number; scale: number; velocityX: number; rotation: number }[]>([]);
  const [scrollY, setScrollY] = useState(0);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);

  const triggerEmojis = () => {
    const emojis = ['🎈', '🎉', '✨', '💖', '🚀', '💅', '💇‍♀️', '🥳', '💄', '⭐'];
    const newEmojis = Array.from({ length: 8 }).map((_, i) => ({
      id: Date.now() + i + Math.random(),
      left: Math.random() * 70 + 15,
      top: Math.random() * 20 + 60,
      text: emojis[Math.floor(Math.random() * emojis.length)],
      delay: Math.random() * 0.3,
      scale: Math.random() * 0.4 + 0.8,
      velocityX: (Math.random() - 0.5) * 40,
      rotation: (Math.random() - 0.5) * 60,
    }));
    setFloatingEmojis((prev) => [...prev.slice(-15), ...newEmojis]);
  };

  const triggerParticles = () => {
    const colors = ['#ec4899', '#a855f7', '#3b82f6', '#10b981', '#fbbf24', '#f43f5e', '#06b6d4'];
    const newParticles = Array.from({ length: 22 }).map((_, i) => ({
      id: Date.now() + i + Math.random(),
      left: Math.random() * 80 + 10,
      top: Math.random() * 30 + 50,
      delay: Math.random() * 0.4,
      color: colors[Math.floor(Math.random() * colors.length)],
      size: Math.random() * 8 + 4,
    }));
    setParticles((prev) => [...prev.slice(-40), ...newParticles]);
    triggerEmojis();
  };

  const getShareUrl = () => {
    if (typeof window === 'undefined') return 'https://beautybroughttoyou.com';
    const base = window.location.origin + window.location.pathname;
    const params = new URLSearchParams();
    if (headline) params.set('hl', headline);
    if (tagline) params.set('tl', tagline);
    const queryStr = params.toString();
    return queryStr ? `${base}?${queryStr}` : base;
  };

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
    try {
      if (headline) {
        safeLocalStorage.setItem('bbty_saved_headline', headline);
      }
    } catch (e) {}
  }, [headline]);

  useEffect(() => {
    try {
      if (tagline) {
        safeLocalStorage.setItem('bbty_saved_tagline', tagline);
      }
    } catch (e) {}
  }, [tagline]);

  useEffect(() => {
    let unsubscribeFirestore: (() => void) | null = null;

    const updateStatsFromLocal = () => {
      const data = getWaitlistData();
      
      let count = data.length > 0 ? (180 + data.length) : 180;
      try {
        const storedStats = safeLocalStorage.getItem('bbty_stats_count');
        if (storedStats) {
          const num = parseInt(storedStats, 10);
          if (!isNaN(num) && num > count) {
            count = num;
          }
        }
      } catch (e) {}

      setWaitlistCount(count);
      
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const todayCount = data.filter((item: any) => {
        if (!item.submittedAt) return false;
        try {
          const itemDate = new Date(item.submittedAt);
          return itemDate >= today;
        } catch(e) {
          return false;
        }
      }).length;
      
      setTodaySignupsCount(todayCount);
    };

    if (isFirebaseSupported && db) {
      try {
        // Pull directly from public Firestore stats document in real-time
        unsubscribeFirestore = onSnapshot(doc(db, "stats", "waitlist_stats"), (snapshot) => {
          if (snapshot.exists()) {
            const data = snapshot.data();
            const totalCount = data.count || 0;
            
            let finalCount = totalCount;
            try {
              const storedStats = safeLocalStorage.getItem('bbty_stats_count');
              if (storedStats) {
                const num = parseInt(storedStats, 10);
                if (!isNaN(num) && num > finalCount) {
                  finalCount = num;
                }
              }
            } catch (e) {}

            setWaitlistCount(finalCount);

            // Fetch today's signups count from the statistics document
            const todayStr = new Date().toISOString().split('T')[0];
            let todayCount = 0;
            if (data.lastUpdatedDate === todayStr) {
              todayCount = data.todayCount || 0;
            }
            setTodaySignupsCount(todayCount);
          } else {
            updateStatsFromLocal();
          }
        }, (error) => {
          console.warn("Could not load real-time dashboard stats from Firestore, falling back to local:", error);
          updateStatsFromLocal();
        });
      } catch (e) {
        console.warn("Firestore stats listener failed to initialize:", e);
        updateStatsFromLocal();
      }
    } else {
      updateStatsFromLocal();
    }

    const onUpdateEvent = () => {
      updateStatsFromLocal();
    };

    window.addEventListener('bbty_waitlist_updated', onUpdateEvent);
    window.addEventListener('storage', onUpdateEvent);

    return () => {
      if (unsubscribeFirestore) {
        try { unsubscribeFirestore(); } catch (e) {}
      }
      window.removeEventListener('bbty_waitlist_updated', onUpdateEvent);
      window.removeEventListener('storage', onUpdateEvent);
    };
  }, []);

  useEffect(() => {
    if (prevCount !== null && waitlistCount > prevCount) {
      triggerParticles();
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
          safeConfetti({ ...defaults, particleCount, colors: ['#ec4899', '#a855f7', '#3b82f6', '#10b981', '#fbbf24'], origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
          safeConfetti({ ...defaults, particleCount, colors: ['#ec4899', '#a855f7', '#3b82f6', '#10b981', '#fbbf24'], origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
        }, 250);
      } else if (isMultipleOf5) {
        // High-end milestone interval blast
        safeConfetti({
          particleCount: 160,
          spread: 90,
          origin: { y: 0.6 },
          colors: ['#ec4899', '#a855f7', '#3b82f6', '#10b981', '#fbbf24'],
          zIndex: 10000
        });
      } else {
        // Classic responsive signup burst
        safeConfetti({
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
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedLang, setSelectedLang] = useState<string>('en');

  // Helper to safely get speechSynthesis and avoid SecurityError in sandboxed iframes
  const getSafeSpeechSynthesis = (): SpeechSynthesis | null => {
    if (typeof window === 'undefined') return null;
    try {
      const synth = window.speechSynthesis;
      return synth || null;
    } catch (e) {
      console.warn("Speech Synthesis is blocked or unsupported in this sandbox environment.", e);
      return null;
    }
  };

  useEffect(() => {
    const synth = getSafeSpeechSynthesis();
    if (synth) {
      const loadVoices = () => {
        try {
          setVoices(synth.getVoices());
        } catch (e) {
          console.warn("Failed to load voices:", e);
        }
      };
      loadVoices();
      try {
        synth.onvoiceschanged = loadVoices;
      } catch (e) {
        console.warn("Failed to assign onvoiceschanged handler:", e);
      }
    }
  }, []);

  // Graceful cleanup to stop reading if the user navigates away or unmounts
  useEffect(() => {
    return () => {
      const synth = getSafeSpeechSynthesis();
      if (synth) {
        try {
          synth.cancel();
        } catch (e) {
          console.warn("Failed to cancel speech synthesis:", e);
        }
      }
    };
  }, []);

  const togglePlayOutLoud = () => {
    const synth = getSafeSpeechSynthesis();
    if (!synth || typeof SpeechSynthesisUtterance === 'undefined') {
      console.warn("Text to speech is not supported, blocked, or SpeechSynthesisUtterance is undefined in this environment.");
      return;
    }

    try {
      if (isSpeaking) {
        synth.cancel();
        setIsSpeaking(false);
      } else {
        synth.cancel(); // Stop any pending or legacy speaking queue elements
        
        // Deduplicate overlapping texts (e.g., span inside p) to avoid double reading
        // A simpler way: just grab document.body.innerText, but since that includes buttons and ui elements,
        // innerText of a main container is better.
        const mainContainer = document.querySelector('main') || document.body;
        const textToRead = mainContainer.innerText || document.body.innerText;

        // Clean up text
        const cleanText = textToRead.replace(/\s+/g, ' ').trim();
        
        // To prevent utterance truncation in some browsers, slice into smaller chunks by sentences
        // or chunks of ~200 characters ending at a space.
        const chunks = cleanText.match(/[^.!?]+[.!?]+/g) || [cleanText];
        
        if (chunks.length === 0) {
          setIsSpeaking(false);
          return;
        }

        setIsSpeaking(true);

        chunks.forEach((chunk, index) => {
          try {
            const utterance = new SpeechSynthesisUtterance(chunk.trim());
            utterance.lang = selectedLang;
            
            const matchingVoice = voices.find(v => v.lang.startsWith(selectedLang));
            if (matchingVoice) {
              utterance.voice = matchingVoice;
            }
            
            // Warm, accessible, highly clear slow pacing for elderly or visually impaired users
            utterance.rate = 0.88;
            utterance.pitch = 1.0;

            if (index === chunks.length - 1) {
              utterance.onend = () => {
                setIsSpeaking(false);
              };
            }

            utterance.onerror = (e) => {
              console.warn("Speech Synthesis failure:", e);
              setIsSpeaking(false);
            };

            synth.speak(utterance);
          } catch (err) {
            console.warn("Failed to speak chunk:", err);
            setIsSpeaking(false);
          }
        });
      }
    } catch (e) {
      console.warn("Speech Synthesis toggling failed:", e);
      setIsSpeaking(false);
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

          safeScrollTo({
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

      safeScrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  const handleTabScroll = (tabId: string) => {
    setActiveTab(tabId);
    scrollToSection('audience-explorer');
  };

  const availableLangs = Array.from(new Set(voices.map(v => v.lang.slice(0, 2)))) as string[];
  const langNames: Record<string, string> = {
    en: 'English', es: 'Español', fr: 'Français', de: 'Deutsch',
    it: 'Italiano', pt: 'Português', zh: '中文', ja: '日本語',
    ko: '한국어', ru: 'Русский', hi: 'हिन्दी', ar: 'العربية'
  };

  return (
    <div className="min-h-screen max-w-full overflow-x-hidden bg-transparent text-slate-800 dark:text-slate-100 font-sans selection:bg-pink-100 selection:text-pink-900 scroll-smooth antialiased transition-colors duration-200">
      
      <AnimatePresence>
        {showWelcome && (
          <WelcomePage onComplete={() => setShowWelcome(false)} />
        )}
      </AnimatePresence>

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
          <strong>NOTE:</strong> We provide beauty, grooming, and comfort care. We do not provide clinical or medical services.
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
                safeScrollTo({ top: 0, behavior: 'smooth' });
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
                  safeScrollTo({ top: 0, behavior: 'smooth' });
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
                onClick={() => scrollToSection('new-grads-program')}
                className="px-3 py-2 text-slate-600 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
              >
                New Grads
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
                {/* 3. Readability Fonts Mode */}
                <button
                  onClick={toggleReadabilityMode}
                  className={`px-3.5 py-2.5 rounded-xl border transition-all duration-300 cursor-pointer flex items-center justify-center gap-1.5 ${
                    isReadabilityMode 
                      ? "border-pink-500 bg-pink-500/20 text-pink-600 dark:text-pink-400 font-black shadow-xs scale-[1.02] animate-[pulse_2s_infinite]" 
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
                  <span className="text-[10px] font-mono font-black tracking-wider uppercase leading-none select-none">Read out loud</span>
                </button>
                {availableLangs.length > 0 && (
                  <select
                    value={selectedLang}
                    onChange={(e) => setSelectedLang(e.target.value)}
                    className="ml-1 px-2 py-2.5 rounded-xl border border-slate-200/80 bg-white/95 text-slate-600 dark:text-slate-400 dark:border-slate-800 dark:bg-slate-900 text-xs font-mono font-bold uppercase cursor-pointer hover:border-slate-300 dark:hover:border-slate-700 outline-none transition-colors"
                    aria-label="Select language for Read Out Loud"
                  >
                    {availableLangs.map(lang => (
                      <option key={lang} value={lang}>{langNames[lang] || lang.toUpperCase()}</option>
                    ))}
                  </select>
                )}
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
                Join our wait list
              </button>
            </div>

            {/* Mobile Burger Menu Icon */}
            <div className="lg:hidden flex items-center gap-2.5">
              
              {/* Premium Interactive Accessibility Control Badge For Mobile Shortcuts */}
              <div className="flex items-center gap-1.5 bg-pink-50/70 dark:bg-slate-900/60 p-1.5 rounded-2xl border border-pink-100/60 dark:border-slate-800/80 shadow-[0_1px_8px_rgba(219,39,119,0.03)]" id="mobile-accessibility-shortcuts">
                {/* Mobile quick play out loud click */}
                <button
                  onClick={togglePlayOutLoud}
                  className={`p-2 rounded-xl border focus:outline-none cursor-pointer flex items-center justify-center gap-1.5 transition-all active:scale-[0.88] ${
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
                  <span className="text-[10px] font-mono font-black tracking-wider uppercase leading-none select-none">Read out loud</span>
                </button>
                {availableLangs.length > 0 && (
                  <select
                    value={selectedLang}
                    onChange={(e) => setSelectedLang(e.target.value)}
                    className="p-2 rounded-xl border focus:outline-none cursor-pointer flex items-center justify-center transition-all active:scale-[0.88] border-slate-200/50 bg-white/90 text-slate-500 dark:text-slate-400 dark:bg-slate-900 text-[10px] font-mono font-black uppercase"
                    aria-label="Select language for Read Out Loud"
                  >
                    {availableLangs.map(lang => (
                      <option key={lang} value={lang}>{langNames[lang] || lang.toUpperCase()}</option>
                    ))}
                  </select>
                )}
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
            <span className="text-[10px] font-bold font-mono text-slate-400 dark:text-slate-500 uppercase tracking-widest block px-4 py-1">Select your profession below</span>
            <button
              onClick={() => handleTabScroll('clients')}
              className={`w-full text-left flex items-center gap-2 px-4 py-3.5 rounded-xl text-xs font-medium transition-colors ${activeTab === 'clients' ? 'bg-pink-50 text-pink-600 border border-pink-200 dark:bg-pink-900/20 dark:text-pink-400 dark:border-pink-800/60' : 'text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-850 hover:bg-slate-100 dark:hover:bg-slate-850'}`}
            >
              <Users className="w-4 h-4" />
              Clients, Caregivers & Families
            </button>
            <button
              onClick={() => handleTabScroll('facilities')}
              className={`w-full text-left flex items-center gap-2 px-4 py-3.5 rounded-xl text-xs font-medium transition-colors ${activeTab === 'facilities' ? 'bg-pink-50 text-pink-600 border border-pink-200 dark:bg-pink-900/20 dark:text-pink-400 dark:border-pink-800/60' : 'text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-850 hover:bg-slate-100 dark:hover:bg-slate-850'}`}
            >
              <Building className="w-4 h-4" />
              Senior living & Care facilities
            </button>
            <button
              onClick={() => handleTabScroll('salons')}
              className={`w-full text-left flex items-center gap-2 px-4 py-3.5 rounded-xl text-xs font-medium transition-colors ${activeTab === 'salons' ? 'bg-pink-50 text-pink-600 border border-pink-200 dark:bg-pink-900/20 dark:text-pink-400 dark:border-pink-800/60' : 'text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-850 hover:bg-slate-100 dark:hover:bg-slate-850'}`}
            >
              <Scissors className="w-4 h-4" />
              Salon Owners & partnerships
            </button>
            <button
              onClick={() => handleTabScroll('independent')}
              className={`w-full text-left flex items-center gap-2 px-4 py-3.5 rounded-xl text-xs font-medium transition-colors ${activeTab === 'independent' ? 'bg-pink-50 text-pink-600 border border-pink-200 dark:bg-pink-900/20 dark:text-pink-400 dark:border-pink-800/60' : 'text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-850 hover:bg-slate-100 dark:hover:bg-slate-850'}`}
            >
              <Briefcase className="w-4 h-4" />
              Independent contractors
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
                onClick={() => scrollToSection('new-grads-program')}
                className="w-full text-left block px-4 py-3 rounded-xl text-xs font-bold text-pink-600 dark:text-pink-400 hover:bg-pink-50 dark:hover:bg-pink-950/20"
              >
                🎓 New Grads Careers Program
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
                <div className="flex justify-center">
                  <div className="inline-flex items-center gap-2.5 px-4 py-2 bg-pink-100/60 dark:bg-pink-950/30 rounded-full text-pink-700 dark:text-pink-300 text-xs font-bold border border-pink-200/30 dark:border-pink-900/10 animate-fade-in shadow-xs">
                    <span className="flex h-2.5 w-2.5 rounded-full bg-pink-500 animate-pulse"></span>
                    <span className="font-mono uppercase tracking-wider">Coming Soon to Your Region</span>
                    <span className="text-pink-400 font-mono">|</span>
                    <span>Waitlist Priority Active</span>
                  </div>
                </div>

                {/* Display Headline */}
                <motion.h1 
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1, ease: [0.21, 0.45, 0.15, 1.0] }}
                  className="text-3xl sm:text-4xl md:text-4xl lg:text-5xl xl:text-6xl font-serif text-slate-900 dark:text-white font-black tracking-tight leading-[1.08] select-all"
                >
                  {headline === "Experience \"Beauty Brought To You!\"" ? (
                    <>
                      <span className="block text-center">Experience</span>
                      <span className="block text-center">"Beauty Brought To You!"</span>
                    </>
                  ) : (
                    headline
                  )}
                </motion.h1>

                {/* Description Tagline */}
                <motion.p 
                  id="hero-tagline"
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
                  whileHover={{ y: -6, scale: 1.02 }}
                  className="p-5 bg-slate-950/90 border border-purple-500/30 rounded-3xl flex flex-col gap-3.5 max-w-sm sm:max-w-md shadow-[0_0_25px_rgba(168,85,247,0.12)] hover:shadow-[0_0_45px_rgba(236,72,153,0.25)] hover:border-pink-500/40 backdrop-blur-md relative overflow-hidden text-left group/card transition-all duration-300"
                >
                  {/* Neon top accent line */}
                  <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 opacity-90" />

                  {/* Playful Floating mascot bubble */}
                  <motion.div
                    animate={{ 
                      y: [0, -4, 0],
                      rotate: [-1.5, 1.5, -1.5] 
                    }}
                    transition={{ 
                      repeat: Infinity, 
                      duration: 3, 
                      ease: "easeInOut" 
                    }}
                    className="absolute -top-3 right-4 bg-gradient-to-r from-pink-500 to-purple-600 text-[9px] font-black tracking-wider text-white uppercase px-2.5 py-1 rounded-full shadow-lg border border-white/10 flex items-center gap-1 select-none z-20"
                  >
                    <span className="animate-bounce inline-block">🔥</span> Filling Fast!
                    <div className="absolute -bottom-1 right-3.5 w-2 h-2 bg-purple-600 rotate-45 border-r border-b border-white/5" />
                  </motion.div>

                  {/* Absolute floating particles container */}
                  <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-3xl">
                    {/* Render standard neon particles */}
                    <AnimatePresence>
                      {particles.map((p) => (
                        <motion.span
                          key={p.id}
                          initial={{ x: 0, y: 0, opacity: 0.9, scale: 0.2 }}
                          animate={{
                            y: -140 - Math.random() * 80,
                            x: (Math.random() - 0.5) * 110,
                            opacity: 0,
                            scale: [1, 1.4, 0],
                            rotate: Math.random() * 360,
                          }}
                          exit={{ opacity: 0 }}
                          transition={{
                            duration: 1.6 + Math.random() * 1.4,
                            ease: "easeOut",
                            delay: p.delay,
                          }}
                          className="absolute pointer-events-none rounded-full"
                          style={{
                            left: `${p.left}%`,
                            top: `${p.top}%`,
                            width: p.size,
                            height: p.size,
                            backgroundColor: p.color,
                            boxShadow: `0 0 8px ${p.color}, 0 0 16px ${p.color}`,
                            zIndex: 10,
                          }}
                        />
                      ))}
                    </AnimatePresence>

                    {/* Render custom fun floating emojis */}
                    <AnimatePresence>
                      {floatingEmojis.map((emoji) => (
                        <motion.span
                          key={emoji.id}
                          initial={{ 
                            x: 0, 
                            y: 30, 
                            opacity: 1, 
                            scale: 0.1, 
                            rotate: 0 
                          }}
                          animate={{
                            y: -150 - Math.random() * 80,
                            x: emoji.velocityX * 1.8,
                            opacity: [1, 1, 0.8, 0],
                            scale: [0.1, emoji.scale, emoji.scale, 0],
                            rotate: emoji.rotation * 2.5,
                          }}
                          exit={{ opacity: 0 }}
                          transition={{
                            duration: 1.8 + Math.random() * 1.2,
                            ease: "easeOut",
                            delay: emoji.delay,
                          }}
                          className="absolute pointer-events-none select-none text-xl z-20"
                          style={{
                            left: `${emoji.left}%`,
                            top: `${emoji.top}%`,
                          }}
                        >
                          {emoji.text}
                        </motion.span>
                      ))}
                    </AnimatePresence>
                  </div>

                  {/* Subtle Background Glow behind the chart */}
                  <div className="absolute right-0 bottom-0 w-32 h-20 bg-purple-500/10 dark:bg-purple-500/5 rounded-full blur-2xl pointer-events-none" />

                  {/* Row 1: Badges Row */}
                  <div className="flex items-center justify-between gap-2 border-b border-slate-850 pb-2.5 relative z-10">
                    <div className="flex items-center gap-2">
                      <div className="relative flex h-2.5 w-2.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                      </div>
                      <span className="text-[11px] font-mono font-extrabold text-emerald-400 tracking-wider uppercase">Live Activity</span>
                    </div>

                    {/* Growth Velocity Indicator Pill */}
                    <div className="flex items-center gap-1.5 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20 shadow-sm hover:scale-[1.05] transition-transform duration-250 cursor-default">
                      <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-[10px] font-mono font-black text-emerald-400 tracking-wide">+{todaySignupsCount} signups today</span>
                    </div>
                  </div>

                  {/* Row 2: Statistics & Chart block */}
                  <div className="flex items-center justify-between gap-4 py-0.5 relative z-10">
                    <div className="flex items-center gap-2.5 font-sans">
                      <div className="flex flex-col">
                        <div 
                          onClick={() => {
                            triggerParticles();
                            safeConfetti({
                              particleCount: 50,
                              spread: 60,
                              origin: { y: 0.65 },
                              colors: ['#ec4899', '#a855f7', '#3b82f6'],
                              zIndex: 10000
                            });
                          }}
                          className="flex items-baseline gap-1 relative group cursor-pointer"
                          title="Click to celebrate!"
                        >
                          {/* Individual Retro-Neon Digit Cards */}
                          <div className="flex items-center gap-1 sm:gap-1.5 select-none h-12">
                            {String(waitlistCount).split('').map((char, index) => (
                              <div 
                                key={`${index}-${char}`} 
                                className="relative h-12 w-8 sm:w-9 bg-slate-900/90 border border-slate-800 rounded-xl flex items-center justify-center overflow-visible shadow-[inset_0_2px_4px_rgba(0,0,0,0.8),0_1px_2px_rgba(255,255,255,0.05)] border-t-purple-500/20"
                              >
                                <AnimatePresence mode="popLayout">
                                  <motion.span
                                    key={char}
                                    initial={{ opacity: 0, y: 18, scale: 0.3, rotateX: -90 }}
                                    animate={{ opacity: 1, y: 0, scale: 1, rotateX: 0 }}
                                    exit={{ opacity: 0, y: -18, scale: 0.3, rotateX: 90 }}
                                    transition={{
                                      type: "spring",
                                      stiffness: 450,
                                      damping: 14,
                                      delay: index * 0.05
                                    }}
                                    whileHover={{ 
                                      scale: 1.25, 
                                      rotate: [0, -8, 8, 0],
                                      y: -4
                                    }}
                                    style={{ originY: 0.5, transformPerspective: 400 }}
                                    className="text-2xl sm:text-3xl font-black font-mono text-transparent bg-clip-text bg-gradient-to-b from-white via-slate-100 to-pink-300 tracking-tighter inline-block drop-shadow-[0_2px_5px_rgba(236,72,153,0.4)]"
                                  >
                                    {char}
                                  </motion.span>
                                </AnimatePresence>
                              </div>
                            ))}
                          </div>
                          
                          {/* Sparkle micro-interaction indicator */}
                          <motion.span 
                            animate={{ scale: [1, 1.2, 1], rotate: [0, 15, -15, 0] }}
                            transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
                            className="text-sm text-pink-400 opacity-80 group-hover:opacity-100 transition-opacity ml-2 inline-block self-center drop-shadow-[0_0_5px_rgba(236,72,153,0.5)]"
                          >
                            ✨
                          </motion.span>
                        </div>
                        <span className="text-[10px] sm:text-xs font-semibold text-slate-400 flex items-center gap-1 mt-1">
                          registered on waitlist
                          <span className="text-[9px] text-slate-500 font-normal italic opacity-0 group-hover/card:opacity-100 transition-opacity duration-300">
                            (click to celebrate!)
                          </span>
                        </span>
                      </div>
                    </div>

                    {/* Subtle Upward-Trending Chart Animation with active wave undulating loop */}
                    <div className="w-24 h-12 flex items-center justify-center relative bg-slate-900/60 px-2.5 py-1 rounded-xl border border-slate-800/60 shadow-inner group/chart overflow-hidden">
                      <svg viewBox="0 0 100 40" className="w-full h-full overflow-visible">
                        <defs>
                          <linearGradient id="sparkline-gradient" x1="0" y1="1" x2="1" y2="0">
                            <stop offset="0%" stopColor="#ec4899" />
                            <stop offset="50%" stopColor="#a855f7" />
                            <stop offset="100%" stopColor="#3b82f6" />
                          </linearGradient>
                          <linearGradient id="sparkline-fill" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#a855f7" stopOpacity="0.25" />
                            <stop offset="100%" stopColor="#a855f7" stopOpacity="0" />
                          </linearGradient>
                        </defs>
                        
                        {/* Shaded Area Below Line (Undulating Loop) */}
                        <motion.path
                          animate={{ 
                            d: [
                              "M 5,35 Q 25,31 42,24 T 75,11 T 95,4 L 95,40 L 5,40 Z",
                              "M 5,35 Q 20,28 42,26 T 70,8 T 95,4 L 95,40 L 5,40 Z",
                              "M 5,35 Q 25,31 42,24 T 75,11 T 95,4 L 95,40 L 5,40 Z"
                            ] 
                          }}
                          transition={{ 
                            repeat: Infinity, 
                            duration: 4, 
                            ease: "easeInOut" 
                          }}
                          fill="url(#sparkline-fill)"
                        />
                        
                        {/* Animated Line (Undulating Wave) */}
                        <motion.path
                          animate={{ 
                            d: [
                              "M 5,35 Q 25,31 42,24 T 75,11 T 95,4",
                              "M 5,35 Q 20,28 42,26 T 70,8 T 95,4",
                              "M 5,35 Q 25,31 42,24 T 75,11 T 95,4"
                            ] 
                          }}
                          transition={{ 
                            repeat: Infinity, 
                            duration: 4, 
                            ease: "easeInOut" 
                          }}
                          fill="none"
                          stroke="url(#sparkline-gradient)"
                          strokeWidth="3.5"
                          strokeLinecap="round"
                        />
                        
                        {/* Pulsing Target Node */}
                        <motion.circle
                          cx="95"
                          cy="4"
                          r="4.5"
                          fill="#ec4899"
                          animate={{ 
                            scale: [0.8, 1.6, 0.8], 
                            opacity: [0.6, 1, 0.6],
                            fill: ["#ec4899", "#3b82f6", "#ec4899"] 
                          }}
                          transition={{ 
                            repeat: Infinity, 
                            duration: 1.5, 
                            ease: "easeInOut" 
                          }}
                          style={{ filter: "drop-shadow(0 0 4px #ec4899)" }}
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
                    <span>Join our wait list</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform text-white/90" />
                  </button>
                  
                  <button
                    onClick={() => {
                      safeScrollTo({ top: 0, behavior: 'smooth' });
                      setMobileMenuOpen(true);
                    }}
                    className="inline-flex items-center justify-center gap-2.5 px-8 py-4 bg-white/90 dark:bg-slate-900/90 hover:bg-white dark:hover:bg-slate-800 text-slate-800 dark:text-slate-100 font-extrabold rounded-2xl text-base border-2 border-slate-800/85 dark:border-slate-400/80 hover:border-pink-500 dark:hover:border-pink-400 transition-all duration-300 cursor-pointer shadow-md hover:shadow-lg hover:scale-[1.04] active:scale-[0.96]"
                    id="hero-secondary-cta"
                  >
                    <Menu className="w-5 h-5" />
                    <span>Menu</span>
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
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      setIsLightboxOpen(true);
                    }
                  }}
                  tabIndex={0}
                  role="button"
                  aria-label="Enlarge beauty and wellness styling photo"
                  className="relative rounded-[48px] overflow-hidden shadow-2xl border-4 border-white/90 dark:border-[#0e1423]/90 aspect-[4/5] w-full max-w-md group cursor-zoom-in transition-all duration-305 hover:scale-[1.01]"
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-950/20 to-transparent z-10" />
                  
                  {/* Premium Gently Pulsing Floating Zoom Badge Indicator */}
                  <div 
                    className="absolute top-4 left-4 z-20 flex items-center justify-center pointer-events-none" 
                    id="hero-lightbox-pulse-badge"
                  >
                    {/* Growing/pinging outer ring effect */}
                    <span className="absolute inline-flex h-9 w-9 rounded-full bg-pink-500/45 animate-[ping_2.2s_infinite]" />
                    {/* Floating pill badge */}
                    <div className="relative flex items-center gap-1.5 bg-slate-950/90 backdrop-blur-md border border-pink-500/60 hover:border-pink-500 text-white text-[9px] font-mono font-black tracking-widest uppercase py-1.5 px-3 rounded-full shadow-[0_4px_16px_rgba(236,72,153,0.4)] transition-all duration-300 group-hover:scale-105 group-hover:shadow-[0_4px_22px_rgba(236,72,153,0.65)]">
                      <ZoomIn className="w-3 h-3 text-pink-400 group-hover:text-pink-300 transition-colors animate-[pulse_1.5s_infinite]" />
                      <span className="leading-none select-none">Inspect</span>
                    </div>
                  </div>

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
                  Our Mission
                </span>
                <h2 className="text-2xl md:text-3xl font-serif text-slate-950 dark:text-white font-extrabold tracking-tight">
                  Who is Beauty Brought to You?
                </h2>
                <p className="text-slate-800 dark:text-slate-100 text-sm md:text-base leading-relaxed font-semibold">
                  We are a <strong>mobile beauty and wellness platform</strong> that delivers professional hair, nail, and styling services directly to your home or care facility. 
                </p>
                <p className="text-slate-800 dark:text-slate-100 text-sm md:text-base leading-relaxed font-semibold">
                  We serve seniors, people with disabilities, memory care residents, and busy families who deserve convenient, respectful care.
                </p>
              </div>

              {/* Graphic stats boxes */}
              <div className="bg-gradient-to-br from-pink-50 to-amber-50/45 dark:from-pink-950/20 dark:to-amber-950/10 rounded-3xl p-6 border border-pink-100/50 dark:border-pink-900/10 space-y-4 shadow-sm">
                <h3 className="font-serif font-semibold text-slate-950 dark:text-white text-base">Key Pillars of Care</h3>
                
                <div className="space-y-3 font-sans text-xs">
                  <div className="flex gap-2.5 items-start">
                    <span className="text-lg">♿</span>
                    <div className="text-slate-600 dark:text-slate-300">
                      <strong className="text-slate-800 dark:text-slate-200">Accessible:</strong> We solve the problem of inaccessible salons by bringing the service directly to your living room.
                    </div>
                  </div>
                  <div className="flex gap-2.5 items-start">
                    <span className="text-lg">🌿</span>
                    <div className="text-slate-600 dark:text-slate-300">
                      <strong className="text-slate-800 dark:text-slate-200">Specially Trained:</strong> Our independent professionals are trained to work gently with seniors and individuals with special needs.
                    </div>
                  </div>
                  <div className="flex gap-2.5 items-start">
                    <span className="text-lg">✨</span>
                    <div className="text-slate-600 dark:text-slate-300">
                      <strong className="text-slate-800 dark:text-slate-200">Convenient:</strong> From quick fixes like repairing a nail to regular haircuts, we bring the salon to you.
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* Core Services Overview Grid */}
        <section className="py-16 bg-white dark:bg-slate-950 border-b border-slate-100 dark:border-slate-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Hair Care */}
              <div className="flex flex-col items-center text-center space-y-4 p-8 rounded-3xl bg-slate-50 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800 transition-all hover:shadow-lg">
                <div className="w-14 h-14 rounded-2xl bg-pink-100 dark:bg-pink-900/40 flex items-center justify-center text-pink-600 dark:text-pink-400 mb-2">
                  <Scissors className="w-7 h-7" />
                </div>
                <h3 className="font-serif font-bold text-xl text-slate-900 dark:text-white tracking-tight">Hair Care</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  Professional haircuts, blowouts, and gentle styling brought right to your living room or facility chair.
                </p>
              </div>
              
              {/* Nail Services */}
              <div className="flex flex-col items-center text-center space-y-4 p-8 rounded-3xl bg-slate-50 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800 transition-all hover:shadow-lg">
                <div className="w-14 h-14 rounded-2xl bg-purple-100 dark:bg-purple-900/40 flex items-center justify-center text-purple-600 dark:text-purple-400 mb-2">
                  <Sparkles className="w-7 h-7" />
                </div>
                <h3 className="font-serif font-bold text-xl text-slate-900 dark:text-white tracking-tight">Nail Services</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  Waterless, diabetic-friendly manicures and pedicures with an emphasis on gentle hand and foot care.
                </p>
              </div>

              {/* Wellness & Grooming */}
              <div className="flex flex-col items-center text-center space-y-4 p-8 rounded-3xl bg-slate-50 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800 transition-all hover:shadow-lg">
                <div className="w-14 h-14 rounded-2xl bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center text-blue-600 dark:text-blue-400 mb-2">
                  <Heart className="w-7 h-7" />
                </div>
                <h3 className="font-serif font-bold text-xl text-slate-900 dark:text-white tracking-tight">Wellness & Grooming</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  Compassionate skincare, esthetics, and dignity-focused grooming ensuring confidence and well-being.
                </p>
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

        {/* 5. Dedicated Graduate & Aspirant Onboarding Program Section */}
        <NewGradsSection />

        {/* 4. Strategic brand copywriter tool (Interactive selection panel) - ADMIN ONLY */}
        {isAdminAuthenticated && (
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
        )}

        {/* 5. Safe Interactive Waitlist signup + live database simulator */}
        <WaitlistForm 
          isAdminAuthenticated={isAdminAuthenticated} 
          setIsAdminAuthenticated={setIsAdminAuthenticated} 
        />

        {/* 7. Fully Expandable accordion FAQ system with real-time text-search query */}
        <FaqSection onOpenSecurity={() => setSecurityModalOpen(true)} />

        {/* Final call to action banners */}
        <section className="bg-gradient-to-tr from-pink-500 via-purple-600 to-cyan-500 text-white py-20 relative overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-white/5 rounded-full blur-3xl"></div>
          
          <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-6 relative z-10">
            <span className="text-xs font-mono uppercase font-bold tracking-widest bg-white/20 px-3 py-1 rounded-full text-white border border-white/10">
              Personal Care
            </span>
            <h2 className="text-3xl md:text-5.5xl font-serif font-black tracking-tight leading-tight">
              Self-grooming and respect are fundamental rights.
            </h2>
            <p className="text-pink-100 text-base md:text-lg max-w-2xl mx-auto leading-relaxed font-sans">
              Help us bring comfort, confidence, and beauty directly to seniors, people with disabilities, and busy families in their own homes. Join our waitlist today.
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
          safeScrollTo({ top: 0, behavior: 'smooth' });
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
                <li><button onClick={() => { try { window.print(); } catch (e) { console.warn("Printing is not supported in this iframe sandbox.", e); } }} className="text-rose-300 hover:text-white font-bold transition-colors cursor-pointer text-left focus:outline-none flex items-center gap-1.5" id="download-printable-brochure-footer-btn">🖨️ Download Printable Brochure</button></li>
              </ul>
            </div>

            {/* Contact Newsletter info */}
            <div className="md:col-span-4 space-y-3">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">Advisory & Contact</h4>
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

              {/* Verified Secure Badge near Footer */}
              <div className="pt-4 flex flex-wrap gap-3 items-center">
                <button 
                  onClick={() => setSecurityModalOpen(true)}
                  className="inline-flex items-center gap-2 px-3 py-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 rounded-lg border border-emerald-500/20 hover:border-emerald-500/40 transition-all text-xs font-semibold cursor-pointer"
                >
                  <ShieldCheck className="w-4 h-4" />
                  Verified Secure Profile
                </button>
              </div>

              {/* Quick Access QR Code */}
              <div className="pt-6 border-t border-slate-900/60 mt-6">
                <div className="bg-slate-900/40 rounded-2xl p-4 border border-slate-800/60 flex items-center gap-4 hover:border-slate-700/80 transition-all group">
                  <div className="bg-white p-2 rounded-xl shrink-0 shadow-lg relative overflow-hidden group-hover:scale-105 transition-transform duration-300">
                    <img 
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=${encodeURIComponent(getShareUrl())}&color=0f172a&bgcolor=ffffff`}
                      alt="Quick Access QR Code"
                      className="w-20 h-20 relative z-10"
                      referrerPolicy="no-referrer"
                      loading="lazy"
                    />
                  </div>
                  <div className="space-y-1">
                    <h5 className="text-xs font-bold text-white uppercase tracking-wider font-mono flex items-center gap-1.5">
                      <QrCode className="w-3.5 h-3.5 text-pink-400 animate-pulse" />
                      Quick Access QR
                    </h5>
                    <p className="text-[11px] text-slate-500 leading-relaxed max-w-[200px]">
                      Scan with your smartphone camera to instantly open and share your exact custom-configured workspace on mobile.
                    </p>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Legal Fine Print - Safety disclaimer */}
          <div className="pt-8 border-t border-slate-900 text-[10px] text-slate-600 space-y-2 leading-relaxed">
            <p>
              <strong>IMPORTANT DISCLAIMER:</strong> Beauty Brought to You (BBTY) is an informational mobile beauty platform. We do not provide medical treatments, clinical therapy, or nursing care. Our independent stylists work within their professional licensing guidelines regarding cosmetic services, basic grooming, and aesthetic care.
            </p>
            <div className="flex flex-wrap items-center gap-3.5 text-slate-500 font-mono mt-2">
              <span>© {new Date().getFullYear()} Beauty Brought To You, LLC. All rights or trademarks reserved.</span>
              <span className="text-slate-800">•</span>
              <button 
                onClick={() => {
                  setCurrentPage('privacy');
                  safeScrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="hover:text-pink-400 font-bold transition-colors cursor-pointer text-left focus:outline-none flex items-center gap-1"
              >
                🔒 Security & Privacy Policy
              </button>
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
            🏡 About Us
          </h2>
          <p className="text-xs text-stone-700 leading-relaxed">
            Beauty Brought to You is a mobile platform delivering licensed beauty support, gentle skincare, and grooming directly to clients at home. We serve seniors, individuals with disabilities, and anyone seeking convenient salon services within their comfort zone. Guided by safety and compassion, we believe self-grooming is a fundamental right.
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
          <strong>CRITICAL SAFETY & MEDICAL DISCLAIMER:</strong> Beauty Brought to You (BBTY) is an informational mobile platform. We do not provide medical treatments, physical therapy, or medical dermatology. Stylists operate within their local licensing guidelines regarding cosmetic services and basic grooming.
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
      <SecurityModal isOpen={securityModalOpen} onClose={() => setSecurityModalOpen(false)} />

      {/* Smooth Premium Back to Top Button */}
      <AnimatePresence>
        {scrollY > 500 && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 30 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            onClick={() => safeScrollTo({ top: 0, behavior: 'smooth' })}
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

