import React, { useState } from 'react';
import { ToggleLeft, ToggleRight, Check, AlertCircle } from 'lucide-react';
import { PricingPlan } from '../types';

interface PricingTiersProps {
  onJoinWaitlistClick: () => void;
}

export default function PricingTiers({ onJoinWaitlistClick }: PricingTiersProps) {
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'annually'>('monthly');

  const plans: PricingPlan[] = [
    {
      id: 'client',
      name: 'Comfort Care Circle',
      subtitle: 'For Clients & Dedicated Families',
      priceMonthly: 19.99,
      priceAnnually: 15.99,
      features: [
        'Secure early queue slots upon area rollout',
        'Optional recurring service locks (weekly/monthly checks)',
        'Priority client service window scheduling',
        'Direct family notification logs and safety sheets',
        '10% sibling or couples discount on grouped visits'
      ],
      ctaText: 'Join Client Waitlist'
    },
    {
      id: 'independent',
      name: 'Independent Pro Path',
      subtitle: 'For Solo Beauty Vanguards',
      priceMonthly: 29.00,
      priceAnnually: 23.00,
      features: [
        'Set 100% of your service rates and active radius',
        'Claim unlimited private home client bookings',
        'Zero commission fees on your core hours',
        'Access to specialized BBTY safety training logs',
        'Pre-integrated mobile card payment ledger'
      ],
      ctaText: 'Register as Independent Pro',
      isPopular: true
    },
    {
      id: 'salon-basic',
      name: 'Salon Partner Basic',
      subtitle: 'For Boutique Multi-Stylist Shops',
      priceMonthly: 79.00,
      priceAnnually: 63.00,
      features: [
        'Register and manage up to 3 salon stylists',
        'Accept nearby home or workplace bookings',
        'Perfect for filling slow weekday morning tables',
        'Standard dashboard tracking for stylist hours',
        'Full customer service backup from BBTY'
      ],
      ctaText: 'Register Basic Salon'
    },
    {
      id: 'salon-plus',
      name: 'Salon Partner Plus Oasis',
      subtitle: 'For Growing Commercial Teams',
      priceMonthly: 129.00,
      priceAnnually: 103.00,
      features: [
        'Register and syndicate up to 5 salon stylists',
        'Priority allocations for care facility group days',
        'Priority event, wedding, and party matching',
        'Enhanced analytics panel & team routing tools',
        'Priority local advertising spots on BBTY client catalog'
      ],
      ctaText: 'Register Plus Team'
    }
  ];

  return (
    <div className="py-20 bg-gradient-to-b from-white to-slate-50 dark:from-slate-950 dark:to-slate-950/80 border-t border-slate-100 dark:border-slate-950 text-left transition-colors duration-200" id="membership-tiers">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <span className="text-xs font-semibold text-pink-600 dark:text-pink-300 uppercase tracking-widest font-mono bg-pink-50/80 dark:bg-pink-950/40 px-3 py-1 rounded-full">
            Subscription Options
          </span>
          <h2 className="text-3xl md:text-5xl font-serif text-slate-900 dark:text-white font-medium tracking-tight mt-3">
            Honest, Community-First Memberships
          </h2>
          <p className="text-slate-600 dark:text-slate-350 mt-4 text-sm md:text-base leading-relaxed">
            Choose the membership tier that matches your professional or personal scale. 
            <span className="font-semibold text-pink-600 block sm:inline"> Pricing and plans shown below are projections for our upcoming launch. </span> No payment is required today — sign up to request priority access.
          </p>
 
          {/* Pricing warning badge */}
          <div className="inline-flex items-center gap-2 mt-6 px-4 py-2 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/40 rounded-2xl text-xs text-amber-800 dark:text-amber-200">
            <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0" />
            <span><strong>PRICING ON LAUNCH:</strong> No charges are made for joining the waitlist today. Tiers serve as preview frameworks.</span>
          </div>
        </div>
 
        {/* Dynamic Toggle buttons */}
        <div className="flex justify-center items-center gap-4 mb-16">
          <span className={`text-sm font-medium ${billingPeriod === 'monthly' ? 'text-slate-900 dark:text-slate-100' : 'text-slate-400'}`}>
            Monthly Billing
          </span>
          <button
            onClick={() => setBillingPeriod(prev => prev === 'monthly' ? 'annually' : 'monthly')}
            type="button"
            className="text-pink-600 focus:outline-none cursor-pointer"
            title="Toggle annual savings"
          >
            {billingPeriod === 'annually' ? (
              <ToggleRight className="w-12 h-12" />
            ) : (
              <ToggleLeft className="w-12 h-12 text-slate-300" />
            )}
          </button>
          <span className={`text-sm font-medium flex items-center gap-1.5 ${billingPeriod === 'annually' ? 'text-pink-900 dark:text-pink-300' : 'text-slate-400'}`}>
            Annual Billing
            <span className="bg-pink-100 dark:bg-pink-950/40 text-pink-700 dark:text-pink-300 text-[10px] font-bold font-mono px-2 py-0.5 rounded-full uppercase">
              Save 20%
            </span>
          </span>
        </div>
 
        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
          {plans.map((plan) => {
            const displayPrice = billingPeriod === 'monthly' ? plan.priceMonthly : plan.priceAnnually;
            const savingsYearly = ((plan.priceMonthly - plan.priceAnnually) * 12).toFixed(2);
            return (
              <div
                key={plan.id}
                className={`flex flex-col justify-between bg-white dark:bg-slate-900 rounded-3xl p-6.5 border transition-all ${
                  plan.isPopular
                    ? 'border-pink-300 dark:border-pink-500/50 ring-1 ring-pink-300/30 dark:ring-pink-500/10 shadow-md scale-102 relative md:-translate-y-2'
                    : 'border-slate-150 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 shadow-sm'
                }`}
              >
                {plan.isPopular && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-pink-500 to-purple-600 text-white text-[10px] font-bold font-mono px-3 py-1 rounded-full uppercase tracking-wider shadow-sm z-10">
                    Highest Interest
                  </span>
                )}
 
                <div>
                  {/* Name and Sub */}
                  <div>
                    <h3 className="text-xl font-serif font-bold text-slate-900 dark:text-white leading-tight">
                      {plan.name}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 min-h-[32px] leading-tight">
                      {plan.subtitle}
                    </p>
                  </div>
 
                  {/* Price Block */}
                  <div className="mt-5 py-4 border-y border-slate-100 dark:border-slate-805 flex items-baseline gap-1">
                    <span className="text-sm font-medium text-slate-400">$</span>
                    <span className="text-4xl font-extrabold font-mono text-slate-900 dark:text-white select-all">
                      {Math.floor(displayPrice)}
                    </span>
                    <span className="text-sm font-mono text-slate-400">
                      .{((displayPrice % 1) * 100).toFixed(0).padStart(2, '0')}
                    </span>
                    <span className="text-xs text-slate-400 ml-1">/mo</span>
                  </div>
 
                  {billingPeriod === 'annually' && (
                    <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold font-mono mt-2 bg-emerald-50 dark:bg-emerald-950/20 px-2 py-0.5 rounded-md inline-block">
                      ✓ Saves ${savingsYearly}/year billed annually
                    </p>
                  )}
 
                  {/* Features List */}
                  <ul className="mt-6 space-y-3.5">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex gap-2.5 items-start">
                        <Check className={`w-4 h-4 flex-shrink-0 mt-0.5 ${plan.isPopular ? 'text-pink-500' : 'text-slate-400'}`} />
                        <span className="text-xs md:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
 
                {/* CTA button */}
                <div className="mt-8">
                  <button
                    onClick={onJoinWaitlistClick}
                    className={`w-full py-3.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all duration-300 cursor-pointer ${
                      plan.isPopular
                        ? 'bg-gradient-to-r from-pink-500 via-purple-600 to-blue-600 hover:from-pink-600 hover:via-purple-700 hover:to-blue-700 text-white shadow-[0_4px_18px_rgba(219,39,119,0.25)] hover:shadow-[0_12px_28px_rgba(219,39,119,0.55)] border border-t-white/30 border-pink-400/40 hover:scale-[1.05] active:scale-[0.95]'
                        : 'bg-slate-50 dark:bg-slate-900 hover:bg-gradient-to-r hover:from-pink-500 hover:to-purple-600 hover:text-white text-slate-705 dark:text-slate-250 border-2 border-slate-200 dark:border-slate-800 hover:border-pink-500 dark:hover:border-pink-500 hover:scale-[1.04] active:scale-[0.95] shadow-xs'
                    }`}
                  >
                    {plan.ctaText}
                  </button>
                  <p className="text-[10px] text-center text-slate-400 dark:text-slate-500 mt-2.5">
                    No credit card required. Free early signups.
                  </p>
                </div>
 
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
