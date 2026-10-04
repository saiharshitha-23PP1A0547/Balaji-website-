import React, { useState } from 'react';
import { Image as ImageIcon, Camera } from 'lucide-react';

interface PhotoSlotProps {
  src?: string | null;
  alt: string;
  slotLabel: string;
  slotSubtext?: string;
  aspectRatioClass?: string;
  className?: string;
  onClick?: () => void;
  priority?: boolean;
}

export const PhotoSlot: React.FC<PhotoSlotProps> = ({
  src,
  alt,
  slotLabel,
  slotSubtext,
  aspectRatioClass = 'aspect-4/3',
  className = '',
  onClick,
  priority = false,
}) => {
  const [hasError, setHasError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  const showImage = src && !hasError;

  return (
    <div
      onClick={onClick}
      className={`relative w-full ${aspectRatioClass} overflow-hidden rounded-xl bg-[#F3EFE8] border border-[#E8E2D8] ${
        onClick ? 'cursor-pointer group' : ''
      } ${className}`}
    >
      {showImage ? (
        <>
          <img
            src={src}
            alt={alt}
            loading={priority ? 'eager' : 'lazy'}
            decoding="async"
            onError={() => setHasError(true)}
            onLoad={() => setIsLoaded(true)}
            className={`w-full h-full object-cover object-center transition-all duration-300 ${
              isLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
            } group-hover:scale-105`}
          />
          {/* Subtle hover overlay if interactive */}
          {onClick && (
            <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <span className="text-white text-xs font-semibold px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-xs flex items-center gap-1.5">
                <Camera className="w-3.5 h-3.5" />
                <span>View / Update Photo</span>
              </span>
            </div>
          )}
        </>
      ) : (
        /* Tasteful Non-AI Archival Placeholder */
        <div className="w-full h-full flex flex-col items-center justify-center p-4 text-center border-2 border-dashed border-[#C5A059]/40 bg-[#FAF8F5]/80 hover:bg-[#FAF8F5] transition-colors">
          <div className="w-10 h-10 rounded-full bg-[#6B121C]/10 flex items-center justify-center text-[#6B121C] mb-2 group-hover:scale-110 transition-transform">
            <ImageIcon className="w-5 h-5 text-[#C5A059]" />
          </div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#6B121C]">
            {slotLabel}
          </span>
          {slotSubtext && (
            <span className="text-[10px] text-[#5A504D] mt-1 max-w-[220px] line-clamp-2">
              {slotSubtext}
            </span>
          )}
          <span className="text-[9px] text-[#8C7E7A] mt-1.5 font-medium">
            Ready for real photo upload
          </span>
        </div>
      )}
    </div>
  );
};
