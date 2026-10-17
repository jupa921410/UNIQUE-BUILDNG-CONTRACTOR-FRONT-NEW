export const pageDescriptions = {
  '/': 'Licensed Tampa Bay general contractor for custom homes, kitchen and bathroom remodeling, additions and flooring. Plan your project with Unique Building Contractors.',
  '/aboutus': 'Meet the Unique Building Contractors team serving Tampa Bay, FL. Learn how we coordinate construction, remodeling, permits, finishes and project communication.',
  '/service-areas': 'Explore Tampa Bay communities served by Unique Building Contractors for kitchen, bathroom and home remodeling, condo renovations, flooring and home additions.',
  '/specialized': 'Explore specialized kitchen, bathroom and flooring renovations in Tampa Bay, FL. Plan finishes, layouts and coordinated construction with Unique Building Contractors.',
  '/resources': 'Plan your Tampa Bay renovation with guides to kitchens, bathrooms, flooring, additions, budgets and schedules from the team at Unique Building Contractors.',
  '/privacy': 'Read how Unique Building Contractors collects and uses website inquiries and messaging information, handles privacy requests and protects contact information.',
  '/terms': 'Review the terms for using the Unique Building Contractors website, including project information, written agreements and how to contact our Tampa Bay team.',
  '/contact': 'Discuss your Tampa Bay construction or remodeling project with Unique Building Contractors. Call (813) 523-7828 to plan your scope, priorities and next steps.',
};

export function metaDescription(value = '') {
  const clean = String(value).replace(/(?:request|schedule|book|call[^.]*for)?\s*(?:a\s+)?free consultation[.!]?/gi, '').replace(/\s+/g, ' ').trim();
  if (clean.length <= 160) return clean;
  return clean.slice(0, 157).replace(/\s+\S*$/, '').replace(/[,;:]$/, '') + '…';
}
