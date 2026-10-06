import { motion } from 'framer-motion';
import AboutStory from '../../components/AboutStory/AboutStory';
import OurTeams from '../../components/OurTeams/OurTeams';
import Contact from '../../components/Contact/Contact';
import './AboutUsPage.css';
import SEO from '../../components/SEO/SEO';

export default function AboutUsPage() {
  return (
    <div className="about-us-page">
      <SEO
        title="About Our Tampa Bay Construction Team"
        description="Meet the licensed professionals behind Unique Building Contractors and learn about our commitment to quality construction across Tampa Bay."
      />
      <div className="page-header-spacer"></div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <AboutStory />
        <OurTeams />
      </motion.div>

      <Contact />
    </div>
  );
}
