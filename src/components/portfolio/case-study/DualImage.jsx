import React from 'react';
import ScrollReveal from '../ScrollReveal';

export default function DualImage({ images = [], alt = '' }) {
  const imgs = images.filter(Boolean).slice(0, 2);
  if (!imgs.length) return null;
  return (
    <ScrollReveal amount={0.15}>
      <div className="px-6 md:px-12 lg:px-20 grid grid-cols-2 gap-3 md:gap-6">
        {imgs.map((src, i) => (
          <div key={i} className="overflow-hidden rounded-md bg-secondary" style={{ aspectRatio: '4 / 5' }}>
            <img src={src} alt={`${alt} ${i + 1}`} className="w-full h-full object-cover" />
          </div>
        ))}
      </div>
    </ScrollReveal>
  );
}
