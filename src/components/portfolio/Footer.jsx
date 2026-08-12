import React from 'react';
import { Link } from 'react-router-dom';
import ScrollReveal from './ScrollReveal';

export default function Footer() {
  return (
    <footer id="contact" className="relative py-14 md:py-20 px-6 md:px-12 lg:px-20" style={{ backgroundColor: '#2C3E50' }}>
      <div className="max-w-7xl mx-auto">
        <ScrollReveal>
          <span className="text-xs font-body font-light tracking-[0.15em] uppercase" style={{ color: '#F15B22' }}>
            Get in Touch
          </span>
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          <h2 className="font-heading font-extrabold text-3xl md:text-4xl lg:text-5xl leading-[1.1] tracking-tight mt-3 mb-5 text-white">
            Let's build<br />something meaningful.
          </h2>
        </ScrollReveal>

        <ScrollReveal delay={0.2}>
          <a
            href="mailto:devin.sanders02@gmail.com"
            className="font-body font-light text-sm text-white/60 hover:text-white/90 transition-colors"
          >
            devin.sanders02@gmail.com
          </a>
        </ScrollReveal>

        <ScrollReveal delay={0.25}>
          <div className="flex flex-wrap gap-x-8 gap-y-1 mt-2">
            <a href="tel:+17206550390" className="font-body font-light text-sm text-white/60 hover:text-white/90 transition-colors">
              (720) 655-0390
            </a>
          </div>
        </ScrollReveal>

        {/* Social — text links */}
        <ScrollReveal delay={0.3}>
          <div className="flex items-center gap-6 mt-5">
            <a
              href="https://www.linkedin.com/in/devin-sanders-6a43a41b6/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-body font-light text-sm text-white/50 hover:text-white/90 transition-colors"
            >
              LinkedIn
            </a>
            <a
              href="https://www.behance.net/devinsanders"
              target="_blank"
              rel="noopener noreferrer"
              className="font-body font-light text-sm text-white/50 hover:text-white/90 transition-colors"
            >
              Behance
            </a>
          </div>
        </ScrollReveal>

        {/* Divider */}
        <div className="my-8 border-t" style={{ borderColor: '#ffffff15' }} />

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex flex-wrap gap-6">
            {[
              { label: 'Work', path: '/work' },
              { label: 'About', path: '/about' },
            ].map((link) => (
              <Link key={link.label} to={link.path} className="font-body font-light text-sm text-white/50 hover:text-white/80 transition-colors">
                {link.label}
              </Link>
            ))}
          </div>
          <p className="font-body font-light text-xs text-white/30">
            © {new Date().getFullYear()} Devin Sanders. Crafted with intention.
          </p>
        </div>
      </div>
    </footer>
  );
}
