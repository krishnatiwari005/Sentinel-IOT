import { useEffect } from 'react';

import { Sidebar } from './Sidebar';
import { BottomNav } from './BottomNav';
import { motion, AnimatePresence, useMotionValue, useSpring } from 'framer-motion';
import { useLocation, Outlet } from 'react-router-dom';

export const Layout = () => {
  const location = useLocation();
  
  // Dynamic Mouse Glow
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  const springConfig = { damping: 20, stiffness: 150 };
  const glowX = useSpring(mouseX, springConfig);
  const glowY = useSpring(mouseY, springConfig);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  return (
    <div className="min-h-screen bg-background relative overflow-x-hidden">
      {/* Global Background Scanline Overlay */}
      <div className="fixed inset-0 pointer-events-none z-[99] opacity-[0.03] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%]"></div>
      
      {/* Mouse Glow Effect */}
      <motion.div 
        style={{ x: glowX, y: glowY, translate: '-50% -50%' }}
        className="fixed w-[600px] h-[600px] bg-accent-blue/10 blur-[120px] rounded-full pointer-events-none z-0 hidden md:block"
      />

      <Sidebar />
      <section 
        id="sentinel-command-vault"
        className="md:pl-64 w-full min-h-screen p-4 md:p-8 pb-28 md:pb-8 relative z-10"
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 15, scale: 0.99 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -15, scale: 0.99 }}
            transition={{ 
              type: "spring", 
              stiffness: 260, 
              damping: 20,
              mass: 0.5
            }}
            style={{ width: '100%', maxWidth: 'none', margin: 0 }}
            className="w-full"
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </section>
      <BottomNav />
    </div>
  );
};
