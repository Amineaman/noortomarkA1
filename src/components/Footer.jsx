import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-surface border-t border-border px-6 py-10 transition-all duration-300 backdrop-blur-[1px] light:bg-[#f9f7f3]/75">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8 md:gap-0">
        <div className="flex flex-col items-center md:items-start space-y-2">
            <div className="font-serif text-lg font-semibold tracking-widest text-gold">
                NOOR<span className="font-normal text-text">TOMARK</span>
            </div>
            <p className="font-mono text-[10px] text-muted tracking-[0.2em] uppercase">
                Premium Digital Intelligence
            </p>
        </div>

        <div className="flex flex-wrap justify-center gap-8 text-[0.7rem] font-medium tracking-widest uppercase text-muted hover:text-text transition-colors duration-300">
           <a href="#about" className="hover:text-gold">Agency</a>
           <a href="#results" className="hover:text-gold">Results</a>
           <a href="#services" className="hover:text-gold">Capabilities</a>
           <a href="#privacy" className="hover:text-gold">Privacy</a>
        </div>

        <div className="flex items-center gap-4 text-muted hover:text-gold transition-colors duration-300 font-mono text-[0.65rem] tracking-widest">
            <span>© 2026</span>
            <span className="w-1.5 h-[1px] bg-border"></span>
            <span className="flex items-center gap-1.5 uppercase">
                <span className="w-2 h-2 rounded-full border border-gold-dk bg-gold/10"></span>
                Active HQ
            </span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
