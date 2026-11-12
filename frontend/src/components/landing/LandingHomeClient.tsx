'use client';

import React, { useState } from 'react';
import Navbar from '@/components/landing/Navbar';
import Hero from '@/components/landing/Hero';
import TrustBar from '@/components/landing/TrustBar';
import ProductCategories from '@/components/landing/ProductCategories';
import QuickSpecTable from '@/components/landing/QuickSpecTable';
import WarehouseCapabilities from '@/components/landing/WarehouseCapabilities';
import QuoteRequestForm from '@/components/landing/QuoteRequestForm';
import Footer from '@/components/landing/Footer';
import FloatingContactBubble from '@/components/landing/FloatingContactBubble';
import ContactModal from '@/components/landing/ContactModal';
import { Category, SiteSettings } from '@/lib/types';

interface LandingHomeClientProps {
  initialSettings: SiteSettings;
  initialCategories: Category[];
}

export default function LandingHomeClient({
  initialSettings,
  initialCategories,
}: LandingHomeClientProps) {
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);
  const settings = initialSettings;
  const homeCategories = initialCategories;

  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc] text-[#0b132b]">
      {/* Top Navbar */}
      <Navbar onOpenQuoteModal={() => setIsQuoteModalOpen(true)} />

      {/* Main Sections */}
      <main className="flex-1">
        <Hero
          onOpenQuoteModal={() => setIsQuoteModalOpen(true)}
          settings={settings.hero}
        />
        <TrustBar settings={settings.trust_stats} />
        <ProductCategories categories={homeCategories} />
        <QuickSpecTable onOpenQuoteModal={() => setIsQuoteModalOpen(true)} />
        <WarehouseCapabilities settings={settings.capabilities} />
        <QuoteRequestForm company={settings.company} />
      </main>

      {/* Footer */}
      <Footer company={settings.company} categories={homeCategories} />

      {/* Floating CTA Bubble & Modal */}
      <FloatingContactBubble onClick={() => setIsQuoteModalOpen(true)} />
      <ContactModal
        isOpen={isQuoteModalOpen}
        onClose={() => setIsQuoteModalOpen(false)}
      />
    </div>
  );
}
