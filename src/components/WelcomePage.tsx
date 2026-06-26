import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { safeConfetti } from '../lib/safeConfetti';

interface WelcomePageProps {
  onComplete: () => void;
}

export default function WelcomePage({ onComplete }: WelcomePageProps) {
  const [showLogo, setShowLogo] = useState(false);

  useEffect(() => {
    // Delay to let the background wave initiate
    const timer1 = setTimeout(() => {
      setShowLogo(true);
      
      // Fire a massive "forming" confetti splash exactly from the center
      // right as the logo starts scaling up.
      setTimeout(() => {
        const count = 250;
        const defaults = {
          origin: { x: 0.5, y: 0.5 },
          colors: ['#ec4899', '#8b5cf6', '#3b82f6', '#06b6d4', '#e879f9'],
          zIndex: 10000,
          disableForReducedMotion: true
        };

        function fire(particleRatio: number, opts: any) {
          safeConfetti({
            ...defaults,
            ...opts,
            particleCount: Math.floor(count * particleRatio)
          });
        }

        // Inner dense burst
        fire(0.25, {
          spread: 26,
          startVelocity: 65,
        });
        // Core layer
        fire(0.2, {
          spread: 60,
        });
        // Wide slower layer
        fire(0.35, {
          spread: 100,
          decay: 0.91,
          scalar: 0.8
        });
        // Extra large particles
        fire(0.1, {
          spread: 120,
          startVelocity: 25,
          decay: 0.92,
          scalar: 1.2
        });
        // Outermost rapid burst
        fire(0.1, {
          spread: 120,
          startVelocity: 55,
        });
      }, 250); // Burst happens slightly after logo initiates its zoom
      
    }, 200);
    
    // Auto-dismiss the splash screen to reveal the site 
    const timer2 = setTimeout(() => {
      onComplete();
    }, 4500);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [onComplete]);

  return (
    <motion.div
      key="welcome-splash-screen"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 1.2, ease: "easeInOut" } }}
      className="fixed inset-0 z-[9999] overflow-hidden flex items-center justify-center bg-[#f0f3f8] dark:bg-[#060a14] high-contrast:bg-white high-contrast:dark:bg-black"
    >
      {/* Background with animated diagonal wave effect */}
      <div className="absolute inset-0 z-0 bg-welcome-wave opacity-90 dark:opacity-40" />

      {/* The Logo fading into view and growing larger */}
      <AnimatePresence>
        {showLogo && (
          <motion.div
            initial={{ opacity: 0, scale: 0.1, rotate: -5 }} 
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 2.8, ease: [0.16, 1, 0.3, 1] }}
            className="z-10 relative flex flex-col items-center justify-center w-full h-full px-6"
          >
            <img 
              src="/bbty-circle-logo.svg" 
              alt="BBTY Beauty Brought To You - Welcome"
              className="w-full max-w-lg object-contain drop-shadow-2xl"
              style={{ filter: 'drop-shadow(0px 20px 40px rgba(139, 92, 246, 0.4))' }}
              onError={(e) => {
                console.error("BBTY logo failed to load", e);
              }}
            />
            {/* Fallback styling placeholder just in case */}
            <div className="absolute inset-0 flex items-center justify-center -z-10 animate-pulse">
              <div className="w-[400px] h-[400px] bg-gradient-to-br from-pink-500/10 to-purple-500/10 rounded-full blur-3xl mix-blend-multiply" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
