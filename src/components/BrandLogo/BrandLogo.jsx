import ResponsiveImage from '../ResponsiveImage';
import './BrandLogo.css';
export default function BrandLogo({ light = false, compact = false }) {
  const src = compact ? '/brand/logo-mini.svg' : `/brand/logo-horizontal${light ? '-white' : ''}.webp`;
  return <span className={`unique-brand ${compact ? 'unique-brand-compact' : ''}`}>
    <ResponsiveImage src={src} loading="eager" width={compact ? 150 : 1400} height={compact ? 187 : 478} alt="Unique Building Contractors" className={compact ? 'unique-brand-mark' : 'unique-brand-image'} />
  </span>;
}
