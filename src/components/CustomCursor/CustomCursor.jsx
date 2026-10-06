import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import martilloSvg from '../../assets/martillo.svg';
import './CustomCursor.css';

export default function CustomCursor() {
  const [mousePosition, setMousePosition] = useState({ x: -100, y: -100 });
  const [isClicking, setIsClicking] = useState(false);
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const updateMousePosition = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);

    const handleMouseOver = (e) => {
      const target = e.target;
      setIsHovering(Boolean(
        target.closest('a') ||
        target.closest('button') ||
        target.closest('input') ||
        target.closest('select') ||
        target.closest('textarea') ||
        target.classList.contains('cursor-pointer')
      ));
    };

    window.addEventListener('mousemove', updateMousePosition);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('mouseover', handleMouseOver);
    document.documentElement.classList.add('hide-default-cursor');

    return () => {
      window.removeEventListener('mousemove', updateMousePosition);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('mouseover', handleMouseOver);
      document.documentElement.classList.remove('hide-default-cursor');
    };
  }, []);

  return (
    <motion.div
      className={`custom-cursor ${isHovering ? 'hovering' : ''}`}
      animate={{
        x: mousePosition.x - 18,
        y: mousePosition.y - 20,
        rotate: isClicking ? -48 : (isHovering ? -20 : -30),
        scale: isClicking ? 0.9 : (isHovering ? 1.08 : 1),
      }}
      transition={{
        x: { type: 'spring', stiffness: 720, damping: 44 },
        y: { type: 'spring', stiffness: 720, damping: 44 },
        rotate: { type: 'spring', stiffness: 320, damping: 16 },
        scale: { duration: 0.15 }
      }}
    >
      <img src={martilloSvg} alt="" className="custom-cursor-hammer" aria-hidden="true" style={{ width: '35px', height: '100px' }} />
    </motion.div>
  );
}
