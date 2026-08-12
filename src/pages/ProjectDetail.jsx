import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { projects } from '../lib/projectData';
import FloatingNav from '../components/portfolio/FloatingNav';
import Footer from '../components/portfolio/Footer';
import ScrollReveal from '../components/portfolio/ScrollReveal';
import FullBleedImage from '../components/portfolio/case-study/FullBleedImage';
import DualImage from '../components/portfolio/case-study/DualImage';
import OffsetImage from '../components/portfolio/case-study/OffsetImage';
import ImageGrid from '../components/portfolio/case-study/ImageGrid';
import TextSection from '../components/portfolio/case-study/TextSection';

export default function ProjectDetail() {
  const { slug } = useParams();
  const project = projects.find((p) => p.slug === slug);

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#F4F5F7' }}>
        <div className="text-center">
          <h1 className="font-heading font-extrabold text-4xl mb-4" style={{ color: '#2C3E50' }}>Project not found</h1>
          <Link to="/work" className="font-body font-medium text-sm" style={{ color: '#F15B22' }}>Back to Work</Link>
        </div>
      </div>
    );
  }

  const g = project.galleryImages || [];
  const accent = project.accentColor || '#F15B22';
  const otherProjects = projects.filter((p) => p.slug !== slug);

  const meta = [
    { label: 'Client', value: project.title },
    { label: 'Services', value: project.services },
    { label: 'Year', value: project.year },
  ];

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F4F5F7' }}>
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="flex items-center justify-between px-6 md:px-12 lg:px-20 pt-8 md:pt-10 relative z-10"
      >
        <Link to="/" className="font-heading font-bold text-lg md:text-xl tracking-tight" style={{ color: '#2C3E50' }}>
          Devin Sanders
        </Link>
        <Link to="/work" className="font-body font-light text-sm tracking-wide hover:opacity-60 transition-opacity" style={{ color: '#2C3E50' }}>
          ← All Work
        </Link>
      </motion.header>

      {/* Full-width hero with title overlay */}
      <section className="relative w-full mt-6 md:mt-8">
        <motion.img
          src={project.heroImage}
          alt={project.title}
          initial={{ opacity: 0, scale: 1.02 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="w-full object-cover"
          style={{ height: '85vh' }}
        />
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="absolute bottom-8 md:bottom-12 left-6 md:left-12 lg:left-16 font-heading font-extrabold uppercase tracking-[-0.02em] leading-[0.95] text-white"
          style={{ fontSize: 'clamp(2.5rem, 7vw, 6rem)' }}
        >
          {project.title}
        </motion.h1>
      </section>

      {/* Info bar — summary + meta */}
      <section className="px-6 md:px-12 lg:px-20 py-10 md:py-14 border-b" style={{ borderColor: '#2C3E5015' }}>
        <div className="max-w-6xl grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          <div className="md:col-span-2">
            <span className="text-[11px] font-body font-light tracking-[0.15em] uppercase block mb-3" style={{ color: accent }}>
              {project.industry}
            </span>
            <p className="font-body font-light text-base md:text-lg leading-relaxed max-w-2xl" style={{ color: '#2C3E50CC' }}>
              {project.summary}
            </p>
          </div>
          <div className="flex flex-row md:flex-col gap-6 md:gap-5 md:items-start flex-wrap">
            {meta.map((m) => (
              <div key={m.label}>
                <span className="text-[11px] font-body font-light tracking-[0.15em] uppercase block" style={{ color: '#2C3E5060' }}>
                  {m.label}
                </span>
                <span className="font-body font-medium text-sm" style={{ color: '#2C3E50' }}>{m.value}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Case study body — editorial, varied */}
      <div className="py-16 md:py-24 space-y-16 md:space-y-24">
        <FullBleedImage src={g[0]} alt={project.title} />

        <TextSection items={[{ label: 'Challenge', content: project.challenge }]} accentColor={accent} />

        <DualImage images={[g[1], g[2]]} alt={project.title} />

        <OffsetImage src={g[3]} alt={project.title} align="left" />

        <TextSection items={[{ label: 'Strategy', content: project.strategy }, { label: 'Process', content: project.process }]} accentColor={accent} />

        <FullBleedImage src={g[4]} alt={project.title} />

        <ImageGrid images={[g[5], g[0], g[2]]} alt={project.title} />

        <TextSection items={[{ label: 'Outcome', content: project.outcome }]} accentColor={accent} />

        <OffsetImage src={g[1]} alt={project.title} align="right" />
      </div>

      {/* End — Back to Work + other projects */}
      <section className="px-6 md:px-12 lg:px-20 py-16 md:py-24 border-t" style={{ borderColor: '#2C3E5015' }}>
        <div className="max-w-4xl mx-auto">
          <ScrollReveal>
            <Link
              to="/work"
              className="inline-flex items-center gap-2 font-body font-light text-sm hover:opacity-60 transition-opacity mb-8"
              style={{ color: '#2C3E50' }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
              Back to Work
            </Link>
            <span className="text-xs font-body font-light tracking-[0.15em] uppercase block mb-4" style={{ color: '#2C3E5080' }}>
              Other Projects
            </span>
            <ul className="space-y-3">
              {otherProjects.map((p) => (
                <li key={p.slug}>
                  <Link
                    to={`/project/${p.slug}`}
                    className="font-body font-light text-base md:text-lg hover:opacity-60 transition-opacity"
                    style={{ color: '#2C3E50' }}
                  >
                    {p.title}
                    <span className="font-body font-light text-sm ml-3" style={{ color: '#2C3E5050' }}>
                      — {p.industry}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </ScrollReveal>
        </div>
      </section>

      <Footer />
      <FloatingNav />
    </div>
  );
}
