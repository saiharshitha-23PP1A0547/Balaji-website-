import React from 'react';
import { useBusiness } from '../context/BusinessContext';
import { AlertTriangle, Clock, Calendar, Phone, MessageSquare, Navigation, Info } from 'lucide-react';

export const ShopStatusBanner: React.FC = () => {
  const { config, getPhoneCallLink, getWhatsAppLink, getDirectionsLink } = useBusiness();

  const isClosed = config.SHOP_STATUS === 'CLOSED';
  const isSpecialHours = config.SHOP_STATUS === 'SPECIAL HOURS';
  const isAnnouncementOnly = config.ANNOUNCEMENT_ENABLED && config.SHOP_STATUS === 'OPEN';

  // Rule 5: Normal mode - when ANNOUNCEMENT_ENABLED is false and SHOP_STATUS is OPEN, render nothing!
  if (!isClosed && !isSpecialHours && !isAnnouncementOnly) {
    return null;
  }

  const phone = getPhoneCallLink();
  const whatsapp = getWhatsAppLink(
    isClosed
      ? `Hello Balaji Mutton Shop, I saw that the shop is closed today. I would like to enquire about placing an advance order for reopening.`
      : `Hello Balaji Mutton Shop, I would like to enquire about today's hours.`
  );
  const directionsUrl = getDirectionsLink();

  // 1. CLOSED TODAY Banner
  if (isClosed) {
    return (
      <aside
        aria-label="Shop Closure Notice"
        className="bg-gradient-to-r from-[#4A0B10] via-[#6B121C] to-[#4A0B10] text-[#FAF8F5] border-b-2 border-[#C5A059] shadow-lg relative z-30"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 sm:py-4">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            {/* Left: Prominent Closure Badge & Reason */}
            <div className="flex items-start gap-3 flex-1">
              <div className="w-10 h-10 rounded-xl bg-white/10 border border-[#E5C88F]/40 flex items-center justify-center shrink-0 mt-0.5 text-[#E5C88F]">
                <AlertTriangle className="w-5 h-5 text-[#E5C88F]" />
              </div>

              <div>
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <span className="px-2.5 py-0.5 rounded-full bg-[#E5C88F] text-[#4A0B10] text-xs font-black tracking-wider uppercase shadow-xs">
                    CLOSED TODAY
                  </span>
                  {(config.REOPENING_DATE || config.REOPENING_TIME) && (
                    <span className="inline-flex items-center gap-1.5 text-xs text-[#E5C88F] font-semibold bg-white/10 px-2.5 py-0.5 rounded-full">
                      <Clock className="w-3.5 h-3.5" />
                      <span>
                        Reopening: {config.REOPENING_DATE} {config.REOPENING_TIME ? `at ${config.REOPENING_TIME}` : ''}
                      </span>
                    </span>
                  )}
                </div>

                <p className="text-sm font-medium text-[#FAF8F5] leading-relaxed">
                  {config.ANNOUNCEMENT_MESSAGE || 'The shop is temporarily closed today. We apologize for any inconvenience.'}
                </p>
                <p className="text-[11px] text-[#FAF8F5]/80 mt-1">
                  *Advance orders for reopening are still welcomed via WhatsApp and Phone.
                </p>
              </div>
            </div>

            {/* Right: Retained Call, WhatsApp, Directions Actions */}
            <div className="flex flex-wrap items-center gap-2 w-full md:w-auto pt-2 md:pt-0 border-t md:border-t-0 border-white/15">
              <a
                href={phone.url}
                className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-bold text-[#4A0B10] bg-[#FAF8F5] hover:bg-white transition-colors cursor-pointer"
                title="Call Shop"
              >
                <Phone className="w-3.5 h-3.5 text-[#6B121C]" />
                <span>Call Shop</span>
              </a>

              <a
                href={whatsapp.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-bold text-white bg-[#1E7E34] hover:bg-[#155724] transition-colors shadow-xs cursor-pointer"
                title="Enquire on WhatsApp"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>WhatsApp Enquiries</span>
              </a>

              <a
                href={directionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold text-[#FAF8F5] bg-white/10 hover:bg-white/20 transition-colors cursor-pointer"
                title="Get Directions"
              >
                <Navigation className="w-3.5 h-3.5 text-[#E5C88F]" />
                <span>Directions</span>
              </a>
            </div>
          </div>
        </div>
      </aside>
    );
  }

  // 2. SPECIAL HOURS Banner
  if (isSpecialHours) {
    return (
      <aside
        aria-label="Special Hours Notice"
        className="bg-gradient-to-r from-[#9D7B37] via-[#C5A059] to-[#9D7B37] text-[#1F1B1A] border-b-2 border-[#6B121C] shadow-md relative z-30"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <span className="px-2.5 py-0.5 rounded-full bg-[#6B121C] text-[#FAF8F5] text-xs font-black tracking-wider uppercase">
                SPECIAL HOURS TODAY
              </span>
              <p className="text-xs sm:text-sm font-bold text-[#1F1B1A]">
                {config.SPECIAL_HOURS || config.ANNOUNCEMENT_MESSAGE || 'Special schedule in effect today.'}
              </p>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <a
                href={phone.url}
                className="px-3 py-1.5 rounded-lg text-xs font-bold text-[#6B121C] bg-white hover:bg-[#FAF8F5] transition-colors"
              >
                Call to Confirm
              </a>
              <a
                href={whatsapp.url}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 rounded-lg text-xs font-bold text-white bg-[#1E7E34] hover:bg-[#155724] transition-colors"
              >
                WhatsApp Us
              </a>
            </div>
          </div>
        </div>
      </aside>
    );
  }

  // 3. Informational Announcement Banner (when OPEN but ANNOUNCEMENT_ENABLED = true)
  return (
    <aside
      aria-label="Notice"
      className="bg-[#6B121C] text-[#FAF8F5] border-b border-[#C5A059]/40 py-2.5 px-4 relative z-30"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-xs font-medium">
          <Info className="w-4 h-4 text-[#E5C88F] shrink-0" />
          <span>{config.ANNOUNCEMENT_MESSAGE}</span>
        </div>
        <div className="hidden sm:flex items-center gap-2 text-xs">
          <span className="px-2 py-0.5 rounded bg-white/10 text-[#E5C88F] font-semibold">
            Shop is Open
          </span>
        </div>
      </div>
    </aside>
  );
};
