// Shared helpers that turn CRM showcase text into clean, crawlable page content.
// Used by the React project/city pages and by scripts/generate-project-seo.mjs,
// so the prerendered HTML and the hydrated page say exactly the same thing.
import { PHASE1_CITIES } from './serviceAreasData.js';

// Emoji, pictographs, variation selectors and zero-width joiners.
const EMOJI = /\p{Extended_Pictographic}|[\u{1F1E6}-\u{1F1FF}]|\u{FE0F}|\u{200D}|\u{20E3}/gu;
// "Project: X", "Built by: X", "Size: X" — CRM footer lines that repeat page metadata.
const FOOTER_LINE = /^(project|built by|size|location|client)\s*:/i;
const HASHTAG_LINE = /^(#[\w-]+\s*)+$/;

function cleanLine(line = '') {
  return String(line)
    .replace(EMOJI, '')
    .replace(/\*\*|__|`/g, '')
    .replace(/(^|\s)#[A-Za-z][\w-]*/g, '$1')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Parses a CRM description into blocks: { type: 'p', text } or { type: 'ul', items }.
 * Drops hashtags, emoji, markdown asterisks and footer lines that only repeat metadata.
 */
export function projectBlocks(description = '') {
  const blocks = [];
  const groups = String(description).replace(/\r\n?/g, '\n').split(/\n\s*\n/);
  for (const group of groups) {
    const rawLines = group.split('\n').map(line => line.trim()).filter(Boolean);
    const lines = rawLines
      .filter(line => !HASHTAG_LINE.test(line.replace(EMOJI, '').trim()))
      .map(cleanLine)
      .filter(line => line && !FOOTER_LINE.test(line));
    if (!lines.length) continue;
    // Several short lines in one group (emoji bullets in the CRM) read as a list.
    if (lines.length >= 3 && lines.every(line => line.length <= 70)) {
      blocks.push({ type: 'ul', items: lines });
    } else {
      blocks.push({ type: 'p', text: lines.join(' ') });
    }
  }
  return blocks;
}

export function projectPlainText(description = '') {
  return projectBlocks(description)
    .map(block => (block.type === 'ul' ? block.items.join(', ') + '.' : block.text))
    .join(' ');
}

export function projectCity(project) {
  return String(project?.location || '').split(',')[0].trim();
}

const SERVICES = [
  { test: /bath|kitchen|vanity|shower/i, path: '/services/kitchens-bathrooms', name: 'Kitchen & Bathroom Remodeling' },
  { test: /addition/i, path: '/services/additions', name: 'Home Additions' },
  { test: /new construction|new home|ground up/i, path: '/services/new-construction', name: 'New Construction' },
  { test: /floor/i, path: '/services/flooring', name: 'Flooring Installation' },
  { test: /condo/i, path: '/services/condo-renovations', name: 'Condo Renovations' },
];

/** Service landing page that best matches the project title/category/description. */
export function projectService(project) {
  const haystack = [project?.title, project?.category, project?.description].join(' ');
  // Title and category win over words that merely appear in the description.
  const primary = [project?.title, project?.category].join(' ');
  return SERVICES.find(service => service.test.test(primary))
    || SERVICES.find(service => service.test.test(haystack))
    || { path: '/services/remodeling', name: 'Home Remodeling' };
}

const normalizeCity = value => String(value).toLowerCase().replace(/\bst\.?\s+/g, 'st ').replace(/[^a-z ]/g, '').trim();

/** Service-area landing page for the project's city, if one exists. */
export function projectArea(project) {
  const city = normalizeCity(projectCity(project));
  if (!city) return null;
  return PHASE1_CITIES.find(area => normalizeCity(area.city) === city) || null;
}

/** Projects located in a service-area city, falling back to the most recent ones. */
export function projectsForArea(projects = [], areaSlug, limit = 3) {
  const local = projects.filter(project => projectArea(project)?.slug === areaSlug);
  const rest = projects.filter(project => !local.includes(project));
  return { local, list: [...local, ...rest].slice(0, limit) };
}

export function relatedProjects(project, projects = [], limit = 3) {
  const service = projectService(project).path;
  const others = projects.filter(item => item.slug !== project.slug);
  const sameService = others.filter(item => projectService(item).path === service);
  return [...sameService, ...others.filter(item => !sameService.includes(item))].slice(0, limit);
}

/** Meta description written from the facts, not from the CRM's marketing intro. */
export function projectMetaDescription(project) {
  const city = projectCity(project);
  const service = projectService(project).name.toLowerCase();
  const lead = `${project.title}${city ? ` in ${city}, FL` : ''} by Unique Building Contractors`;
  const sentences = projectBlocks(project.description)
    .filter(block => block.type === 'p')
    .flatMap(block => block.text.split(/(?<=[.!?])\s+/));
  const sentence = sentences.find(text => text.length > 60 && !/unique building contractors/i.test(text)) || `A ${service} project in Tampa Bay.`;
  const text = `${lead}. ${sentence}`.replace(/\s+/g, ' ').trim();
  if (text.length <= 160) return text;
  return text.slice(0, 157).replace(/\s+\S*$/, '').replace(/[,;:]$/, '') + '…';
}

export function projectImageAlt(project, index, item) {
  const city = projectCity(project);
  const base = item?.caption?.trim() || `${project.title}${city ? ` in ${city}, FL` : ''}`;
  return index === 0 ? base : `${base} — photo ${index + 1}`;
}
