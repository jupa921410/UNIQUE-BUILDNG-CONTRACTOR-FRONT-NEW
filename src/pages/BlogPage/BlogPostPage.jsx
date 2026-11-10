import ResponsiveImage from '../../components/ResponsiveImage';
import { Link, useParams } from 'react-router-dom';
import SEO, { breadcrumbSchema, SITE_URL } from '../../components/SEO/SEO';
import NotFoundPage from '../NotFoundPage/NotFoundPage';
import { blogPosts, getBlogPost, formatBlogDate } from '../../data/blogPosts';
import { getCityData } from '../../data/serviceAreasData';
import './BlogPage.css';

export default function BlogPostPage() {
  const { slug } = useParams();
  const post = getBlogPost(slug);
  if (!post) return <NotFoundPage />;
  const url = `${SITE_URL}/blog/${post.slug}`;
  const nearby = getCityData(post.city);
  const related = [...blogPosts.filter(item => item.slug !== slug && item.category === post.category), ...blogPosts.filter(item => item.slug !== slug && item.category !== post.category)].slice(0, 3);
  return <main className="blog-page">
    <SEO title={post.title} description={post.description} path={`/blog/${post.slug}`} type="article" schema={[
      { '@context': 'https://schema.org', '@type': 'BlogPosting', '@id': url, headline: post.title, description: post.description, image: `${SITE_URL}/blog/images/${post.image}.webp`, datePublished: post.date, dateModified: post.date, author: { '@type': 'Organization', name: post.author, url: `${SITE_URL}/aboutus` }, publisher: { '@id': `${SITE_URL}/#business` }, mainEntityOfPage: { '@type': 'WebPage', '@id': url }, inLanguage: 'en-US', articleSection: post.category },
      breadcrumbSchema([{ name: 'Home', path: '/' }, { name: 'Blog', path: '/blog' }, { name: post.title, path: `/blog/${post.slug}` }]),
    ]} />
    <article>
      <header className="blog-heading blog-post-heading container"><nav aria-label="Breadcrumb"><Link to="/">Home</Link><span aria-hidden="true"> / </span><Link to="/blog">Journal</Link></nav><p className="blog-eyebrow">{post.category}</p><h1>{post.title}</h1><p className="blog-byline">By <Link to="/aboutus">{post.author}</Link> · <time dateTime={post.date}>{formatBlogDate(post.date)}</time> · {post.readingMinutes} min read</p></header>
      <figure className="container blog-cover"><ResponsiveImage src={`/blog/images/${post.image}.webp`} alt={`Architectural concept for ${post.title.toLowerCase()}`} width="960" height="640" fetchPriority="high" /><figcaption>Architectural inspiration. This image is a concept, not a documented project.</figcaption></figure>
      <div className="container blog-article-layout">
        <aside className="blog-toc"><h2>In this guide</h2><nav aria-label="Article contents">{post.sections.map((section, index) => <a key={section.heading} href={`#section-${index + 1}`}>{section.heading}</a>)}<a href="#planning-checklist">Planning checklist</a><a href="#common-questions">Common questions</a></nav></aside>
        <div className="blog-prose"><section className="blog-answer" aria-labelledby="short-answer"><h2 id="short-answer">The short answer</h2><p>{post.answer}</p></section>
          {post.sections.map((section, index) => <section key={section.heading} id={`section-${index + 1}`}><h2>{section.heading}</h2>{section.paragraphs.map(paragraph => <p key={paragraph}>{paragraph}</p>)}</section>)}
          <section id="planning-checklist"><h2>Your planning checklist</h2><ul>{post.checklist.map(item => <li key={item}>{item}</li>)}</ul></section>
          <section id="common-questions"><h2>Common questions</h2>{post.faqs.map(faq => <div key={faq.question}><h3>{faq.question}</h3><p>{faq.answer}</p></div>)}</section>
          {post.sources.length > 0 && <section><h2>Official resources</h2><ul>{post.sources.map(source => <li key={source.url}><a href={source.url} target="_blank" rel="noopener noreferrer">{source.title}</a></li>)}</ul></section>}
          <aside className="blog-next"><h2>Plan your next step</h2><p>Explore our <Link to={`/services/${post.service}`}>related construction and remodeling services</Link>{nearby && <>, learn about our work in <Link to={`/service-areas/${post.city}`}>{nearby.city}</Link></>}, or <Link to="/portfolio">browse our project portfolio</Link>.</p><Link className="design-button gold" to="/contact">Discuss your project</Link></aside>
        </div>
      </div>
    </article>
    <section className="container blog-related"><h2>Keep planning</h2><div className="blog-related-grid">{related.map(item => <Link key={item.slug} to={`/blog/${item.slug}`}><span className="blog-eyebrow">{item.category}</span><h3>{item.title}</h3></Link>)}</div><Link className="blog-read" to="/blog">Explore all articles</Link></section>
  </main>;
}
