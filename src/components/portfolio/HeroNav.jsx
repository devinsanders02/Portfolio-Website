import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function HeroNav() {
  const links = [
    { label: 'Work', path: '/work' },
    { label: 'About', path: '/about' },
    { label: 'Contact', action: () => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' }) },
  ];

  return (
    <motion.header
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
      className="flex items-center justify-end px-8 md:px-14 lg:px-20 pt-6 relative z-10"
    >
      <nav className="flex items-center gap-8">
        {links.map((link) => (
          link.path ? (
            <Link
              key={link.label}
              to={link.path}
              className="font-body font-light text-sm tracking-wide hover:opacity-60 transition-opacity duration-300"
              style={{ color: '#2C3E50' }}
            >
              {link.label}
            </Link>
          ) : (
            <button
              key={link.label}
              onClick={link.action}
              className="font-body font-light text-sm tracking-wide hover:opacity-60 transition-opacity duration-300"
              style={{ color: '#2C3E50' }}
            >
              {link.label}
            </button>
          )
        ))}
      </nav>
    </motion.header>
  );
}
