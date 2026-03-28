import React from 'react';
import { useI18n } from '../hooks/useI18n';

const Guarantee = () => {
  const { t } = useI18n();

  const items = [
    { icon: '⭐', text: '90-Day Full Refund' },
    { icon: '⚡', text: '7-Day Kickoff' },
    { icon: '📊', text: 'Weekly ROI Reports' },
    { icon: '🤝', text: 'No Long-Term Contracts' }
  ];

  return (
    <section className="bg-surface border-b border-border px-6 py-12 md:py-16 transition-all duration-300 backdrop-blur-[1px] light:bg-[#f9f7f3]/75">
      <div className="max-w-7xl mx-auto flex items-center justify-center gap-12 lg:gap-20 flex-wrap text-center">
        {items.map((item, idx) => (
          <div key={idx} className="flex flex-col items-center gap-2 group">
            <span className="text-2xl text-gold group-hover:scale-110 transition-transform duration-300">
                {item.icon}
            </span>
            <span className="text-[0.8rem] font-medium tracking-wider text-muted2 group-hover:text-text transition-colors duration-300 uppercase">
                {item.text}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Guarantee;
