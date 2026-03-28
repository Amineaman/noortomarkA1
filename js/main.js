/* ══════════════════════════════════════════════════════════════
   NOORTOMARK - MAIN JAVASCRIPT
   Production-Ready Interactions & Animations
   ══════════════════════════════════════════════════════════════ */

// ────────────────────────────────────
// INITIALIZATION
// ────────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {
  initThemeToggle();
  initScrollReveal();
  initFilterSystem();
  initGlowEffect();
  initNavigation();
  initI18n();
  initChatbot();
});

// ────────────────────────────────────
// THEME TOGGLE (DARK/LIGHT MODE)
// ────────────────────────────────────

function initThemeToggle() {
  const themeToggle = document.getElementById('themeToggle');
  const themeIcon = document.getElementById('themeIcon');
  const html = document.documentElement;

  // Get saved theme or use system preference
  const savedTheme = localStorage.getItem('theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const initialTheme = savedTheme || (prefersDark ? 'dark' : 'light');

  // Set initial theme
  setTheme(initialTheme);

  // Toggle on button click
  themeToggle.addEventListener('click', () => {
    const currentTheme = html.getAttribute('data-theme') || 'dark';
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);

    // Update neural vortex if available
    if (window.neuralVortex) {
      window.neuralVortex.updateConfig({
        colorMode: 'gold',
        opacity: newTheme === 'light' ? 0.4 : 0.85,
      });
    }
  });

  // Listen for system theme changes
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (!localStorage.getItem('theme')) {
      setTheme(e.matches ? 'dark' : 'light');
    }
  });

  function setTheme(theme) {
    html.setAttribute('data-theme', theme);
    themeIcon.textContent = theme === 'dark' ? '🌙' : '☀️';
  }
}

// ────────────────────────────────────
// SCROLL REVEAL ANIMATION
// ────────────────────────────────────

function initScrollReveal() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -30px 0px',
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in');
      }
    });
  }, observerOptions);

  document.querySelectorAll('.reveal').forEach((el) => {
    observer.observe(el);
  });
}

// ────────────────────────────────────
// FILTER SYSTEM
// ────────────────────────────────────

function initFilterSystem() {
  const filterButtons = document.querySelectorAll('.filter-btn');
  const cards = document.querySelectorAll('.card, .card-featured');

  filterButtons.forEach((button) => {
    button.addEventListener('click', () => {
      // Update active button
      filterButtons.forEach((btn) => btn.classList.remove('active'));
      button.classList.add('active');

      // Filter cards
      const category = button.dataset.category || 'all';
      filterCards(category, cards);
    });
  });
}

function filterCards(category, cards) {
  cards.forEach((card) => {
    if (category === 'all') {
      card.classList.remove('hidden');
    } else {
      const cardCategory = card.dataset.cat;
      if (cardCategory === category) {
        card.classList.remove('hidden');
      } else {
        card.classList.add('hidden');
      }
    }
  });
}

// ────────────────────────────────────
// GLOW EFFECT ON MOUSE MOVE
// ────────────────────────────────────

function initGlowEffect() {
  const cards = document.querySelectorAll('.card, .card-featured');

  cards.forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      card.style.setProperty('--mx', `${x}px`);
      card.style.setProperty('--my', `${y}px`);
    });

    card.addEventListener('mouseleave', () => {
      card.style.setProperty('--mx', '50%');
      card.style.setProperty('--my', '50%');
    });
  });
}

// ────────────────────────────────────
// SMART NAVIGATION
// ────────────────────────────────────

function initNavigation() {
  const navLinks = document.querySelectorAll('nav a');

  navLinks.forEach((link) => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');

      // Allow external links
      if (href.startsWith('http')) {
        return;
      }

      // Handle hash links smoothly
      if (href.startsWith('#')) {
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
          target.scrollIntoView({ behavior: 'smooth' });
        }
      }
    });
  });
}

// ────────────────────────────────────
// PERFORMANCE OPTIMIZATION
// ────────────────────────────────────

// Debounce scroll events for better performance
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Throttle mousemove for glow effect
function throttle(func, limit) {
  let inThrottle;
  return function (...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

// ────────────────────────────────────
// ACCESSIBILITY ENHANCEMENTS
// ────────────────────────────────────

// Ensure keyboard navigation works
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    const chat = document.getElementById('chatbot');
    if (chat) {
      chat.classList.remove('is-open');
    }
  }
});

// Respect user's motion preferences
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  document.documentElement.style.scrollBehavior = 'auto';
}

// ────────────────────────────────────
// UTILITY FUNCTIONS
// ────────────────────────────────────

/**
 * Get viewport dimensions
 */
