// Answer options for the qualification form.
// Keys MUST match App\Models\QualifiedLead::OPTIONS in the backend.

export const PROJECT_TYPES = [
  { value: 'new_construction', label: 'New Construction' },
  { value: 'remodeling', label: 'Whole-Home Remodeling' },
  { value: 'home_addition', label: 'Home Addition' },
  { value: 'kitchen', label: 'Kitchen' },
  { value: 'bathroom', label: 'Bathroom' },
  { value: 'flooring', label: 'Flooring' },
  { value: 'condo_renovation', label: 'Condo Renovation' },
  { value: 'other', label: 'Something else' },
];

export const PROPERTY_TYPES = [
  { value: 'single_family', label: 'Single-family home' },
  { value: 'condo', label: 'Condo / Apartment' },
  { value: 'townhouse', label: 'Townhouse' },
  { value: 'multi_family', label: 'Multi-family' },
  { value: 'commercial', label: 'Commercial' },
  { value: 'land', label: 'Vacant land / lot' },
];

export const TIMELINES = [
  { value: 'asap', label: 'As soon as possible' },
  { value: '1_3_months', label: 'In 1–3 months' },
  { value: '3_6_months', label: 'In 3–6 months' },
  { value: '6_12_months', label: 'In 6–12 months' },
  { value: 'researching', label: 'Just researching for now' },
];

export const BUDGETS = [
  { value: 'under_25k', label: 'Under $25k' },
  { value: '25k_50k', label: '$25k – $50k' },
  { value: '50k_100k', label: '$50k – $100k' },
  { value: '100k_250k', label: '$100k – $250k' },
  { value: 'over_250k', label: 'Over $250k' },
  { value: 'not_sure', label: 'Not sure yet' },
];

export const OWNERSHIP = [
  { value: 'yes', label: 'Yes, I own it' },
  { value: 'buying', label: 'Buying / under contract' },
  { value: 'no', label: 'No' },
];

export const DECISION = [
  { value: 'yes', label: 'Yes, I decide' },
  { value: 'shared', label: 'Together with someone else' },
  { value: 'no', label: 'Someone else decides' },
];

export const CONTACT_METHODS = [
  { value: 'phone', label: 'Phone call' },
  { value: 'text', label: 'Text message' },
  { value: 'email', label: 'Email' },
];

export const BEST_TIMES = [
  { value: 'morning', label: 'Morning' },
  { value: 'afternoon', label: 'Afternoon' },
  { value: 'evening', label: 'Evening' },
  { value: 'anytime', label: 'Anytime' },
];

export const REFERRAL_SOURCES = [
  { value: 'google', label: 'Google search' },
  { value: 'social', label: 'Facebook / Instagram' },
  { value: 'referral', label: 'Friend or family referral' },
  { value: 'past_client', label: 'I am a past client' },
  { value: 'yard_sign', label: 'Yard sign / truck' },
  { value: 'email', label: 'Email from UBC' },
  { value: 'other', label: 'Other' },
];
