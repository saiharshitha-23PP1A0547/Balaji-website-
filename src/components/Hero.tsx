import React from 'react';
import { useBusiness } from '../context/BusinessContext';
import { MessageSquare, Phone, Navigation, Clock, ShieldCheck, Sparkles } from 'lucide-react';
import { PhotoSlot } from './PhotoSlot';

export const Hero: React.FC = () => {
  const { config, photos, getWhatsAppLink, getPhoneCallLink, getDirectionsLink } =
    useBusiness();

  const isClosed = config.SHOP_STATUS === 'CLOSED';
  const isSpecialHours = config.SHOP_STATUS === 'SPECIAL HOURS';

  const whatsappMessage = isClosed
    ? `Hello Balaji Mutton Shop, I saw that the shop is closed today. I would like to place an advance order for when you reopen.`
    : `Hello Balaji Mutton Shop, I would like to place an order.`;

  const whatsapp = getWhatsAppLink(whatsappMessage);
  const phone = getPhoneCallLink();
  const directionsUrl = getDirectionsLink();

  return (
    <section id="home" className="relative bg-[#FAF8F5] pt-8 pb-16 lg:py-20 overflow-hidden border-b border-[#E8E2D8]">
      {/* Decorative Traditional Geometric Background Accents */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-[#C5A059]/5 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 rounded-full bg-[#6B121C]/5 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* Left Text Column */}
          <div className="lg:col-span-7 flex flex-col items-start">
            {/* Serving Badge / Status Badge */}
            <div className="flex flex-wrap items-center gap-2 mb-5">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#6B121C]/10 border border-[#6B121C]/20">
                <Sparkles className="w-3.5 h-3.5 text-[#C5A059]" />
                <span className="text-xs font-semibold text-[#6B121C] tracking-wide">
                  {config.BADGE_TEXT}
                </span>
              </div>

              {isClosed && (
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#871924] text-[#FAF8F5] text-xs font-black tracking-wider uppercase shadow-xs">
                  <span>CLOSED TODAY</span>
                  {config.REOPENING_DATE && (
                    <span className="text-[#E5C88F] font-normal lowercase">· reopens {config.REOPENING_DATE}</span>
                  )}
                </div>
              )}

              {isSpecialHours && (
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#C5A059] text-[#1F1B1A] text-xs font-bold uppercase">
                  <span>Special Hours Today</span>
                </div>
              )}
            </div>

            {/* Main Title H1 */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-brand font-bold text-[#1F1B1A] tracking-tight leading-[1.1] mb-3">
              {config.BUSINESS_NAME}
            </h1>

            {/* Main Brand Message */}
            <p className="text-xl sm:text-2xl font-serif-display italic font-semibold text-[#6B121C] mb-4">
              "{config.BRAND_MESSAGE}"
            </p>

            {/* Subheading & Tagline */}
            <p className="text-base sm:text-lg text-[#3D3534] max-w-xl leading-relaxed mb-4">
              {config.HERO_SUBTITLE}
            </p>

            <div className="border-l-2 border-[#C5A059] pl-3.5 py-0.5 mb-8">
              <p className="text-sm font-semibold text-[#6B121C] tracking-wide uppercase">
                {config.TAGLINE}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="w-full sm:w-auto flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-8">
              <a
                href={whatsapp.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-lg text-sm font-bold text-white shadow-md hover:shadow-lg text-center cursor-pointer transition-all active:scale-[0.99] ${
                  isClosed
                    ? 'bg-[#871924] hover:bg-[#6B121C]'
                    : 'bg-[#6B121C] hover:bg-[#4A0B10]'
                }`}
                title={isClosed ? 'Pre-Order for Reopening on WhatsApp' : 'Order on WhatsApp'}
              >
                <MessageSquare className="w-4 h-4 text-[#E5C88F]" />
                <span>{isClosed ? 'PRE-ORDER ON WHATSAPP' : 'ORDER ON WHATSAPP'}</span>
              </a>

              <a
                href={phone.url}
                className="inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-lg text-sm font-semibold text-[#4A0B10] bg-white border border-[#6B121C]/30 hover:border-[#6B121C] hover:bg-[#6B121C]/5 transition-colors text-center cursor-pointer"
                title="Call Balaji Mutton Shop"
              >
                <Phone className="w-4 h-4 text-[#6B121C]" />
                <span>CALL NOW</span>
              </a>

              <a
                href={directionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-lg text-sm font-semibold text-[#2D2726] bg-[#E8E2D8]/60 hover:bg-[#E8E2D8] transition-colors text-center cursor-pointer"
                title="Get Directions to Shop"
              >
                <Navigation className="w-4 h-4 text-[#9D7B37]" />
                <span>GET DIRECTIONS</span>
              </a>
            </div>

            {/* Heritage Trust Strip */}
            <div className="w-full pt-6 border-t border-[#E8E2D8] grid grid-cols-3 gap-2 sm:gap-4 text-xs text-[#5A504D]">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#C5A059] shrink-0" />
                <span className="font-medium text-[#1F1B1A]">Founded by {config.FOUNDER}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#C5A059] shrink-0" />
                <span className="font-medium text-[#1F1B1A]">Fresh Daily Cutting</span>
              </div>
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#C5A059] shrink-0" />
                <span className="font-medium text-[#1F1B1A]">Proprietors: {config.PROPRIETORS}</span>
              </div>
            </div>
          </div>

          {/* Right Image Column - Real Photo with Fallback Frame */}
          <div className="lg:col-span-5">
            <div className="relative rounded-2xl p-2 bg-gradient-to-b from-[#C5A059]/40 via-[#6B121C]/20 to-[#C5A059]/40 shadow-xl">
              <div className="bg-[#FAF8F5] rounded-xl overflow-hidden border border-[#E8E2D8] p-4 sm:p-6 flex flex-col items-center">
                <PhotoSlot
                  src={photos.hero}
                  alt={`${config.BUSINESS_NAME} storefront and fresh meat counter with 40+ years heritage`}
                  slotLabel="Main Shopfront & Counter"
                  slotSubtext="Real photo of Balaji Mutton Shop entrance or butcher counter"
                  aspectRatioClass="aspect-4/3"
                  priority={true}
                />

                <div className="w-full mt-4 text-center">
                  <h2 className="text-base sm:text-lg font-serif-display font-bold text-[#1F1B1A]">
                    {config.BUSINESS_NAME}
                  </h2>
                  <p className="text-xs text-[#6B121C] font-semibold mt-0.5">
                    {config.BRAND_MESSAGE}
                  </p>
                </div>

                {/* Simulated Shop Specs Badge */}
                <div className="w-full bg-[#F3EFE8] rounded-lg p-3 border border-[#E8E2D8] text-left mt-3">
                  <div className="flex items-center justify-between text-xs font-semibold text-[#1F1B1A] pb-1.5 border-b border-[#E8E2D8]">
                    <span>{config.BUSINESS_NAME}</span>
                    <span className="text-[#6B121C]">ESTD. {config.EXPERIENCE_YEARS} YRS</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-[11px] text-[#5A504D] pt-1.5">
                    <div>
                      <span className="block text-[10px] text-[#8C7E7A] uppercase">Founder</span>
                      <strong className="text-[#1F1B1A]">{config.FOUNDER}</strong>
                    </div>
                    <div>
                      <span className="block text-[10px] text-[#8C7E7A] uppercase">Meat Standard</span>
                      <strong className="text-[#1F1B1A]">100% Fresh Daily</strong>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