function getViewport() {
  return {
    width: Math.max(document.documentElement.clientWidth, window.innerWidth),
    height: Math.max(document.documentElement.clientHeight, window.innerHeight),
  };
}

/**
 * Check if element is in viewport
 */
function isInViewport(element) {
  const rect = element.getBoundingClientRect();
  return (
    rect.top < (window.innerHeight || document.documentElement.clientHeight) &&
    rect.bottom > 0 &&
    rect.left < (window.innerWidth || document.documentElement.clientWidth) &&
    rect.right > 0
  );
}

// ────────────────────────────────────
// ANALYTICS TRACKING (optional)
// ────────────────────────────────────

function trackButtonClick(category, action, label) {
  // Integrate with analytics service (GA, Mixpanel, etc.)
  if (typeof gtag !== 'undefined') {
    gtag('event', action, {
      event_category: category,
      event_label: label,
    });
  }
}

// Track CTA clicks
document.querySelectorAll('.btn').forEach((btn) => {
  btn.addEventListener('click', () => {
    trackButtonClick('engagement', 'button_click', btn.textContent.trim());
  });
});

// ────────────────────────────────────
// EXPORT FOR EXTERNAL USE
// ────────────────────────────────────


// -------------------------------------------------------------
// CHATBOT WIDGET LOGIC
// -------------------------------------------------------------

function initChatbot() {
  const widget = document.getElementById('chatbot');
  const toggle = document.getElementById('chatToggle');
  const closeBtn = document.getElementById('chatClose');
  const messages = document.getElementById('chatMessages');
  const form = document.getElementById('chatForm');
  const input = document.getElementById('chatInput');
  const suggestions = document.querySelectorAll('.chat-suggest');

  if (!widget || !toggle || !closeBtn || !messages || !form || !input) return;

  const addMessage = (role, text) => {
    const bubble = document.createElement('div');
    bubble.className = chat-msg ;
    bubble.textContent = text;
    messages.appendChild(bubble);
    messages.scrollTop = messages.scrollHeight;
  };

  const openChat = () => {
    widget.classList.add('is-open');
    input.focus();
  };

  const closeChat = () => widget.classList.remove('is-open');

  addMessage('bot', 'Hi, I\'m Noorbot. Ask about pricing, guarantees, or start dates.');

  toggle.addEventListener('click', () => {
    widget.classList.toggle('is-open');
    if (widget.classList.contains('is-open')) {
      input.focus();
    }
  });

  closeBtn.addEventListener('click', closeChat);

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const text = input.value.trim();
    if (!text) return;
    addMessage('user', text);
    input.value = '';

    setTimeout(() => {
      addMessage('bot', getChatbotReply(text));
    }, 180);
  });

  suggestions.forEach((btn) => {
    btn.addEventListener('click', () => {
      const preset = btn.dataset.msg || btn.textContent.trim();
      openChat();
      addMessage('user', preset);
      setTimeout(() => addMessage('bot', getChatbotReply(preset)), 140);
    });
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeChat();
    }
  });
}

function getChatbotReply(message) {
  const msg = message.toLowerCase();
  const has = (...terms) => terms.some((term) => msg.includes(term));

  if (has('price', 'pricing', 'cost', 'budget', 'fee')) {
    return 'Most clients start at $800/mo for paid media and $600/mo for SEO. We scope a plan in 24 hours.';
  }

  if (has('guarantee', 'refund', 'risk')) {
    return 'We set a KPI before kickoff. If we miss it by day 90, you get a full refund.';
  }

  if (has('start', 'timeline', 'how fast', 'kickoff', 'speed')) {
    return 'Kickoff in 7 business days. Campaigns live by week 2 with weekly reporting.';
  }

  if (has('case', 'results', 'proof', 'roas', 'roi', 'work')) {
    return 'Recent wins: 3x ROAS in 60 days and page 1 SEO within 6 months. See the Results section for proof.';
  }

  if (has('seo', 'search', 'organic')) {
    return 'SEO: technical audit, keyword map, 4 articles/month, and backlinks starting at $600/mo.';
  }

  if (has('ads', 'media', 'ppc', 'paid', 'tiktok', 'meta', 'google')) {
    return 'Paid media: Meta, Google, TikTok with weekly A/B testing starting at $800/mo.';
  }

  if (has('automation', 'crm', 'hubspot', 'pipedrive', 'zapier', 'tech')) {
    return 'Automation: HubSpot or Pipedrive setup, email sequences, lead scoring, Zapier webhooks from $500/mo.';
  }

  if (has('contact', 'call', 'audit', 'book', 'meeting')) {
    return 'Book a 45-minute audit via the contact form or email hello@noortomark.com. Response within one business day.';
  }

  return 'Tell me your goal (leads, revenue, ROAS) and monthly budget; I will point you to the right service or book a quick audit.';
}

