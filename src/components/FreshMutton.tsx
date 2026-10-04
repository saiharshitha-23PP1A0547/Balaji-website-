import React, { useState } from 'react';
import { useBusiness } from '../context/BusinessContext';
import { CUTTING_PREFERENCES } from '../config/businessConfig';
import { ShoppingBag, Calculator, Check, AlertCircle, ArrowDown } from 'lucide-react';
import { MuttonOrderForm } from './MuttonOrderForm';
import { PhotoSlot } from './PhotoSlot';

export const FreshMutton: React.FC = () => {
  const { config, photos, muttonItems } = useBusiness();
  const [selectedKg, setSelectedKg] = useState<number>(1);
  const [selectedItemId, setSelectedItemId] = useState<string>('item-fresh-mutton');

  const pricePerKg = config.MUTTON_PRICE_PER_KG;
  const estimatedTotal = selectedKg * pricePerKg;

  const quickPicks = [
    { kg: 1, label: '1 kg', total: 1 * pricePerKg },
    { kg: 2, label: '2 kg', total: 2 * pricePerKg },
    { kg: 5, label: '5 kg', total: 5 * pricePerKg },
    { kg: 10, label: '10 kg', total: 10 * pricePerKg },
  ];

  const handleScrollToForm = () => {
    const el = document.getElementById('mutton-order-form');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="mutton" className="py-16 lg:py-24 bg-[#FAF8F5] border-b border-[#E8E2D8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#6B121C]/10 text-[#6B121C] text-xs font-bold uppercase tracking-wider mb-3">
            <span>Daily Fresh Stock</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif-display font-bold text-[#1F1B1A] mb-3">
            Fresh Mutton
          </h2>
          <p className="text-base sm:text-lg text-[#5A504D]">
            Prepared fresh daily according to your household cooking traditions and cutting specifications.
          </p>
        </div>

        {/* Real Mutton Showcase & Calculator Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch max-w-6xl mx-auto mb-16">
          {/* Left Column: Real Mutton Photo Slot */}
          <div className="lg:col-span-4 flex flex-col">
            <div className="bg-white rounded-2xl border border-[#E8E2D8] p-5 shadow-sm h-full flex flex-col justify-between">
              <div>
                <PhotoSlot
                  src={photos.fresh_mutton}
                  alt="Fresh daily cut mutton at Balaji Mutton Shop with clean trimming"
                  slotLabel="Fresh Mutton Display"
                  slotSubtext="Real photograph of fresh cut mutton display and meat preparation"
                  aspectRatioClass="aspect-4/3 sm:aspect-16/11 lg:aspect-square"
                />
                <div className="mt-4">
                  <h3 className="text-base font-bold text-[#1F1B1A]">100% Fresh Daily Cut</h3>
                  <p className="text-xs text-[#5A504D] mt-1 leading-relaxed">
                    Sourced responsibly from healthy local livestock, cleanly trimmed and weighed right before your eyes.
                  </p>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-[#E8E2D8] flex items-center justify-between text-xs text-[#8C7E7A]">
                <span>Zero Stale Stock</span>
                <span>·</span>
                <span className="text-[#6B121C] font-semibold">Custom Cuts Available</span>
              </div>
            </div>
          </div>

          {/* Right Column: Pricing & Automatic Calculator */}
          <div className="lg:col-span-8 bg-white rounded-2xl border border-[#E8E2D8] shadow-sm overflow-hidden flex flex-col">
            <div className="bg-[#6B121C] text-white p-6 sm:p-7 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs uppercase tracking-wider text-[#E5C88F] font-bold block mb-1">
                  Standard Daily Rate
                </span>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl sm:text-4xl font-serif-display font-bold text-white tabular-nums">
                    {config.CURRENCY_SYMBOL}{pricePerKg.toLocaleString('en-IN')}
                  </span>
                  <span className="text-sm sm:text-base text-[#FAF8F5]/80 font-normal">/ per kg</span>
                </div>
              </div>

              <div className="bg-[#4A0B10]/80 border border-[#E5C88F]/30 rounded-xl px-4 py-2 text-xs text-[#E5C88F] max-w-xs">
                <span className="font-semibold block text-white">Daily Freshness Guarantee:</span>
                Never frozen. Prepared daily under clean and hygienic standards.
              </div>
            </div>

            <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between">
              <div>
                {/* Calculator Title */}
                <div className="flex items-center gap-2 mb-5 pb-3 border-b border-[#E8E2D8]">
                  <Calculator className="w-5 h-5 text-[#C5A059]" />
                  <h3 className="text-base sm:text-lg font-bold text-[#1F1B1A]">
                    Quantity Selector & Price Calculator
                  </h3>
                </div>

                {/* Quick Pick Buttons as requested */}
                <div className="mb-5">
                  <label className="block text-xs font-semibold text-[#5A504D] uppercase tracking-wider mb-2">
                    Quick Selection:
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    {quickPicks.map((pick) => {
                      const isSelected = selectedKg === pick.kg;
                      return (
                        <button
                          key={pick.kg}
                          type="button"
                          onClick={() => setSelectedKg(pick.kg)}
                          className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                            isSelected
                              ? 'border-[#6B121C] bg-[#6B121C]/5 text-[#6B121C] ring-2 ring-[#6B121C]/20 shadow-xs'
                              : 'border-[#E8E2D8] bg-[#FAF8F5] hover:border-[#C5A059] text-[#1F1B1A]'
                          }`}
                        >
                          <div className="text-base font-bold tabular-nums">{pick.label}</div>
                          <div className="text-xs text-[#5A504D] mt-0.5 tabular-nums">
                            = {config.CURRENCY_SYMBOL}{pick.total.toLocaleString('en-IN')}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Custom Quantity Stepper */}
                <div className="bg-[#F3EFE8]/70 rounded-xl p-4 mb-5 border border-[#E8E2D8]">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <label htmlFor="custom-kg-input" className="block text-xs font-semibold text-[#1F1B1A] uppercase tracking-wide">
                        Custom Quantity (kg)
                      </label>
                      <p className="text-xs text-[#5A504D] mt-0.5">
                        Adjust in 0.5 kg increments or enter exact requirement
                      </p>
                    </div>

                    <div className="flex items-center gap-2.5">
                      <button
                        type="button"
                        onClick={() => setSelectedKg((prev) => Math.max(0.5, prev - 0.5))}
                        className="w-9 h-9 rounded-lg bg-white border border-[#D9D2C7] hover:border-[#6B121C] text-lg font-bold text-[#1F1B1A] flex items-center justify-center transition-colors active:scale-95 cursor-pointer"
                        aria-label="Decrease quantity by 0.5 kg"
                      >
                        -
                      </button>

                      <div className="flex items-center bg-white border border-[#D9D2C7] rounded-lg px-3 py-1.5 min-w-[85px] justify-center">
                        <input
                          id="custom-kg-input"
                          type="number"
                          step="0.5"
                          min="0.5"
                          max="100"
                          value={selectedKg}
                          onChange={(e) => {
                            const val = parseFloat(e.target.value);
                            if (!isNaN(val) && val > 0) {
                              setSelectedKg(val);
                            } else if (e.target.value === '') {
                              setSelectedKg(1);
                            }
                          }}
                          className="w-12 text-center font-bold text-base text-[#1F1B1A] focus:outline-hidden tabular-nums"
                          aria-label="Mutton quantity in kilograms"
                        />
                        <span className="text-xs font-medium text-[#5A504D]">kg</span>
                      </div>

                      <button
                        type="button"
                        onClick={() => setSelectedKg((prev) => prev + 0.5)}
                        className="w-9 h-9 rounded-lg bg-white border border-[#D9D2C7] hover:border-[#6B121C] text-lg font-bold text-[#1F1B1A] flex items-center justify-center transition-colors active:scale-95 cursor-pointer"
                        aria-label="Increase quantity by 0.5 kg"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                {/* Prominent Estimated Total Banner */}
                <div className="bg-[#FAF8F5] rounded-xl p-4 sm:p-5 border border-[#C5A059]/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
                  <div>
                    <span className="text-xs uppercase tracking-wider text-[#8C7E7A] font-semibold block">
                      Estimated Total
                    </span>
                    <div className="text-2xl sm:text-3xl font-serif-display font-bold text-[#6B121C] tabular-nums">
                      {config.CURRENCY_SYMBOL}{estimatedTotal.toLocaleString('en-IN')}
                    </div>
                    <span className="text-[11px] text-[#5A504D]">
                      Calculated as: {selectedKg} kg × {config.CURRENCY_SYMBOL}{pricePerKg.toLocaleString('en-IN')}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={handleScrollToForm}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#6B121C] hover:bg-[#4A0B10] text-white rounded-lg text-sm font-bold shadow-md transition-all active:scale-[0.98] cursor-pointer"
                  >
                    <ShoppingBag className="w-4 h-4 text-[#E5C88F]" />
                    <span>ORDER NOW</span>
                    <ArrowDown className="w-4 h-4" />
                  </button>
                </div>

                {/* Mandatory Price & Availability Disclaimer */}
                <div className="flex items-start gap-2.5 p-3 rounded-lg bg-[#FDF8E8] border border-[#E8D099] text-xs text-[#7A5B18]">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-[#B38F46]" />
                  <p className="leading-relaxed">
                    <strong>Important Notice:</strong> {config.PRICE_DISCLAIMER}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>


        {/* Mutton Items & Varieties Showcase */}
        <div className="mb-16">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#6B121C]/10 text-[#6B121C] text-xs font-bold uppercase tracking-wider mb-2">
              <span>Fresh Butcher Cuts & Selections</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-serif-display font-bold text-[#1F1B1A]">
              Mutton Options & Preparations
            </h3>
            <p className="text-xs sm:text-sm text-[#5A504D] mt-1 max-w-2xl mx-auto">
              Choose your preferred mutton item below. Custom quantities and instant price calculation available in the order form.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-6xl mx-auto">
            {muttonItems.map((item) => {
              const hasPrice = typeof item.pricePerKg === 'number' && item.pricePerKg > 0;
              const isSelected = selectedItemId === item.id;
              return (
                <div
                  key={item.id}
                  onClick={() => {
                    setSelectedItemId(item.id);
                    handleScrollToForm();
                  }}
                  className={`bg-white rounded-2xl border p-4 shadow-xs transition-all cursor-pointer flex flex-col justify-between hover:shadow-md ${
                    isSelected
                      ? 'border-[#6B121C] ring-2 ring-[#6B121C]/20 bg-[#FAF8F5]/60'
                      : 'border-[#E8E2D8] hover:border-[#C5A059]'
                  }`}
                >
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <span className="text-sm font-bold text-[#1F1B1A]">
                        {item.name}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                          item.available
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {item.available ? '✓ In Stock' : '✕ Out of Stock'}
                      </span>
                    </div>

                    <p className="text-xs text-[#5A504D] line-clamp-2 min-h-[32px]">
                      {item.description || 'Prepared fresh daily to traditional standards.'}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-[#E8E2D8] flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-[#8C7E7A] uppercase block">Rate / kg</span>
                      <span className="text-xs font-bold font-mono text-[#6B121C]">
                        {hasPrice
                          ? `${config.CURRENCY_SYMBOL}${item.pricePerKg!.toLocaleString('en-IN')}`
                          : 'Contact us'}
                      </span>
                    </div>

                    <span className="text-xs font-semibold text-[#6B121C] hover:underline flex items-center gap-1">
                      <span>Order</span>
                      <span>→</span>
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Cutting Preferences Information */}
        <div className="mb-16">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-serif-display font-bold text-[#1F1B1A]">
              Traditional Cutting Options
            </h3>
            <p className="text-xs text-[#5A504D] mt-1">
              Select your preference when filling out the order form below
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto">
            {CUTTING_PREFERENCES.map((cut) => (
              <div
                key={cut.id}
                className="bg-white rounded-xl p-4 border border-[#E8E2D8] flex items-start gap-3 shadow-xs"
              >
                <div className="w-5 h-5 rounded-full bg-[#6B121C]/10 text-[#6B121C] flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[#1F1B1A]">{cut.label.split('(')[0]}</h4>
                  {cut.label.includes('(') && (
                    <p className="text-xs text-[#5A504D] mt-0.5">
                      ({cut.label.split('(')[1]}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* The Dedicated Mutton Order Form */}
        <div id="mutton-order-form">
          <MuttonOrderForm initialItemId={selectedItemId} initialQuantity={selectedKg} />
        </div>
      </div>
    </section>
  );
};
