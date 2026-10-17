const projectCities = {
  'dental-clinic-addition': 'dunedin-fl',
  'bathroom-remodel': 'st-petersburg-fl',
  'remodeling-project': 'clearwater-beach-fl',
  'complete-bathroom-remodeling': 'zephyrhills-fl',
};

export const legacyPortfolioRoutes = Object.fromEntries(Object.entries(projectCities).map(([slug, city]) => [slug, `${slug}-${city}`]));
export function portfolioSlug(slug) {
  return legacyPortfolioRoutes[slug] || slug;
}
export function apiPortfolioSlug(slug) {
  return Object.keys(legacyPortfolioRoutes).find(key => legacyPortfolioRoutes[key] === slug) || slug;
}
export function formatProjectLocation(location = '') {
  const clean = location.replace(/BOOKVILLE/ig, 'Brooksville').replace(/Clewater/ig, 'Clearwater').replace(/\s+\d{5}(?:-\d{4})?$/, '').trim();
  if (/Cliff Swallow/i.test(clean)) return 'Brooksville, FL';
  return clean.replace(/,?\s+FL$/i, ', FL');
}
export function normalizeProject(project) {
  return { ...project, slug: portfolioSlug(project.slug), location: formatProjectLocation(project.location) };
}
