import React, { useState, useEffect, useMemo } from 'react';
import { useBusiness } from '../context/BusinessContext';
import { CUTTING_PREFERENCES, MuttonItem } from '../config/businessConfig';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import {
  MessageSquare,
  Copy,
  Check,
  AlertTriangle,
  Calendar,
  Clock,
  MapPin,
  User,
  Phone,
  FileText,
  Beef,
  Scale,
  Sparkles,
  AlertCircle,
  XCircle,
} from 'lucide-react';

interface MuttonOrderFormProps {
  initialItemId?: string;
  initialQuantity?: number;
}

interface QuantityPreset {
  id: string;
  label: string;
  kg: number;
  display: string;
}

const QUANTITY_PRESETS: QuantityPreset[] = [
  { id: '250g', label: '250 g', kg: 0.25, display: '250 g' },
  { id: '500g', label: '500 g', kg: 0.5, display: '500 g' },
  { id: '750g', label: '750 g', kg: 0.75, display: '750 g' },
  { id: '1kg', label: '1 kg', kg: 1.0, display: '1 kg' },
  { id: '1.5kg', label: '1.5 kg', kg: 1.5, display: '1.5 kg' },
  { id: '2kg', label: '2 kg', kg: 2.0, display: '2 kg' },
  { id: '2.5kg', label: '2.5 kg', kg: 2.5, display: '2.5 kg' },
  { id: '3kg', label: '3 kg', kg: 3.0, display: '3 kg' },
];

