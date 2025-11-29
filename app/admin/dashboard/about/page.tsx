'use client';

import { useState, useEffect } from 'react';
import { useAdmin } from '@/contexts/AdminContext';
import { Save } from 'lucide-react';

export default function AboutAdmin() {
  const { content, updateContent, loading } = useAdmin();
  const [aboutData, setAboutData] = useState<any>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (content?.about) {
      setAboutData(content.about);
    }
  }, [content]);

  const handleSave = async () => {
    try {
      await updateContent({
        ...content,
        about: aboutData
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (error) {
      console.error('Save failed:', error);
      alert('Failed to save changes');
    }
  };

  const updateFeature = (index: number, field: string, value: string) => {
    const features = aboutData?.content?.features || [];
    const newFeatures = [...features];
    newFeatures[index] = { ...newFeatures[index], [field]: value };
    setAboutData({
      ...aboutData,
      content: { ...aboutData.content, features: newFeatures }
    });
  };

  if (loading || !aboutData) {
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
          <h1 className="text-4xl font-serif text-[#2c2420] mb-2">Edit About Page</h1>
          <p className="text-gray-600">Update your story and team information</p>
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
        {/* Hero Section */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <h2 className="text-xl font-serif text-[#2c2420] mb-4">Hero Section</h2>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
            <input
              type="text"
              value={aboutData.hero.title}
              onChange={(e) => setAboutData({
                ...aboutData,
                hero: { ...aboutData.hero, title: e.target.value }
              })}
              className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:border-[#a67b5b]"
            />
          </div>
        </div>

        {/* Content Section */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <h2 className="text-xl font-serif text-[#2c2420] mb-4">Content Section</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Section Title</label>
              <input
                type="text"
                value={aboutData.content.title}
                onChange={(e) => setAboutData({
                  ...aboutData,
                  content: { ...aboutData.content, title: e.target.value }
                })}
                className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:border-[#a67b5b]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea
                value={aboutData.content.description}
                onChange={(e) => setAboutData({
                  ...aboutData,
                  content: { ...aboutData.content, description: e.target.value }
                })}
                rows={4}
                className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:border-[#a67b5b]"
              />
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <h2 className="text-xl font-serif text-[#2c2420] mb-4">Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {aboutData?.content?.features?.map((feature: any, index: number) => (
              <div key={index} className="border border-gray-200 rounded p-4">
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                    <input
                      type="text"
                      value={feature.title}
                      onChange={(e) => updateFeature(index, 'title', e.target.value)}
                      className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:border-[#a67b5b]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                    <textarea
                      value={feature.description}
                      onChange={(e) => updateFeature(index, 'description', e.target.value)}
                      rows={3}
                      className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:border-[#a67b5b]"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
