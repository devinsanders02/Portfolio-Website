import React from 'react';
import ScrollReveal from '../ScrollReveal';

export default function FullBleedImage({ src, alt = '', caption }) {
  return (
    <ScrollReveal amount={0.1}>
      <figure className="w-full">
        <img
          src={src}
          alt={alt}
          className="w-full object-cover"
          style={{ maxHeight: '90vh', display: 'block' }}
        />
        {caption && (
          <figcaption className="px-6 md:px-12 lg:px-20 mt-3 font-body font-light text-xs tracking-wide" style={{ color: '#2C3E5060' }}>
            {caption}
          </figcaption>
        )}
      </figure>
    </ScrollReveal>
  );
}
