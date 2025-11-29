'use client';

import { useState, useEffect } from 'react';
import { useAdmin } from '@/contexts/AdminContext';
import { Save, Upload, X } from 'lucide-react';

export default function AboutAdmin() {
  const { content, updateContent, loading } = useAdmin();
  const [aboutData, setAboutData] = useState<any>(null);
  const [saved, setSaved] = useState(false);
  const [uploading, setUploading] = useState(false);

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

  const updateStat = (index: number, field: string, value: string) => {
    const stats = aboutData?.stats?.items || [];
    const newStats = [...stats];
    newStats[index] = { ...newStats[index], [field]: value };
    setAboutData({
      ...aboutData,
      stats: { ...aboutData.stats, items: newStats }
    });
  };

  const updateApproachListItem = (index: number, value: string) => {
    const list = aboutData?.approach?.list || [];
    const newList = [...list];
    newList[index] = value;
    setAboutData({
      ...aboutData,
      approach: { ...aboutData.approach, list: newList }
    });
  };

  const handleImageUpload = async (file: File, field: 'hero' | 'philosophy' | 'testimonial' | 'approach') => {
    setUploading(true);
    const formData = new FormData();
    formData.append('files', file); // Backend expects 'files' field name

    try {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        throw new Error('Not authenticated');
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/media/upload`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Upload failed');
      }

      const data = await response.json();
      // Backend returns array of uploaded files
      const imageUrl = data.data[0].url;

      if (field === 'hero') {
        setAboutData({
          ...aboutData,
          hero: { ...aboutData.hero, imageUrl }
        });
      } else if (field === 'philosophy') {
        setAboutData({
          ...aboutData,
          philosophy: { ...aboutData.philosophy, imageUrl }
        });
      } else if (field === 'testimonial') {
        setAboutData({
          ...aboutData,
          testimonial: { ...aboutData.testimonial, backgroundImageUrl: imageUrl }
        });
      } else if (field === 'approach') {
        setAboutData({
          ...aboutData,
          approach: { ...aboutData.approach, imageUrl }
        });
      }
    } catch (error) {
      console.error('Upload error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to upload image';
      alert(errorMessage);
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (field: 'hero' | 'philosophy' | 'testimonial' | 'approach') => {
    if (field === 'hero') {
      setAboutData({
        ...aboutData,
        hero: { ...aboutData.hero, imageUrl: '' }
      });
    } else if (field === 'philosophy') {
      setAboutData({
        ...aboutData,
        philosophy: { ...aboutData.philosophy, imageUrl: '' }
      });
    } else if (field === 'testimonial') {
      setAboutData({
        ...aboutData,
        testimonial: { ...aboutData.testimonial, backgroundImageUrl: '' }
      });
    } else if (field === 'approach') {
      setAboutData({
        ...aboutData,
        approach: { ...aboutData.approach, imageUrl: '' }
      });
    }
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
          <div className="space-y-4">
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
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Hero Background Image</label>
              
              {aboutData.hero.imageUrl ? (
                <div className="relative inline-block">
                  <img 
                    src={aboutData.hero.imageUrl} 
                    alt="Hero" 
                    className="w-full max-w-md h-48 object-cover rounded border border-gray-300"
                  />
                  <button
                    onClick={() => removeImage('hero')}
                    className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                  >
                    <X size={16} />
                  </button>
                </div>
              ) : (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-[#a67b5b] transition-colors">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleImageUpload(file, 'hero');
                    }}
                    className="hidden"
                    id="hero-image-upload"
                    disabled={uploading}
                  />
                  <label
                    htmlFor="hero-image-upload"
                    className={`cursor-pointer flex flex-col items-center gap-2 ${uploading ? 'opacity-50' : ''}`}
                  >
                    <Upload size={32} className="text-gray-400" />
                    <span className="text-sm text-gray-600">
                      {uploading ? 'Uploading...' : 'Click to upload hero image'}
                    </span>
                    <span className="text-xs text-gray-400">PNG, JPG up to 10MB</span>
                  </label>
                </div>
              )}
              
              <p className="text-xs text-gray-500 mt-2">Recommended size: 1920x1080px. This image appears as the hero background on the about page.</p>
            </div>
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

        {/* Philosophy Section */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <h2 className="text-xl font-serif text-[#2c2420] mb-4">Philosophy Section</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Badge</label>
              <input
                type="text"
                value={aboutData?.philosophy?.badge || ''}
                onChange={(e) => setAboutData({
                  ...aboutData,
                  philosophy: { ...aboutData.philosophy, badge: e.target.value }
                })}
                className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:border-[#a67b5b]"
                placeholder="e.g., A NATURAL CONNECTION"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Title 1</label>
              <input
                type="text"
                value={aboutData?.philosophy?.title1 || ''}
                onChange={(e) => setAboutData({
                  ...aboutData,
                  philosophy: { ...aboutData.philosophy, title1: e.target.value }
                })}
                className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:border-[#a67b5b]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Title 2 (Italic)</label>
              <input
                type="text"
                value={aboutData?.philosophy?.title2 || ''}
                onChange={(e) => setAboutData({
                  ...aboutData,
                  philosophy: { ...aboutData.philosophy, title2: e.target.value }
                })}
                className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:border-[#a67b5b]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea
                value={aboutData?.philosophy?.description || ''}
                onChange={(e) => setAboutData({
                  ...aboutData,
                  philosophy: { ...aboutData.philosophy, description: e.target.value }
                })}
                rows={4}
                className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:border-[#a67b5b]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Philosophy Image</label>
              
              {aboutData?.philosophy?.imageUrl ? (
                <div className="relative inline-block">
                  <img 
                    src={aboutData.philosophy.imageUrl} 
                    alt="Philosophy" 
                    className="w-full max-w-md h-48 object-cover rounded border border-gray-300"
                  />
                  <button
                    onClick={() => removeImage('philosophy')}
                    className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                  >
                    <X size={16} />
                  </button>
                </div>
              ) : (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-[#a67b5b] transition-colors">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleImageUpload(file, 'philosophy');
                    }}
                    className="hidden"
                    id="philosophy-image-upload"
                    disabled={uploading}
                  />
                  <label
                    htmlFor="philosophy-image-upload"
                    className={`cursor-pointer flex flex-col items-center gap-2 ${uploading ? 'opacity-50' : ''}`}
                  >
                    <Upload size={32} className="text-gray-400" />
                    <span className="text-sm text-gray-600">
                      {uploading ? 'Uploading...' : 'Click to upload philosophy image'}
                    </span>
                    <span className="text-xs text-gray-400">PNG, JPG up to 10MB</span>
                  </label>
                </div>
              )}
              
              <p className="text-xs text-gray-500 mt-2">Recommended size: 800x1200px. This image appears in the philosophy section.</p>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <h2 className="text-xl font-serif text-[#2c2420] mb-4">Stats Section</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[0, 1, 2, 3, 4].map((index) => (
              <div key={index} className="border border-gray-200 rounded p-4">
                <h3 className="text-sm font-medium text-gray-700 mb-3">Stat {index + 1}</h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Label</label>
                    <input
                      type="text"
                      value={aboutData?.stats?.items?.[index]?.label || ''}
                      onChange={(e) => updateStat(index, 'label', e.target.value)}
                      className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#a67b5b]"
                      placeholder="e.g., HAPPY COUPLES"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Value</label>
                    <input
                      type="text"
                      value={aboutData?.stats?.items?.[index]?.value || ''}
                      onChange={(e) => updateStat(index, 'value', e.target.value)}
                      className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#a67b5b]"
                      placeholder="e.g., 2,200"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Description</label>
                    <input
                      type="text"
                      value={aboutData?.stats?.items?.[index]?.description || ''}
                      onChange={(e) => updateStat(index, 'description', e.target.value)}
                      className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#a67b5b]"
                      placeholder="Optional italic text"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Testimonial Section */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <h2 className="text-xl font-serif text-[#2c2420] mb-4">Testimonial Section</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Quote</label>
              <textarea
                value={aboutData?.testimonial?.quote || ''}
                onChange={(e) => setAboutData({
                  ...aboutData,
                  testimonial: { ...aboutData.testimonial, quote: e.target.value }
                })}
                rows={3}
                className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:border-[#a67b5b]"
                placeholder="e.g., A TRUE WORK OF ART"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Author Name</label>
              <input
                type="text"
                value={aboutData?.testimonial?.author || ''}
                onChange={(e) => setAboutData({
                  ...aboutData,
                  testimonial: { ...aboutData.testimonial, author: e.target.value }
                })}
                className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:border-[#a67b5b]"
                placeholder="e.g., ALEXIS"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Background Image</label>
              
              {aboutData?.testimonial?.backgroundImageUrl ? (
                <div className="relative inline-block">
                  <img 
                    src={aboutData.testimonial.backgroundImageUrl} 
                    alt="Testimonial Background" 
                    className="w-full max-w-md h-48 object-cover rounded border border-gray-300"
                  />
                  <button
                    onClick={() => removeImage('testimonial')}
                    className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                  >
                    <X size={16} />
                  </button>
                </div>
              ) : (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-[#a67b5b] transition-colors">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleImageUpload(file, 'testimonial');
                    }}
                    className="hidden"
                    id="testimonial-image-upload"
                    disabled={uploading}
                  />
                  <label
                    htmlFor="testimonial-image-upload"
                    className={`cursor-pointer flex flex-col items-center gap-2 ${uploading ? 'opacity-50' : ''}`}
                  >
                    <Upload size={32} className="text-gray-400" />
                    <span className="text-sm text-gray-600">
                      {uploading ? 'Uploading...' : 'Click to upload background image'}
                    </span>
                    <span className="text-xs text-gray-400">PNG, JPG up to 10MB</span>
                  </label>
                </div>
              )}
              
              <p className="text-xs text-gray-500 mt-2">Recommended size: 1920x800px. This image appears as a subtle background behind the testimonial quote.</p>
            </div>
          </div>
        </div>

        {/* Approach Section */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <h2 className="text-xl font-serif text-[#2c2420] mb-4">Approach Section</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Title 1</label>
              <input
                type="text"
                value={aboutData?.approach?.title1 || ''}
                onChange={(e) => setAboutData({
                  ...aboutData,
                  approach: { ...aboutData.approach, title1: e.target.value }
                })}
                className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:border-[#a67b5b]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Title 2 (Italic)</label>
              <input
                type="text"
                value={aboutData?.approach?.title2 || ''}
                onChange={(e) => setAboutData({
                  ...aboutData,
                  approach: { ...aboutData.approach, title2: e.target.value }
                })}
                className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:border-[#a67b5b]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea
                value={aboutData?.approach?.description || ''}
                onChange={(e) => setAboutData({
                  ...aboutData,
                  approach: { ...aboutData.approach, description: e.target.value }
                })}
                rows={4}
                className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:border-[#a67b5b]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Approach Image</label>
              
              {aboutData?.approach?.imageUrl ? (
                <div className="relative inline-block">
                  <img 
                    src={aboutData.approach.imageUrl} 
                    alt="Approach" 
                    className="w-full max-w-md h-48 object-cover rounded border border-gray-300"
                  />
                  <button
                    onClick={() => removeImage('approach')}
                    className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                  >
                    <X size={16} />
                  </button>
                </div>
              ) : (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-[#a67b5b] transition-colors">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleImageUpload(file, 'approach');
                    }}
                    className="hidden"
                    id="approach-image-upload"
                    disabled={uploading}
                  />
                  <label
                    htmlFor="approach-image-upload"
                    className={`cursor-pointer flex flex-col items-center gap-2 ${uploading ? 'opacity-50' : ''}`}
                  >
                    <Upload size={32} className="text-gray-400" />
                    <span className="text-sm text-gray-600">
                      {uploading ? 'Uploading...' : 'Click to upload approach image'}
                    </span>
                    <span className="text-xs text-gray-400">PNG, JPG up to 10MB</span>
                  </label>
                </div>
              )}
              
              <p className="text-xs text-gray-500 mt-2">Recommended size: 800x1200px. This image appears in the approach section.</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">List Items</label>
              {[0, 1, 2, 3].map((index) => (
                <input
                  key={index}
                  type="text"
                  value={aboutData?.approach?.list?.[index] || ''}
                  onChange={(e) => updateApproachListItem(index, e.target.value)}
                  className="w-full border border-gray-300 rounded px-4 py-2 mb-2 focus:outline-none focus:border-[#a67b5b]"
                  placeholder={`List item ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
