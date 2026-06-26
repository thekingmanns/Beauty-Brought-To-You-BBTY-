export interface WaitlistSubmission {
  id: string;
  name: string;
  email: string;
  phone: string;
  category: 'client_family' | 'facility_partner' | 'salon_owner_stylist' | 'independent_professional' | 'aspiring_technician';
  services: string[];
  notes?: string;
  submittedAt: string;
}

export interface FaqItem {
  question: string;
  answer: string;
  category: 'general' | 'safety' | 'facilities' | 'join-us';
}

export interface PricingPlan {
  id: string;
  name: string;
  subtitle: string;
  priceMonthly: number;
  priceAnnually: number;
  features: string[];
  ctaText: string;
  isPopular?: boolean;
}

export interface BrandAsset {
  id: number;
  text: string;
}
