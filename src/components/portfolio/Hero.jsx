import React from 'react';
import { motion } from 'framer-motion';

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, delay, ease: [0.22, 1, 0.36, 1] },
  }),
};

export default function Hero() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden text-center px-4">
      <div className="relative z-10 w-full max-w-[100vw]">
        <motion.h1
          initial="hidden"
          animate="visible"
          custom={0.3}
          variants={fadeUp}
          className="font-heading leading-[0.95] tracking-[-0.03em] uppercase select-none"
          style={{ color: '#2C3E50' }}
        >
          <span className="block" style={{ fontWeight: 300, fontSize: 'clamp(1.9rem, 6.75vw, 7.1rem)' }}>
            Integrity
          </span>
          <span className="block" style={{ fontWeight: 300, fontSize: 'clamp(1.9rem, 6.75vw, 7.1rem)' }}>
            at every
          </span>
          <span className="block" style={{ fontWeight: 800, color: '#F15B22', fontSize: 'clamp(2.6rem, 9vw, 9.75rem)' }}>
            Altitude.
          </span>
        </motion.h1>

        <motion.div
          initial="hidden"
          animate="visible"
          custom={0.7}
          variants={fadeUp}
          className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-10"
        >
          <p
            className="font-body font-light text-base md:text-lg leading-relaxed max-w-xs md:max-w-sm text-left sm:text-right"
            style={{ color: '#2C3E50AA' }}
          >
            Brand & Graphic Designer<br />
            Rexburg, ID
          </p>
          <div className="w-px h-10 bg-border hidden sm:block" />
          <p
            className="font-body font-light text-base md:text-lg leading-relaxed max-w-xs md:max-w-sm text-left"
            style={{ color: '#2C3E50AA' }}
          >
            Creating thoughtful identities, systems,<br />
            and experiences that help organizations<br />
            reach higher.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
