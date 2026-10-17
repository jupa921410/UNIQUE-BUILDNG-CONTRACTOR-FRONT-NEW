import ResponsiveImage from '../../components/ResponsiveImage';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import SEO, { breadcrumbSchema, SITE_URL } from '../../components/SEO/SEO';
import { blogPosts } from '../../data/blogPosts';
import './BlogPage.css';

export default function BlogPage() {
  const [category, setCategory] = useState('All articles');
  const categories = ['All articles', ...new Set(blogPosts.map(post => post.category))];
  const posts = category === 'All articles' ? blogPosts : blogPosts.filter(post => post.category === category);
  return <main className="blog-page">
    <SEO title="Tampa Bay Remodeling & Construction Blog" description="Practical Tampa Bay remodeling guides on kitchens, bathrooms, flooring, additions, budgets and planning. Find clear answers before your next project." path="/blog" schema={[
      { '@context': 'https://schema.org', '@type': 'Blog', name: 'The UBC Journal', url: `${SITE_URL}/blog`, publisher: { '@id': `${SITE_URL}/#business` } },
      breadcrumbSchema([{ name: 'Home', path: '/' }, { name: 'Blog', path: '/blog' }]),
    ]} />
    <header className="blog-heading container"><p className="blog-eyebrow">The UBC Journal</p><h1>Thoughtful plans.<br />Better places to live.</h1><p>Practical answers for building and remodeling in Tampa Bay. Explore the decisions behind a space that works for you.</p><a href="/blog/feed.xml" className="blog-feed">Subscribe with RSS</a></header>
    <section className="container blog-library" aria-label="Construction and remodeling articles">
      <div className="blog-filters" role="group" aria-label="Filter articles by topic">{categories.map(item => <button key={item} aria-pressed={category === item} onClick={() => setCategory(item)}>{item}</button>)}</div>
      <p className="blog-count" role="status">{posts.length} articles</p>
      <div className="blog-grid">{posts.map(post => <article className="blog-card" key={post.slug}>
        <Link to={`/blog/${post.slug}`} className="blog-card-image" tabIndex={-1} aria-hidden="true"><ResponsiveImage src={`/blog/images/${post.image}.webp`} alt="" width="960" height="640" loading="lazy" /></Link>
        <div className="blog-card-copy"><p className="blog-eyebrow">{post.category} <span> / {post.readingMinutes} min read</span></p><h2><Link to={`/blog/${post.slug}`}>{post.title}</Link></h2><p>{post.description}</p><Link className="blog-read" to={`/blog/${post.slug}`}>Read the guide <span aria-hidden="true">↗</span></Link></div>
      </article>)}</div>
    </section>
    <aside className="container blog-cta"><h2>Have a project in mind?</h2><p>Talk through your space, priorities, and next steps with our team.</p><Link className="design-button gold" to="/contact">Request a consultation</Link></aside>
  </main>;
}
