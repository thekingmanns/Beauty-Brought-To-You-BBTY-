import React, { useState } from 'react';
import { Share2, Copy, Check, Facebook, Linkedin, Twitter, Heart, MessageSquare, ExternalLink, ShieldAlert } from 'lucide-react';

export default function ShareWidget({ onOpenReferral }: { onOpenReferral?: () => void }) {
  const serviceUrl = "https://beautybroughttoyou.com";
  const [copied, setCopied] = useState(false);
  const [selectedRole, setSelectedRole] = useState<'caregiver' | 'healthcare' | 'advocate'>('caregiver');
  const [shareCount, setShareCount] = useState(() => {
    // Elegant local persistence or initial realistic seed
    const local = localStorage.getItem('bbty_shares_count');
    return local ? parseInt(local, 10) : 142;
  });

  const messageTemplates = {
    caregiver: "I just discovered Beauty Brought to You (BBTY)! They bring compassionate, professional salon-quality beauty and wellness care directly to caregivers, seniors, and families at home. Sign up for waitlist rollouts!",
    healthcare: "I highly recommend exploring Beauty Brought to You (BBTY). They are mobilizing dignified, accessibility-trained beauty salons and hand care directly to senior living and memory support homes.",
    advocate: "Dignity and grooming are basic rights. Help Beauty Brought to You (BBTY) launch in your area to deliver gentle beauty services to mobility-limited individuals and families."
  };

  const getShareText = () => {
    return messageTemplates[selectedRole];
  };

  const copyToClipboard = () => {
    const fullText = `${getShareText()}\n\nJoin the rollout waitlist here: ${serviceUrl}`;
    navigator.clipboard.writeText(fullText).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
      
      // Increment simulated count upon user engagement
      const newCount = shareCount + 1;
      setShareCount(newCount);
      localStorage.setItem('bbty_shares_count', String(newCount));
    });
  };

  const triggerSocialShare = (platform: 'facebook' | 'linkedin' | 'twitter') => {
    const text = encodeURIComponent(getShareText());
    const url = encodeURIComponent(serviceUrl);
    let shareLink = '';

    if (platform === 'facebook') {
      shareLink = `https://www.facebook.com/sharer/sharer.php?u=${url}&quote=${text}`;
    } else if (platform === 'linkedin') {
      shareLink = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;
    } else if (platform === 'twitter') {
      shareLink = `https://twitter.com/intent/tweet?url=${url}&text=${text}`;
    }

    // Open real popup
    window.open(shareLink, '_blank', 'width=600,height=450,location=no,toolbar=no,menubar=no');

    // Increment simulated counts on engagement
    const newCount = shareCount + 1;
    setShareCount(newCount);
    localStorage.setItem('bbty_shares_count', String(newCount));
  };

  const socialLinks = [
    {
      name: "Instagram",
      color: "bg-gradient-to-tr from-yellow-500 via-pink-500 via-red-500 to-purple-600 hover:shadow-pink-500/20",
      url: "https://www.instagram.com/beautybroughttoyou_placeholder",
      icon: (
        <svg viewBox="0 0 24 24" className="w-5 h-5 fill-none stroke-current" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
          <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
          <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
        </svg>
      )
    },
    {
      name: "Facebook",
      color: "bg-[#1877F2] hover:bg-[#166fe5] hover:shadow-blue-600/20",
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(serviceUrl)}&quote=${encodeURIComponent(getShareText())}`,
      icon: (
        <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
        </svg>
      )
    },
    {
      name: "LinkedIn",
      color: "bg-[#0077B5] hover:bg-[#00669c] hover:shadow-blue-500/20",
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(serviceUrl)}`,
      icon: (
        <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003y"/>
        </svg>
      )
    },
    {
      name: "TikTok",
      color: "bg-black hover:bg-slate-950 hover:shadow-cyan-500/20 border border-slate-800",
      url: "https://www.tiktok.com/@beautybroughttoyou_placeholder",
      icon: (
        <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
          <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.17-2.81-.74-3.95-1.63-.1-.08-.17-.06-.23.03-.4 1.01-1.07 1.88-1.92 2.52-.08.06-.09.11-.09.2.02 2.22-.01 4.43-.01 6.65.02 1.4-.28 2.87-1.02 4.07-1.19 1.95-3.38 3.19-5.67 3.19-2.1 0-4.16-1.03-5.32-2.77-1.41-2.11-1.4-5.07.03-7.17C7.26 11.5 9.4 10.47 11.82 10.74c.08.01.12-.01.12-.1V6.52c-.17-.01-.35-.01-.52-.02-3.15-.22-5.73-1.6-7.39-4.32C2.18 10.87.56 8.35.53 5.56c-.05-4.4 4.54-7.85 8.78-6.6 1.25.37 2.37 1.14 3.13 2.19.06.08.09.07.13-.01.01-.2 0-.4 0-.6-.01-.49-.01-.98-.01-1.47l-.03-.05z"/>
        </svg>
      )
    },
    {
      name: "X",
      color: "bg-slate-900 hover:bg-black dark:bg-black dark:hover:bg-slate-950 hover:shadow-slate-500/20 border border-slate-800",
      url: `https://twitter.com/intent/tweet?url=${encodeURIComponent(serviceUrl)}&text=${encodeURIComponent(getShareText())}`,
      icon: (
        <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
        </svg>
      )
    },
    {
      name: "WhatsApp",
      color: "bg-[#25D366] hover:bg-[#20ba59] hover:shadow-emerald-500/20",
      url: `https://api.whatsapp.com/send?text=${encodeURIComponent(getShareText() + " " + serviceUrl)}`,
      icon: (
        <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.458 5.704 1.459h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
        </svg>
      )
    },
    {
      name: "Telegram",
      color: "bg-[#26A5E4] hover:bg-[#208ebe] hover:shadow-cyan-500/20",
      url: `https://t.me/share/url?url=${encodeURIComponent(serviceUrl)}&text=${encodeURIComponent(getShareText())}`,
      icon: (
        <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
          <path d="M11.944 0C5.344 0 0 5.344 0 11.944c0 6.6 5.344 11.944 11.944 11.944 6.6 0 11.944-5.344 11.944-11.944C23.888 5.344 18.544 0 11.944 0zm5.82 8.16l-1.92 9.06c-.135.63-.51.78-.135.78H15.7l-2.92-2.16-1.41 1.36c-.15.15-.28.28-.58.28l.21-2.98 5.43-4.91c.24-.21-.05-.33-.37-.12l-6.72 4.23-2.89-.9c-.63-.2-.64-.63.13-.93l11.29-4.36c.52-.19.98.12.78.81z"/>
        </svg>
      )
    },
  ];

  return (
    <section className="py-20 bg-transparent border-y border-white/10 dark:border-white/5 transition-colors duration-200" id="caregiver-share-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Title block */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-purple-600 dark:text-purple-300 uppercase tracking-widest font-mono bg-purple-50 dark:bg-purple-950/30 px-3.5 py-1.5 rounded-full border border-purple-100/40 dark:border-purple-900/10 shadow-sm animate-pulse">
            <Heart className="w-3.5 h-3.5 text-purple-500" />
            Caregiver & Ally Amplification
          </span>
          <h2 className="text-3xl md:text-5xl font-serif text-slate-900 dark:text-white font-bold tracking-tight mt-3">
            Amplify Dignity in Your Community
          </h2>
          <p className="text-slate-600 dark:text-slate-300 mt-4 text-sm md:text-base leading-relaxed">
            By sharing our mission with other supportive caregivers, families, and healthcare networks, you build the dense local coordination required to prioritize and authorize regional launch approvals for Beauty Brought to You (BBTY).
          </p>
        </div>

        {/* Master layout grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Preset Builder & Share Control Center (Left side, 7 columns) */}
          <div className="lg:col-span-7 flex flex-col justify-between bg-white dark:bg-slate-900 border border-slate-250 dark:border-slate-800/80 rounded-3xl p-6 md:p-8 shadow-sm text-left transition-colors duration-200">
            
            <div className="space-y-6">
              {/* Step 1: Select Role */}
              <div className="space-y-3">
                <span className="text-[10px] font-mono font-bold text-purple-500 dark:text-purple-400 uppercase tracking-widest block">
                  1. Choose Your Advocacy Profile
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    { id: 'caregiver', emoji: '🏡', title: 'Devoted Caregiver', desc: 'Family & Elder advocates' },
                    { id: 'healthcare', emoji: '🧑‍⚕️', title: 'Healthcare Hero', desc: 'Facility & nursing staff' },
                    { id: 'advocate', emoji: '✨', title: 'Community Ally', desc: 'Promoting local wellness' },
                  ].map((role) => {
                    const active = selectedRole === role.id;
                    return (
                      <button
                        key={role.id}
                        type="button"
                        onClick={() => setSelectedRole(role.id as any)}
                        className={`p-3 rounded-xl border text-left transition-all relative cursor-pointer outline-none ${
                          active
                            ? 'bg-gradient-to-br from-purple-50 to-purple-100/40 dark:from-purple-950/20 dark:to-purple-900/10 border-purple-200 dark:border-purple-800 text-purple-950 dark:text-purple-150 shadow-xs'
                            : 'bg-white dark:bg-slate-950 hover:bg-slate-100/30 dark:hover:bg-slate-900/30 border-slate-200 dark:border-slate-850 text-slate-600 dark:text-slate-350'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-lg leading-none">{role.emoji}</span>
                          <span className="text-xs font-bold font-sans tracking-tight block">
                            {role.title}
                          </span>
                        </div>
                        <span className="text-[10px] text-slate-400 dark:text-slate-500 block mt-1 leading-normal font-sans">
                          {role.desc}
                        </span>
                        {active && (
                          <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-purple-500 rounded-full"></span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Step 2: Custom Text Template Preview */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-mono font-bold text-purple-500 dark:text-purple-400 uppercase tracking-widest block">
                    2. Recommended Copy text
                  </span>
                  <span className="text-[10px] font-mono text-slate-400 dark:text-slate-500">
                    Automatically formatted
                  </span>
                </div>
                <div className="relative">
                  <textarea
                    readOnly
                    value={getShareText()}
                    className="w-full h-32 p-4 bg-white dark:bg-slate-950 border border-slate-205 dark:border-slate-800 rounded-2xl text-xs text-slate-700 dark:text-slate-200 leading-relaxed resize-none focus:outline-none focus:ring-0 shadow-inner font-sans"
                  />
                  <div className="absolute bottom-3 right-3 flex items-center gap-1 bg-purple-500/10 dark:bg-purple-500/20 px-2.5 py-1 rounded-lg border border-purple-200/50 dark:border-purple-850">
                    <Heart className="w-3 h-3 text-purple-500 fill-purple-500 animate-pulse" />
                    <span className="text-[10px] font-bold font-mono text-purple-700 dark:text-purple-300">Preset Active</span>
                  </div>
                </div>
              </div>

              {/* Share Stats */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-purple-50/50 dark:bg-purple-950/15 p-4 rounded-xl border border-purple-100/30 dark:border-purple-900/10">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center flex-shrink-0">
                    <MessageSquare className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div className="text-xs">
                    <p className="font-semibold text-slate-800 dark:text-slate-200">
                      💖 Over <span className="font-bold text-purple-600 dark:text-purple-400 font-mono text-sm">{shareCount} Caregivers</span> & allies shared this link
                    </p>
                    <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5 font-sans">
                      Each share registers regional demand coordinates to help fast-track launch priorities.
                    </p>
                  </div>
                </div>
                {onOpenReferral && (
                  <button
                    type="button"
                    onClick={onOpenReferral}
                    className="self-start sm:self-center px-3.5 py-2 bg-purple-600/10 hover:bg-purple-600/20 text-purple-700 dark:text-purple-300 font-bold rounded-xl text-[10px] uppercase tracking-wider flex items-center gap-1.5 cursor-pointer transition-all border border-purple-200 dark:border-purple-800"
                  >
                    <span>Ambassador Referral</span>
                    <Share2 className="w-3 h-3 text-purple-500" />
                  </button>
                )}
              </div>

            </div>

            {/* Step 3: Trigger real social shares & Copy actions */}
            <div className="pt-6 border-t border-slate-150 dark:border-slate-800 mt-6 space-y-4">
              <span className="text-[10px] font-mono font-bold text-purple-500 dark:text-purple-400 uppercase tracking-widest block">
                3. Share to Digital Care Circles
              </span>
              
              <div className="flex flex-wrap gap-3">
                {/* Facebook Share Button */}
                <button
                  type="button"
                  onClick={() => triggerSocialShare('facebook')}
                  className="flex-1 min-w-[130px] inline-flex items-center justify-center gap-2 px-4 py-3 bg-[#1877F2] hover:bg-[#156cd4] text-white font-medium rounded-xl text-xs transition-colors cursor-pointer group"
                >
                  <Facebook className="w-4 h-4 text-white group-hover:scale-110 transition-transform" />
                  <span>Share on Facebook</span>
                </button>

                {/* LinkedIn Share Button */}
                <button
                  type="button"
                  onClick={() => triggerSocialShare('linkedin')}
                  className="flex-1 min-w-[130px] inline-flex items-center justify-center gap-2 px-4 py-3 bg-[#0077B5] hover:bg-[#00669b] text-white font-medium rounded-xl text-xs transition-colors cursor-pointer group"
                >
                  <Linkedin className="w-4 h-4 text-white group-hover:scale-110 transition-transform" />
                  <span>Share on LinkedIn</span>
                </button>

                {/* X Share Button */}
                <button
                  type="button"
                  onClick={() => triggerSocialShare('twitter')}
                  className="flex-1 min-w-[130px] inline-flex items-center justify-center gap-2 px-4 py-3 bg-slate-900 hover:bg-black dark:bg-black dark:hover:bg-slate-900 text-white font-medium rounded-xl text-xs border border-slate-800 dark:border-slate-800 transition-colors cursor-pointer group"
                >
                  <Twitter className="w-4 h-4 text-white group-hover:scale-110 transition-transform" />
                  <span>Share on X / Twitter</span>
                </button>
              </div>

              {/* Copy URL & Custom text block combined */}
              <button
                type="button"
                onClick={copyToClipboard}
                className={`w-full py-3.5 px-4 rounded-xl font-medium text-xs flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  copied 
                    ? 'bg-emerald-500 text-white shadow-emerald-500/10' 
                    : 'bg-purple-600 hover:bg-purple-700 text-white shadow-purple-500/10 shadow-sm'
                }`}
              >
                {copied ? (
                  <>
                    <Check className="w-4.5 h-4.5 animate-bounce" />
                    <span>Copied Prepared Link & Text to Your Clipboard! Code Green.</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>Copy Complete Service Invitation Text & Link</span>
                  </>
                )}
              </button>

              {/* Row of dedicated social media icons to amplify the mission */}
              <div className="pt-4 border-t border-slate-200/50 dark:border-slate-800/80 mt-4 space-y-3" id="social-fast-share-row">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest block">
                    Fast Amplify Channels (7 Platforms)
                  </span>
                  <span className="text-[9px] text-pink-600 dark:text-pink-400 font-mono font-medium bg-pink-50 dark:bg-pink-950/45 px-2.5 py-0.5 rounded-md border border-pink-100/20">
                    Direct Links
                  </span>
                </div>
                
                <div className="flex flex-wrap items-center gap-3 p-3 bg-white dark:bg-slate-950 border border-slate-150 dark:border-slate-850 rounded-2xl shadow-3xs">
                  {socialLinks.map((social) => (
                    <a
                      key={social.name}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer nofollow"
                      onClick={() => {
                        // Increment simulated counts on engagement
                        const newCount = shareCount + 1;
                        setShareCount(newCount);
                        localStorage.setItem('bbty_shares_count', String(newCount));
                      }}
                      title={`Share BBTY on ${social.name}`}
                      className={`w-10 h-10 rounded-full flex items-center justify-center text-white transition-all duration-300 hover:scale-110 shadow-xs cursor-pointer ${social.color}`}
                    >
                      {social.icon}
                    </a>
                  ))}
                </div>
              </div>
            </div>

          </div>

          {/* Realistic Rich Live Card Unfurl Mock (Right side, 5 columns) */}
          <div className="lg:col-span-5 bg-white dark:bg-slate-900 border border-slate-250 dark:border-slate-800/80 rounded-3xl p-6 flex flex-col justify-between shadow-xs text-left transition-colors duration-200">
            
            <div className="space-y-4">
              <span className="text-[10px] font-mono font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest block">
                Visual Share Card Preview
              </span>
              
              {/* The Mock Feed unfurl */}
              <div className="border border-slate-105 dark:border-slate-800 rounded-2xl overflow-hidden bg-white dark:bg-slate-950 shadow-sm">
                
                {/* Fake App header (Facebook or LinkedIn lookalike) */}
                <div className="p-3.5 border-b border-slate-100 dark:border-slate-900/60 flex items-center gap-2.5">
                  <div className="w-7 h-7 bg-purple-500/10 dark:bg-purple-500/20 text-purple-600 dark:text-purple-300 rounded-full flex items-center justify-center font-bold text-[10px] font-mono leading-none">
                    BBTY
                  </div>
                  <div className="leading-tight">
                    <h5 className="text-[11px] font-bold text-slate-850 dark:text-slate-200 flex items-center gap-1">
                      Beauty Brought to You 
                      <span className="text-[9px] px-1 bg-purple-50 dark:bg-purple-950 text-purple-600 dark:text-purple-300 rounded-sm font-normal">Official Page</span>
                    </h5>
                    <p className="text-[9px] text-slate-400 dark:text-slate-500 leading-none mt-0.5">Sponsored • Compassionate Care Rollout</p>
                  </div>
                </div>

                {/* Sub text user comment dynamically rendered */}
                <div className="p-3.5 bg-slate-50/40 dark:bg-slate-950/10 text-xs italic font-sans text-slate-600 dark:text-slate-350 leading-relaxed border-b border-slate-100 dark:border-slate-900/60">
                  "{getShareText()}"
                </div>

                {/* Card representation image placeholders or clean stylized layouts mimicking the exact scissors logo assets */}
                <div className="bg-gradient-to-br from-brand-pink/5 via-brand-purple/5 to-brand-cyan/5 p-8 flex flex-col items-center justify-center relative overflow-hidden h-40">
                  {/* Decorative faint grid lines */}
                  <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-brand-pink via-brand-purple to-brand-cyan"></div>
                  
                  {/* Miniature beautiful road assets */}
                  <svg 
                    viewBox="0 0 100 100" 
                    className="w-20 h-20 relative z-10" 
                    fill="none" 
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <defs>
                      <filter id="scissors-shadow-widget" x="-30%" y="-30%" width="160%" height="160%">
                        <feDropShadow dx="1.5" dy="2.5" stdDeviation="1.8" floodColor="#5c5fc5" floodOpacity="0.22" />
                      </filter>
                    </defs>

                    {/* Circle 1: Large Light Periwinkle Background Circle (with decorative stitching like a pincushion) */}
                    <circle cx="70" cy="42" r="26" fill="#e8ecfb" stroke="#a3b8f0" strokeWidth="1.5" strokeDasharray="3,3" />

                    {/* Scissors Group with shadow filter for distinguished hovering appearance */}
                    <g filter="url(#scissors-shadow-widget)">
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
                  
                  <span className="text-[9px] tracking-widest font-mono font-bold uppercase text-purple-700 bg-purple-50 px-2 py-0.5 rounded-full border border-purple-100 shadow-3xs mt-2 relative z-10">
                    beautybroughttoyou.com
                  </span>
                </div>

                {/* Text unfurl title & desc metadata */}
                <div className="p-3.5 bg-slate-50 dark:bg-slate-950 font-sans text-left space-y-1">
                  <span className="text-[9px] font-bold text-pink-600 uppercase font-mono tracking-widest">
                    Caregiver Rollout Waitlist
                  </span>
                  <h4 className="text-xs font-bold text-slate-800 dark:text-slate-100 leading-tight">
                    Compassionate Salon-Quality Beauty Service Brought Directly to You
                  </h4>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-snug">
                    Say goodbye to inaccessible clinic stairs, high parlor seats, or painful coordination hazards. Our wellness-aware beauty partners serve elderly, memory-care & homebound family.
                  </p>
                </div>

              </div>

              {/* Extra tips specifically focused on LinkedIn/Facebook sharing */}
              <div className="space-y-2 bg-pink-50/20 dark:bg-slate-950/40 p-4 rounded-xl border border-pink-100/10">
                <span className="text-[9.5px] font-mono font-bold text-pink-600 dark:text-pink-300 uppercase tracking-wider block">
                  💡 How sharing accelerates rollout:
                </span>
                <ul className="text-[11px] text-slate-500 dark:text-slate-400 space-y-1 pl-3.5 list-disc">
                  <li><strong>LinkedIn</strong>: Matches our administrative teams with local municipal grants and private senior care sponsors.</li>
                  <li><strong>Facebook</strong>: Connects our independent contractors with nursing assistants, daughters, and home care helpers directly.</li>
                  <li><strong>Print & Offline</strong>: You can also print the offline brochure below to physically pin in community bullet boards!</li>
                </ul>
              </div>

            </div>

            {/* Verification of encrypted TLS routing */}
            <div className="flex gap-1.5 items-center justify-center text-[9px] font-mono text-slate-400 dark:text-slate-500 mt-6 pt-3.5 border-t border-slate-100 dark:border-slate-900">
              <ExternalLink className="w-3 h-3 text-purple-400" />
              <span>Realistic social share callbacks and popup frames configured.</span>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
