import { Suspense, lazy } from 'react'
import Hero from '../../components/Hero/Hero'
import Stats from '../../components/Stats/Stats'
import Services from '../../components/Services/Services'
import SEO from '../../components/SEO/SEO'

// Lazy load sections that are well below the fold
const ConstructionShowcase = lazy(() => import('../../components/ConstructionShowcase/ConstructionShowcase'))
const Process = lazy(() => import('../../components/Process/Process'))
const BeforeAfter = lazy(() => import('../../components/BeforeAfter/BeforeAfter'))
const Portfolio = lazy(() => import('../../components/Portfolio/Portfolio'))
const HomeServiceAreas = lazy(() => import('../../components/HomeServiceAreas/HomeServiceAreas'))
// Restore testimonials only after their sources and ratings are verified.
const Contact = lazy(() => import('../../components/Contact/Contact'))

export default function Home() {
  return (
    <>
      <SEO
        title="Tampa General Contractor & Home Remodeling"
        description="Licensed Tampa Bay general contractor for custom homes, remodeling, kitchens, bathrooms, additions and flooring. Request a free consultation."
        path="/"
      />
      <Hero />
      <Stats />
      {/* Services is eagerly loaded so search engines index service names on first render */}
      <Services />

      <Suspense fallback={<div className="section-loader"></div>}>
        <ConstructionShowcase />
        <Process />
        <BeforeAfter />
        <Portfolio />
        <HomeServiceAreas />
        <Contact />
      </Suspense>
    </>
  )
}
