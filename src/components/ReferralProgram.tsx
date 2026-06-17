import React from 'react';
import { Gift, Users, Star, ArrowRight, CheckCircle, Sparkles, HandHeart, Award } from 'lucide-react';

export default function ReferralProgram() {
  return (
    <section id="referral-program" className="py-24 relative overflow-hidden bg-transparent border-t border-white/10 dark:border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div className="max-w-3xl mx-auto text-center space-y-4 mb-16">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 text-[10px] sm:text-xs font-bold font-mono tracking-widest uppercase text-purple-700 dark:text-purple-300 bg-purple-100/50 dark:bg-purple-900/30 border border-purple-200/50 dark:border-purple-800/50 rounded-full">
            <Gift className="w-3.5 h-3.5" />
            BBTY Rewards
          </span>
          <h2 className="text-3xl sm:text-4xl font-serif font-black text-slate-900 dark:text-white tracking-tight">
            Share Dignity. <span className="italic text-purple-600 dark:text-purple-400">Earn Rewards.</span>
          </h2>
          <p className="text-sm sm:text-base text-slate-800 dark:text-slate-100 leading-relaxed font-semibold">
            Help us expand our network of compassionate beauty professionals and families in need. Our referral program rewards you for every successful connection that brings Beauty Brought To You into a new home or facility.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start mb-20">
          {/* How to Refer */}
          <div className="space-y-8 lg:pr-8 font-sans">
            <div className="space-y-4">
              <h3 className="text-xl font-serif font-black text-slate-900 dark:text-white">How It Works</h3>
              <p className="text-sm text-slate-800 dark:text-slate-205 font-semibold">
                Whether you're a current client, a caregiver, or a salon partner, sharing BBTY is simple.
              </p>
            </div>

            <div className="space-y-6">
              {[
                {
                  step: "01",
                  title: "Get Your Unique Link",
                  desc: "Use the 'Refer a Friend' button in the menu to generate your personalized ambassador link.",
                  icon: <ArrowRight className="w-4 h-4 text-purple-500" />
                },
                {
                  step: "02",
                  title: "Share with Your Network",
                  desc: "Send your link to independent stylists, care facility directors, or families needing in-home beauty care.",
                  icon: <Users className="w-4 h-4 text-purple-500" />
                },
                {
                  step: "03",
                  title: "Automated Tracking",
                  desc: "When they join the priority waitlist or book a service through your link, your ambassador profile automatically logs the successful referral.",
                  icon: <CheckCircle className="w-4 h-4 text-purple-500" />
                }
              ].map((item, i) => (
                <div key={i} className="flex gap-4 group">
                  <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-900/20 border border-purple-100 dark:border-purple-800/30 flex items-center justify-center font-mono text-xs font-bold text-purple-600 dark:text-purple-400 transition-colors group-hover:bg-purple-600 group-hover:text-white dark:group-hover:bg-purple-500">
                    {item.step}
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                      {item.title}
                    </h4>
                    <p className="text-xs text-slate-800 dark:text-slate-200 leading-relaxed font-semibold">
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Target Audiences / Options */}
          <div className="bg-white/80 dark:bg-slate-950/45 backdrop-blur-md p-8 rounded-3xl border border-white/20 dark:border-white/10 shadow-xl shadow-slate-200/20 dark:shadow-none space-y-6">
            <h3 className="text-xl font-serif font-black text-slate-900 dark:text-white flex items-center gap-2">
              <HandHeart className="w-5 h-5 text-pink-500" />
              Who Can You Refer?
            </h3>
            
            <div className="space-y-4">
              <div className="p-4 rounded-xl border border-pink-100 dark:border-pink-900/30 bg-pink-50/50 dark:bg-pink-950/20 space-y-2">
                <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <HeartIcon /> New Clients & Families
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  Refer seniors, mobility-limited individuals, or caregivers looking for safe, in-home grooming services.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-cyan-100 dark:border-cyan-900/30 bg-cyan-50/50 dark:bg-cyan-950/20 space-y-2">
                <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <ScissorsIcon /> Beauty Professionals
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  Refer licensed cosmetologists, barbers, or nail technicians looking for flexible, high-impact freelance work.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-amber-100 dark:border-amber-900/30 bg-amber-50/50 dark:bg-amber-950/20 space-y-2">
                <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <BuildingIcon /> Care Facilities
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  Refer senior living homes, memory care communities, or rehabilitation centers lacking an on-site salon.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Tiered Rewards System */}
        <div className="space-y-8">
          <div className="text-center space-y-3">
            <h3 className="text-2xl font-serif font-black text-slate-900 dark:text-white">Tiered Rewards</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
              Your impact grows with every successful referral. Unlock exclusive perks as you build density in your community.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-sans">
            {/* Tier 1 */}
            <div className="p-6 rounded-3xl border border-white/10 dark:border-white/5 bg-white/50 dark:bg-slate-950/35 backdrop-blur-sm hover:shadow-lg transition-all space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-6">
                <Star className="w-6 h-6 text-slate-500 dark:text-slate-400" />
              </div>
              <div className="space-y-1">
                <div className="text-[10px] font-mono font-extrabold text-slate-600 dark:text-slate-300 uppercase tracking-widest">1-2 Referrals</div>
                <h4 className="text-lg font-bold text-slate-900 dark:text-white">Advocate</h4>
              </div>
              <ul className="space-y-3 text-xs text-slate-800 dark:text-slate-100 font-semibold">
                <li className="flex gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span><strong>$15 Credit</strong> towards your next service booking.</span>
                </li>
                <li className="flex gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Early access to scheduling app features.</span>
                </li>
              </ul>
            </div>

            {/* Tier 2 */}
            <div className="p-6 rounded-3xl border border-purple-200 dark:border-purple-800 bg-purple-50/15 dark:bg-purple-950/15 backdrop-blur-sm hover:shadow-lg hover:shadow-purple-500/10 transition-all space-y-4 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-3">
                <span className="px-2.5 py-1 text-[9px] font-bold bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300 rounded-full font-mono uppercase tracking-wider">Most Popular</span>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-purple-100 dark:bg-purple-900/40 flex items-center justify-center mb-6">
                <Award className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div className="space-y-1">
                <div className="text-[10px] font-mono font-extrabold text-purple-705 dark:text-purple-300 uppercase tracking-widest">3-5 Referrals</div>
                <h4 className="text-lg font-bold text-slate-900 dark:text-white">Community Builder</h4>
              </div>
              <ul className="space-y-3 text-xs text-slate-800 dark:text-slate-100 font-semibold">
                <li className="flex gap-2">
                  <CheckCircle className="w-4 h-4 text-purple-500 shrink-0" />
                  <span><strong>Free Add-on Service</strong> (e.g., deep conditioning, hand massage) for you and the referred friend.</span>
                </li>
                <li className="flex gap-2">
                  <CheckCircle className="w-4 h-4 text-purple-500 shrink-0" />
                  <span><strong>$25 Credit</strong> for Salon Partners towards supply stipends.</span>
                </li>
                <li className="flex gap-2">
                  <CheckCircle className="w-4 h-4 text-purple-500 shrink-0" />
                  <span>Priority scheduling status during busy holiday seasons.</span>
                </li>
              </ul>
            </div>

            {/* Tier 3 */}
            <div className="p-6 rounded-3xl border border-amber-205 dark:border-amber-905 bg-gradient-to-br from-amber-50/15 to-orange-50/15 dark:from-amber-900/15 dark:to-orange-950/15 backdrop-blur-sm hover:shadow-lg hover:shadow-amber-500/10 transition-all space-y-4 relative">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-900/40 flex items-center justify-center mb-6">
                <Sparkles className="w-6 h-6 text-amber-600 dark:text-amber-400" />
              </div>
              <div className="space-y-1">
                <div className="text-[10px] font-mono font-extrabold text-amber-700 dark:text-amber-300 uppercase tracking-widest">6+ Referrals</div>
                <h4 className="text-lg font-bold text-slate-900 dark:text-white">BBTY Ambassador</h4>
              </div>
              <ul className="space-y-3 text-xs text-slate-800 dark:text-slate-100 font-semibold">
                <li className="flex gap-2">
                  <CheckCircle className="w-4 h-4 text-amber-500 shrink-0" />
                  <span><strong>One Free Standard Service</strong> (haircut/blowout or basic manicure) every 6 months.</span>
                </li>
                <li className="flex gap-2">
                  <CheckCircle className="w-4 h-4 text-amber-500 shrink-0" />
                  <span><strong>$100 Cash Bonus</strong> or supply credit for referring a successfully onboarded Beauty Professional.</span>
                </li>
                <li className="flex gap-2">
                  <CheckCircle className="w-4 h-4 text-amber-500 shrink-0" />
                  <span>Direct hotline to our coordination team.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}

function HeartIcon() {
  return (
    <svg className="w-4 h-4 text-pink-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
    </svg>
  );
}

function ScissorsIcon() {
  return (
    <svg className="w-4 h-4 text-cyan-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.121 14.121L19 19m-7-7l7-7m-7 7l-2.879 2.879M12 12L9.121 9.121m0 5.758a3 3 0 10-4.243 4.243 3 3 0 004.243-4.243zm0-5.758a3 3 0 10-4.243-4.243 3 3 0 004.243 4.243z" />
    </svg>
  );
}

function BuildingIcon() {
  return (
    <svg className="w-4 h-4 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
    </svg>
  );
}
