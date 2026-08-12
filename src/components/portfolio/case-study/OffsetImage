import React from 'react';
import ScrollReveal from '../ScrollReveal';

export default function OffsetImage({ src, alt = '', align = 'right', caption }) {
  return (
    <ScrollReveal amount={0.15}>
      <div className="px-6 md:px-12 lg:px-20">
        <div className="flex" style={{ justifyContent: align === 'left' ? 'flex-start' : 'flex-end' }}>
          <figure className="overflow-hidden rounded-md bg-secondary" style={{ width: '72%' }}>
            <img src={src} alt={alt} className="w-full object-cover" style={{ maxHeight: '80vh', display: 'block' }} />
          </figure>
        </div>
        {caption && (
          <figcaption
            className="mt-3 font-body font-light text-xs tracking-wide"
            style={{ color: '#2C3E5060', width: '72%', marginLeft: align === 'left' ? '0' : 'auto', textAlign: 'left' }}
          >
            {caption}
          </figcaption>
        )}
      </div>
    </ScrollReveal>
  );
}
