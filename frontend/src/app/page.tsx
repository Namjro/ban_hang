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

export default function LandingHomePage() {
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc] text-[#0b132b]">
      {/* Top Navbar */}
      <Navbar onOpenQuoteModal={() => setIsQuoteModalOpen(true)} />

      {/* Main Sections */}
      <main className="flex-1">
        <Hero onOpenQuoteModal={() => setIsQuoteModalOpen(true)} />
        <TrustBar />
        <ProductCategories />
        <QuickSpecTable onOpenQuoteModal={() => setIsQuoteModalOpen(true)} />
        <WarehouseCapabilities />
        <QuoteRequestForm />
      </main>

      {/* Footer */}
      <Footer />

      {/* Floating CTA Bubble & Modal */}
      <FloatingContactBubble onClick={() => setIsQuoteModalOpen(true)} />
      <ContactModal
        isOpen={isQuoteModalOpen}
        onClose={() => setIsQuoteModalOpen(false)}
      />
    </div>
  );
}
