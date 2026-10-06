import { Link } from 'react-router-dom';
import SEO from '../../components/SEO/SEO';

export default function NotFoundPage() {
  return (
    <main className="service-not-found" style={{ minHeight: '70vh', paddingTop: '180px', textAlign: 'center' }}>
      <SEO
        title="Page Not Found"
        description="The requested page could not be found. Explore Unique Building Contractors services in Tampa Bay."
        noindex
      />
      <h1>Page Not Found</h1>
      <p>The page may have moved or no longer exists.</p>
      <Link to="/" className="btn btn-primary">Back to Home</Link>
    </main>
  );
}
