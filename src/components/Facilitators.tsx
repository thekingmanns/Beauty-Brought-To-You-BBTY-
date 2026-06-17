import React, { useEffect } from 'react';
import { User, Users, Scissors, Building2, GraduationCap, CheckCircle2, Quote, ArrowRight } from 'lucide-react';

interface FacilitatorsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onJoinWaitlistClick: () => void;
}

export default function Facilitators({ activeTab, setActiveTab, onJoinWaitlistClick }: FacilitatorsProps) {
  
  const segments = [
    {
      id: 'clients',
      label: 'Clients & Families',
      icon: User,
      heading: 'Heartfelt Grooming & Comfort—Brought directly to where you live.',
      sub: 'Bring professional beauty care to your living room, care facility, or backyard.',
      body: 'Whether seeking regular hair styling, restorative nail care, or general beauty maintenance, BBTY transforms personal grooming into a calming wellness touch of your own choosing. From full hair sets to small details—like an immediate nail trim before an event—we are right there.',
      howItWorks: [
        'Join our priority waitlist to confirm your interest and local area.',
        'Upon regional rollout, book appointments through our accessible web app.',
        'A licensed, fully vetted wellness-aware stylist arrives at your location.',
        'Enjoy customized grooming in your own chair, couch, or wheelchair configuration.'
      ],
      points: [
        'Weekly, biweekly or monthly scheduled visits are fully customizable.',
        'Trained to accommodate walkers, wheelchairs, and physical stability supports.',
        'Great for busy families, elderly parents, or people needing brief, specialized companion care.',
        'Emergency short-run beauty tasks (like fixing a broken acrylic nail) from the convenience of home.'
      ],
      quote: {
        text: "My mom has severe arthritis and going to her local shop became too exhausting. BBTY came directly to her assisted living apartment — the stylist was patient, sweet, and made her hands look beautiful. She felt truly seen.",
        author: "Sarah M.",
        role: "Devoted Daughter"
      }
    },
    {
      id: 'facilities',
      label: 'Care Facilities & Homes',
      icon: Building2,
      heading: 'Enrich Your Resident Community—With fully structured beauty events.',
      sub: 'Increase dignity, raise spirits, and deliver clinical-safety-first grooming amenities.',
      body: 'Senior communities, assisted living boards, rehab centers, and adult day care lines can schedule recurring BBTY days. We handle everything from booking to liability coverage, providing residents with delightful hair coloring, clipping, and hand care sessions that build community and pride.',
      howItWorks: [
        'Establish your facility partner waitlist request online.',
        'Formulate custom beauty-day packages for your community sizing.',
        'BBTY handles resident scheduling, stylist staffing, and safety sheets.',
        'We arrive on-site with clean-swept practices and certified products.'
      ],
      points: [
        'Provides restorative sensory comfort to residents with dementia or brain injuries.',
        'Reduces complex outer transit, coordination risks, and family transport burdens.',
        'Specialty Group and Facility care booking access for holidays, family brunches, or birthdays.',
        'A powerful, dignified amenity to show incoming resident families and advocates.'
      ],
      quote: {
        text: "Bringing BBTY to our memory support wing has raised our residents' spirits immensely. Hand-care sessions are incredibly comforting for folks, and knowing the team is fully trained in dementia-awareness gives us absolute peace of mind.",
        author: "Robert L.",
        role: "Life Enrichment Coordinator, Golden Oasis Communities"
      }
    },
    {
      id: 'salons',
      label: 'Salon Owners & Partners',
      icon: Scissors,
      heading: 'Expand Your Stylist Base—Fill slow calendars and build local goodwill.',
      sub: 'Register team members to build community care hours and grow revenue.',
      body: 'Are you a salon owner with talented stylists who need additional booking traffic during slow weekdays? Subscribe to BBTY to access local facility, housing, or home-care group requests. Keep your brand active while reaching clients who cannot come to you.',
      howItWorks: [
        'Select a Basic (up to 3 stylists) or Plus (up to 5 stylists) Partner account preview.',
        'Register your salon footprint and employee licenses.',
        'Accept nearby community, individual, or facility bookings on demand.',
        'Perform services and clear commissions directly to your salon ledger.'
      ],
      points: [
        'Salon Partner Basic: Register up to 3 stylists to get standard booking matching.',
        'Salon Partner Plus: Register up to 5 stylists with priority, large-scale facility contracts.',
        'Outstanding asset to keep stylists active during historically slower Tuesdays & Wednesdays.',
        'Generates huge community exposure and local trust for your salon brand.'
      ],
      quote: {
        text: "We registered three of our junior artists through the BBTY salon partner dashboard. It has filled our slow mornings, built their confidence working with geriatric clients, and brought new clients directly to our home shop.",
        author: "Elena G.",
        role: "Founder, Velvet Sage Salons"
      }
    },
    {
      id: 'independent',
      label: 'Independent Professionals',
      icon: Scissors,
      heading: 'Be Your Own Advocate—Set stable rates, design schedules, grow independently.',
      sub: 'The freedom of booth rent without the expensive weekly commercial leasing costs.',
      body: 'Join as an independent mobile cosmetologist or manicurist. Build a rich clientele focusing on meaningful work. You choose your available neighborhoods, set price structures, and manage clients. We supply the training, scheduling safety, and insurance options.',
      howItWorks: [
        'Subscribe to the independent contractor tier to create your provider bio.',
        'Upload licensing and set your exact hourly or service pricing.',
        'Declare your mobile service zip-code territory and active calendar hours.',
        'Review appointment requests and get paid prompt direct-deposits.'
      ],
      points: [
        'Retain 100% control over your rates, schedules, and custom products.',
        'No costly physical booth rental commitments or overhead stressors.',
        'Access to specialized BBTY training manuals inside our mobile portal.',
        'Find deeply rewarding work supporting senior citizens, individuals with chronic illnesses, and veterans.'
      ],
      quote: {
        text: "I was tired of static salon corporate structures. With BBTY, I set my own prices, specialized in gentle geriatric manicures, and chose my own hours so I can lift my kids from school. Truly life-transforming.",
        author: "Marcus T.",
        role: "Licensed Nail Tech & Independent Contractor"
      }
    },
    {
      id: 'graduates',
      label: 'New Grads & Careers',
      icon: GraduationCap,
      heading: 'Launch Your Professional Path—Build skills with mentorship and zero booth risk.',
      sub: 'Graduate with specialized care experience, patient licensing, and instant clientele.',
      body: 'Are you a recent cosmetology/nail graduate? Avoid commercial rent strain and master real-world care. Become a BBTY employee or join our tech network. Get specialized wellness-aware training to manage, communicate, and support clients with limited mobility.',
      howItWorks: [
        'Submit a candidate application summarizing your beauty school record.',
        'Undergo our signature BBTY wellness-aware customer support program.',
        'Deliver beauty services under professional guidance to gain hours.',
        'Transition into high-priority, licensed independent contractor matching.'
      ],
      points: [
        'Bridge the gap from license to real income with immediate local care hours.',
        'Gain rare, valuable skill-sets: senior hair density care, cognitive pacing, and mobility-friendly protocols.',
        'No booth rent risk or marketing cost when starting out.',
        'Mentorship support from senior BBTY professionals throughout your growth.'
      ],
      quote: {
        text: "Straight out of clinical cosmetology camp, I dreaded booth rent. BBTY trained me on physical handling safety for wheelchair transfers and gave me clients immediately. I am earning and doing work that touches people.",
        author: "Jasmine K.",
        role: "BBTY Graduate Associate Stylist"
      }
    }
  ];

  const currentSegment = segments.find(s => s.id === activeTab) || segments[0];

  return (
    <div className="py-20 bg-transparent transition-colors duration-200" id="audience-explorer">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs font-semibold text-pink-600 dark:text-pink-300 uppercase tracking-widest font-mono bg-pink-50 dark:bg-pink-950/40 px-3 py-1 rounded-full">
            Custom-Built Pathways
          </span>
          <h2 className="text-3xl md:text-5xl font-serif text-slate-900 dark:text-white font-medium tracking-tight mt-3">
            Who We Serve & Partner With
          </h2>
          <p className="text-slate-800 dark:text-slate-100 mt-4 text-base md:text-lg leading-relaxed">
            Beauty Brought to You is an ecosystem that connects compassionate local beauty professionals directly with families, care communities, and salons to make dignity accessible. Select a pathway below:
          </p>
        </div>
 
        {/* Button style Navigation Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-12 border-b border-slate-100 dark:border-slate-900 pb-8">
          {segments.map((seg) => {
            const IconComponent = seg.icon;
            const isSelected = seg.id === activeTab;
            return (
              <button
                key={seg.id}
                onClick={() => setActiveTab(seg.id)}
                type="button"
                className={`flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 text-white shadow-md shadow-pink-500/10'
                    : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                }`}
                id={`tab-btn-${seg.id}`}
              >
                <IconComponent className="w-4 h-4" />
                {seg.label}
              </button>
            );
          })}
         {/* Content Dynamic Block */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 md:p-10 border border-slate-200 dark:border-slate-800 text-left grid grid-cols-1 lg:grid-cols-12 gap-8 items-start transition-colors duration-200 shadow-sm">
          
          {/* Details (Left Side col-span-7) */}
          <div className="lg:col-span-7 space-y-6">
            <div>
              <span className="text-xs font-mono font-bold text-rose-500 dark:text-pink-300 uppercase tracking-widest">
                Explore pathways
              </span>
              <h3 className="text-2xl md:text-3.5xl font-serif text-slate-900 dark:text-white font-medium tracking-tight mt-1">
                {currentSegment.heading}
              </h3>
              <p className="text-sm md:text-base text-slate-700 dark:text-slate-200 font-medium italic mt-2">
                {currentSegment.sub}
              </p>
              <p className="text-slate-900 dark:text-slate-100 text-sm md:text-base mt-4 leading-relaxed font-semibold">
                {currentSegment.body}
              </p>
            </div>
 
            {/* List of Benefits */}
            <div className="space-y-3">
              <h4 className="text-sm font-extrabold text-slate-900 dark:text-white uppercase tracking-wider">
                Key Support Features:
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {currentSegment.points.map((pt, idx) => (
                  <div key={idx} className="flex gap-2.5 items-start">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                    <span className="text-xs md:text-sm text-slate-800 dark:text-slate-100 leading-relaxed font-semibold">{pt}</span>
                  </div>
                ))}
              </div>
            </div>
 
            {/* Process / How It Works */}
            <div className="space-y-3 pt-4 border-t border-slate-200/60 dark:border-slate-805">
              <h4 className="text-xs font-bold font-mono text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                Our Rollout Roadmap for {currentSegment.label}
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                {currentSegment.howItWorks.map((step, idx) => (
                  <div key={idx} className="bg-slate-50 dark:bg-slate-950 rounded-xl p-3 border border-slate-200/60 dark:border-slate-800 relative transition-colors">
                    <span className="absolute top-2 right-2 text-xs font-bold font-mono text-rose-350 dark:text-rose-900/40">0{idx + 1}</span>
                    <h5 className="text-xs font-bold text-slate-850 dark:text-slate-200 font-sans">Step {idx + 1}</h5>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-snug">{step}</p>
                  </div>
                ))}
              </div>
            </div>
 
            {/* Call to action button */}
            <div className="pt-4 flex flex-wrap gap-4 items-center">
              <button
                onClick={onJoinWaitlistClick}
                className="inline-flex items-center gap-2 px-6 py-3 bg-slate-900 hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 text-white rounded-xl text-sm font-medium transition-all shadow-sm group cursor-pointer"
                id={`cta-btn-${currentSegment.id}`}
              >
                Join Waitlist for {currentSegment.label}
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">✨ Priority spots determined by signup order</span>
            </div>
          </div>
 
          {/* Sidebar (Right Side col-span-5) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Visual Callout Portrait Mock */}
            <div className="bg-white dark:from-slate-950 dark:to-pink-950/5 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 relative overflow-hidden text-center shadow-sm transition-colors duration-200">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-pink-500 via-rose-400 to-amber-300"></div>
              
              <div className="w-12 h-12 bg-rose-50 dark:bg-pink-950/45 text-rose-500 dark:text-pink-350 rounded-full flex items-center justify-center mx-auto mb-4 border border-rose-100/50 dark:border-purple-800/10">
                <currentSegment.icon className="w-6 h-6" />
              </div>
 
              <h4 className="font-semibold text-slate-800 dark:text-slate-200 text-sm">Compassionate Support Ecosystem</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-xs mx-auto">
                Connecting professional skillsets with specialized community mobility limitations safely and beautifully.
              </p>
 
              <div className="mt-6 p-4 bg-slate-50 dark:bg-slate-950/50 rounded-xl text-left border border-slate-100 dark:border-slate-800/80">
                <h5 className="text-xs font-semibold text-slate-405 dark:text-slate-500 uppercase tracking-wider font-mono">
                  General Service Categories
                </h5>
                <ul className="text-xs text-slate-600 dark:text-slate-300 mt-2 space-y-1.5 list-disc pl-4">
                  <li>Hair washing, trimming, styling, and care sets</li>
                  <li>Gentle podiatric-aware manicures & nail maintenance</li>
                  <li>Light moisturizing therapy and makeup touch-ups</li>
                  <li>Personal skin hygiene care & safe grooming trims</li>
                </ul>
              </div>
            </div>
 
            {/* Real Quote Card */}
            <div className="bg-rose-50/60 dark:bg-slate-950 rounded-2xl p-6 border border-rose-100/60 dark:border-slate-800 text-left relative transition-colors duration-200 shadow-xs">
              <Quote className="absolute top-4 right-4 w-10 h-10 text-rose-200/40 dark:text-slate-800/60" />
              <p className="text-sm text-rose-950 dark:text-purple-100 font-serif leading-relaxed italic relative z-10">
                "{currentSegment.quote.text}"
              </p>
              <div className="mt-4 pt-3 border-t border-rose-100/70 dark:border-slate-800">
                <p className="text-xs font-semibold text-rose-955 dark:text-white">{currentSegment.quote.author}</p>
                <p className="text-[10px] text-rose-700 dark:text-pink-300 uppercase tracking-wider font-mono">{currentSegment.quote.role}</p>
              </div>
            </div>            </div>
 
          </div>
 
        </div>

      </div>
    </div>
  );
}
