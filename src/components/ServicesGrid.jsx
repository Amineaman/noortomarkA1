import React, { useState, useRef, useEffect } from 'react';
import { servicesData } from '../data/services';
import { useI18n } from '../hooks/useI18n';

const ServiceCard = ({ service }) => {
  const cardRef = useRef(null);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    cardRef.current.style.setProperty('--mx', `${x}%`);
    cardRef.current.style.setProperty('--my', `${y}%`);
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      className={`group relative overflow-hidden bg-surface p-8 transition-all duration-350 hover:bg-s2 border-border cursor-pointer 
        ${service.featured ? 'md:col-span-2 md:p-12' : 'col-span-1'}
      `}
    >
      {/* Glow effect */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background: `radial-gradient(400px circle at var(--mx, 50%) var(--my, 50%), rgba(232, 201, 122, 0.08), transparent 50%)`
        }}
      />

      <div className="relative z-10 flex flex-col h-full">
        <div className="flex items-center gap-2 mb-6 font-mono text-[0.6rem] font-bold tracking-[0.2em] text-gold-dk uppercase before:content-[''] before:w-5 before:h-[1px] before:bg-gold-dk">
          {service.tag}
        </div>

        <h3 className={`font-serif leading-tight font-medium transition-colors duration-300 group-hover:text-gold ${service.featured ? 'text-3xl md:text-4xl mb-4' : 'text-xl mb-3'}`}>
          {service.title}
        </h3>

        <p className={`font-light text-muted2 leading-relaxed transition-colors duration-300 group-hover:text-text ${service.featured ? 'text-lg max-w-2xl' : 'text-sm'}`}>
          {service.desc}
        </p>

        <div className="mt-8 flex items-center justify-between pt-5 border-t border-border">
          <div className="flex items-center gap-2 border border-gold-dk px-4 py-1 rounded-[2px] bg-gold/5 animate-pulse">
            <span className="w-1.5 h-1.5 rounded-full bg-gold"></span>
            <span className="font-mono text-[0.62rem] tracking-widest text-gold uppercase">{service.outcome}</span>
          </div>
          
          <div className="font-serif text-lg font-medium text-muted2 group-hover:text-text transition-colors duration-300">
            From <strong className="text-xl text-text group-hover:text-gold">${service.price}</strong>/mo
          </div>
        </div>

        <div className="absolute top-6 right-8 font-serif text-7xl opacity-5 text-gold group-hover:opacity-10 transition-opacity pointer-events-none select-none">
          {`0${service.id}`}
        </div>
      </div>
    </div>
  );
};

const ServicesGrid = () => {
  const [filter, setFilter] = useState('all');
  const { t } = useI18n();

  const categories = [
    { id: 'all', label: 'All Services' },
    { id: 'strategy', label: 'Strategy' },
    { id: 'ads', label: 'Paid Ads' },
    { id: 'seo', label: 'Search' },
    { id: 'tech', label: 'Automation' },
    { id: 'design', label: 'CRO' },
  ];

  const filteredServices = filter === 'all' 
    ? servicesData 
    : servicesData.filter(s => s.category === filter);

  return (
    <section id="services" className="relative z-10 bg-bg transition-colors duration-300 dark:bg-transparent light:bg-[#fefdfb]/70 backdrop-blur-[1px]">
      <div className="flex justify-center gap-2 flex-wrap px-6 py-10 scale-in duration-500">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setFilter(cat.id)}
            className={`font-mono text-[0.63rem] font-medium tracking-[0.18em] px-4 py-2 border rounded-[2px] uppercase transition-all duration-300 
              ${filter === cat.id 
                ? 'border-gold-dk text-gold bg-gold/5' 
                : 'border-border text-muted2 hover:text-text hover:border-white/15'
              }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      <div className="max-w-7xl mx-auto px-6 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-border border border-border rounded-xl overflow-hidden shadow-2xl animate-in fade-in duration-700">
          {filteredServices.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesGrid;
