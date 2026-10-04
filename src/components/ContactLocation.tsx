import React from 'react';
import { useBusiness } from '../context/BusinessContext';
import {
  MapPin,
  Phone,
  MessageSquare,
  Clock,
  Navigation,
  ExternalLink,
  ShieldCheck,
  Building,
} from 'lucide-react';

export const ContactLocation: React.FC = () => {
  const { config, getPhoneCallLink, getWhatsAppLink, getDirectionsLink } = useBusiness();

  const phone = getPhoneCallLink();
  const whatsapp = getWhatsAppLink(
    'Hello Balaji Mutton Shop, I would like to visit the shop / place an order.'
  );
  const directionsUrl = getDirectionsLink();

  return (
    <section id="contact" className="py-16 lg:py-24 bg-[#FAF8F5] border-b border-[#E8E2D8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#6B121C]/10 text-[#6B121C] text-xs font-bold uppercase tracking-wider mb-3">
            <span>Direct Community Access</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif-display font-bold text-[#1F1B1A] mb-3">
            Visit Balaji Mutton Shop
          </h2>
          <p className="text-base sm:text-lg text-[#5A504D]">
            We welcome you to visit our shop, inspect fresh cuts in person, and speak directly with proprietors Kamtekar Badrinath & Shyam.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start max-w-6xl mx-auto">
          {/* Contact Details Card */}
          <div className="lg:col-span-6 bg-white rounded-2xl p-6 sm:p-8 border border-[#E8E2D8] shadow-sm space-y-6">
            <div>
              <span className="text-xs uppercase tracking-wider text-[#C5A059] font-bold block mb-1">
                Family Business Premises
              </span>
              <h3 className="text-2xl font-serif-display font-bold text-[#1F1B1A]">
                {config.BUSINESS_NAME}
              </h3>
              <p className="text-xs text-[#5A504D] mt-0.5">
                Proprietors: {config.PROPRIETORS} · Founded by {config.FOUNDER}
              </p>
            </div>

            {/* Address Block */}
            <div className="flex items-start gap-4 p-4 rounded-xl bg-[#FAF8F5] border border-[#E8E2D8]">
              <div className="w-10 h-10 rounded-lg bg-[#6B121C]/10 text-[#6B121C] flex items-center justify-center shrink-0">
                <MapPin className="w-5 h-5 text-[#6B121C]" />
              </div>
              <div className="text-xs">
                <strong className="block text-[#1F1B1A] font-bold text-sm mb-0.5">
                  Shop Address
                </strong>
                <p className="text-[#3D3534] font-medium text-sm leading-relaxed">
                  {config.SHOP_ADDRESS || config.BUSINESS_ADDRESS}
                </p>
                <a
                  href={directionsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-[11px] text-[#6B121C] font-semibold mt-2 hover:underline"
                >
                  <Navigation className="w-3 h-3 text-[#C5A059]" />
                  <span>View on Google Maps →</span>
                </a>
              </div>
            </div>

            {/* Timings Block */}
            <div className="flex items-start gap-4 p-4 rounded-xl bg-[#FAF8F5] border border-[#E8E2D8]">
              <div className="w-10 h-10 rounded-lg bg-[#C5A059]/15 text-[#C5A059] flex items-center justify-center shrink-0">
                <Clock className="w-5 h-5 text-[#9D7B37]" />
              </div>
              <div className="text-xs">
                <strong className="block text-[#1F1B1A] font-bold text-sm mb-0.5">
                  Opening Hours
                </strong>
                <p className="text-[#3D3534] font-medium leading-relaxed">
                  {config.OPENING_HOURS}
                </p>
                <div className="mt-2 pt-2 border-t border-[#E8E2D8] grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-[#5A504D]">
                  <div>
                    <span className="font-semibold text-[#1F1B1A]">Sunday Batches:</span> Fresh early morning cuts from 6:30 AM
                  </div>
                  <div>
                    <span className="font-semibold text-[#1F1B1A]">Mon Schedule:</span> Call ahead to confirm
                  </div>
                </div>
              </div>
            </div>

            {/* Direct Contact Numbers */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-[#FAF8F5] border border-[#E8E2D8]">
                <div className="flex items-center gap-2 mb-1">
                  <Phone className="w-4 h-4 text-[#6B121C]" />
                  <span className="text-xs font-semibold text-[#1F1B1A]">Phone</span>
                </div>
                <div className="text-sm font-bold text-[#6B121C] tabular-nums">
                  {config.PHONE_NUMBER}
                </div>
                <span className="text-[10px] text-[#8C7E7A] block mt-0.5">
                  Direct proprietor call
                </span>
              </div>

              <div className="p-4 rounded-xl bg-[#FAF8F5] border border-[#E8E2D8]">
                <div className="flex items-center gap-2 mb-1">
                  <MessageSquare className="w-4 h-4 text-[#1E7E34]" />
                  <span className="text-xs font-semibold text-[#1F1B1A]">WhatsApp</span>
                </div>
                <div className="text-sm font-bold text-[#1E7E34] tabular-nums">
                  {config.WHATSAPP_NUMBER}
                </div>
                <span className="text-[10px] text-[#8C7E7A] block mt-0.5">
                  Instant orders & queries
                </span>
              </div>
            </div>

            {/* Action Buttons as requested */}
            <div className="pt-2 flex flex-col sm:flex-row gap-3">
              <a
                href={phone.url}
                className="flex-1 inline-flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl text-xs font-bold text-[#6B121C] bg-white border border-[#6B121C] hover:bg-[#6B121C]/5 transition-colors text-center"
              >
                <Phone className="w-4 h-4" />
                <span>CALL NOW</span>
              </a>

              <a
                href={whatsapp.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 inline-flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl text-xs font-bold text-white bg-[#1E7E34] hover:bg-[#155724] transition-colors shadow-sm text-center"
              >
                <MessageSquare className="w-4 h-4 text-white" />
                <span>WHATSAPP</span>
              </a>

              <a
                href={directionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 inline-flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl text-xs font-bold text-white bg-[#6B121C] hover:bg-[#4A0B10] transition-colors shadow-sm text-center"
              >
                <Navigation className="w-4 h-4 text-[#E5C88F]" />
                <span>GET DIRECTIONS</span>
              </a>
            </div>
          </div>

          {/* Google Maps / Location Integration Card */}
          <div className="lg:col-span-6 bg-white rounded-2xl border border-[#E8E2D8] p-6 sm:p-8 shadow-sm flex flex-col justify-between h-full">
            <div>
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#E8E2D8]">
                <div className="flex items-center gap-2">
                  <Building className="w-5 h-5 text-[#C5A059]" />
                  <h4 className="text-base font-bold text-[#1F1B1A]">
                    Google Business Profile & Map
                  </h4>
                </div>
                <span className="text-[11px] font-semibold text-[#6B121C] bg-[#6B121C]/10 px-2 py-0.5 rounded">
                  Verified Local Business
                </span>
              </div>

              <p className="text-xs text-[#5A504D] mb-5 leading-relaxed">
                Connect directly to our shop via Google Maps for turn-by-turn navigation, updated operating hours, and landmark assistance.
              </p>

              {/* Visual Map Frame / Simulated Map Interface */}
              <div className="relative aspect-16/10 rounded-xl bg-[#F3EFE8] border border-[#E8E2D8] overflow-hidden flex flex-col items-center justify-center p-6 text-center mb-6">
                <div className="w-14 h-14 rounded-full bg-white shadow-md flex items-center justify-center text-[#6B121C] mb-3 animate-bounce">
                  <MapPin className="w-7 h-7 text-[#6B121C]" />
                </div>
                <h5 className="text-sm font-bold text-[#1F1B1A] mb-1">
                  {config.BUSINESS_NAME}
                </h5>
                <p className="text-xs text-[#5A504D] max-w-xs mb-3">
                  {config.SHOP_ADDRESS || config.BUSINESS_ADDRESS}
                </p>
                <a
                  href={directionsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#6B121C] text-white rounded-lg text-xs font-bold hover:bg-[#4A0B10] shadow-sm transition-colors"
                >
                  <Navigation className="w-3.5 h-3.5 text-[#E5C88F]" />
                  <span>Open in Google Maps</span>
                  <ExternalLink className="w-3 h-3 ml-1" />
                </a>
              </div>

              {/* Google Business Profile Information Note */}
              <div className="bg-[#FAF8F5] rounded-xl p-4 border border-[#E8E2D8] text-xs text-[#5A504D] space-y-1.5">
                <div className="font-semibold text-[#1F1B1A] flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-[#C5A059]" />
                  <span>Google Business Profile Consistency</span>
                </div>
                <p className="text-[11px] leading-relaxed">
                  The exact name <strong>Balaji Mutton Shop</strong>, along with this phone number and address, matches our local Google profile for seamless local search discovery.
                </p>
              </div>
            </div>

            <div className="pt-6 mt-6 border-t border-[#E8E2D8] flex items-center justify-between text-xs text-[#8C7E7A]">
              <span>Free Parking Available</span>
              <span>·</span>
              <span>Clean Meat Preparation</span>
              <span>·</span>
              <span>Cash & UPI Accepted</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
