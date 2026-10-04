import React, { useState } from 'react';
import { useBusiness } from '../context/BusinessContext';
import { OCCASIONS, CUTTING_PREFERENCES } from '../config/businessConfig';
import {
  MessageSquare,
  Copy,
  Check,
  Calendar,
  Phone,
  User,
  ShoppingBag,
  Info,
  ArrowDown,
  Sparkles,
} from 'lucide-react';

export const BulkOrders: React.FC = () => {
  const { config, getWhatsAppLink } = useBusiness();

  // Form State
  const [customerName, setCustomerName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [eventType, setEventType] = useState('Weddings');
  const [eventDate, setEventDate] = useState('');
  const [whatDoYouNeed, setWhatDoYouNeed] = useState('Bulk Mutton');
  const [quantity, setQuantity] = useState('25 kg');
  const [approxWeight, setApproxWeight] = useState('Standard / Per head calculation');
  const [cuttingPref, setCuttingPref] = useState('Biryani Cut (Large tender bone-in cuts)');
  const [orderType, setOrderType] = useState<string>('Store Pickup');
  const [additionalRequirements, setAdditionalRequirements] = useState('');
  const [copied, setCopied] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const productOptions = [
    'Fresh Mutton',
    'Goat',
    'Sheep',
    'Bulk Mutton',
    'Bulk Goat Requirement',
    'Bulk Sheep Requirement',
    'Other',
  ];

  const handleOccasionClick = (occasionTitle: string) => {
    setEventType(occasionTitle);
    const el = document.getElementById('bulk-form-container');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const generateBulkMessage = () => {
    return `*SPECIAL / BULK ENQUIRY - BALAJI MUTTON SHOP*
---------------------------------------
👤 *Customer Name:* ${customerName.trim() || 'Not specified'}
📞 *Phone Number:* ${phoneNumber.trim() || 'Not specified'}
🎉 *Occasion:* ${eventType}
⚖️ *Required Quantity:* ${quantity}
📅 *Preferred Date:* ${eventDate || 'To be confirmed'}
📦 *What do you need:* ${whatDoYouNeed}
📐 *Approximate Weight:* ${approxWeight}
🔪 *Cutting Preference:* ${cuttingPref}
🚚 *Fulfillment:* ${orderType}
📝 *Additional Requirements:* ${additionalRequirements.trim() || 'None'}
---------------------------------------
_Note: Final pricing for goats and sheep depends on current availability, size/weight and market conditions. Please contact us for confirmation._`;
  };

  const bulkMessage = generateBulkMessage();
  const wa = getWhatsAppLink(bulkMessage);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    window.open(wa.url, '_blank', 'noopener,noreferrer');
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(bulkMessage);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <section id="bulk-orders" className="py-16 lg:py-24 bg-[#FAF8F5] border-b border-[#E8E2D8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#6B121C]/10 text-[#6B121C] text-xs font-bold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5 text-[#C5A059]" />
            <span>Event & Catering Specialists</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif-display font-bold text-[#1F1B1A] mb-3">
            Special & Bulk Orders
          </h2>
          <h3 className="text-xl sm:text-2xl font-serif-display italic text-[#6B121C] mb-4">
            "Planning a Celebration? We've Got Your Order Covered."
          </h3>
          <p className="text-base sm:text-lg text-[#5A504D] leading-relaxed">
            From birthdays and weddings to family functions and large gatherings, Balaji Mutton Shop accepts advance enquiries and bulk orders.
          </p>

          <div className="mt-6">
            <button
              type="button"
              onClick={() => {
                const el = document.getElementById('bulk-form-container');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg text-xs font-bold uppercase tracking-wider text-white bg-[#6B121C] hover:bg-[#4A0B10] shadow-md transition-all active:scale-[0.98]"
            >
              <span>PLAN YOUR ORDER</span>
              <ArrowDown className="w-4 h-4 text-[#E5C88F]" />
            </button>
          </div>
        </div>

        {/* 6 Celebration Occasions Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-16">
          {OCCASIONS.map((occ) => (
            <button
              key={occ.id}
              type="button"
              onClick={() => handleOccasionClick(occ.title)}
              className="bg-white p-5 rounded-xl border border-[#E8E2D8] hover:border-[#C5A059] hover:shadow-md transition-all flex flex-col items-center text-center group cursor-pointer"
            >
              <span className="text-3xl mb-2 group-hover:scale-110 transition-transform">
                {occ.icon}
              </span>
              <h4 className="text-sm font-bold text-[#1F1B1A] mb-1">{occ.title}</h4>
              <span className="text-[11px] text-[#5A504D] leading-tight">
                {occ.note}
              </span>
              <span className="mt-3 text-[10px] text-[#6B121C] font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                Select Event →
              </span>
            </button>
          ))}
        </div>

        {/* Bulk Order Enquiry Form Container */}
        <div id="bulk-form-container" className="max-w-3xl mx-auto bg-white rounded-2xl border border-[#E8E2D8] shadow-md overflow-hidden">
          <div className="bg-[#FAF8F5] border-b border-[#E8E2D8] p-6 sm:p-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#6B121C] text-white flex items-center justify-center font-bold">
                <ShoppingBag className="w-5 h-5 text-[#E5C88F]" />
              </div>
              <div>
                <h3 className="text-xl sm:text-2xl font-serif-display font-bold text-[#1F1B1A]">
                  Bulk & Event Enquiry Form
                </h3>
                <p className="text-xs text-[#5A504D]">
                  Advance coordination for weddings, family gatherings, festivals, and catering batches.
                </p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">
            {/* Customer Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-semibold text-[#1F1B1A] uppercase tracking-wide mb-1.5 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-[#C5A059]" />
                  <span>Customer Name *</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Suresh Kamtekar"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-[#D9D2C7] focus:border-[#6B121C] text-sm text-[#1F1B1A] bg-[#FAF8F5]/50"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1F1B1A] uppercase tracking-wide mb-1.5 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-[#C5A059]" />
                  <span>Phone Number *</span>
                </label>
                <input
                  type="tel"
                  required
                  placeholder="e.g. 9876543210"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-[#D9D2C7] focus:border-[#6B121C] text-sm text-[#1F1B1A] bg-[#FAF8F5]/50"
                />
              </div>
            </div>

            {/* Event Type & Date */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-semibold text-[#1F1B1A] uppercase tracking-wide mb-1.5">
                  Event Type *
                </label>
                <select
                  value={eventType}
                  onChange={(e) => setEventType(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-[#D9D2C7] focus:border-[#6B121C] text-sm text-[#1F1B1A] bg-white"
                >
                  {OCCASIONS.map((o) => (
                    <option key={o.id} value={o.title}>
                      {o.icon} {o.title}
                    </option>
                  ))}
                  <option value="Other Celebration">Other Celebration / Ceremony</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1F1B1A] uppercase tracking-wide mb-1.5 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-[#C5A059]" />
                  <span>Event Date *</span>
                </label>
                <input
                  type="date"
                  required
                  value={eventDate}
                  onChange={(e) => setEventDate(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-[#D9D2C7] focus:border-[#6B121C] text-sm text-[#1F1B1A] bg-white"
                />
              </div>
            </div>

            {/* What do you need? */}
            <div>
              <label className="block text-xs font-semibold text-[#1F1B1A] uppercase tracking-wide mb-1.5">
                What do you need? *
              </label>
              <select
                value={whatDoYouNeed}
                onChange={(e) => setWhatDoYouNeed(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg border border-[#D9D2C7] focus:border-[#6B121C] text-sm text-[#1F1B1A] bg-white font-medium"
              >
                {productOptions.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>

            {/* Quantity & Approximate Weight */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-semibold text-[#1F1B1A] uppercase tracking-wide mb-1.5">
                  Estimated Quantity *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 20 kg or 2 Goats or 3 Sheep"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-[#D9D2C7] focus:border-[#6B121C] text-sm text-[#1F1B1A] bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1F1B1A] uppercase tracking-wide mb-1.5">
                  Approximate Weight Preference
                </label>
                <input
                  type="text"
                  placeholder="e.g. 12-15 kg per animal, or standard cuts"
                  value={approxWeight}
                  onChange={(e) => setApproxWeight(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-[#D9D2C7] focus:border-[#6B121C] text-sm text-[#1F1B1A] bg-white"
                />
              </div>
            </div>

            {/* Cutting Preference & Pickup/Delivery */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-semibold text-[#1F1B1A] uppercase tracking-wide mb-1.5">
                  Cutting Preference
                </label>
                <select
                  value={cuttingPref}
                  onChange={(e) => setCuttingPref(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-[#D9D2C7] focus:border-[#6B121C] text-sm text-[#1F1B1A] bg-white"
                >
                  {CUTTING_PREFERENCES.map((c) => (
                    <option key={c.id} value={c.label}>
                      {c.label}
                    </option>
                  ))}
                  <option value="Live Delivery / Uncut">Live Delivery / Inspection on site</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1F1B1A] uppercase tracking-wide mb-1.5">
                  Pickup / Delivery
                </label>
                <select
                  value={orderType}
                  onChange={(e) => setOrderType(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-[#D9D2C7] focus:border-[#6B121C] text-sm text-[#1F1B1A] bg-white"
                >
                  <option value="Store Pickup">Store Pickup at Shop</option>
                  <option value="Delivery to Function Hall / Home">Delivery to Function Hall / Home</option>
                </select>
              </div>
            </div>

            {/* Additional Requirements */}
            <div>
              <label className="block text-xs font-semibold text-[#1F1B1A] uppercase tracking-wide mb-1.5">
                Additional Requirements / Special Notes
              </label>
              <textarea
                rows={2}
                placeholder="Mention timings, guest headcount, packaging preferences, or any ritual requirements..."
                value={additionalRequirements}
                onChange={(e) => setAdditionalRequirements(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg border border-[#D9D2C7] focus:border-[#6B121C] text-sm text-[#1F1B1A] bg-[#FAF8F5]/50"
              />
            </div>

            {/* Mandatory Non-Calculation Disclaimer Notice */}
            <div className="p-3.5 rounded-xl bg-[#FDF8E8] border border-[#E8D099] flex items-start gap-2.5 text-xs text-[#7A5B18]">
              <Info className="w-4 h-4 text-[#B38F46] shrink-0 mt-0.5" />
              <p className="leading-relaxed">
                <strong>Pricing Policy:</strong> "Final pricing for goats and sheep depends on current availability, size/weight and market conditions. Please contact us for confirmation."
              </p>
            </div>

            {/* Action Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row gap-3">
              <button
                type="submit"
                className="flex-1 inline-flex items-center justify-center gap-2 py-3.5 px-6 rounded-lg text-sm font-bold text-white bg-[#1E7E34] hover:bg-[#155724] active:scale-[0.99] transition-all shadow-md"
              >
                <MessageSquare className="w-4 h-4 text-white" />
                <span>SEND ENQUIRY ON WHATSAPP</span>
              </button>

              <button
                type="button"
                onClick={handleCopy}
                className="inline-flex items-center justify-center gap-1.5 py-3.5 px-4 rounded-lg text-xs font-semibold text-[#2D2726] bg-[#FAF8F5] border border-[#D9D2C7] hover:border-[#6B121C] hover:text-[#6B121C] transition-colors"
              >
                {copied ? <Check className="w-4 h-4 text-[#1E7E34]" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? 'Copied Details!' : 'Copy Enquiry'}</span>
              </button>
            </div>

            {submitted && (
              <p className="text-center text-xs text-[#1E7E34] font-medium pt-1">
                ✓ Bulk enquiry prepared. WhatsApp has been opened in a new tab.
              </p>
            )}
          </form>
        </div>
      </div>
    </section>
  );
};
