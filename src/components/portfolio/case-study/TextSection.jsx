import React from 'react';
import ScrollReveal from '../ScrollReveal';

export default function TextSection({ items = [], accentColor = '#F15B22' }) {
  const filtered = items.filter((i) => i && i.content);
  if (!filtered.length) return null;
  return (
    <ScrollReveal amount={0.2}>
      <div className="px-6 md:px-12 lg:px-20 py-16 md:py-24">
        <div className={`max-w-5xl grid grid-cols-1 ${filtered.length > 1 ? 'md:grid-cols-2 gap-12 md:gap-20' : ''}`}>
          {filtered.map((item) => (
            <div key={item.label}>
              <span className="text-xs font-body font-light tracking-[0.15em] uppercase block mb-3" style={{ color: accentColor }}>
                {item.label}
              </span>
              <p className="font-body font-light text-base md:text-lg leading-relaxed" style={{ color: '#2C3E50CC' }}>
                {item.content}
              </p>
            </div>
          ))}
        </div>
      </div>
    </ScrollReveal>
  );
}
