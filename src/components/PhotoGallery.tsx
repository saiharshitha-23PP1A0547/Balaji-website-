import React, { useState } from 'react';
import { useBusiness } from '../context/BusinessContext';
import { GALLERY_ITEMS, GalleryItem } from '../config/businessConfig';
import { X, Sparkles, Camera } from 'lucide-react';
import { PhotoSlot } from './PhotoSlot';

export const PhotoGallery: React.FC = () => {
  const { photos, getWhatsAppLink } = useBusiness();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activeModalItem, setActiveModalItem] = useState<GalleryItem | null>(null);

  const categories = ['All', 'Heritage', 'Shop', 'Craft', 'Livestock', 'Events'];

  const filteredItems =
    selectedCategory === 'All'
      ? GALLERY_ITEMS
      : GALLERY_ITEMS.filter((item) => item.category === selectedCategory);

  return (
    <section id="gallery" className="py-16 lg:py-24 bg-[#FAF8F5] border-b border-[#E8E2D8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#6B121C]/10 text-[#6B121C] text-xs font-bold uppercase tracking-wider mb-3">
            <span>Visual Archives & Operations</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif-display font-bold text-[#1F1B1A] mb-3">
            Photo Gallery
          </h2>
          <p className="text-base sm:text-lg text-[#5A504D]">
            A documented view of our family heritage, clean butcher shop standards, and healthy livestock selection.
          </p>
          <p className="text-xs text-[#8C7E7A] mt-2 italic">
            *All gallery frames responsively display your genuine high-resolution shop and livestock photographs without stretching or distortion.
          </p>
        </div>

        {/* Category Filter Controls */}
        <div className="flex flex-wrap items-center justify-center gap-1.5 p-1 bg-[#F3EFE8] rounded-xl max-w-lg mx-auto mb-10 border border-[#E8E2D8]">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-[#6B121C] text-white shadow-xs'
                  : 'text-[#5A504D] hover:text-[#1F1B1A]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* 11 Items Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              onClick={() => setActiveModalItem(item)}
              className="bg-white rounded-xl border border-[#E8E2D8] hover:border-[#C5A059] hover:shadow-md transition-all duration-200 overflow-hidden cursor-pointer group flex flex-col justify-between"
            >
              <div>
                {/* Visual Image / Placeholder Frame */}
                <div className="p-3 pb-0">
                  <PhotoSlot
                    src={photos[item.imageKey]}
                    alt={item.altText}
                    slotLabel={`Slot #${item.number} · ${item.title}`}
                    slotSubtext={item.category}
                    aspectRatioClass="aspect-4/3"
                  />
                </div>

                <div className="p-4">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-bold text-[#1F1B1A]">{item.title}</span>
                    <span className="text-[10px] text-[#C5A059] font-semibold">{item.category}</span>
                  </div>
                  <p className="text-xs text-[#5A504D] line-clamp-2">
                    {item.description}
                  </p>
                </div>
              </div>

              <div className="px-4 pb-4 pt-1 border-t border-[#F3EFE8] flex items-center justify-between text-[11px] text-[#8C7E7A]">
                <span>{photos[item.imageKey] ? 'Real Photograph' : 'Photo Placeholder'}</span>
                <span className="text-[#6B121C] group-hover:underline flex items-center gap-1">
                  <span>View Details</span>
                  <span>→</span>
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Modal for inspect / replacing instructions */}
        {activeModalItem && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-[#FAF8F5] rounded-2xl max-w-lg w-full p-6 sm:p-8 border border-[#C5A059] shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
              <button
                type="button"
                onClick={() => setActiveModalItem(null)}
                className="absolute top-4 right-4 p-2 text-[#5A504D] hover:text-[#1F1B1A] bg-white rounded-full border border-[#E8E2D8] cursor-pointer"
                aria-label="Close modal"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="mb-4">
                <PhotoSlot
                  src={photos[activeModalItem.imageKey]}
                  alt={activeModalItem.altText}
                  slotLabel={activeModalItem.placeholderLabel}
                  slotSubtext={activeModalItem.description}
                  aspectRatioClass="aspect-16/10"
                />
              </div>

              <span className="text-xs font-bold text-[#6B121C] uppercase tracking-wider block mb-1">
                Gallery Slot #{activeModalItem.number} · {activeModalItem.category}
              </span>
              <h3 className="text-xl sm:text-2xl font-serif-display font-bold text-[#1F1B1A] mb-2">
                {activeModalItem.title}
              </h3>
              <p className="text-sm text-[#4A4240] leading-relaxed mb-6">
                {activeModalItem.description}
              </p>

              <div className="flex gap-2">
                <a
                  href={getWhatsAppLink(`Hello Balaji Mutton Shop, I am enquiring regarding your gallery display: ${activeModalItem.title} (#${activeModalItem.number})`).url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-2.5 px-4 bg-[#6B121C] text-white rounded-lg text-xs font-semibold hover:bg-[#4A0B10] transition-colors text-center"
                >
                  Enquire on WhatsApp
                </a>
                <button
                  type="button"
                  onClick={() => setActiveModalItem(null)}
                  className="py-2.5 px-4 bg-white border border-[#D9D2C7] text-[#1F1B1A] rounded-lg text-xs font-semibold hover:bg-[#F3EFE8] transition-colors cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

