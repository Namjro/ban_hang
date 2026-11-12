'use client';

import { useEffect, useState } from 'react';
import { DEFAULT_SITE_SETTINGS } from '@/constants';
import { SiteSettings } from '@/lib/types';
import { settingsService } from '@/services';

export function useSiteSettings() {
  const [settings, setSettings] = useState<SiteSettings>(DEFAULT_SITE_SETTINGS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    settingsService
      .getPublicSettings()
      .then((res) => {
        if (!isMounted || !res.success || !res.data) return;
        setSettings({
          company: { ...DEFAULT_SITE_SETTINGS.company, ...res.data.company },
          hero: { ...DEFAULT_SITE_SETTINGS.hero, ...res.data.hero },
          trust_stats: { ...DEFAULT_SITE_SETTINGS.trust_stats, ...res.data.trust_stats },
          capabilities: { ...DEFAULT_SITE_SETTINGS.capabilities, ...res.data.capabilities },
          product_detail: { ...DEFAULT_SITE_SETTINGS.product_detail, ...res.data.product_detail },
        });
      })
      .catch(() => {
        // Keep DEFAULT_SITE_SETTINGS as resilient fallback
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return { settings, loading };
}
