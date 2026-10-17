import { Home, Ruler, Plus, Utensils, LayoutGrid } from 'lucide-react';
import { projectPhotos } from './projectPresentation';
const hero1 = projectPhotos.home, hero2 = projectPhotos.kitchen, hero3 = projectPhotos.entry, flooringImg = projectPhotos.flooring, projectmanagementImg = projectPhotos.detail;
import { serviceContent } from './serviceContent';

const visuals = {
  'condo-renovations': { icon: <Ruler size={48} />, image: projectPhotos.living },
  'new-construction': { icon: <Home size={48} />, image: hero1 },
  remodeling: { icon: <Ruler size={48} />, image: projectPhotos.bathroom },
  additions: { icon: <Plus size={48} />, image: hero3 },
  'kitchens-bathrooms': { icon: <Utensils size={48} />, image: hero2 },
  flooring: { icon: <LayoutGrid size={48} />, image: flooringImg },
  projectmanagement: { icon: <LayoutGrid size={48} />, image: projectmanagementImg },
};

// Shared copy is also used by the build-time HTML generator.
export const servicesData = serviceContent.map(service => ({
  ...service,
  ...visuals[service.id],
}));