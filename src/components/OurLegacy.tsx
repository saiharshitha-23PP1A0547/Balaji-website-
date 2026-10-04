import React from 'react';
import { useBusiness } from '../context/BusinessContext';
import { HeartHandshake, Award } from 'lucide-react';
import { PhotoSlot } from './PhotoSlot';

export const OurLegacy: React.FC = () => {
  const { config, photos } = useBusiness();

  const timelineSteps = [
    {
      period: '40+ YEARS AGO',
      title: 'Humble Beginnings',
      description: 'Kamtekar Eshwar Ji started the business with a firm pledge to honest weighing and pure quality.',
      highlight: true,
    },
    {
      period: 'LOCAL COMMUNITY TRUST',
      title: 'Earning Community Respect',
      description: 'The business became known in the local area through uncompromising freshness and fair dealings.',
      highlight: false,
    },
    {
      period: 'FAMILY LEGACY',
      title: 'Generational Craft Handover',
      description: 'The next generation continued the business, learning the art of healthy livestock selection.',
      highlight: false,
    },
    {
      period: 'TODAY',
      title: 'Carrying the Tradition Forward',
      description: 'Kamtekar Badrinath & Shyam continue the legacy, blending traditional values with modern hygiene.',
      highlight: true,
    },
  ];

  const legacyPhotos = [
    {
      label: 'Kamtekar Eshwar Ji',
      role: 'Founder & Visionary',
      photoKey: 'legacy_grandfather',
      alt: 'Kamtekar Eshwar Ji - Founder of Balaji Mutton Shop with 40+ years heritage',
      note: 'Archival portrait of founder Kamtekar Eshwar Ji',
    },
    {
      label: 'Original / Old Shop',
      role: 'Historical Roots',
      photoKey: 'legacy_old_shop',
      alt: 'Original historical shop premises of Balaji Mutton Shop',
      note: 'Archival photograph of original shop premises',
    },
    {
      label: 'Current Shop',
      role: 'Today’s Premises',
      photoKey: 'legacy_current_shop',
      alt: 'Current Balaji Mutton Shop storefront and hygienic premises',
      note: 'Photograph of today’s modern, hygienic storefront',
    },
    {
      label: 'Family & Proprietors',
      role: 'Generational Stewardship',
      photoKey: 'legacy_family',
      alt: 'Proprietors Kamtekar Badrinath & Shyam of Balaji Mutton Shop',
      note: 'Photograph of Kamtekar Badrinath & Shyam',
    },
  ];

  return (
    <section id="legacy" className="py-16 lg:py-24 bg-[#F3EFE8] border-b border-[#E8E2D8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#C5A059]/20 text-[#8A6726] text-xs font-bold uppercase tracking-wider mb-3">
            <Award className="w-3.5 h-3.5 text-[#C5A059]" />
            <span>Family Heritage</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif-display font-bold text-[#1F1B1A] mb-3">
            Our Legacy
          </h2>
          <p className="text-lg sm:text-xl font-serif-display italic text-[#6B121C]">
            A Name Trusted by Generations
          </p>
        </div>

        {/* Story Block */}
        <div className="max-w-4xl mx-auto mb-16">
          <div className="bg-[#FAF8F5] rounded-2xl p-6 sm:p-10 border border-[#C5A059]/30 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#C5A059]/5 rounded-bl-full pointer-events-none" />
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-[#6B121C] text-[#E5C88F] flex items-center justify-center font-bold">
                <HeartHandshake className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-[#1F1B1A]">The Kamtekar Family Story</h3>
                <p className="text-xs text-[#6B121C] font-medium">40+ Years of Dedication to Our Community</p>
              </div>
            </div>

            <blockquote className="text-base sm:text-lg text-[#2D2726] leading-relaxed font-serif-display italic mb-6">
              "{config.LEGACY_STORY}"
            </blockquote>

            <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-[#E8E2D8] text-xs text-[#5A504D]">
              <div>
                <span className="text-[#8C7E7A]">Founder:</span>{' '}
                <strong className="text-[#1F1B1A]">{config.FOUNDER}</strong>
              </div>
              <div>
                <span className="text-[#8C7E7A]">Current Proprietors:</span>{' '}
                <strong className="text-[#1F1B1A]">{config.PROPRIETORS}</strong>
              </div>
              <div>
                <span className="text-[#8C7E7A]">Heritage:</span>{' '}
                <strong className="text-[#6B121C]">{config.EXPERIENCE_YEARS} Years of Honest Service</strong>
              </div>
            </div>
          </div>
        </div>

        {/* 4 Photo Grid */}
        <div className="mb-20">
          <div className="text-center mb-8">
            <h3 className="text-xl font-serif-display font-bold text-[#1F1B1A]">
              Historical Archives & Today's Care
            </h3>
            <p className="text-xs text-[#5A504D] mt-1">
              Real photographs of our founder, archival premises, storefront, and family proprietors
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {legacyPhotos.map((item, idx) => (
              <div
                key={idx}
                className="bg-[#FAF8F5] rounded-xl p-5 border border-[#E8E2D8] hover:border-[#C5A059] transition-all flex flex-col items-center text-center shadow-xs"
              >
                <div className="w-full mb-4">
                  <PhotoSlot
                    src={photos[item.photoKey]}
                    alt={item.alt}
                    slotLabel={item.label}
                    slotSubtext={item.note}
                    aspectRatioClass="aspect-4/3"
                  />
                </div>

                <h4 className="text-base font-bold text-[#1F1B1A] mb-0.5">{item.label}</h4>
                <p className="text-xs text-[#6B121C] font-medium mb-1">{item.role}</p>
                <span className="text-[11px] text-[#8C7E7A]">
                  {photos[item.photoKey] ? 'Real Photograph' : 'Family Archive'}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Visual Timeline Section */}
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <h3 className="text-2xl font-serif-display font-bold text-[#1F1B1A]">
              Timeline of Trust
            </h3>
            <p className="text-xs text-[#5A504D] mt-1">
              How four decades shaped our reputation in the local community
            </p>
          </div>

          <div className="relative pl-6 sm:pl-8 border-l-2 border-[#C5A059]/40 space-y-10">
            {timelineSteps.map((step, idx) => (
              <div key={idx} className="relative group">
                {/* Timeline Dot Indicator */}
                <div
                  className={`absolute -left-[31px] sm:-left-[39px] top-1 w-5 h-5 rounded-full border-2 ${
                    step.highlight
                      ? 'bg-[#6B121C] border-[#FAF8F5] ring-2 ring-[#C5A059]'
                      : 'bg-[#C5A059] border-[#FAF8F5]'
                  } flex items-center justify-center`}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-white" />
                </div>

                {/* Timeline Content */}
                <div className="bg-[#FAF8F5] rounded-xl p-5 border border-[#E8E2D8] group-hover:border-[#C5A059] transition-colors shadow-xs">
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
                    <span className="text-xs font-bold text-[#6B121C] tracking-wider uppercase">
                      {step.period}
                    </span>
                    {idx < timelineSteps.length - 1 && (
                      <span className="text-xs text-[#C5A059] font-medium">↓ Next Phase</span>
                    )}
                  </div>
                  <h4 className="text-lg font-bold text-[#1F1B1A] mb-1">{step.title}</h4>
                  <p className="text-sm text-[#4A4240] leading-relaxed">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

