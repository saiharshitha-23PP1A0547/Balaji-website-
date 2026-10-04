import React from 'react';
import { Link } from 'react-router-dom';
import { useBusiness } from '../context/BusinessContext';
import { Phone, MessageSquare, MapPin, Heart, ShieldCheck, Settings } from 'lucide-react';

export const Footer: React.FC = () => {
  const { config, getPhoneCallLink, getWhatsAppLink, getDirectionsLink } =
    useBusiness();

  const phone = getPhoneCallLink();
  const whatsapp = getWhatsAppLink('Hello Balaji Mutton Shop, I would like to enquire about mutton orders.');
  const directionsUrl = getDirectionsLink();

  return (
    <footer className="bg-[#1F1B1A] text-[#FAF8F5] pt-16 pb-24 md:pb-12 border-t-2 border-[#C5A059]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 mb-12">
          {/* Brand & Legacy Column */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center gap-3">
              <img
                src="/favicon.svg"
                alt="Balaji Mutton Shop Logo"
                className="w-8 h-8 rounded-full border border-[#C5A059] shadow-xs"
              />
              <h3 className="text-2xl font-brand font-bold text-[#E5C88F] tracking-wider">
                {config.BUSINESS_NAME}
              </h3>
            </div>
            <p className="text-sm font-serif-display italic text-[#FAF8F5]/90">
              "{config.BRAND_MESSAGE}"
            </p>
            <p className="text-xs text-[#FAF8F5]/70 leading-relaxed">
              Founded over four decades ago by our grandfather, <strong>{config.FOUNDER}</strong>. Carrying forward honest service, daily freshness, and deep community trust under Proprietors <strong>{config.PROPRIETORS}</strong>.
            </p>
            <p className="text-xs font-semibold text-[#C5A059] uppercase tracking-wider">
              {config.TAGLINE}
            </p>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#C5A059]">
              Quick Links
            </h4>
            <ul className="space-y-2 text-xs text-[#FAF8F5]/80">
              <li>
                <a href="#home" className="hover:text-[#E5C88F] transition-colors">
                  Home
                </a>
              </li>
              <li>
                <a href="#legacy" className="hover:text-[#E5C88F] transition-colors">
                  Our Legacy
                </a>
              </li>
              <li>
                <a href="#mutton" className="hover:text-[#E5C88F] transition-colors">
                  Fresh Mutton
                </a>
              </li>
              <li>
                <a href="#goats" className="hover:text-[#E5C88F] transition-colors">
                  Live Goats
                </a>
              </li>
              <li>
                <a href="#sheep" className="hover:text-[#E5C88F] transition-colors">
                  Live Sheep
                </a>
              </li>
              <li>
                <a href="#bulk-orders" className="hover:text-[#E5C88F] transition-colors">
                  Bulk Orders
                </a>
              </li>
            </ul>
          </div>

          {/* Sections & Transparency */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#C5A059]">
              Trust & Media
            </h4>
            <ul className="space-y-2 text-xs text-[#FAF8F5]/80">
              <li>
                <a href="#gallery" className="hover:text-[#E5C88F] transition-colors">
                  Photo Archives
                </a>
              </li>
              <li>
                <a href="#reviews" className="hover:text-[#E5C88F] transition-colors">
                  Customer Reviews
                </a>
              </li>
              <li>
                <a href="#contact" className="hover:text-[#E5C88F] transition-colors">
                  Visit & Directions
                </a>
              </li>
              <li>
                <Link
                  to="/admin/login"
                  className="text-left text-[#C5A059] hover:underline flex items-center gap-1"
                >
                  <Settings className="w-3 h-3" />
                  <span>Shop Staff Login</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Summary */}
          <div className="lg:col-span-4 space-y-3 text-xs text-[#FAF8F5]/80">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#C5A059]">
              Visit Our Shop
            </h4>
            <p className="flex items-start gap-2">
              <MapPin className="w-4 h-4 text-[#C5A059] shrink-0 mt-0.5" />
              <span>
                {config.SHOP_ADDRESS || config.BUSINESS_ADDRESS}
              </span>
            </p>
            <p className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-[#C5A059] shrink-0" />
              <span>{config.PHONE_NUMBER}</span>
            </p>
            <p className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-[#1E7E34] shrink-0" />
              <span>WhatsApp: {config.WHATSAPP_NUMBER}</span>
            </p>

            <div className="pt-2 flex items-center gap-3">
              <a
                href={phone.url}
                className="px-3 py-1.5 rounded bg-white/10 hover:bg-white/20 text-white text-[11px] font-semibold transition-colors"
              >
                Call Shop
              </a>
              <a
                href={whatsapp.url}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 rounded bg-[#1E7E34] hover:bg-[#155724] text-white text-[11px] font-semibold transition-colors"
              >
                WhatsApp Order
              </a>
              <a
                href={directionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 rounded bg-[#C5A059] hover:bg-[#9D7B37] text-[#1F1B1A] text-[11px] font-bold transition-colors"
              >
                Directions
              </a>
            </div>
          </div>
        </div>

        {/* Disclaimer & Transparency Footnote */}
        <div className="pt-8 border-t border-white/10 text-[11px] text-[#FAF8F5]/60 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-center sm:text-left">
            © {new Date().getFullYear()} {config.BUSINESS_NAME}. All rights reserved. 40+ Years of Generational Butcher Craftsmanship.
          </p>
          <div className="flex items-center gap-4 text-center sm:text-right">
            <span>Prices subject to daily market availability</span>
            <span>·</span>
            <Link
              to="/admin/login"
              className="text-[#E5C88F] hover:underline"
            >
              Shop Admin Portal
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
