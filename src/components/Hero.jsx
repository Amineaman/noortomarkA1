import React from 'react';
import { useI18n } from '../hooks/useI18n';

const Hero = () => {
  const { t } = useI18n();

  return (
    <section className="relative px-6 py-20 pb-16 text-center border-b border-border transition-all duration-300 backdrop-blur-[2px] overflow-hidden light:bg-[#fefdfb]/75 dark:bg-transparent">
      {/* Background radial glow */}
      <div className="absolute inset-0 pointer-events-none z-0 bg-[radial-gradient(ellipse_800px_400px_at_50%_100%,rgba(201,168,76,0.05),transparent_70%)]"></div>

      <div className="relative z-10 max-w-4xl mx-auto space-y-6">
        <p className="font-mono text-[0.65rem] font-semibold tracking-[0.28em] text-gold uppercase animate-in fade-in slide-in-from-bottom-2 duration-700 delay-100">
          {t('hero.eyebrow')}
        </p>

        <h1 
          className="font-serif text-5xl md:text-6xl lg:text-[5.5rem] font-medium leading-[1.06] tracking-[-0.01em] animate-in fade-in slide-in-from-bottom-4 duration-800 delay-300"
          dangerouslySetInnerHTML={{ __html: t('hero.title') }}
        />

        <p className="mx-auto max-w-[540px] text-lg md:text-xl font-light leading-relaxed text-muted2 text-shadow-sm animate-in fade-in slide-in-from-bottom-6 duration-800 delay-500">
          {t('hero.sub')}
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6 animate-in fade-in slide-in-from-bottom-8 duration-800 delay-700">
          <a
            href="#audit"
            className="w-full sm:w-auto px-8 py-3.5 bg-gold text-bg font-medium tracking-widest rounded-sm hover:bg-gold-lt transition-all duration-300"
          >
            {t('hero.ctaPrimary')}
          </a>
          <a
            href="#services"
            className="w-full sm:w-auto px-8 py-3.5 border border-border text-text font-medium tracking-widest rounded-sm hover:border-gold-dk hover:text-gold transition-all duration-300 backdrop-blur-sm"
          >
            {t('hero.ctaSecondary')}
          </a>
        </div>
      </div>
    </section>
  );
};

export default Hero;
