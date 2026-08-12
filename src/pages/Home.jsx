import React from 'react';
import HeroNav from '../components/portfolio/HeroNav';
import Hero from '../components/portfolio/Hero';
import ProjectCard from '../components/portfolio/ProjectCard';
import Footer from '../components/portfolio/Footer';
import FloatingNav from '../components/portfolio/FloatingNav';
import ScrollReveal from '../components/portfolio/ScrollReveal';
import { Link } from 'react-router-dom';
import { projects } from '../lib/projectData';

export default function Home() {
  const featured = projects.slice(0, 5);

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F4F5F7' }}>
      <HeroNav />
      <Hero />

      {/* Featured Work */}
      <section id="work">
        {featured.map((project, i) => (
          <ProjectCard
            key={project.slug}
            project={project}
            index={i}
          />
        ))}
      </section>

      {/* View All */}
      <section className="py-16 md:py-24 px-6 md:px-12 lg:px-20 text-center">
        <ScrollReveal>
          <Link
            to="/work"
            className="inline-block px-10 py-4 rounded-lg font-body font-semibold text-sm tracking-wide text-white transition-all duration-300 hover:opacity-85"
            style={{ backgroundColor: '#F15B22' }}
          >
            View All Projects
          </Link>
        </ScrollReveal>
      </section>

      {/* Closing Statement */}
      <section className="py-20 md:py-28 px-6 md:px-12 lg:px-20">
        <ScrollReveal>
          <div className="max-w-3xl mx-auto text-center">
            <span className="text-xs font-body font-light tracking-[0.15em] uppercase block mb-4" style={{ color: '#F15B22' }}>
              Philosophy
            </span>
            <h2 className="font-heading font-extrabold text-3xl md:text-4xl lg:text-5xl tracking-tight leading-tight mb-6" style={{ color: '#2C3E50' }}>
              Design is how you think,<br />not just what you make.
            </h2>
            <p className="font-body font-light text-base md:text-lg leading-relaxed" style={{ color: '#2C3E50AA' }}>
              Every project is an opportunity to solve real problems with clarity and craft.
              I believe in asking better questions, embracing constraints, and staying curious
              long after the brief is written.
            </p>
          </div>
        </ScrollReveal>
      </section>

      <Footer />
      <FloatingNav />
    </div>
  );
}
