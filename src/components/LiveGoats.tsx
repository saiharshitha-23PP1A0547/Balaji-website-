import React from 'react';
import { useBusiness } from '../context/BusinessContext';
import { LIVE_GOATS } from '../config/businessConfig';
import { MessageSquare, Info, ShieldCheck } from 'lucide-react';
import { PhotoSlot } from './PhotoSlot';

export const LiveGoats: React.FC = () => {
  const { config, photos, getWhatsAppLink } = useBusiness();

  const handleEnquire = (itemTitle: string) => {
    const text = `*LIVE GOATS ENQUIRY - BALAJI MUTTON SHOP*
Hello Balaji Mutton Shop, I am enquiring about live goat availability, weight ranges, and current pricing for: ${itemTitle}.
Please share current details and holding shed timings.`;
    const wa = getWhatsAppLink(text);
    window.open(wa.url, '_blank', 'noopener,noreferrer');
  };

  return (
    <section id="goats" className="py-16 lg:py-24 bg-[#F3EFE8] border-b border-[#E8E2D8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#6B121C]/10 text-[#6B121C] text-xs font-bold uppercase tracking-wider mb-3">
            <span>Healthy Livestock</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif-display font-bold text-[#1F1B1A] mb-3">
            Live Goats
          </h2>
          <p className="text-base sm:text-lg text-[#5A504D]">
            Goats available for individual requirements and special occasions.
          </p>
        </div>

        {/* Live Goats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto mb-10">
          {LIVE_GOATS.map((goat) => (
            <div
              key={goat.id}
              className="bg-[#FAF8F5] rounded-2xl border border-[#E8E2D8] hover:border-[#C5A059] transition-all duration-200 overflow-hidden shadow-sm flex flex-col justify-between"
            >
              <div>
                {/* Photo Slot */}
                <div className="p-4 pb-0">
                  <PhotoSlot
                    src={photos[goat.imageKey]}
                    alt={`${goat.title} at Balaji Mutton Shop`}
                    slotLabel={goat.imagePlaceholderTitle}
                    slotSubtext={goat.imagePlaceholderNote}
                    aspectRatioClass="aspect-16/10"
                  />
                </div>

                <div className="p-6">
                  {/* Card Title & Breed */}
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <h3 className="text-xl font-serif-display font-bold text-[#1F1B1A]">
                      {goat.title}
                    </h3>
                  </div>

                  <p className="text-xs text-[#5A504D] leading-relaxed mb-5">
                    {goat.description}
                  </p>

                  {/* Animal Specifications */}
                  <div className="bg-white rounded-xl p-4 border border-[#E8E2D8] space-y-2 mb-5 text-xs">
                    <div className="flex justify-between py-1 border-b border-[#F3EFE8]">
                      <span className="text-[#8C7E7A]">Availability:</span>
                      <strong className="text-[#1F1B1A]">{goat.availability}</strong>
                    </div>
                    <div className="flex justify-between py-1 border-b border-[#F3EFE8]">
                      <span className="text-[#8C7E7A]">Approximate Weight:</span>
                      <span className="text-[#5A504D] italic">{goat.approximateWeight}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-[#F3EFE8]">
                      <span className="text-[#8C7E7A]">Age Range:</span>
                      <span className="text-[#5A504D] italic">{goat.age}</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-[#8C7E7A]">Gender:</span>
                      <strong className="text-[#1F1B1A]">{goat.gender}</strong>
                    </div>
                  </div>

                  {/* Mandatory Price Placeholder Notice */}
                  <div className="bg-[#FAF8F5] p-3 rounded-lg border border-[#C5A059]/40 mb-6 flex items-start gap-2 text-xs">
                    <Info className="w-4 h-4 text-[#C5A059] shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold text-[#1F1B1A] block">Pricing & Stock:</span>
                      <span className="text-[#6B121C] font-medium">
                        "{goat.priceNotice}"
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="p-6 pt-0">
                <button
                  type="button"
                  onClick={() => handleEnquire(goat.title)}
                  className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs font-bold uppercase tracking-wider text-white bg-[#6B121C] hover:bg-[#4A0B10] active:scale-[0.99] transition-all shadow-sm cursor-pointer"
                >
                  <MessageSquare className="w-4 h-4 text-[#E5C88F]" />
                  <span>ENQUIRE ABOUT GOATS</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Informational Disclaimer Box */}
        <div className="max-w-3xl mx-auto bg-white rounded-xl p-4 border border-[#E8E2D8] flex items-start gap-3 text-xs text-[#5A504D]">
          <ShieldCheck className="w-5 h-5 text-[#C5A059] shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <strong>Care & Inspection:</strong> All live goats at Balaji Mutton Shop are inspected for good health and vigor. Patrons are welcome to inspect livestock in person at our premises during morning hours. {config.GOAT_SHEEP_PRICE_DISCLAIMER}
          </p>
        </div>
      </div>
    </section>
  );
};

