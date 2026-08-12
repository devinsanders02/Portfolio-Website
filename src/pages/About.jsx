import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import ScrollReveal from '../components/portfolio/ScrollReveal';
import TopographicBg from '../components/portfolio/TopographicBg';
import FloatingNav from '../components/portfolio/FloatingNav';
import Footer from '../components/portfolio/Footer';
import ResumeModal from '../components/portfolio/ResumeModal';

const skills = [
  { category: 'Design Tools', items: ['Illustrator', 'Photoshop', 'InDesign', 'After Effects', 'Figma'] },
  { category: 'Design Focus', items: ['Brand Identity', 'Typography', 'Grid Systems', 'Packaging Design', 'E-Commerce Visual Design'] },
  { category: 'Additional', items: ['Amazon A+ Content', 'Brand Stores', 'Client Communication', 'Research & Content Strategy'] },
];

const timeline = [
  {
    year: 'Jun 2025 — Present',
    role: 'Ecommerce Visual Designer',
    company: 'Rippl Marketing',
    description: 'Creating high-volume product infographics for major brands including WANDRD, Borka Tools, and KleenBore. Building complete Amazon Brand Stores and researching competitor content strategies.',
  },
  {
    year: 'Apr 2023 — Jul 2024',
    role: 'Data Entry Specialist',
    company: 'BYU-Idaho Career Center',
    description: 'Organized and maintained alumni data with high accuracy, supporting targeted outreach and communication efforts.',
  },
  {
    year: 'Apr 2021 — Mar 2023',
    role: 'Volunteer Representative',
    company: 'The Church of Jesus Christ of Latter-day Saints',
    description: 'Led a team of 14 volunteers, coordinating daily responsibilities and dedicating 30+ hours weekly to community outreach and teaching.',
  },
];

const values = [
  { title: 'Integrity', text: 'Doing the right work the right way, even when nobody is watching.' },
  { title: 'Craft', text: 'Sweating the details because details are what separate good from great.' },
  { title: 'Growth', text: 'Every project is a chance to learn. Every constraint is a teacher.' },
  { title: 'Clarity', text: 'Complexity is easy. Simplicity requires deeper understanding.' },
];

