import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import ScrollReveal from './ScrollReveal';

const slideInLeft = {
  hidden: { opacity: 0, x: -60 },
  visible: (delay = 0) => ({
    opacity: 1,
    x: 0,
    transition: { duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] },
  }),
};

function HeroGallery({ images, isAccentBg, accentColor }) {
  const [current, setCurrent] = useState(0);
  const allImages = images.filter(Boolean);
  if (!allImages.length) return null;

  const advance = () => {
    setCurrent((prev) => (prev + 1) % allImages.length);
  };

  return (
    <div className="w-full">
      {/* Hero image — 80% width, left-aligned, click to advance */}
      <div
        onClick={advance}
        className="relative overflow-hidden rounded-md bg-secondary cursor-pointer"
        style={{ maxHeight: '74vh', width: '80%' }}
      >
        <AnimatePresence mode="wait">
          <motion.img
            key={current}
            src={allImages[current]}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="w-full object-cover rounded-md"
            style={{ maxHeight: '74vh', display: 'block' }}
            alt="Project image"
          />
        </AnimatePresence>
      </div>

      {/* Indicator bars — slightly wider; active longer + colored, inactive shorter + neutral */}
      {allImages.length > 1 && (
        <div className="flex gap-2 items-center mt-4" style={{ width: '80%' }}>
          {allImages.map((_, i) => (
            <button
              key={i}
              onClick={(e) => { e.stopPropagation(); setCurrent(i); }}
              className="h-[2px] rounded-full transition-all duration-300"
              style={{
                width: i === current ? '2.25rem' : '0.85rem',
                backgroundColor: i === current
                  ? (isAccentBg ? '#fff' : (accentColor || '#F15B22'))
                  : (isAccentBg ? 'rgba(255,255,255,0.25)' : '#2C3E5020'),
              }}
              aria-label={`Go to image ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default function ProjectCard({ project, index }) {
  const { title, summary, services, heroImage, galleryImages, accentColor, slug } = project;
  const isAccentBg = index % 2 === 1;
  const allImages = [heroImage, ...(galleryImages || [])].filter(Boolean);
  const titleWords = title.split(' ');
  const firstWord = titleWords[0];
  const restTitle = titleWords.slice(1).join(' ');
  const secondaryImages = (galleryImages || []).filter(Boolean).slice(0, 2);

  return (
    <div
      className="py-12 md:py-20 px-6 md:px-12 lg:px-20 transition-colors duration-700"
      style={{ backgroundColor: isAccentBg ? (accentColor || '#2C3E50') : '#F4F5F7' }}
    >
      <motion.div
        variants={slideInLeft}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.15 }}
      >
        {/* 1. Hero gallery — 80% width, left-aligned */}
        <HeroGallery images={allImages} isAccentBg={isAccentBg} accentColor={accentColor} />

        {/* 2. Info block */}
        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-start" style={{ width: '80%' }}>
          <div>
            <h2
              className="font-heading font-extrabold text-2xl md:text-3xl lg:text-4xl leading-tight tracking-tight"
              style={{ color: isAccentBg ? '#fff' : '#2C3E50' }}
            >
              <span style={{ color: isAccentBg ? 'rgba(255,255,255,0.75)' : (accentColor || '#F15B22') }}>
                {firstWord}
              </span>
              {restTitle ? ` — ${restTitle}` : ''}
            </h2>
            <p
              className="font-body font-light text-sm mt-2"
              style={{ color: isAccentBg ? 'rgba(255,255,255,0.55)' : '#2C3E5070' }}
            >
              {services}
            </p>
          </div>
          <div>
            <p
              className="font-body font-light text-sm md:text-base leading-relaxed mb-5"
              style={{ color: isAccentBg ? 'rgba(255,255,255,0.8)' : '#2C3E50CC' }}
            >
              {summary}
            </p>
            <Link
              to={`/project/${slug}`}
              className="group inline-flex items-center gap-2 font-body font-medium text-sm hover:opacity-60 transition-opacity"
              style={{ color: isAccentBg ? '#fff' : '#2C3E50' }}
            >
              View Project Details
              <ArrowRight
                className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300"
              />
            </Link>
          </div>
        </div>

        {/* 3. Secondary images — right-aligned, ~65% width, side-by-side */}
        {secondaryImages.length >= 2 && (
          <div className="mt-12 flex justify-end">
            <div className="grid grid-cols-2 gap-3 md:gap-4" style={{ width: '65%' }}>
              {secondaryImages.map((img, i) => (
                <div key={i} className="overflow-hidden rounded-md aspect-[4/3] bg-secondary">
                  <img src={img} alt={`${title} detail ${i + 1}`} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
