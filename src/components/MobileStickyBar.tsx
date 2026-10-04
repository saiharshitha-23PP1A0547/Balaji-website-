import React from 'react';
import { useBusiness } from '../context/BusinessContext';
import { Phone, MessageSquare, ShoppingBag, Navigation } from 'lucide-react';

export const MobileStickyBar: React.FC = () => {
  const { config, getPhoneCallLink, getWhatsAppLink, getDirectionsLink } = useBusiness();

  const isClosed = config.SHOP_STATUS === 'CLOSED';
  const phone = getPhoneCallLink();
  const whatsapp = getWhatsAppLink(
    isClosed
      ? 'Hello Balaji Mutton Shop, I would like to place an advance order for reopening.'
      : 'Hello Balaji Mutton Shop, I would like to order fresh mutton.'
  );
  const directionsUrl = getDirectionsLink();

  const handleScrollToOrder = (e: React.MouseEvent) => {
    e.preventDefault();
    const orderSection = document.getElementById('mutton-order-form') || document.getElementById('mutton');
    if (orderSection) {
      orderSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <aside aria-label="Quick Contact Actions" className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-[#FAF8F5]/98 backdrop-blur-md border-t border-[#C5A059]/40 shadow-[0_-4px_16px_rgba(0,0,0,0.08)] px-2 py-2">
      <div className="grid grid-cols-4 gap-1.5 max-w-md mx-auto">
        {/* Call Button */}
        <a
          href={phone.url}
          className="flex flex-col items-center justify-center min-h-[48px] py-1.5 px-1 rounded-lg text-[#4A0B10] bg-[#6B121C]/10 active:bg-[#6B121C]/20 transition-colors"
          aria-label="Call Balaji Mutton Shop"
        >
          <Phone className="w-5 h-5 text-[#6B121C]" />
          <span className="text-[10px] font-bold tracking-tight uppercase mt-0.5">Call</span>
        </a>

        {/* WhatsApp Button */}
        <a
          href={whatsapp.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center justify-center min-h-[48px] py-1.5 px-1 rounded-lg text-white bg-[#1E7E34] active:bg-[#155724] shadow-sm transition-colors"
          aria-label="Order on WhatsApp"
        >
          <MessageSquare className="w-5 h-5 text-white" />
          <span className="text-[10px] font-bold tracking-tight uppercase mt-0.5">WhatsApp</span>
        </a>

        {/* Order Button */}
        <button
          type="button"
          onClick={handleScrollToOrder}
          className={`flex flex-col items-center justify-center min-h-[48px] py-1.5 px-1 rounded-lg text-white shadow-sm transition-colors cursor-pointer ${
            isClosed
              ? 'bg-[#871924] active:bg-[#6B121C]'
              : 'bg-[#6B121C] active:bg-[#4A0B10]'
          }`}
          aria-label={isClosed ? 'Pre-Order for Reopening' : 'Order Mutton Now'}
        >
          <ShoppingBag className="w-5 h-5 text-[#E5C88F]" />
          <span className="text-[10px] font-bold tracking-tight uppercase mt-0.5">
            {isClosed ? 'Pre-Order' : 'Order'}
          </span>
        </button>

        {/* Directions Button */}
        <a
          href={directionsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center justify-center min-h-[48px] py-1.5 px-1 rounded-lg text-[#2D2726] bg-[#E8E2D8] active:bg-[#D9D2C7] transition-colors"
          aria-label="Get Directions to Shop"
        >
          <Navigation className="w-5 h-5 text-[#9D7B37]" />
          <span className="text-[10px] font-bold tracking-tight uppercase mt-0.5">Directions</span>
        </a>
      </div>
    </aside>
  );
};
