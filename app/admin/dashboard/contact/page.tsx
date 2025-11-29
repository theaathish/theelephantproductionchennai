'use client';

import { useState, useEffect } from 'react';
import { useAdmin } from '@/contexts/AdminContext';
import { Save } from 'lucide-react';

export default function ContactAdmin() {
  const { content, updateContent, loading } = useAdmin();
  const [contactData, setContactData] = useState<any>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (content?.contact) {
      setContactData(content.contact);
    }
  }, [content]);

  const handleSave = async () => {
    try {
      await updateContent({
        ...content,
        contact: contactData
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (error) {
      console.error('Save failed:', error);
      alert('Failed to save changes');
    }
  };

  if (loading || !contactData) {
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
          <h1 className="text-4xl font-serif text-[#2c2420] mb-2">Edit Contact Page</h1>
          <p className="text-gray-600">Update contact information and messaging</p>
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
          <h2 className="text-xl font-serif text-[#2c2420] mb-4">Hero Section</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
              <input
                type="text"
                value={contactData.hero.title}
                onChange={(e) => setContactData({
                  ...contactData,
                  hero: { ...contactData.hero, title: e.target.value }
                })}
                className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:border-[#a67b5b]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea
                value={contactData.hero.description}
                onChange={(e) => setContactData({
                  ...contactData,
                  hero: { ...contactData.hero, description: e.target.value }
                })}
                rows={3}
                className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:border-[#a67b5b]"
              />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <h2 className="text-xl font-serif text-[#2c2420] mb-4">Contact Details</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
              <input
                type="text"
                value={contactData.details.phone}
                onChange={(e) => setContactData({
                  ...contactData,
                  details: { ...contactData.details, phone: e.target.value }
                })}
                className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:border-[#a67b5b]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
              <input
                type="email"
                value={contactData.details.email}
                onChange={(e) => setContactData({
                  ...contactData,
                  details: { ...contactData.details, email: e.target.value }
                })}
                className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:border-[#a67b5b]"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
