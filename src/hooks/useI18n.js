import { useState, useEffect } from 'react';
import { translations } from '../data/translations';

export function useI18n() {
  const [lang, setLang] = useState(() => {
    return localStorage.getItem('lang') || 'en';
  });

  useEffect(() => {
    localStorage.setItem('lang', lang);
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  }, [lang]);

  const t = (key) => {
    const dict = translations[lang] || translations.en;
    return dict[key] || key;
  };

  const changeLang = (newLang) => {
    if (translations[newLang]) {
      setLang(newLang);
    }
  };

  return { lang, t, changeLang };
}