export default function About() {
  const [resumeOpen, setResumeOpen] = useState(false);

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F4F5F7' }}>
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="flex items-center justify-between px-6 md:px-12 lg:px-20 pt-8 md:pt-12"
      >
        <Link to="/" className="font-heading font-bold text-lg md:text-xl tracking-tight" style={{ color: '#2C3E50' }}>
          Devin Sanders
        </Link>
        <nav className="hidden md:flex items-center gap-8">
          <Link to="/" className="font-body font-light text-sm tracking-wide hover:opacity-60 transition-opacity" style={{ color: '#2C3E50' }}>Home</Link>
          <button onClick={() => setResumeOpen(true)} className="font-body font-light text-sm tracking-wide hover:opacity-60 transition-opacity" style={{ color: '#2C3E50' }}>Resume</button>
        </nav>
      </motion.header>

      {/* Hero */}
      <section className="relative px-6 md:px-12 lg:px-20 pt-20 md:pt-32 pb-16 md:pb-24 overflow-hidden">
        <TopographicBg opacity={0.04} />
        <div className="relative z-10 max-w-4xl">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="text-xs font-body font-light tracking-[0.15em] uppercase block mb-4"
            style={{ color: '#F15B22' }}
          >
            About
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="font-heading font-extrabold text-4xl md:text-5xl lg:text-6xl xl:text-7xl leading-[1.08] tracking-[-0.02em] mb-8"
            style={{ color: '#2C3E50' }}
          >
            I design brands that<br />deserve to be believed in.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="font-body font-light text-lg md:text-xl leading-relaxed max-w-2xl"
            style={{ color: '#2C3E50AA' }}
          >
            I'm a brand and graphic designer based in Rexburg, Idaho, currently finishing my BA 
            in Graphic Design at BYU-Idaho. My work sits at the intersection of strategic thinking 
            and visual craft.
          </motion.p>
        </div>
      </section>

      {/* Story */}
      <section className="px-6 md:px-12 lg:px-20 py-16 md:py-24">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
          <ScrollReveal>
            <div>
              <span className="text-xs font-body font-light tracking-[0.15em] uppercase block mb-4" style={{ color: '#F15B22' }}>My Story</span>
              <h2 className="font-heading font-bold text-2xl md:text-3xl tracking-tight mb-6" style={{ color: '#2C3E50' }}>
                From curiosity to conviction
              </h2>
              <div className="space-y-5 font-body font-light text-base leading-relaxed" style={{ color: '#2C3E50CC' }}>
                <p>
                  Design wasn't something I discovered overnight — it was something that slowly revealed itself 
                  through years of noticing things other people didn't. The spacing on a sign. The weight of a 
                  typeface. The way a well-designed package made you trust what was inside before you ever opened it.
                </p>
                <p>
                  That curiosity led me to BYU-Idaho, where I've been immersing myself in the fundamentals: 
                  typography, grid systems, brand strategy, and visual communication. But the classroom has only 
                  been part of the education. The real lessons have come from working on real projects with real 
                  constraints — learning to balance creative ambition with strategic thinking.
                </p>
                <p>
                  At Rippl Marketing, I discovered the power of high-volume production work — maintaining quality 
                  and brand consistency across 50+ pieces while moving at speed. It taught me that craft isn't 
                  just about perfection; it's about consistency under pressure.
                </p>
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.2}>
            <div>
              <span className="text-xs font-body font-light tracking-[0.15em] uppercase block mb-4" style={{ color: '#F15B22' }}>Philosophy</span>
              <h2 className="font-heading font-bold text-2xl md:text-3xl tracking-tight mb-6" style={{ color: '#2C3E50' }}>
                What I believe
              </h2>
              <div className="space-y-6">
                {values.map((v, i) => (
                  <div key={v.title} className="flex gap-4">
                    <span className="font-heading font-extrabold text-3xl leading-none" style={{ color: '#F15B2220' }}>
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <div>
                      <h3 className="font-heading font-semibold text-base mb-1" style={{ color: '#2C3E50' }}>{v.title}</h3>
                      <p className="font-body font-light text-sm leading-relaxed" style={{ color: '#2C3E50AA' }}>{v.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Timeline */}
      <section className="px-6 md:px-12 lg:px-20 py-16 md:py-24" style={{ backgroundColor: '#2C3E5008' }}>
        <div className="max-w-4xl mx-auto">
          <ScrollReveal>
            <span className="text-xs font-body font-light tracking-[0.15em] uppercase block mb-4" style={{ color: '#F15B22' }}>Experience</span>
            <h2 className="font-heading font-bold text-2xl md:text-3xl tracking-tight mb-12" style={{ color: '#2C3E50' }}>
              Career Journey
            </h2>
          </ScrollReveal>

          <div className="space-y-0">
            {timeline.map((item, i) => (
              <ScrollReveal key={i} delay={i * 0.1}>
                <div className="flex gap-6 md:gap-10 py-8 border-t" style={{ borderColor: '#2C3E5015' }}>
                  <div className="w-48 shrink-0">
                    <span className="font-body font-light text-xs tracking-wide" style={{ color: '#2C3E5080' }}>
                      {item.year}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-heading font-semibold text-base mb-1" style={{ color: '#2C3E50' }}>{item.role}</h3>
                    <p className="font-body font-medium text-sm mb-3" style={{ color: '#F15B22' }}>{item.company}</p>
                    <p className="font-body font-light text-sm leading-relaxed" style={{ color: '#2C3E50AA' }}>{item.description}</p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>

          <ScrollReveal delay={0.3}>
            <div className="mt-12 flex flex-wrap gap-4 items-center">
              <button
                onClick={() => setResumeOpen(true)}
                className="px-8 py-3.5 rounded-lg font-body font-semibold text-sm tracking-wide text-white transition-all duration-300 hover:opacity-90"
                style={{ backgroundColor: '#F15B22' }}
              >
                View Full Resume
              </button>
              <a
                href="https://www.linkedin.com/in/devin-sanders-6a43a41b6/"
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-3.5 rounded-lg font-body font-semibold text-sm tracking-wide border-2 transition-all duration-300 hover:opacity-70 flex items-center gap-2"
                style={{ borderColor: '#2C3E5030', color: '#2C3E50' }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>
                LinkedIn
              </a>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Skills */}
      <section className="px-6 md:px-12 lg:px-20 py-16 md:py-24">
        <div className="max-w-7xl mx-auto">
          <ScrollReveal>
            <span className="text-xs font-body font-light tracking-[0.15em] uppercase block mb-4" style={{ color: '#F15B22' }}>Capabilities</span>
            <h2 className="font-heading font-bold text-2xl md:text-3xl tracking-tight mb-12" style={{ color: '#2C3E50' }}>
              Skills & Tools
            </h2>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {skills.map((group, i) => (
              <ScrollReveal key={group.category} delay={i * 0.1}>
                <h3 className="font-heading font-semibold text-sm tracking-wide uppercase mb-4" style={{ color: '#2C3E50' }}>
                  {group.category}
                </h3>
                <ul className="space-y-2">
                  {group.items.map((item) => (
                    <li key={item} className="font-body font-light text-sm" style={{ color: '#2C3E50AA' }}>
                      {item}
                    </li>
                  ))}
                </ul>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Education */}
      <section className="px-6 md:px-12 lg:px-20 py-16 md:py-24" style={{ backgroundColor: '#2C3E5008' }}>
        <div className="max-w-4xl mx-auto">
          <ScrollReveal>
            <span className="text-xs font-body font-light tracking-[0.15em] uppercase block mb-4" style={{ color: '#F15B22' }}>Education</span>
            <h2 className="font-heading font-bold text-2xl md:text-3xl tracking-tight mb-6" style={{ color: '#2C3E50' }}>
              BYU-Idaho
            </h2>
            <div className="flex flex-wrap gap-x-8 gap-y-2">
              <div>
                <span className="font-body font-light text-xs tracking-wide" style={{ color: '#2C3E5080' }}>Degree</span>
                <p className="font-body font-medium text-sm" style={{ color: '#2C3E50' }}>BA, Graphic Design</p>
              </div>
              <div>
                <span className="font-body font-light text-xs tracking-wide" style={{ color: '#2C3E5080' }}>Location</span>
                <p className="font-body font-medium text-sm" style={{ color: '#2C3E50' }}>Rexburg, ID</p>
              </div>
              <div>
                <span className="font-body font-light text-xs tracking-wide" style={{ color: '#2C3E5080' }}>Expected</span>
                <p className="font-body font-medium text-sm" style={{ color: '#2C3E50' }}>July 2026</p>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      <Footer />
      <FloatingNav />
      <ResumeModal open={resumeOpen} onClose={() => setResumeOpen(false)} />
    </div>
  );
}
