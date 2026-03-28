import React, { useState } from 'react';
import { useI18n } from '../hooks/useI18n';
import { useTheme } from '../hooks/useTheme';

const Navbar = () => {
  const { lang, t, changeLang } = useI18n();
  const { theme, toggleTheme } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    document.body.style.overflow = !isMenuOpen ? 'hidden' : '';
  };

  const navLinks = [
    { key: 'nav.home', href: '#' },
    { key: 'nav.services', href: '#services' },
    { key: 'nav.results', href: '#work' },
    { key: 'nav.contact', href: '#contact' },
  ];

  return (
    <nav className="sticky top-0 z-[100] flex items-center justify-between px-6 py-4 md:px-10 transition-all duration-300 border-b border-border bg-[rgba(6,6,8,0.85)] backdrop-blur-lg dark:bg-[rgba(6,6,8,0.85)] light:bg-[rgba(250,250,248,0.85)]">
      <div className="font-serif text-xl font-semibold tracking-widest text-gold">
        NOOR<span className="font-normal text-text">TOMARK</span>
      </div>

      {/* Desktop Menu */}
      <ul className="hidden md:flex gap-10 text-[0.82rem] tracking-[0.06em] text-muted2">
        {navLinks.map((link) => (
          <li key={link.key}>
            <a href={link.href} className="hover:text-text transition-colors duration-300 uppercase">
              {t(link.key)}
            </a>
          </li>
        ))}
      </ul>

      <div className="flex items-center gap-4">
        {/* Language Switcher */}
        <div className="hidden sm:inline-flex items-center gap-1.5 p-1 rounded-full border border-border bg-white/5">
          <span className="opacity-85 w-4 h-4 flex items-center">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-muted2">
              <circle cx="12" cy="12" r="10" />
              <line x1="2" y1="12" x2="22" y2="12" />
              <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
            </svg>
          </span>
          {['en', 'fr', 'ar'].map((l) => (
            <button
              key={l}
              onClick={() => changeLang(l)}
              className={`px-2 py-1 rounded md:text-[0.7rem] uppercase transition-all duration-200 ${
                lang === l ? 'text-gold border border-gold-dk bg-gold/10' : 'text-muted2 hover:text-text'
              }`}
            >
              {l}
            </button>
          ))}
        </div>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="w-[50px] h-[28px] rounded-full border border-border bg-surface cursor-pointer flex items-center p-0.5 hover:border-gold-dk transition-all duration-300 relative z-[102]"
        >
          <div className={`w-6 h-6 rounded-full bg-gold flex items-center justify-center transition-transform duration-300 ${theme === 'light' ? 'translate-x-[22px]' : 'translate-x-[0px]'}`}>
            {theme === 'dark' ? '🌙' : '☀️'}
          </div>
        </button>

        <a href="#audit" className="hidden lg:block text-[0.75rem] font-medium tracking-widest px-5 py-2 border border-gold-dk text-gold rounded-sm hover:bg-gold hover:text-bg transition-all duration-300">
          {t('nav.audit')}
        </a>

        {/* Hamburger Menu Icon */}
        <button
          onClick={toggleMenu}
          className="md:hidden flex flex-col gap-1.5 z-[151]"
          aria-label="Toggle menu"
        >
          <span className={`w-6 h-[1.5px] bg-gold transition-all duration-300 ${isMenuOpen ? 'translate-y-[7.5px] rotate-45' : ''}`}></span>
          <span className={`w-6 h-[1.5px] bg-gold transition-all duration-300 ${isMenuOpen ? 'opacity-0 scale-x-0' : ''}`}></span>
          <span className={`w-6 h-[1.5px] bg-gold transition-all duration-300 ${isMenuOpen ? '-translate-y-[7.5px] -rotate-45' : ''}`}></span>
        </button>
      </div>

      {/* Mobile Overlay */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-[150] bg-bg/95 flex flex-col items-center justify-center gap-10 animate-in fade-in zoom-in duration-300 backdrop-blur-xl">
          <ul className="flex flex-col items-center gap-8 text-xl tracking-widest uppercase">
            {navLinks.map((link) => (
              <li key={link.key}>
                <a href={link.href} onClick={toggleMenu} className="text-text hover:text-gold transition-colors duration-300">
                  {t(link.key)}
                </a>
              </li>
            ))}
          </ul>
          <div className="flex gap-4">
             {['en', 'fr', 'ar'].map((l) => (
              <button
                key={l}
                onClick={() => { changeLang(l); toggleMenu(); }}
                className={`px-4 py-2 border rounded uppercase transition-all duration-200 ${
                  lang === l ? 'text-gold border-gold bg-gold/10' : 'text-muted2 border-border'
                }`}
              >
                {l}
              </button>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
