import React from 'react';
import { useI18n } from '../hooks/useI18n';

const ProcessSteps = () => {
  const { t } = useI18n();

  const steps = [
    { num: 'I', name: 'AUDIT', info: 'Raw data analysis of current funnels' },
    { num: 'II', name: 'STRATEGY', info: '90-day growth roadmap' },
    { num: 'III', name: 'SETUP', info: 'Infrastructure & tracking' },
    { num: 'IV', name: 'SCALE', info: 'Aggressive media buying' },
    { num: 'V', name: 'REPORT', info: 'Weekly performance insights' },
  ];

  return (
    <section className="bg-surface border-y border-border px-6 py-16 md:py-20 transition-all duration-300 backdrop-blur-sm light:bg-[#f9f7f3]/75">
      <div className="max-w-7xl mx-auto">
        <p className="font-mono text-[0.62rem] font-semibold tracking-[0.25em] text-gold uppercase text-center mb-12">
          OPERATIONAL EXCELLENCE
        </p>

        <div className="relative grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-10 lg:gap-0">
          {/* Connecting line */}
          <div className="hidden lg:block absolute top-[1.1rem] left-[10%] right-[10%] h-[1px] bg-border z-0"></div>

          {stepData.map((step, idx) => (
            <div key={idx} className="relative z-10 flex flex-col items-center group">
              <div className="w-9 h-9 rounded-full border border-gold-dk bg-bg flex items-center justify-center font-mono text-[0.65rem] text-gold mb-4 group-hover:border-gold group-hover:shadow-[0_0_12px_rgba(201,168,76,0.2)] transition-all duration-300">
                {step.num}
              </div>
              <h4 className="text-[0.82rem] font-medium text-text mb-1 uppercase group-hover:text-gold transition-colors">
                {step.name}
              </h4>
              <p className="text-[0.75rem] text-muted font-light leading-relaxed text-center max-w-[160px] group-hover:text-muted2 transition-colors">
                {step.info}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const stepData = [
  { num: 'I', name: 'AUDIT', info: 'Raw data analysis of current funnels' },
  { num: 'II', name: 'STRATEGY', info: '90-day growth roadmap' },
  { num: 'III', name: 'SETUP', info: 'Infrastructure & tracking' },
  { num: 'IV', name: 'SCALE', info: 'Aggressive media buying' },
  { num: 'V', name: 'REPORT', info: 'Weekly performance insights' },
];

export default ProcessSteps;