window.noortomark = {
  filterCards,
  debounce,
  throttle,
  getViewport,
  isInViewport,
  trackButtonClick,
};

// -------------------------------------------------------------
// I18N (EN / FR / AR)
// -------------------------------------------------------------

const translations = {
  en: {
    'nav.home': 'Home',
    'nav.services': 'Services',
    'nav.results': 'Results',
    'nav.contact': 'Contact',
    'nav.audit': 'GET AUDIT →',
    'hero.eyebrow': 'PERFORMANCE MARKETING AGENCY',
    'hero.title': 'Scale Revenue<br /><em>Guaranteed</em>',
    'hero.sub': 'Hit target or refund. No contracts. Risk on us.',
    'hero.ctaPrimary': 'START FREE AUDIT',
    'hero.ctaSecondary': 'SEE SERVICES',
    'cta.title': 'Not Sure Which<br /><em>Service You Need?</em>',
    'cta.sub': "Book a free 45-minute audit. We'll tell you exactly what's costing you money and what to fix first.",
    'cta.btnPrimary': 'BOOK FREE AUDIT →',
    'cta.btnSecondary': 'SEE CASE STUDIES',
    'cta.slots': '2 SPOTS LEFT FOR APRIL 2026',
  },
  fr: {
    'nav.home': 'Accueil',
    'nav.services': 'Services',
    'nav.results': 'Résultats',
    'nav.contact': 'Contact',
    'nav.audit': 'OBTENIR UN AUDIT →',
    'hero.eyebrow': 'AGENCE DE PERFORMANCE MARKETING',
    'hero.title': 'Développez vos revenus<br /><em>avec garantie</em>',
    'hero.sub': 'Objectif atteint ou remboursé. Aucun contrat. Le risque est pour nous.',
    'hero.ctaPrimary': 'DÉMARRER UN AUDIT GRATUIT',
    'hero.ctaSecondary': 'VOIR LES SERVICES',
    'cta.title': 'Vous ne savez pas<br /><em>quel service choisir&nbsp;?</em>',
    'cta.sub': 'Réservez un audit gratuit de 45 min. On vous dit ce qui vous coûte et quoi corriger en premier.',
    'cta.btnPrimary': 'RÉSERVER UN AUDIT GRATUIT →',
    'cta.btnSecondary': 'VOIR LES CAS CLIENTS',
    'cta.slots': '2 PLACES RESTANTES POUR AVRIL 2026',
  },
  ar: {
    'nav.home': 'الرئيسية',
    'nav.services': 'الخدمات',
    'nav.results': 'النتائج',
    'nav.contact': 'تواصل',
    'nav.audit': 'احصل على تدقيق →',
    'hero.eyebrow': 'وكالة تسويق أدائي',
    'hero.title': 'نمّ الإيرادات<br /><em>بضمان النتائج</em>',
    'hero.sub': 'نصل للهدف أو نعيد المال. بدون عقود. المخاطرة علينا.',
    'hero.ctaPrimary': 'ابدأ تدقيق مجاني',
    'hero.ctaSecondary': 'عرض الخدمات',
    'cta.title': 'لست متأكدًا<br /><em>أي خدمة تحتاج؟</em>',
    'cta.sub': 'احجز تدقيقًا مجانيًا لمدة 45 دقيقة. نخبرك بما يكلّفك المال وما يجب إصلاحه أولًا.',
    'cta.btnPrimary': 'احجز تدقيق مجاني →',
    'cta.btnSecondary': 'شاهد دراسات الحالة',
    'cta.slots': 'متبقي مكانان لشهر أبريل 2026',
  },
};

function initI18n() {
  const buttons = document.querySelectorAll('.lang-btn');
  if (!buttons.length) return;

  let current = localStorage.getItem('lang') || 'en';

  const applyLang = (lang) => {
    const dict = translations[lang] || translations.en;
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';

    document.querySelectorAll('[data-i18n]').forEach((el) => {
      const key = el.dataset.i18n;
      if (dict[key]) {
        el.innerHTML = dict[key];
      }
    });

    buttons.forEach((btn) => {
      btn.classList.toggle('active', btn.dataset.lang === lang);
    });

    localStorage.setItem('lang', lang);
  };

  buttons.forEach((btn) => {
    btn.addEventListener('click', () => {
      current = btn.dataset.lang || 'en';
      applyLang(current);
    });
  });

  applyLang(current);
}
