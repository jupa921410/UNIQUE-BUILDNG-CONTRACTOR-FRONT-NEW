import { motion } from 'framer-motion';
import { CheckCircle2, ArrowRight } from 'lucide-react';
import hero2 from '../../assets/hero2.png';
import hero3 from '../../assets/hero3.png';
import flooringImg from '../../assets/flooring.png';
import './ServiceDetail.css';

const details = [
  {
    id: 'kitchens-detail',
    image: hero2,
    tag: 'Kitchens',
    title: 'The Heart of Every Great Home',
    desc: 'Our kitchen specialists transform ordinary cooking spaces into extraordinary culinary experiences. We handle everything from cabinet refinishing and custom island installations to full structural reconfigurations.',
    highlights: [
      'Granite & dolomite countertops',
      'Custom cabinetry design & installation',
      'Appliance relocation & upgrades',
      'Improved flow & functionality layout',
      'Premium backsplash & tile work',
      'LED under-cabinet lighting',
    ],
    reverse: false,
    accent: 'green',
  },
  {
    id: 'bathrooms-detail',
    image: hero3,
    tag: 'Bathrooms',
    title: 'Your Personal Spa Sanctuary',
    desc: 'We transform standard bathrooms into five-star spa retreats. From custom frameless glass showers to precision tile installations and luxury vanity upgrades — every detail is crafted to perfection.',
    highlights: [
      'Custom frameless glass shower enclosures',
      'High-precision porcelain & marble tiling',
      'Freestanding soaking tubs',
      'Double vanity & countertop upgrades',
      'Heated floor installations',
      'Premium fixture packages',
    ],
    reverse: true,
    accent: 'terra',
  },
  {
    id: 'flooring-detail',
    image: flooringImg,
    tag: 'Flooring',
    title: 'Luxury Surfaces, Flawless Finishes',
    desc: 'Our flooring experts install the full spectrum of premium materials with industry-leading precision. From wide-plank hardwood to large-format porcelain tile, we deliver surfaces that stand the test of time.',
    highlights: [
      'Hardwood & engineered wood installation',
      'Large-format porcelain & ceramic tile',
      'Luxury vinyl plank (LVP)',
      'Natural stone & travertine',
      'Marble & mosaic feature areas',
      'Seamless transitions throughout',
    ],
    reverse: false,
    accent: 'green',
  },
];

export default function ServiceDetail() {
  return (
    <section className="service-detail section" id="service-detail">
      <div className="container">
        <motion.div 
          className="service-detail-header text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <div className="section-badge">Specialized Services</div>
          <h2 className="section-title">
            Crafted to <span>Perfection</span>
          </h2>
          <p className="section-subtitle" style={{margin: '16px auto 0'}}>
            Deep expertise in the spaces that matter most — kitchens, bathrooms, and flooring — delivered with 5-star precision.
          </p>
        </motion.div>

        <div className="service-detail-list">
          {details.map((item) => (
            <div
              key={item.id}
              id={item.id}
              className={`detail-row ${item.reverse ? 'reverse' : ''}`}
            >
              {/* Image */}
              <motion.div 
                className="detail-image-wrap"
                initial={{ opacity: 0, x: item.reverse ? 40 : -40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8 }}
              >
                <div className="detail-image-frame">
                  <img src={item.image} alt={item.tag} className="detail-img" />
                  <div className={`detail-tag-badge ${item.accent}`}>{item.tag}</div>
                </div>
              </motion.div>

              {/* Content */}
              <motion.div 
                className={`detail-content ${item.accent}`}
                initial={{ opacity: 0, x: item.reverse ? -40 : 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <div className={`detail-accent-line ${item.accent}`}></div>
                <h3 className="detail-title">{item.title}</h3>
                <p className="detail-desc">{item.desc}</p>

                <div className="detail-highlights">
                  {item.highlights.map((h, j) => (
                    <motion.div 
                      key={j} 
                      className="highlight-item"
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: 0.4 + (j * 0.1) }}
                    >
                      <CheckCircle2 size={20} className={`highlight-check-icon ${item.accent}`} />
                      <span>{h}</span>
                    </motion.div>
                  ))}
                </div>

                <motion.a 
                  href="#contact" 
                  className={`btn btn-${item.accent === 'terra' ? 'terra' : 'primary'}`} 
                  id={`${item.id}-cta`}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.8 }}
                >
                  Get a Free Quote
                  <ArrowRight size={20} />
                </motion.a>
              </motion.div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
