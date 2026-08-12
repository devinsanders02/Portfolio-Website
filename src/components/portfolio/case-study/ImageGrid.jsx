import React from 'react';
import ScrollReveal from '../ScrollReveal';

export default function ImageGrid({ images = [], alt = '' }) {
  const imgs = images.filter(Boolean).slice(0, 3);
  if (!imgs.length) return null;
  return (
    <ScrollReveal amount={0.15}>
      <div className="px-6 md:px-12 lg:px-20 grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-6">
        {imgs.map((src, i) => (
          <div key={i} className="overflow-hidden rounded-md bg-secondary" style={{ aspectRatio: '3 / 4' }}>
            <img src={src} alt={`${alt} ${i + 1}`} className="w-full h-full object-cover" />
          </div>
        ))}
      </div>
    </ScrollReveal>
  );
}
