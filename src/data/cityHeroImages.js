import team from '../assets/about.png';
import plans from '../assets/plan.jpg';
import management from '../assets/management.png';
import waterfrontHome from '../assets/hero1.png';
import kitchen from '../assets/hero2.png';
import bathroom from '../assets/hero3.png';
import renovatedKitchen from '../assets/after_kitchen.png';
import traditionalKitchen from '../assets/before_kitchen.png';
import flooringInstallation from '../assets/flooring.png';
import villa from '../assets/redesign/villa.png';
import interior from '../assets/redesign/interior.webp';
import exterior from '../assets/redesign/exterior.webp';
import livingRoom from '../assets/redesign/flooring.webp';
import bathroomConcept from '../assets/redesign/bathroom.webp';
import materials from '../assets/redesign/materials.webp';
import kitchenModel from '../assets/redesign/kitchen-cutout.png';
import bathroomModel from '../assets/redesign/bathroom-cutout.png';

// Keep city headers independent of the API project gallery.
export const cityHeroImages = {
  'tampa-fl': { image: '/blog/images/villa.webp', imageAlt: 'Architectural model of a modern waterfront villa', cutout: true },
  'south-tampa-fl': { image: villa, imageAlt: 'Architectural concept of a custom two-story home', cutout: true },
  'davis-islands-fl': { image: waterfrontHome, imageAlt: 'Waterfront home concept with tropical landscaping' },
  'st-pete-beach-fl': { image: exterior, imageAlt: 'Coastal home concept with a pool terrace at dusk' },
  'clearwater-beach-fl': { image: interior, imageAlt: 'Open-plan kitchen concept overlooking tropical landscaping' },
  'belleair-fl': { image: livingRoom, imageAlt: 'Living room concept with walnut flooring and a pool terrace' },
  'carrollwood-fl': { image: renovatedKitchen, imageAlt: 'Remodeled kitchen with white cabinetry and a bright dining area' },
  'clearwater-fl': { image: kitchen, imageAlt: 'Kitchen design with a stone island and pendant lighting' },
  'st-petersburg-fl': { image: bathroom, imageAlt: 'Bathroom design with a glass shower and double vanity' },
  'dunedin-fl': { image: bathroomConcept, imageAlt: 'Bathroom concept with a freestanding bathtub and gold fixtures' },
  'palm-harbor-fl': { image: kitchenModel, imageAlt: 'Architectural kitchen model with custom cabinetry and a stone island', cutout: true },
  'brandon-fl': { image: traditionalKitchen, imageAlt: 'Traditional kitchen with wood cabinetry and a central island' },
  'riverview-fl': { image: team, imageAlt: 'Construction team reviewing architectural plans' },
  'wesley-chapel-fl': { image: bathroomModel, imageAlt: 'Architectural bathroom model with a bathtub and walk-in shower', cutout: true },
  'lutz-fl': { image: management, imageAlt: 'Construction professionals coordinating work with architectural plans' },
  'land-o-lakes-fl': { image: flooringInstallation, imageAlt: 'Flooring installation in an open-plan living space' },
  'new-port-richey-fl': { image: materials, imageAlt: 'Architectural drawings and stone, wood and metal finish samples' },
  'sarasota-fl': { image: plans, imageAlt: 'Architectural floor plans for a home construction project' },
};
