import { Suspense, lazy, useEffect } from 'react'
import { Routes, Route, useLocation, Navigate } from 'react-router-dom'
import './index.css'
import Navbar from './components/Navbar/Navbar'
import Footer from './components/Footer/Footer'
import { PortalAuthProvider } from './context/PortalAuthContext'
import PortalRoute from './components/PortalLayout/PortalRoute'
// Note: the LocalBusiness/WebSite JSON-LD (formerly rendered here via
// <OrganizationSchema/>) now lives as a static <script> in index.html's <head>
// so non-JS crawlers (GPTBot, OAI-SearchBot) see it without running React.

// Component to handle scrolling to hash elements
function ScrollToHash() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const id = hash.replace('#', '');
      const element = document.getElementById(id);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth' });
        }, 300);
      }
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [pathname, hash]);

  return null;
}

// Lazy load pages
const Home = lazy(() => import('./pages/Home/Home'))
const ServicePage = lazy(() => import('./pages/ServicePage/ServicePage'))
const SpecializedPage = lazy(() => import('./pages/SpecializedPage/SpecializedPage'))
const AboutUsPage = lazy(() => import('./pages/AboutUsPage/AboutUsPage'))
const PortfolioPage = lazy(() => import('./pages/PortfolioPage/PortfolioPage'))
const ProjectDetailPage = lazy(() => import('./pages/ProjectDetailPage/ProjectDetailPage'))
const NotFoundPage = lazy(() => import('./pages/NotFoundPage/NotFoundPage'))
const LegalPage = lazy(() => import('./pages/LegalPage/LegalPage'))
const ResourcesPage = lazy(() => import('./pages/ResourcesPage/ResourcesPage'))
const ServiceAreasPage = lazy(() => import('./pages/ServiceAreasPage/ServiceAreasPage'))
const CityPage = lazy(() => import('./pages/CityPage/CityPage'))
const ThankYouPage = lazy(() => import('./pages/ThankYouPage/ThankYouPage'))

// Client Portal — login-gated section, own chrome (no marketing Navbar/Footer)
const PortalLogin = lazy(() => import('./pages/ClientPortal/PortalLogin/PortalLogin'))
const PortalForgotPassword = lazy(() => import('./pages/ClientPortal/PortalForgotPassword/PortalForgotPassword'))
const PortalResetPassword = lazy(() => import('./pages/ClientPortal/PortalResetPassword/PortalResetPassword'))
const PortalDashboard = lazy(() => import('./pages/ClientPortal/PortalDashboard/PortalDashboard'))
const PortalInvoices = lazy(() => import('./pages/ClientPortal/PortalInvoices/PortalInvoices'))
const PortalProjectDetail = lazy(() => import('./pages/ClientPortal/PortalProjectDetail/PortalProjectDetail'))

function App() {
  const { pathname } = useLocation();
  const isPortal = pathname.startsWith('/portal');

  if (isPortal) {
    return (
      <div className="app">
        <PortalAuthProvider>
          <Suspense fallback={<div className="page-loader"></div>}>
            <Routes>
              <Route path="/portal/login" element={<PortalLogin />} />
              <Route path="/portal/forgot-password" element={<PortalForgotPassword />} />
              <Route path="/portal/reset-password/:token" element={<PortalResetPassword />} />
              <Route element={<PortalRoute />}>
                <Route path="/portal" element={<PortalDashboard />} />
                <Route path="/portal/invoices" element={<PortalInvoices />} />
                <Route path="/portal/projects/:id" element={<PortalProjectDetail />} />
              </Route>
              <Route path="*" element={<Navigate to="/portal" replace />} />
            </Routes>
          </Suspense>
        </PortalAuthProvider>
      </div>
    );
  }

  return (
    <div className="app">
      <ScrollToHash />
      <Navbar />
      <Suspense fallback={<div className="page-loader"></div>}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/services/:id" element={<ServicePage />} />
          <Route path="/specialized" element={<SpecializedPage />} />
          <Route path="/aboutus" element={<AboutUsPage />} />
          <Route path="/portfolio" element={<PortfolioPage />} />
          <Route path="/portfolio/:slug" element={<ProjectDetailPage />} />
          <Route path="/privacy" element={<LegalPage type="privacy" />} />
          <Route path="/terms" element={<LegalPage type="terms" />} />
          <Route path="/resources" element={<ResourcesPage />} />
          <Route path="/service-areas" element={<ServiceAreasPage />} />
          <Route path="/service-areas/:citySlug" element={<CityPage />} />
          <Route path="/thank-you" element={<ThankYouPage />} />
          <Route path="/service/:id" element={<LegacyServiceRedirect />} />
          <Route path="/services/kitchensabdathrooms" element={<Navigate to="/services/kitchens-bathrooms" replace />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
      <Footer />
    </div>
  )
}

function LegacyServiceRedirect() {
  const { pathname } = useLocation();
  const id = pathname.split('/').filter(Boolean).pop();
  const normalizedId = id === 'kitchensabdathrooms' ? 'kitchens-bathrooms' : id;
  return <Navigate to={`/services/${normalizedId}`} replace />;
}

export default App
