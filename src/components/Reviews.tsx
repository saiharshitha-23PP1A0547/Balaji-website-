import React from 'react';
import { useBusiness } from '../context/BusinessContext';
import { REVIEWS_PLACEHOLDERS } from '../config/businessConfig';
import { MessageSquare, ShieldCheck, Heart } from 'lucide-react';

export const Reviews: React.FC = () => {
  const { config, getWhatsAppLink } = useBusiness();

  const handleShareReview = () => {
    const text = `*FEEDBACK FOR BALAJI MUTTON SHOP*
Hello Kamtekar Badrinath & Shyam Ji,
I would like to share feedback regarding my recent mutton / livestock purchase from Balaji Mutton Shop:
Customer Name: 
Experience / Feedback: `;
    const wa = getWhatsAppLink(text);
    window.open(wa.url, '_blank', 'noopener,noreferrer');
  };

  return (
    <section id="reviews" className="py-16 lg:py-24 bg-[#F3EFE8] border-b border-[#E8E2D8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#6B121C]/10 text-[#6B121C] text-xs font-bold uppercase tracking-wider mb-3">
            <span>Genuine Patron Feedback</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif-display font-bold text-[#1F1B1A] mb-3">
            Customer Reviews
          </h2>
          <p className="text-base sm:text-lg text-[#5A504D]">
            Built on 40+ years of authentic community respect. We uphold strict transparency with our patrons.
          </p>
        </div>

        {/* Ethical Transparency Banner */}
        <div className="max-w-3xl mx-auto bg-white rounded-xl p-4 sm:p-5 border border-[#E8E2D8] mb-12 flex items-start gap-3.5 shadow-xs">
          <ShieldCheck className="w-5 h-5 text-[#C5A059] shrink-0 mt-0.5" />
          <div className="text-xs text-[#5A504D] leading-relaxed">
            <strong className="text-[#1F1B1A] block mb-0.5">Authenticity Notice:</strong>
            Balaji Mutton Shop never posts fabricated reviews or artificial rating scores. The slots below represent our authentic review framework, awaiting genuine customer testimonials from our local community families.
          </div>
        </div>

        {/* Review Cards Grid with Explicit Placeholders */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto mb-12">
          {REVIEWS_PLACEHOLDERS.map((rev) => (
            <div
              key={rev.id}
              className="bg-[#FAF8F5] rounded-2xl p-6 sm:p-7 border border-[#E8E2D8] flex flex-col justify-between shadow-xs relative"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#6B121C]">
                    {rev.occasion}
                  </span>
                  <div className="inline-flex items-center gap-1 text-[11px] text-[#C5A059] font-medium bg-[#C5A059]/10 px-2 py-0.5 rounded">
                    <span>{rev.datePlaceholder}</span>
                  </div>
                </div>

                <div className="min-h-[100px] flex items-center mb-6">
                  <p className="text-sm font-serif-display italic text-[#4A4240] leading-relaxed">
                    "{rev.reviewPlaceholder}"
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t border-[#E8E2D8] flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-[#1F1B1A]">
                    {rev.customerNamePlaceholder}
                  </h4>
                  <span className="text-[11px] text-[#8C7E7A]">
                    Balaji Mutton Shop Patron
                  </span>
                </div>
                <div className="w-8 h-8 rounded-full bg-[#E8E2D8]/60 flex items-center justify-center text-[#8C7E7A] text-xs font-bold">
                  ✓
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Call to Action to Collect Real Reviews */}
        <div className="text-center max-w-xl mx-auto">
          <p className="text-xs text-[#5A504D] mb-4">
            Are you a long-time customer of Kamtekar Eshwar Ji or proprietors Badrinath & Shyam? We would be honored to feature your experience.
          </p>
          <button
            type="button"
            onClick={handleShareReview}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs font-bold text-[#6B121C] bg-white border border-[#6B121C]/30 hover:border-[#6B121C] hover:bg-[#6B121C]/5 transition-colors shadow-xs"
          >
            <Heart className="w-3.5 h-3.5 text-[#6B121C]" />
            <span>Send Your Review on WhatsApp</span>
          </button>
        </div>
      </div>
    </section>
  );
};
