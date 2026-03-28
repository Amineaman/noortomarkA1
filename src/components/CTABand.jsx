import React from 'react';
import { useI18n } from '../hooks/useI18n';

const CTABand = () => {
  const { t } = useI18n();

  return (
    <section id="contact" className="relative px-6 py-20 pb-24 text-center border-t border-border transition-all duration-300 backdrop-blur-[2px] overflow-hidden light:bg-[#fefdfb]/80 dark:bg-transparent">
      {/* Background radial glow */}
      <div className="absolute inset-0 pointer-events-none z-0 bg-[radial-gradient(ellipse_1000px_500px_at_50%_100%,rgba(232,201,122,0.06),transparent_80%)]"></div>

      <div className="relative z-10 max-w-4xl mx-auto space-y-6">
        <h2 
          className="font-serif text-4xl md:text-5xl lg:text-7xl font-medium leading-[1.1] tracking-[-0.012em] animate-in filter blur-sm fade-in duration-700"
          dangerouslySetInnerHTML={{ __html: t('cta.title') }}
        />

        <p className="mx-auto max-w-[620px] text-lg font-light leading-relaxed text-muted2 text-shadow-sm pb-4">
          {t('cta.sub')}
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <a
            href="#audit"
            className="w-full sm:w-auto px-10 py-4 bg-gold text-bg font-semibold tracking-widest rounded-sm hover:bg-gold-lt shadow-lg hover:shadow-gold/20 transition-all duration-300 uppercase"
          >
            {t('cta.btnPrimary')}
          </a>
          <a
            href="#work"
            className="w-full sm:w-auto px-10 py-4 border border-border text-text font-medium tracking-widest rounded-sm hover:border-gold-dk hover:text-gold transition-all duration-300 backdrop-blur-sm uppercase"
          >
            {t('cta.btnSecondary')}
          </a>
        </div>

        <div className="pt-8 flex items-center justify-center gap-4">
          <div className="flex -space-x-3 overflow-hidden">
             {[1,2,3,4].map(i => (
               <img key={i} className="inline-block h-8 w-8 rounded-full ring-2 ring-bg grayscale hover:grayscale-0 transition-all cursor-pointer" src={`https://i.pravatar.cc/100?u=${i+10}`} alt="" />
             ))}
          </div>
          <span className="font-mono text-[0.65rem] font-bold tracking-[0.2em] text-gold uppercase bg-gold/5 px-3 py-1 border border-gold-dk/30 animate-pulse">
            {t('cta.slots')}
          </span>
        </div>
      </div>
    </section>
  );
};

export default CTABand;
