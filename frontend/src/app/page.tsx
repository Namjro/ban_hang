import React from 'react';
import type { Metadata } from 'next';
import LandingHomeClient from '@/components/landing/LandingHomeClient';
import JsonLd from '@/components/seo/JsonLd';
import {
  buildHomeMetadata,
  buildOrganizationJsonLd,
  buildWebSiteJsonLd,
} from '@/lib/seo';
import {
  getServerPublicCategories,
  getServerSiteSettings,
} from '@/services/server-public.service';

export const dynamic = 'force-dynamic';

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getServerSiteSettings();
  return buildHomeMetadata(settings);
}

export default async function LandingHomePage() {
  const [settings, homeCategories] = await Promise.all([
    getServerSiteSettings(),
    getServerPublicCategories({ home: true }),
  ]);

  const organizationJsonLd = buildOrganizationJsonLd(settings.company);
  const webSiteJsonLd = buildWebSiteJsonLd(settings.company);

  return (
    <>
      <JsonLd data={organizationJsonLd} />
      <JsonLd data={webSiteJsonLd} />
      <LandingHomeClient
        initialSettings={settings}
        initialCategories={homeCategories}
      />
    </>
  );
}
