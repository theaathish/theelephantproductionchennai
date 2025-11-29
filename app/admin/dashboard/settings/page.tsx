'use client';

import { useState, useEffect } from 'react';
import { useAdmin } from '@/contexts/AdminContext';
import { Save } from 'lucide-react';

export default function SettingsAdmin() {
  const { content, updateContent, loading } = useAdmin();
  const [siteData, setSiteData] = useState<any>(null);
  const [footerData, setFooterData] = useState<any>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (content) {
      setSiteData(content.site || {});
      setFooterData(content.footer || {});
    }
  }, [content]);

  const handleSave = async () => {
    try {
      await updateContent({
        ...content,
        site: siteData,
        footer: footerData
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (error) {
      console.error('Save failed:', error);
      alert('Failed to save changes');
    }
  };

  if (loading || !siteData || !footerData) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-serif text-[#2c2420] mb-2">Site Settings</h1>
          <p className="text-gray-600">Configure global site settings</p>
        </div>
        <button 
          onClick={handleSave}
          className="flex items-center gap-2 px-6 py-3 bg-[#a67b5b] text-white rounded hover:bg-[#946b4d] transition-colors"
        >
          <Save size={18} />
          {saved ? 'Saved!' : 'Save Changes'}
        </button>
      </div>

      <div className="space-y-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <h2 className="text-xl font-serif text-[#2c2420] mb-4">Site Information</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Site Title</label>
              <input
                type="text"
                value={siteData.title}
                onChange={(e) => setSiteData({ ...siteData, title: e.target.value })}
                className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:border-[#a67b5b]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Site Subtitle (Location)</label>
              <input
                type="text"
                value={siteData.subtitle}
                onChange={(e) => setSiteData({ ...siteData, subtitle: e.target.value })}
                className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:border-[#a67b5b]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Booking Tagline</label>
              <input
                type="text"
                value={siteData.tagline}
                onChange={(e) => setSiteData({ ...siteData, tagline: e.target.value })}
                className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:border-[#a67b5b]"
              />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <h2 className="text-xl font-serif text-[#2c2420] mb-4">Footer Information</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Footer Title</label>
              <input
                type="text"
                value={footerData.title}
                onChange={(e) => setFooterData({ ...footerData, title: e.target.value })}
                className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:border-[#a67b5b]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Footer Subtitle</label>
              <input
                type="text"
                value={footerData.subtitle}
                onChange={(e) => setFooterData({ ...footerData, subtitle: e.target.value })}
                className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:border-[#a67b5b]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Copyright Text</label>
              <input
                type="text"
                value={footerData.copyright}
                onChange={(e) => setFooterData({ ...footerData, copyright: e.target.value })}
                className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:border-[#a67b5b]"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