export const MuttonOrderForm: React.FC<MuttonOrderFormProps> = ({
  initialItemId,
  initialQuantity = 1,
}) => {
  const { config, muttonItems, getWhatsAppLink } = useBusiness();

  // Find initial item or default to first available
  const defaultItem = useMemo(() => {
    if (initialItemId) {
      const match = muttonItems.find((i) => i.id === initialItemId);
      if (match) return match;
    }
    const freshMutton = muttonItems.find(
      (i) => i.id === 'item-fresh-mutton' || i.name.toLowerCase() === 'fresh mutton'
    );
    return freshMutton || muttonItems[0] || null;
  }, [initialItemId, muttonItems]);

  const [selectedItemId, setSelectedItemId] = useState<string>(
    defaultItem ? defaultItem.id : ''
  );

  useEffect(() => {
    if (defaultItem && (!selectedItemId || !muttonItems.some((i) => i.id === selectedItemId))) {
      setSelectedItemId(defaultItem.id);
    }
  }, [defaultItem, muttonItems, selectedItemId]);

  // Selected item object
  const selectedItem: MuttonItem | undefined = useMemo(() => {
    return muttonItems.find((i) => i.id === selectedItemId) || defaultItem || muttonItems[0];
  }, [muttonItems, selectedItemId, defaultItem]);

  // Quantity selection state
  const [selectedPresetId, setSelectedPresetId] = useState<string>(() => {
    if (initialQuantity === 0.25) return '250g';
    if (initialQuantity === 0.5) return '500g';
    if (initialQuantity === 0.75) return '750g';
    if (initialQuantity === 1) return '1kg';
    if (initialQuantity === 1.5) return '1.5kg';
    if (initialQuantity === 2) return '2kg';
    if (initialQuantity === 2.5) return '2.5kg';
    if (initialQuantity === 3) return '3kg';
    return '1kg';
  });

  const [isCustomQuantity, setIsCustomQuantity] = useState<boolean>(false);
  const [customValue, setCustomValue] = useState<string>('500');
  const [customUnit, setCustomUnit] = useState<'g' | 'kg'>('g');

  // Customer contact & preference states
  const [customerName, setCustomerName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [cuttingPref, setCuttingPref] = useState('Curry Cut (Standard medium bone-in pieces)');
  const [orderType, setOrderType] = useState<'Pickup' | 'Delivery'>('Pickup');
  const [preferredDate, setPreferredDate] = useState('');
  const [preferredTime, setPreferredTime] = useState('Morning (8:00 AM – 11:30 AM)');
  const [additionalRequirements, setAdditionalRequirements] = useState('');
  const [copied, setCopied] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);

  // Set default preferred date to today's date
  useEffect(() => {
    const today = new Date();
    const formatted = today.toISOString().split('T')[0];
    setPreferredDate(formatted);
  }, []);

  // Compute effective weight in kilograms
  const effectiveKg = useMemo(() => {
    if (isCustomQuantity) {
      const num = parseFloat(customValue) || 0;
      if (customUnit === 'g') {
        return num / 1000;
      }
      return num;
    }
    const preset = QUANTITY_PRESETS.find((p) => p.id === selectedPresetId);
    return preset ? preset.kg : 1.0;
  }, [isCustomQuantity, customValue, customUnit, selectedPresetId]);

  // Formatted quantity display string
  const quantityDisplayString = useMemo(() => {
    if (isCustomQuantity) {
      const num = parseFloat(customValue) || 0;
      return customUnit === 'g' ? `${num} g` : `${num} kg`;
    }
    const preset = QUANTITY_PRESETS.find((p) => p.id === selectedPresetId);
    return preset ? preset.display : '1 kg';
  }, [isCustomQuantity, customValue, customUnit, selectedPresetId]);

  // Check item availability and pricing
  const isAvailable = selectedItem ? selectedItem.available : true;
  const hasConfiguredPrice = Boolean(
    selectedItem &&
      typeof selectedItem.pricePerKg === 'number' &&
      selectedItem.pricePerKg > 0
  );
  const itemPricePerKg = hasConfiguredPrice ? (selectedItem!.pricePerKg as number) : null;

  // Calculate estimated price based on item price & effective quantity
  const estimatedPriceNumber = useMemo(() => {
    if (!hasConfiguredPrice || itemPricePerKg === null) {
      return null;
    }
    return Math.round(effectiveKg * itemPricePerKg);
  }, [hasConfiguredPrice, itemPricePerKg, effectiveKg]);

  // Estimated price text for display
  const estimatedPriceDisplay = useMemo(() => {
    if (!hasConfiguredPrice || estimatedPriceNumber === null) {
      return 'Price: Contact us';
    }
    return `₹${estimatedPriceNumber.toLocaleString('en-IN')}`;
  }, [hasConfiguredPrice, estimatedPriceNumber]);

  // WhatsApp price text
  const whatsappPriceText = useMemo(() => {
    if (!hasConfiguredPrice || estimatedPriceNumber === null) {
      return 'Contact us';
    }
    return `₹${estimatedPriceNumber.toLocaleString('en-IN')}`;
  }, [hasConfiguredPrice, estimatedPriceNumber]);

  const isClosed = config.SHOP_STATUS === 'CLOSED';

  // Format additional requirements
  const formattedRequirements = useMemo(() => {
    const parts: string[] = [];
    if (cuttingPref && cuttingPref !== 'None') {
      parts.push(`Cut: ${cuttingPref}`);
    }
    if (orderType) {
      parts.push(`Type: ${orderType}`);
    }
    if (preferredDate) {
      parts.push(`Date: ${preferredDate}${preferredTime ? ` (${preferredTime})` : ''}`);
    }
    if (additionalRequirements.trim()) {
      parts.push(`Notes: ${additionalRequirements.trim()}`);
    }
    return parts.length > 0 ? parts.join(' | ') : 'None';
  }, [cuttingPref, orderType, preferredDate, preferredTime, additionalRequirements]);

  // Format the complete order message for WhatsApp
  const generateOrderMessage = () => {
    const itemName = selectedItem ? selectedItem.name : 'Fresh Mutton';
    const cName = customerName.trim() || 'Not specified';
    const cPhone = phoneNumber.trim() || 'Not specified';

    let msg = `Hello Balaji Mutton Shop,\nI would like to place an order.\n\nItem: ${itemName}\nQuantity: ${quantityDisplayString}\nEstimated price: ${whatsappPriceText}\n\nName: ${cName}\nPhone: ${cPhone}\nAdditional requirements: ${formattedRequirements}`;

    if (isClosed) {
      msg += `\n\n(Advance order while shop is closed today. Reopening: ${config.REOPENING_DATE || 'tomorrow'})`;
    }

    return msg;
  };

  const message = generateOrderMessage();
  const whatsappInfo = getWhatsAppLink(message);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAvailable) {
      return;
    }
    setFormSubmitted(true);

    try {
      await addDoc(collection(db, 'orders'), {
        customerName: customerName.trim(),
        phone: phoneNumber.trim(),
        address: `${orderType} - ${preferredDate} (${preferredTime})`,
        items: `${selectedItem ? selectedItem.name : 'Fresh Mutton'} (${quantityDisplayString}) [Cut: ${cuttingPref}]`,
        totalAmount: estimatedPriceNumber || 0,
        orderStatus: 'Pending',
        createdAt: serverTimestamp(),
      });
    } catch (err: unknown) {
      handleFirestoreError(err, OperationType.CREATE, 'orders');
    }

    window.open(whatsappInfo.url, '_blank', 'noopener,noreferrer');
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(message);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-2xl border border-[#E8E2D8] shadow-md overflow-hidden">
      {/* Form Header */}
      <div className="bg-[#FAF8F5] border-b border-[#E8E2D8] p-6 sm:p-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#6B121C] text-white flex items-center justify-center font-bold shadow-xs">
            <Beef className="w-5 h-5 text-[#E5C88F]" />
          </div>
          <div>
            <h3 className="text-xl sm:text-2xl font-serif-display font-bold text-[#1F1B1A]">
              Mutton Order & WhatsApp Booking
            </h3>
            <p className="text-xs text-[#5A504D]">
              Select your specific mutton cut or preparation, choose quantity, and generate a prefilled WhatsApp order.
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-7">
        {/* ========================================================= */}
        {/* STEP 1: ITEM SELECTION */}
        {/* ========================================================= */}
        <div>
          <div className="flex items-center justify-between mb-2.5">
            <label className="block text-xs font-bold text-[#1F1B1A] uppercase tracking-wide flex items-center gap-1.5">
              <Beef className="w-3.5 h-3.5 text-[#C5A059]" />
              <span>1. Select Mutton Item *</span>
            </label>
            <span className="text-[11px] text-[#8C7E7A]">
              {muttonItems.length} items available
            </span>
          </div>

          {/* Interactive Item Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
            {muttonItems.map((item) => {
              const isSelected = selectedItemId === item.id;
              const hasPrice = typeof item.pricePerKg === 'number' && item.pricePerKg > 0;
              const itemAvailable = item.available;

              return (
                <div
                  key={item.id}
                  onClick={() => {
                    setSelectedItemId(item.id);
                  }}
                  className={`p-3 rounded-xl border transition-all cursor-pointer relative flex flex-col justify-between ${
                    isSelected
                      ? 'border-[#6B121C] bg-[#6B121C]/5 ring-2 ring-[#6B121C]/25 shadow-xs'
                      : itemAvailable
                      ? 'border-[#E8E2D8] bg-[#FAF8F5] hover:border-[#C5A059] hover:bg-white'
                      : 'border-red-200 bg-red-50/40 opacity-75'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="font-bold text-xs sm:text-sm text-[#1F1B1A]">
                      {item.name}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full whitespace-nowrap ${
                        itemAvailable
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {itemAvailable ? '✓ Available' : '✕ Out of Stock'}
                    </span>
                  </div>

                  <div className="mt-2 pt-2 border-t border-[#E8E2D8]/70 flex items-center justify-between text-xs">
                    <span className="text-[11px] font-mono font-bold text-[#6B121C]">
                      {hasPrice
                        ? `${config.CURRENCY_SYMBOL}${item.pricePerKg!.toLocaleString('en-IN')}/kg`
                        : 'Price: Contact us'}
                    </span>
                    {isSelected && (
                      <span className="text-[10px] font-bold text-[#6B121C] flex items-center gap-0.5">
                        <Check className="w-3 h-3" /> Selected
                      </span>
                    )}
                  </div>

                  {item.description && (
                    <p className="text-[10px] text-[#5A504D] mt-1 line-clamp-1">
                      {item.description}
                    </p>
                  )}
                </div>
              );
            })}
          </div>

          {!isAvailable && (
            <div className="mt-3 p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-800 flex items-center gap-2">
              <XCircle className="w-4 h-4 text-red-600 shrink-0" />
              <span>
                <strong>{selectedItem?.name}</strong> is currently unavailable / out of stock. Please select another item to place an order.
              </span>
            </div>
          )}
        </div>

        {/* ========================================================= */}
        {/* STEP 2: QUANTITY SELECTION */}
        {/* ========================================================= */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-xs font-bold text-[#1F1B1A] uppercase tracking-wide flex items-center gap-1.5">
              <Scale className="w-3.5 h-3.5 text-[#C5A059]" />
              <span>2. Select Quantity *</span>
            </label>
            <span className="text-xs font-bold text-[#6B121C]">
              Selected: {quantityDisplayString}
            </span>
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
            {QUANTITY_PRESETS.map((preset) => {
              const isSelected = !isCustomQuantity && selectedPresetId === preset.id;
              let calcTotal = null;
              if (hasConfiguredPrice && itemPricePerKg) {
                calcTotal = Math.round(preset.kg * itemPricePerKg);
              }

              return (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => {
                    setIsCustomQuantity(false);
                    setSelectedPresetId(preset.id);
                  }}
                  className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                    isSelected
                      ? 'border-[#6B121C] bg-[#6B121C] text-white shadow-xs ring-2 ring-[#6B121C]/20'
                      : 'border-[#E8E2D8] bg-[#FAF8F5] text-[#1F1B1A] hover:border-[#C5A059]'
                  }`}
                >
                  <div className="text-xs sm:text-sm font-bold">{preset.label}</div>
                  <div
                    className={`text-[10px] mt-0.5 tabular-nums ${
                      isSelected ? 'text-[#E5C88F]' : 'text-[#8C7E7A]'
                    }`}
                  >
                    {calcTotal !== null
                      ? `${config.CURRENCY_SYMBOL}${calcTotal.toLocaleString('en-IN')}`
                      : 'Contact us'}
                  </div>
                </button>
              );
            })}

            <button
              type="button"
              onClick={() => setIsCustomQuantity(true)}
              className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                isCustomQuantity
                  ? 'border-[#6B121C] bg-[#6B121C] text-white shadow-xs ring-2 ring-[#6B121C]/20'
                  : 'border-[#E8E2D8] bg-[#FAF8F5] text-[#1F1B1A] hover:border-[#C5A059]'
              }`}
            >
              <div className="text-xs sm:text-sm font-bold">Custom</div>
              <div
                className={`text-[10px] mt-0.5 ${
                  isCustomQuantity ? 'text-[#E5C88F]' : 'text-[#8C7E7A]'
                }`}
              >
                Grams / kg
              </div>
            </button>
          </div>

          {isCustomQuantity && (
            <div className="mt-3 p-4 rounded-xl bg-[#FAF8F5] border border-[#E8E2D8] flex flex-col sm:flex-row items-center gap-3">
              <div className="w-full sm:flex-1">
                <label className="block text-[11px] font-semibold text-[#5A504D] mb-1">
                  Enter Custom Quantity ({customUnit === 'g' ? 'Grams' : 'Kilograms'}):
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min={customUnit === 'g' ? '50' : '0.1'}
                    step={customUnit === 'g' ? '50' : '0.25'}
                    value={customValue}
                    onChange={(e) => setCustomValue(e.target.value)}
                    placeholder={customUnit === 'g' ? 'e.g. 600' : 'e.g. 4.5'}
                    className="w-full px-3 py-2 text-sm font-bold text-[#1F1B1A] rounded-lg border border-[#D9D2C7] bg-white focus:border-[#6B121C]"
                  />
                  <div className="flex rounded-lg border border-[#D9D2C7] overflow-hidden shrink-0">
                    <button
                      type="button"
                      onClick={() => setCustomUnit('g')}
                      className={`px-3 py-2 text-xs font-bold transition-colors cursor-pointer ${
                        customUnit === 'g'
                          ? 'bg-[#6B121C] text-white'
                          : 'bg-white text-[#5A504D] hover:bg-[#FAF8F5]'
                      }`}
                    >
                      Grams (g)
                    </button>
                    <button
                      type="button"
                      onClick={() => setCustomUnit('kg')}
                      className={`px-3 py-2 text-xs font-bold transition-colors cursor-pointer ${
                        customUnit === 'kg'
                          ? 'bg-[#6B121C] text-white'
                          : 'bg-white text-[#5A504D] hover:bg-[#FAF8F5]'
                      }`}
                    >
                      Kg
                    </button>
                  </div>
                </div>
              </div>

              <div className="w-full sm:w-auto text-left sm:text-right shrink-0">
                <span className="text-[10px] text-[#8C7E7A] uppercase block font-semibold">
                  Equivalent in Kg
                </span>
                <span className="text-sm font-bold font-mono text-[#1F1B1A]">
                  {effectiveKg.toFixed(2)} kg
                </span>
              </div>
            </div>
          )}
        </div>

        {/* ========================================================= */}
        {/* SUMMARY SECTION */}
        {/* ========================================================= */}
        <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-[#FAF8F5] via-[#FFFDF8] to-[#FAF8F5] border-2 border-[#C5A059]/40 shadow-xs">
          <div className="text-[10px] uppercase font-bold tracking-wider text-[#8C7E7A] mb-3 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#C5A059]" />
            <span>Order Summary & Price Calculation</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 divide-y sm:divide-y-0 sm:divide-x divide-[#E8E2D8]">
            <div className="pt-2 sm:pt-0 sm:pr-3">
              <span className="text-[11px] font-semibold text-[#8C7E7A] uppercase tracking-wide block">
                Selected Item
              </span>
              <div className="text-base sm:text-lg font-bold text-[#1F1B1A] mt-0.5 truncate">
                {selectedItem ? selectedItem.name : 'Fresh Mutton'}
              </div>
              <div className="text-[11px] text-[#5A504D] mt-0.5 flex items-center gap-1.5">
                <span>{hasConfiguredPrice ? `Rate: ₹${itemPricePerKg}/kg` : 'Price: Contact us'}</span>
                <span>·</span>
                <span className={isAvailable ? 'text-emerald-700 font-semibold' : 'text-red-700 font-semibold'}>
                  {isAvailable ? 'Available' : 'Unavailable'}
                </span>
              </div>
            </div>

            <div className="pt-3 sm:pt-0 sm:px-3">
              <span className="text-[11px] font-semibold text-[#8C7E7A] uppercase tracking-wide block">
                Quantity
              </span>
              <div className="text-base sm:text-lg font-bold text-[#1F1B1A] mt-0.5">
                {quantityDisplayString}
              </div>
              <span className="text-[11px] text-[#5A504D] mt-0.5 block">
                ({effectiveKg} kg net weight)
              </span>
            </div>

            <div className="pt-3 sm:pt-0 sm:pl-3 flex flex-col justify-center">
              <span className="text-[11px] font-semibold text-[#8C7E7A] uppercase tracking-wide block">
                Estimated Price
              </span>
              <div className="text-xl sm:text-2xl font-serif-display font-bold text-[#6B121C] tabular-nums mt-0.5">
                {estimatedPriceDisplay}
              </div>
              <span className="text-[10px] text-[#8C7E7A] mt-0.5">
                {hasConfiguredPrice
                  ? `Calculated: ${quantityDisplayString} × ₹${itemPricePerKg}/kg`
                  : 'Special cut rate confirmed upon order'}
              </span>
            </div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* CUSTOMER CONTACT */}
        {/* ========================================================= */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-[#1F1B1A] uppercase tracking-wide mb-1.5 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-[#C5A059]" />
              <span>Customer Name *</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Ramesh Kumar"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-lg border border-[#D9D2C7] focus:border-[#6B121C] focus:ring-2 focus:ring-[#6B121C]/15 text-sm text-[#1F1B1A] bg-[#FAF8F5]/50 transition-colors"
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
              className="w-full px-3.5 py-2.5 rounded-lg border border-[#D9D2C7] focus:border-[#6B121C] focus:ring-2 focus:ring-[#6B121C]/15 text-sm text-[#1F1B1A] bg-[#FAF8F5]/50 transition-colors"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#1F1B1A] uppercase tracking-wide mb-1.5 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-[#C5A059]" />
              <span>Pickup or Delivery</span>
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setOrderType('Pickup')}
                className={`py-2 px-3 rounded-lg border text-xs font-bold transition-all cursor-pointer ${
                  orderType === 'Pickup'
                    ? 'border-[#6B121C] bg-[#6B121C]/10 text-[#6B121C]'
                    : 'border-[#D9D2C7] bg-[#FAF8F5] text-[#5A504D]'
                }`}
              >
                🏪 Pickup
              </button>
              <button
                type="button"
                onClick={() => setOrderType('Delivery')}
                className={`py-2 px-3 rounded-lg border text-xs font-bold transition-all cursor-pointer ${
                  orderType === 'Delivery'
                    ? 'border-[#6B121C] bg-[#6B121C]/10 text-[#6B121C]'
                    : 'border-[#D9D2C7] bg-[#FAF8F5] text-[#5A504D]'
                }`}
              >
                🛵 Delivery
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-[#1F1B1A] uppercase tracking-wide mb-1.5 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-[#C5A059]" />
              <span>Preferred Date</span>
            </label>
            <input
              type="date"
              value={preferredDate}
              onChange={(e) => setPreferredDate(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-lg border border-[#D9D2C7] focus:border-[#6B121C] text-sm text-[#1F1B1A] bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#1F1B1A] uppercase tracking-wide mb-1.5 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-[#C5A059]" />
              <span>Preferred Time</span>
            </label>
            <select
              value={preferredTime}
              onChange={(e) => setPreferredTime(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-lg border border-[#D9D2C7] focus:border-[#6B121C] text-sm text-[#1F1B1A] bg-white"
            >
              <option value="Early Morning (7:00 AM – 9:00 AM)">Early Morning (7:00 AM – 9:00 AM)</option>
              <option value="Morning (9:00 AM – 11:30 AM)">Morning (9:00 AM – 11:30 AM)</option>
              <option value="Midday (11:30 AM – 1:30 PM)">Midday (11:30 AM – 1:30 PM)</option>
              <option value="Evening (5:00 PM – 8:30 PM)">Evening (5:00 PM – 8:30 PM)</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#1F1B1A] uppercase tracking-wide mb-1.5 flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5 text-[#C5A059]" />
            <span>Additional Requirements (Optional)</span>
          </label>
          <textarea
            rows={2}
            placeholder="e.g. Extra soup marrow bone, less fat, clean packaging, special cooking request, etc."
            value={additionalRequirements}
            onChange={(e) => setAdditionalRequirements(e.target.value)}
            className="w-full px-3.5 py-2 rounded-lg border border-[#D9D2C7] focus:border-[#6B121C] text-sm text-[#1F1B1A] bg-[#FAF8F5]/50"
          />
        </div>

        {isClosed && (
          <div className="p-3.5 rounded-xl bg-[#871924]/10 border border-[#871924]/30 text-xs text-[#6B121C] flex items-start gap-2.5">
            <AlertTriangle className="w-4 h-4 text-[#871924] shrink-0 mt-0.5" />
            <div>
              <strong className="block font-bold">Shop Closed Today — Advance Orders Accepted:</strong>
              {config.ANNOUNCEMENT_MESSAGE || 'The shop is closed today.'}{' '}
              {config.REOPENING_DATE && (
                <span>
                  Expected reopening:{' '}
                  <strong>
                    {config.REOPENING_DATE} {config.REOPENING_TIME ? `at ${config.REOPENING_TIME}` : ''}
                  </strong>
                  .
                </span>
              )}{' '}
              Your order will be queued for fresh preparation when we reopen.
            </div>
          </div>
        )}

        <div className="pt-2 flex flex-col sm:flex-row gap-3">
          <button
            type="submit"
            disabled={!isAvailable}
            className={`flex-1 inline-flex items-center justify-center gap-2 py-3.5 px-6 rounded-lg text-sm font-bold text-white shadow-md active:scale-[0.99] transition-all ${
              !isAvailable
                ? 'bg-gray-400 cursor-not-allowed opacity-60'
                : isClosed
                ? 'bg-[#871924] hover:bg-[#6B121C] cursor-pointer'
                : 'bg-[#1E7E34] hover:bg-[#155724] cursor-pointer'
            }`}
          >
            <MessageSquare className="w-4 h-4 text-white" />
            <span>
              {!isAvailable
                ? 'ITEM CURRENTLY UNAVAILABLE'
                : isClosed
                ? 'ORDER ON WHATSAPP (CLOSED TODAY)'
                : 'Order on WhatsApp & Save'}
            </span>
          </button>

          <button
            type="button"
            onClick={handleCopy}
            className="inline-flex items-center justify-center gap-1.5 py-3.5 px-4 rounded-lg text-xs font-semibold text-[#2D2726] bg-[#FAF8F5] border border-[#D9D2C7] hover:border-[#6B121C] hover:text-[#6B121C] transition-colors cursor-pointer"
            title="Copy preformatted order details to clipboard"
          >
            {copied ? <Check className="w-4 h-4 text-[#1E7E34]" /> : <Copy className="w-4 h-4 text-[#C5A059]" />}
            <span>{copied ? 'Copied Order!' : 'Copy Order Text'}</span>
          </button>
        </div>

        {formSubmitted && (
          <p className="text-center text-xs text-[#1E7E34] font-medium pt-1">
            ✓ Order saved to cloud database and WhatsApp message prepared. If WhatsApp didn't open automatically, click the button above again or use 'Copy Order Text'.
          </p>
        )}
      </form>
    </div>
  );
};
