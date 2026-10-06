import { useEffect } from 'react';
import { motion } from 'framer-motion';
import ServiceDetail from '../../components/ServiceDetail/ServiceDetail';
import Contact from '../../components/Contact/Contact';
import ProcessSteps from '../../components/ProcessSteps/ProcessSteps';
import './SpecializedPage.css';
import SEO from '../../components/SEO/SEO';

export default function SpecializedPage() {
  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="specialized-page">
      <SEO
        title="Specialized Construction Services in Tampa Bay"
        description="Specialized construction planning, remodeling and project execution by licensed Tampa Bay contractors."
      />
      <div className="page-header-spacer"></div>
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <ServiceDetail />
      </motion.div>

      <ProcessSteps serviceId="remodeling" />

      <Contact />
    </div>
  );
}
