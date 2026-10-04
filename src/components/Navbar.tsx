import React, { useState, useEffect } from 'react';
import { useBusiness } from '../context/BusinessContext';
import { Menu, X, Phone, MessageSquare, MapPin } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { config, getWhatsAppLink, getPhoneCallLink, getDirectionsLink } = useBusiness();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '#home' },
    { name: 'Our Legacy', href: '#legacy' },
    { name: 'Mutton', href: '#mutton' },
    { name: 'Goats', href: '#goats' },
    { name: 'Sheep', href: '#sheep' },
    { name: 'Bulk Orders', href: '#bulk-orders' },
    { name: 'Gallery', href: '#gallery' },
    { name: 'Reviews', href: '#reviews' },
    { name: 'Contact', href: '#contact' },
  ];

  const phoneLink = getPhoneCallLink();
  const heroWhatsApp = getWhatsAppLink(
    `Hello Balaji Mutton Shop, I would like to enquire about placing an order.`
  );

  return (
    <>
      {/* Top Heritage Notice Bar */}
      <div className="bg-[#4A0B10] text-[#E5C88F] text-xs py-1.5 px-4 border-b border-[#6B121C]">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#C5A059]" />
            <span className="font-medium tracking-wide">
              {config.BRAND_MESSAGE} · Founded by {config.FOUNDER}
            </span>
          </div>
          <div className="hidden sm:flex items-center gap-4 text-xs text-[#FAF8F5]/80">
            {config.SHOP_STATUS === 'CLOSED' ? (
              <span className="px-2 py-0.5 rounded bg-[#871924] text-white font-bold uppercase text-[10px]">
                Closed Today
              </span>
            ) : config.SHOP_STATUS === 'SPECIAL HOURS' ? (
              <span className="px-2 py-0.5 rounded bg-[#C5A059] text-[#1F1B1A] font-bold uppercase text-[10px]">
                Special Hours
              </span>
            ) : (
              <span>Daily Fresh Cut</span>
            )}
            <span>·</span>
            <span>Proprietors: {config.PROPRIETORS}</span>
          </div>
        </div>
      </div>

      {/* Main Sticky Header */}
      <header
        className={`sticky top-0 z-40 transition-all duration-300 ${
          scrolled
            ? 'bg-[#FAF8F5]/95 backdrop-blur-md shadow-md border-b border-[#C5A059]/20 py-2.5'
            : 'bg-[#FAF8F5] border-b border-[#E8E2D8] py-3.5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4">
            {/* Zone 1: Brand Wordmark with Branded Icon */}
            <a
              href="#home"
              className="flex items-center gap-2.5 text-xl sm:text-2xl font-brand font-bold text-[#6B121C] tracking-wide whitespace-nowrap hover:text-[#4A0B10] transition-colors"
            >
              <img
                src="/favicon.svg"
                alt="Balaji Mutton Shop Logo"
                className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border border-[#C5A059]/40 shadow-xs flex-shrink-0"
              />
              <span>{config.BUSINESS_NAME}</span>
            </a>

            {/* Zone 2: Navigation Links */}
            <nav className="hidden xl:flex items-center gap-6 text-sm font-medium text-[#2D2726]">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="hover:text-[#6B121C] transition-colors py-1 relative group"
                >
                  {link.name}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#C5A059] transition-all duration-200 group-hover:w-full" />
                </a>
              ))}
            </nav>

            {/* Zone 3: Primary Actions */}
            <div className="hidden md:flex items-center gap-3">
              <a
                href={phoneLink.url}
                className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-[#6B121C] border border-[#6B121C]/30 rounded-md hover:bg-[#6B121C]/5 transition-colors whitespace-nowrap"
                title="Call Shop Directly"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Call Now</span>
              </a>

              <a
                href={heroWhatsApp.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-[#6B121C] hover:bg-[#4A0B10] rounded-md transition-colors shadow-sm whitespace-nowrap"
              >
                <MessageSquare className="w-3.5 h-3.5 text-[#E5C88F]" />
                <span>WhatsApp</span>
              </a>
            </div>

            {/* Mobile Hamburger Button */}
            <div className="flex items-center gap-2 xl:hidden">
              <a
                href={heroWhatsApp.url}
                target="_blank"
                rel="noopener noreferrer"
                className="md:hidden p-2 text-[#6B121C] bg-[#6B121C]/10 rounded-md"
                aria-label="WhatsApp Balaji Mutton Shop"
              >
                <MessageSquare className="w-4 h-4" />
              </a>

              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 text-[#1F1B1A] hover:text-[#6B121C] hover:bg-[#E8E2D8]/50 rounded-md transition-colors"
                aria-expanded={mobileMenuOpen}
                aria-label="Toggle navigation menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Dropdown Menu Drawer */}
        {mobileMenuOpen && (
          <div className="xl:hidden bg-[#FAF8F5] border-b border-[#C5A059]/30 px-4 pt-3 pb-6 shadow-xl animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="grid grid-cols-2 gap-2 mb-4 pt-1">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2.5 text-sm font-medium text-[#1F1B1A] hover:bg-[#6B121C]/10 hover:text-[#6B121C] rounded-md transition-colors"
                >
                  {link.name}
                </a>
              ))}
            </div>

            <div className="pt-3 border-t border-[#E8E2D8] flex flex-col gap-2.5">
              <div className="flex gap-2">
                <a
                  href={phoneLink.url}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 px-3 text-sm font-semibold text-[#6B121C] border border-[#6B121C] rounded-lg bg-white"
                >
                  <Phone className="w-4 h-4" />
                  <span>Call Us</span>
                </a>
                <a
                  href={heroWhatsApp.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 px-3 text-sm font-semibold text-white bg-[#6B121C] rounded-lg shadow-sm"
                >
                  <MessageSquare className="w-4 h-4 text-[#E5C88F]" />
                  <span>WhatsApp</span>
                </a>
              </div>

              <a
                href={getDirectionsLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 py-2 text-xs font-medium text-[#5A504D] hover:text-[#1F1B1A]"
              >
                <MapPin className="w-3.5 h-3.5 text-[#C5A059]" />
                <span>Get Directions to Shop</span>
              </a>
            </div>
          </div>
        )}
      </header>
    </>
  );
};
