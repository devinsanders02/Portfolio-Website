import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';

const navLinks = [
  { label: 'Work', path: '/work' },
  { label: 'About', path: '/about' },
  { label: 'Contact', path: '/#contact' },
];

// Refined custom peak icon — on-brand with "Altitude"
function PeakIcon({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 18 18" fill="none">
      <path d="M2 14 L6.5 5 L10 10 L16 4" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function FloatingNav() {
  const [visible, setVisible] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > window.innerHeight * 0.5);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  const handleNavClick = (path) => {
    setOpen(false);
    if (path.startsWith('/#')) {
      const id = path.slice(2);
      if (window.location.pathname === '/') {
        setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }), 450);
      } else {
        window.location.href = path;
      }
    }
  };

  return (
    <>
      {/* Floating refined button */}
      <AnimatePresence>
        {visible && !open && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            onClick={() => setOpen(true)}
            className="fixed top-4 right-5 z-[70] w-11 h-11 rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform duration-300"
            style={{ backgroundColor: '#F15B22' }}
            aria-label="Open navigation"
          >
            <PeakIcon />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Top-third overlay panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ y: '-100%' }}
            animate={{ y: 0 }}
            exit={{ y: '-100%' }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="fixed top-0 inset-x-0 z-[100]"
            style={{ backgroundColor: '#F15B22' }}
          >
            {/* Top bar */}
            <div className="flex items-center justify-between px-6 md:px-12 py-4 border-b border-white/20">
              <span className="font-body font-light text-xs tracking-[0.2em] uppercase text-white/60">Index</span>
              <button
                onClick={() => setOpen(false)}
                className="w-9 h-9 flex items-center justify-center text-white hover:opacity-70 transition-opacity"
                aria-label="Close"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <line x1="4" y1="4" x2="20" y2="20" /><line x1="20" y1="4" x2="4" y2="20" />
                </svg>
              </button>
            </div>

            {/* Nav links */}
            <nav className="px-6 md:px-12 py-7 md:py-9 flex flex-col sm:flex-row sm:items-end gap-4 sm:gap-12 md:gap-16">
              {navLinks.map((link, i) => (
                <div key={link.label} className="flex items-baseline gap-3">
                  <span className="font-body text-[11px] font-light text-white/45 w-5">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  {link.path.startsWith('/#') ? (
                    <button
                      onClick={() => handleNavClick(link.path)}
                      className="font-heading font-extrabold text-3xl md:text-4xl text-white leading-tight hover:opacity-70 transition-opacity text-left"
                    >
                      {link.label}
                    </button>
                  ) : (
                    <Link
                      to={link.path}
                      onClick={() => setOpen(false)}
                      className="font-heading font-extrabold text-3xl md:text-4xl text-white leading-tight hover:opacity-70 transition-opacity"
                    >
                      {link.label}
                    </Link>
                  )}
                </div>
              ))}
            </nav>

            {/* Bottom contact line */}
            <div className="px-6 md:px-12 pb-5 flex justify-between text-white/55 text-xs font-light font-body">
              <span>devin.sanders02@gmail.com</span>
              <span className="hidden sm:block">Rexburg, ID</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
