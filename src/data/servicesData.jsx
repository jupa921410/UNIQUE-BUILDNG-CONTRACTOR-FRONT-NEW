import { Home, Ruler, Plus, Utensils, LayoutGrid } from 'lucide-react';
import hero1 from '../assets/hero1.png';
import hero2 from '../assets/hero2.png';
import hero3 from '../assets/hero3.png';
import flooringImg from '../assets/flooring.png';
import projectmanagementImg from '../assets/management.png';
import { serviceContent } from './serviceContent';

const visuals = {
  'new-construction': { icon: <Home size={48} />, image: hero1 },
  remodeling: { icon: <Ruler size={48} />, image: hero2 },
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