import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { MessagesSquare, DraftingCompass, FileText, HardHat, ClipboardCheck, Home } from 'lucide-react';
import planImg from '../../assets/plan.jpg';
import './Process.css';

gsap.registerPlugin(ScrollTrigger);

const steps = [
  {
    number: '01',
    icon: <MessagesSquare size={28} className="text-green" />,
    title: 'Complimentary Consultation',
    desc: 'We start with a no-pressure conversation to understand your vision, goals, and budget. Our team listens carefully and asks the right questions.',
  },
  {
    number: '02',
    icon: <DraftingCompass size={28} className="text-green" />,
    title: 'Design & Planning',
    desc: 'We accompany you to material showrooms, help select finishes, and develop detailed project plans. Your input shapes every decision.',
  },
  {
    number: '03',
    icon: <FileText size={28} className="text-green" />,
    title: 'Permits & Compliance',
    desc: 'Our team handles all permit applications and coordinates with local Florida authorities, ensuring full compliance and zero surprises.',
  },
  {
    number: '04',
    icon: <HardHat size={28} className="text-green" />,
    title: 'Construction',
    desc: 'Dedicated project managers oversee every phase on-site, ensuring 5-star quality from foundation to final finish.',
  },
  {
    number: '05',
    icon: <ClipboardCheck size={28} className="text-green" />,
    title: 'Quality Inspection',
    desc: 'We conduct thorough inspections at each milestone and a final walkthrough with you to ensure everything meets our premium standards.',
  },
  {
    number: '06',
    icon: <Home size={28} className="text-green" />,
    title: 'Final Delivery',
    desc: 'We hand over your completed project on time and within budget, with complete documentation and ongoing support.',
  },
];

export default function Process() {
  const container = useRef(null);

  useGSAP(() => {
    // Parallax effect for the background
    gsap.to('.process-bg-container', {
      backgroundPosition: "50% 100%",
      ease: "none",
      scrollTrigger: {
        trigger: container.current,
        start: "top bottom",
        end: "bottom top",
        scrub: true,
      }
    });

    // Content animations
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: container.current,
        start: "top 75%",
        toggleActions: "play none none none"
      }
    });

    tl.from('.process-header', {
      y: 50,
      opacity: 0,
      duration: 0.8,
      ease: 'power3.out'
    })
      .from('.process-step', {
        y: 40,
        opacity: 0,
        duration: 0.6,
        stagger: 0.15,
        ease: 'back.out(1.2)'
      }, "-=0.4")
      .from('.trust-bar', {
        scale: 0.95,
        y: 20,
        opacity: 0,
        duration: 0.6,
        ease: 'power2.out'
      }, "-=0.2");
  }, { scope: container });

  return (
    <section className="process section" id="process" ref={container}>
      {/* Background Architectural Blueprint - Fixed parallax setup */}
      <div
        className="process-bg-container"
        style={{ backgroundImage: `url(${planImg})` }}
      ></div>

      <div className="container">
        <div className="process-header text-center">
          <div className="section-badge">How We Work</div>
          <h2 className="section-title">
            Our <span>6-Step</span> Construction Process
          </h2>
          <p className="section-subtitle" style={{ margin: '16px auto 0' }}>
            A transparent, client-first workflow that keeps you informed and in control — from your first call to the final celebration.
          </p>
        </div>

        <div className="process-steps">
          {steps.map((step, i) => (
            <div key={i} className="process-step">
              <div className="step-number">{step.number}</div>
              <div className="step-content glass-card">
                <div className="step-icon-wrap">{step.icon}</div>
                <h3 className="step-title">{step.title}</h3>
                <p className="step-desc">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Trust bar */}
        <div className="trust-bar glass-card">
          <div className="trust-bar-item">
            <span className="trust-bar-icon">📞</span>
            <span>Call Now: <strong>(813) 523-7828</strong></span>
          </div>
          <div className="trust-bar-divider"></div>
          <div className="trust-bar-item">
            <span className="trust-bar-icon">🆓</span>
            <span><strong>Free Consultation</strong> — No Obligation</span>
          </div>
          <div className="trust-bar-divider"></div>
          <div className="trust-bar-item">
            <span className="trust-bar-icon">⚡</span>
            <span>Fast Response <strong>Within 24 Hours</strong></span>
          </div>
          <a href="#contact" className="btn btn-primary">
            Start Your Project Today
          </a>
        </div>
      </div>
    </section>
  )
}
