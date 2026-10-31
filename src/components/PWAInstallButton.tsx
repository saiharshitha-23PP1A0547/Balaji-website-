import React, { useState } from 'react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { Download, Smartphone, X } from 'lucide-react';

export const PWAInstallButton: React.FC = () => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  // If already installed as PWA, don't show prompt
  if (isInstalled) {
    return null;
  }

  // If installable (Android Chrome / Desktop Chrome / Edge), show install button
  if (isInstallable) {
    return (
      <button
        onClick={install}
        className="flex items-center gap-1.5 rounded-full bg-[#70161E] px-3.5 py-1.5 text-xs font-semibold text-white shadow-md hover:bg-[#8A1C26] transition-all transform hover:scale-105"
        title="Install Balaji Mutton Shop App"
      >
        <Download className="w-3.5 h-3.5 animate-bounce" />
        <span>Install App</span>
      </button>
    );
  }

  // For iOS Safari or browsers where beforeinstallprompt hasn't fired yet, allow manual trigger or info
  if (isIOS) {
    return (
      <>
        <button
          onClick={() => setShowIOSGuide(true)}
          className="flex items-center gap-1.5 rounded-full border border-[#70161E]/30 bg-white px-3 py-1 text-xs font-medium text-[#70161E] hover:bg-[#70161E]/5 transition"
        >
          <Smartphone className="w-3.5 h-3.5" />
          <span>Install PWA</span>
        </button>

        {showIOSGuide && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
            <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl border border-[#70161E]/10">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-base font-bold text-[#70161E]">Install Balaji Mutton Shop</h3>
                <button
                  onClick={() => setShowIOSGuide(false)}
                  className="rounded-full p-1 text-gray-400 hover:bg-gray-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                To install this app on your iPhone or iPad:
              </p>
              <ol className="list-decimal list-inside text-sm text-gray-700 space-y-2 mb-5">
                <li>
                  Tap the <strong className="text-[#70161E]">Share</strong> button in your browser toolbar.
                </li>
                <li>
                  Scroll down and select <strong className="text-[#70161E]">Add to Home Screen</strong>.
                </li>
              </ol>
              <button
                onClick={() => setShowIOSGuide(false)}
                className="w-full rounded-xl bg-[#70161E] py-2.5 text-sm font-semibold text-white shadow-md hover:bg-[#8A1C26] transition"
              >
                Got it
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  return null;
};
