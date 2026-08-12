import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { projects } from '../lib/projectData';
import Footer from '../components/portfolio/Footer';
import FloatingNav from '../components/portfolio/FloatingNav';
import ScrollReveal from '../components/portfolio/ScrollReveal';
import TopographicBg from '../components/portfolio/TopographicBg';

export default function Work() {
  const [hovered, setHovered] = useState(null);

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F4F5F7' }}>
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="flex items-center justify-between px-6 md:px-12 lg:px-20 pt-8 md:pt-10"
      >
        <Link to="/" className="font-heading font-bold text-lg md:text-xl tracking-tight" style={{ color: '#2C3E50' }}>
          Devin Sanders
        </Link>
        <Link to="/about" className="font-body font-light text-sm tracking-wide hover:opacity-60 transition-opacity" style={{ color: '#2C3E50' }}>
          About
        </Link>
      </motion.header>

      {/* Hero */}
      <section className="relative px-6 md:px-12 lg:px-20 pt-20 md:pt-28 pb-12 overflow-hidden">
        <TopographicBg opacity={0.04} />
        <div className="relative z-10 max-w-5xl">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="text-xs font-body font-light tracking-[0.15em] uppercase block mb-4"
            style={{ color: '#F15B22' }}
          >
            Selected Work
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="font-heading font-extrabold text-4xl md:text-5xl lg:text-6xl leading-[1.08] tracking-[-0.02em] mb-6"
            style={{ color: '#2C3E50' }}
          >
            All projects.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="font-body font-light text-lg leading-relaxed max-w-2xl"
            style={{ color: '#2C3E50AA' }}
          >
            A curated selection of brand identities, packaging systems, and digital experiences —
            each one a study in clarity, craft, and constraint.
          </motion.p>
        </div>
      </section>

      {/* Project list */}
      <section className="px-6 md:px-12 lg:px-20 pb-20">
        <div className="max-w-5xl mx-auto">
          {projects.map((project, i) => (
            <ScrollReveal key={project.slug} delay={i * 0.05}>
              <Link
                to={`/project/${project.slug}`}
                className="group block py-6 border-t"
                style={{ borderColor: '#2C3E5015' }}
                onMouseEnter={() => setHovered(project.slug)}
                onMouseLeave={() => setHovered(null)}
              >
                <div className="flex items-baseline justify-between gap-6">
                  <h2
                    className="font-heading font-extrabold text-2xl md:text-3xl tracking-tight transition-colors duration-300"
                    style={{ color: hovered === project.slug ? '#F15B22' : '#2C3E50' }}
                  >
                    {project.title}
                  </h2>
                  <div className="flex items-center gap-4 shrink-0">
                    <span className="font-body font-light text-xs tracking-wide hidden sm:block" style={{ color: '#2C3E5060' }}>
                      {project.services}
                    </span>
                    <span className="font-body font-light text-xs" style={{ color: '#2C3E5060' }}>
                      {project.year}
                    </span>
                  </div>
                </div>
              </Link>
            </ScrollReveal>
          ))}
          <div className="border-t" style={{ borderColor: '#2C3E5015' }} />
        </div>
      </section>

      <Footer />
      <FloatingNav />
    </div>
  );
}
