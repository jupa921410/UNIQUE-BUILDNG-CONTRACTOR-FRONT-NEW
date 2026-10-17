import ResponsiveImage from '../ResponsiveImage';
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
const logo1x = '/brand/logo-mini.svg';
import hammerIcon from '../../assets/martillo.svg'
import planBg from '../../assets/plan.jpg'
import './Preloader.css'

// Detect search engine crawlers — they should never wait on decorative loading screens
function isBot() {
  if (typeof navigator === 'undefined') return true;
  return /bot|crawl|spider|slurp|googlebot|bingbot|yandex|baidu|duckduck|facebookexternalhit|linkedinbot|twitterbot/i.test(
    navigator.userAgent
  );
}

// Only show on first page load within a browser session
function shouldSkipPreloader() {
  if (isBot()) return true;
  try {
    if (sessionStorage.getItem('ubc_loaded')) return true;
    sessionStorage.setItem('ubc_loaded', '1');
  } catch {
    // sessionStorage blocked (private mode edge case) — show preloader normally
  }
  return false;
}

export default function Preloader() {
  const [loading, setLoading] = useState(!shouldSkipPreloader())

  useEffect(() => {
    if (!loading) return;
    // Reduced from 2800ms → 1400ms to minimize LCP impact
    const timer = setTimeout(() => {
      setLoading(false)
    }, 1400)

    return () => clearTimeout(timer)
  }, [loading])

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          className="preloader"
          initial={{ opacity: 1 }}
          exit={{
            opacity: 0,
            transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
          }}
        >
          <div
            className="preloader-bg-image"
            style={{
              backgroundImage: `url(${planBg})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat'
            }}
          />
          <div className="preloader-content">
            {/* Hammer Animation */}
            <motion.div
              className="loader-hammer-wrap"
              animate={{
                rotate: [0, -45, 0],
                x: [0, -10, 0],
                y: [0, -5, 0]
              }}
              transition={{
                duration: 0.6,
                repeat: 4,
                ease: "easeInOut"
              }}
            >
              <ResponsiveImage src={hammerIcon} alt="" className="loader-hammer" />
            </motion.div>

            {/* Logo Assembly */}
            <div className="loader-logo-container">
              <motion.img
                src={logo1x}
                alt="UBC Logo"
                className="loader-logo"
                initial={{ opacity: 0, scale: 0.8, filter: 'blur(10px)' }}
                animate={{
                  opacity: [0, 1],
                  scale: [0.8, 1],
                  filter: ['blur(10px)', 'blur(0px)']
                }}
                transition={{
                  duration: 1.5,
                  delay: 0.5,
                  ease: "easeOut"
                }}
              />

              {/* Construction Lines / Progress */}
              <motion.div
                className="loader-progress-bar"
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ duration: 2.2, ease: "easeInOut" }}
              />
            </div>

            <motion.div
              className="loader-text"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2 }}
            >
              <span className="building">Building</span>
              <span className="excellence">Excellence</span>
            </motion.div>
          </div>

          <div className="preloader-bg-grid"></div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
