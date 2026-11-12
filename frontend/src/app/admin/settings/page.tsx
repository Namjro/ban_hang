'use client';

import React, { useEffect, useState } from 'react';
import { Building2, Sparkles, BarChart3, Warehouse, FileCheck2, Loader2 } from 'lucide-react';
import { DEFAULT_SITE_SETTINGS } from '@/constants';
import { SiteSettingGroup, SiteSettings } from '@/lib/types';
import { settingsService } from '@/services';
import { getApiErrorMessage } from '@/lib/error-handler';
import { useToast } from '@/components/ui/Toast';
import CompanySettingsForm from '@/components/admin/settings/CompanySettingsForm';
import HeroSettingsForm from '@/components/admin/settings/HeroSettingsForm';
import TrustStatsForm from '@/components/admin/settings/TrustStatsForm';
import CapabilitiesSettingsForm from '@/components/admin/settings/CapabilitiesSettingsForm';
import ProductDetailSettingsForm from '@/components/admin/settings/ProductDetailSettingsForm';

const TABS: { key: SiteSettingGroup; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { key: 'company', label: 'Thông Tin Công Ty', icon: Building2 },
  { key: 'hero', label: 'Hero Trang Chủ', icon: Sparkles },
  { key: 'trust_stats', label: 'Chỉ Số Tin Cậy', icon: BarChart3 },
  { key: 'capabilities', label: 'Kho & Năng Lực', icon: Warehouse },
  { key: 'product_detail', label: 'Trang Chi Tiết SP', icon: FileCheck2 },
];

export default function AdminSettingsPage() {
  const toast = useToast();
  const [activeTab, setActiveTab] = useState<SiteSettingGroup>('company');
  const [settings, setSettings] = useState<SiteSettings>(DEFAULT_SITE_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    settingsService
      .getPublicSettings()
      .then((res) => {
        if (isMounted && res.success && res.data) {
          setSettings({
            company: { ...DEFAULT_SITE_SETTINGS.company, ...res.data.company },
            hero: { ...DEFAULT_SITE_SETTINGS.hero, ...res.data.hero },
            trust_stats: { ...DEFAULT_SITE_SETTINGS.trust_stats, ...res.data.trust_stats },
            capabilities: { ...DEFAULT_SITE_SETTINGS.capabilities, ...res.data.capabilities },
            product_detail: { ...DEFAULT_SITE_SETTINGS.product_detail, ...res.data.product_detail },
          });
        }
      })
      .catch((err: unknown) => {
        if (isMounted) {
          toast.error(getApiErrorMessage(err, 'Không thể tải cấu hình website.'));
        }
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSaveGroup = async <K extends SiteSettingGroup>(
    group: K,
    payload: SiteSettings[K]
  ) => {
    setSaving(true);
    try {
      const res = await settingsService.updateAdminGroup(group, payload);
      if (res.success && res.data) {
        setSettings((prev) => ({ ...prev, [group]: res.data }));
        toast.success(res.message || 'Đã lưu cài đặt thành công.');
      }
    } catch (err: unknown) {
      toast.error(getApiErrorMessage(err, 'Không thể lưu cài đặt.'));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-[22px] font-bold text-[#0b132b]">Cài Đặt Website</h1>
        <p className="text-[13px] text-[#475569] mt-0.5">
          Quản lý nội dung hiển thị trên trang chủ, thông tin liên hệ và cấu hình trang chi tiết sản phẩm.
        </p>
      </div>

      <div className="bg-white border border-[#dce2ea] rounded-[8px] shadow-xs overflow-hidden">
        {/* Tabs */}
        <div className="flex border-b border-[#dce2ea] bg-[#f8fafc] overflow-x-auto">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveTab(tab.key)}
                className={`px-3.5 sm:px-5 py-3.5 min-h-[44px] text-[13px] font-semibold flex items-center gap-2 border-b-2 transition-colors whitespace-nowrap cursor-pointer ${
                  active
                    ? 'border-[#0b132b] text-[#0b132b] bg-white'
                    : 'border-transparent text-[#475569] hover:text-[#0b132b]'
                }`}
              >
                <Icon className="w-4 h-4 text-[#f59e0b] shrink-0" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Form Body */}
        <div className="p-4 sm:p-6">
          {loading ? (
            <div className="py-12 flex items-center justify-center gap-2.5 text-[#475569] text-[13px]">
              <Loader2 className="w-5 h-5 animate-spin text-[#0b132b]" />
              <span>Đang tải cấu hình...</span>
            </div>
          ) : (
            <>
              {activeTab === 'company' && (
                <CompanySettingsForm
                  initialData={settings.company}
                  saving={saving}
                  onSave={(data) => handleSaveGroup('company', data)}
                />
              )}
              {activeTab === 'hero' && (
                <HeroSettingsForm
                  initialData={settings.hero}
                  saving={saving}
                  onSave={(data) => handleSaveGroup('hero', data)}
                />
              )}
              {activeTab === 'trust_stats' && (
                <TrustStatsForm
                  initialData={settings.trust_stats}
                  saving={saving}
                  onSave={(data) => handleSaveGroup('trust_stats', data)}
                />
              )}
              {activeTab === 'capabilities' && (
                <CapabilitiesSettingsForm
                  initialData={settings.capabilities}
                  saving={saving}
                  onSave={(data) => handleSaveGroup('capabilities', data)}
                />
              )}
              {activeTab === 'product_detail' && (
                <ProductDetailSettingsForm
                  initialData={settings.product_detail}
                  saving={saving}
                  onSave={(data) => handleSaveGroup('product_detail', data)}
                />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
