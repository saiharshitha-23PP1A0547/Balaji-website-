import React from 'react';
import { WHY_CHOOSE_US } from '../config/businessConfig';
import { Award, Sparkles, Users, ShieldCheck, Scissors, ShoppingBag } from 'lucide-react';

export const WhyChooseUs: React.FC = () => {
  const iconMap: Record<string, React.ReactNode> = {
    Award: <Award className="w-6 h-6 text-[#C5A059]" />,
    Sparkles: <Sparkles className="w-6 h-6 text-[#C5A059]" />,
    Users: <Users className="w-6 h-6 text-[#C5A059]" />,
    ShieldCheck: <ShieldCheck className="w-6 h-6 text-[#C5A059]" />,
    Scissors: <Scissors className="w-6 h-6 text-[#C5A059]" />,
    ShoppingBag: <ShoppingBag className="w-6 h-6 text-[#C5A059]" />,
  };

  return (
    <section className="py-16 lg:py-24 bg-[#F3EFE8] border-b border-[#E8E2D8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#6B121C]/10 text-[#6B121C] text-xs font-bold uppercase tracking-wider mb-3">
            <span>Our Principles</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif-display font-bold text-[#1F1B1A] mb-3">
            Why Families Rely On Us
          </h2>
          <p className="text-base sm:text-lg text-[#5A504D]">
            Grounding four decades of butcher craftsmanship in honest weights, daily fresh sourcing, and personal family accountability.
          </p>
        </div>

        {/* Six Professional Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {WHY_CHOOSE_US.map((card, idx) => (
            <div
              key={idx}
              className="bg-[#FAF8F5] rounded-xl p-6 sm:p-7 border border-[#E8E2D8] hover:border-[#C5A059] hover:shadow-sm transition-all flex flex-col items-start"
            >
              <div className="w-12 h-12 rounded-xl bg-[#6B121C]/10 flex items-center justify-center mb-4">
                {iconMap[card.iconName] || <Award className="w-6 h-6 text-[#C5A059]" />}
              </div>

              <h3 className="text-lg font-serif-display font-bold text-[#1F1B1A] mb-2">
                {card.title}
              </h3>

              <p className="text-xs sm:text-sm text-[#5A504D] leading-relaxed">
                {card.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
