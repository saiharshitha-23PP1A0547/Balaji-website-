/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { BusinessProvider, useBusiness } from './context/BusinessContext';
import { AdminAuthProvider } from './context/AdminAuthContext';
import { AdminProtectedRoute } from './components/admin/AdminProtectedRoute';
import { AdminLogin } from './components/admin/AdminLogin';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { Navbar } from './components/Navbar';
import { ShopStatusBanner } from './components/ShopStatusBanner';
import { Hero } from './components/Hero';
import { OurLegacy } from './components/OurLegacy';
import { FreshMutton } from './components/FreshMutton';
import { LiveGoats } from './components/LiveGoats';
import { LiveSheep } from './components/LiveSheep';
import { BulkOrders } from './components/BulkOrders';
import { WhyChooseUs } from './components/WhyChooseUs';
import { PhotoGallery } from './components/PhotoGallery';
import { Reviews } from './components/Reviews';
import { ContactLocation } from './components/ContactLocation';
import { Footer } from './components/Footer';
import { MobileStickyBar } from './components/MobileStickyBar';
import { OfflineIndicator } from './components/OfflineIndicator';

const StructuredDataSync: React.FC = () => {
  const { config } = useBusiness();

  useEffect(() => {
    document.title = 'Balaji Mutton Shop | 40+ Years of Trust & Tradition';

    let script = document.querySelector('script[type="application/ld+json"]');
    if (!script) {
      script = document.createElement('script');
      script.setAttribute('type', 'application/ld+json');
      document.head.appendChild(script);
    }
    const schema = {
      '@context': 'https://schema.org',
      '@type': 'ButcherShop',
      name: config.BUSINESS_NAME,
      image: 'https://balajimuttonshop.com/images/hero.jpg',
      url: 'https://balajimuttonshop.com',
      telephone: config.PHONE_NUMBER,
      priceRange: '₹₹',
      description:
        'Balaji Mutton Shop — a trusted 40+ year family legacy offering fresh mutton, live goats, live sheep, and special & bulk orders.',
      founder: {
        '@type': 'Person',
        name: config.FOUNDER,
      },
      employee: [
        {
          '@type': 'Person',
          name: 'Kamtekar Badrinath',
        },
        {
          '@type': 'Person',
          name: 'Kamtekar Shyam',
        },
      ],
      address: {
        '@type': 'PostalAddress',
        streetAddress: config.SHOP_ADDRESS,
        addressCountry: 'IN',
      },
    };
    script.textContent = JSON.stringify(schema, null, 2);
  }, [config]);

  return null;
};

// Customer-facing Public Website Component
const PublicWebsite: React.FC = () => {
  return (
    <>
      <StructuredDataSync />
      <div className="min-h-screen bg-[#FAF8F5] text-[#1F1B1A] flex flex-col font-sans selection:bg-[#6B121C] selection:text-[#FAF8F5]">
        {/* Sticky Header Navigation */}
        <Navbar />

        {/* Shop Status & Closure Announcement Banner (prominent on mobile & desktop) */}
        <ShopStatusBanner />

        {/* Main Content Sections */}
        <main className="flex-1">
          {/* Hero Section */}
          <Hero />

          {/* Our Legacy Section */}
          <OurLegacy />

          {/* Fresh Mutton & Order Calculator */}
          <FreshMutton />

          {/* Live Goats Section */}
          <LiveGoats />

          {/* Live Sheep Section */}
          <LiveSheep />

          {/* Special & Bulk Orders */}
          <BulkOrders />

          {/* Why Choose Us */}
          <WhyChooseUs />

          {/* Photo Gallery (Visual Archives & Operation Standards) */}
          <PhotoGallery />

          {/* Genuine Customer Reviews Structure */}
          <Reviews />

          {/* Location & Contact Section */}
          <ContactLocation />
        </main>

        {/* Global Footer */}
        <Footer />

        {/* Mobile Sticky Bottom Action Bar (CALL, WHATSAPP, ORDER, DIRECTIONS) */}
        <MobileStickyBar />

        {/* Offline Connectivity Status Notification */}
        <OfflineIndicator />
      </div>
    </>
  );
};

export default function App() {
  return (
    <BrowserRouter>
      <AdminAuthProvider>
        <BusinessProvider>
          <Routes>
            {/* Public Customer-Facing Website (No login required) */}
            <Route path="/" element={<PublicWebsite />} />

            {/* Private Admin Login Page */}
            <Route path="/admin/login" element={<AdminLogin />} />

            {/* Protected Private Admin Panel Dashboard */}
            <Route
              path="/admin"
              element={
                <AdminProtectedRoute>
                  <AdminDashboard />
                </AdminProtectedRoute>
              }
            />
            <Route
              path="/admin/*"
              element={
                <AdminProtectedRoute>
                  <AdminDashboard />
                </AdminProtectedRoute>
              }
            />

            {/* Catch-all redirect to public website */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BusinessProvider>
      </AdminAuthProvider>
    </BrowserRouter>
  );
}
