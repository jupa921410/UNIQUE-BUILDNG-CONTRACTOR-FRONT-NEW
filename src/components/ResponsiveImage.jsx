import { responsiveImages } from '../data/responsiveImages.js';

export default function ResponsiveImage({ src, alt, sizes = '(max-width: 640px) 100vw, (max-width: 1100px) 75vw, 960px', loading = 'lazy', fetchPriority, ...props }) {
  const image = responsiveImages.get(src);
  return <img {...props} src={image?.src || src} srcSet={image?.srcSet} sizes={image ? sizes : undefined}
    width={props.width || image?.width} height={props.height || image?.height} alt={alt}
    loading={fetchPriority === 'high' ? 'eager' : loading} fetchPriority={fetchPriority} decoding="async" />;
}
