'use client';

import { useState, useEffect } from 'react';
import { useAdmin } from '@/contexts/AdminContext';
import { Save, Eye, Plus, X, Trash2, Upload, ImageIcon } from 'lucide-react';

export default function ServicesAdmin() {
  const { content, updateContent, loading } = useAdmin();
  const [servicesData, setServicesData] = useState<any>(null);
  const [saved, setSaved] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (content?.services) {
      setServicesData(content.services);
    }
  }, [content]);

  const handleSave = async () => {
    try {
      await updateContent({
        ...content,
        services: servicesData
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (error) {
      console.error('Save failed:', error);
      alert('Failed to save changes');
    }
  };

  const updatePackage = (index: number, field: string, value: any) => {
    const newPackages = [...servicesData.packages];
    newPackages[index] = { ...newPackages[index], [field]: value };
    
    // If setting mediaUrl, delete old fields
    if (field === 'mediaUrl' && value) {
      delete newPackages[index].imageUrl;
      delete newPackages[index].videoUrl;
    }
    
    setServicesData({ ...servicesData, packages: newPackages });
  };

  const updateFeature = (packageIndex: number, featureIndex: number, value: string) => {
    const newPackages = [...servicesData.packages];
    newPackages[packageIndex].features[featureIndex] = value;
    setServicesData({ ...servicesData, packages: newPackages });
  };

  const addFeature = (packageIndex: number) => {
    const newPackages = [...servicesData.packages];
    newPackages[packageIndex].features.push('New Feature');
    setServicesData({ ...servicesData, packages: newPackages });
  };

  const removeFeature = (packageIndex: number, featureIndex: number) => {
    const newPackages = [...servicesData.packages];
    newPackages[packageIndex].features = newPackages[packageIndex].features.filter((_: any, i: number) => i !== featureIndex);
    setServicesData({ ...servicesData, packages: newPackages });
  };

  const addPackage = () => {
    const packages = servicesData?.packages || [];
    const newId = Math.max(...packages.map((p: any) => p.id || 0), 0) + 1;
    const newPackage = {
      id: newId,
      name: 'New Package',
      tagline: 'Package tagline',
      description: 'Package description',
      mediaUrl: '/images/service.jpg',
      features: ['Feature 1'],
      featured: false
    };
    setServicesData({
      ...servicesData,
      packages: [...packages, newPackage]
    });
  };

  const deletePackage = (index: number) => {
    if (!confirm('Are you sure you want to delete this package?')) return;
    const packages = servicesData?.packages || [];
    const newPackages = packages.filter((_: any, i: number) => i !== index);
    setServicesData({ ...servicesData, packages: newPackages });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, packageIndex: number) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const isVideo = file.type.startsWith('video');
    const isImage = file.type.startsWith('image');
    const isGif = file.name.toLowerCase().endsWith('.gif') || file.type === 'image/gif';

    if (!isVideo && !isImage) {
      alert('Please upload an image, GIF, or video file');
      return;
    }

    if (file.size > 100 * 1024 * 1024) {
      alert('File size must be less than 100MB');
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('files', file);

      const response = await fetch('https://0jdbg6kb-5001.inc1.devtunnels.ms/api/media/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        },
        body: formData
      });

      if (!response.ok) throw new Error('Upload failed');

      const result = await response.json();
      const uploadedUrl = result.data[0].url;

      // Update package with single mediaUrl
      updatePackage(packageIndex, 'mediaUrl', uploadedUrl);

      alert('Media uploaded successfully!');
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  if (loading || !servicesData) {
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
          <h1 className="text-4xl font-serif text-[#2c2420] mb-2">Edit Services</h1>
          <p className="text-gray-600">Update service packages and pricing</p>
        </div>
        <button 
          onClick={handleSave}
          className="flex items-center gap-2 px-6 py-3 bg-[#a67b5b] text-white rounded hover:bg-[#946b4d] transition-colors"
        >
          <Save size={18} />
          {saved ? 'Saved!' : 'Save Changes'}
        </button>
      </div>

      {/* Hero Section */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 mb-6">
        <h2 className="text-xl font-serif text-[#2c2420] mb-4">Hero Section</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
            <input
              type="text"
              value={servicesData.hero.title}
              onChange={(e) => setServicesData({
                ...servicesData,
                hero: { ...servicesData.hero, title: e.target.value }
              })}
              className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:border-[#a67b5b]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Subtitle</label>
            <input
              type="text"
              value={servicesData.hero.subtitle}
              onChange={(e) => setServicesData({
                ...servicesData,
                hero: { ...servicesData.hero, subtitle: e.target.value }
              })}
              className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:border-[#a67b5b]"
            />
          </div>
        </div>
      </div>

      {/* Service Packages */}
      <div className="space-y-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-serif text-[#2c2420]">Service Packages</h2>
          <button
            onClick={addPackage}
            className="flex items-center gap-2 px-4 py-2 bg-[#a67b5b] text-white rounded hover:bg-[#946b4d] transition-colors"
          >
            <Plus size={18} />
            Add Package
          </button>
        </div>

        {servicesData.packages.map((pkg: any, index: number) => (
          <div key={pkg.id} className="bg-white p-6 rounded-lg shadow-sm border-2 border-gray-200 hover:border-[#a67b5b] transition-colors">
            <div className="flex justify-between items-start mb-4">
              <h3 className="font-serif text-xl text-[#2c2420]">Package {index + 1}</h3>
              <div className="flex gap-2">
                {pkg.featured && (
                  <span className="bg-[#a67b5b] text-white text-xs px-3 py-1 rounded">Featured</span>
                )}
                <button
                  onClick={() => deletePackage(index)}
                  className="text-red-500 hover:text-red-700 flex items-center gap-1"
                >
                  <Trash2 size={16} />
                  Delete
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                <input
                  type="text"
                  value={pkg.title}
                  onChange={(e) => updatePackage(index, 'title', e.target.value)}
                  className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:border-[#a67b5b]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Number</label>
                <input
                  type="text"
                  value={pkg.number}
                  onChange={(e) => updatePackage(index, 'number', e.target.value)}
                  className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:border-[#a67b5b]"
                />
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea
                value={pkg.description}
                onChange={(e) => updatePackage(index, 'description', e.target.value)}
                rows={3}
                className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:border-[#a67b5b]"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Media URL (Photo, Video, or GIF)</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={pkg.mediaUrl || pkg.imageUrl || pkg.videoUrl || ''}
                  onChange={(e) => updatePackage(index, 'mediaUrl', e.target.value)}
                  className="flex-1 border border-gray-300 rounded px-4 py-2 focus:outline-none focus:border-[#a67b5b]"
                  placeholder="/images/package.jpg or /videos/package.mp4"
                />
                <label className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded cursor-pointer hover:from-blue-600 hover:to-purple-700 transition-all">
                  <Upload size={16} />
                  Upload Media
                  <input
                    type="file"
                    accept="image/*,video/*,.gif"
                    onChange={(e) => handleImageUpload(e, index)}
                    disabled={uploading}
                    className="hidden"
                  />
                </label>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Upload photo, animated GIF, or video • Max 100MB
              </p>
              {(pkg.mediaUrl || pkg.imageUrl || pkg.videoUrl) && (
                <div className="mt-3 relative">
                  {(() => {
                    const url = pkg.mediaUrl || pkg.imageUrl || pkg.videoUrl || '';
                    const isVideo = url.match(/\.(mp4|webm|mov)$/i);
                    const isGif = url.toLowerCase().endsWith('.gif');
                    
                    if (isVideo) {
                      return (
                        <div className="relative">
                          <video src={url} className="h-32 w-auto rounded border" controls />
                          <span className="absolute top-2 right-2 bg-purple-500 text-white text-xs px-2 py-1 rounded">VIDEO</span>
                        </div>
                      );
                    } else if (isGif) {
                      return (
                        <div className="relative">
                          <img src={url} alt="Package preview" className="h-32 w-auto rounded border" />
                          <span className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded">GIF</span>
                        </div>
                      );
                    } else if (url.trim() !== '') {
                      return (
                        <div className="relative">
                          <img src={url} alt="Package preview" className="h-32 w-auto rounded border" />
                          <span className="absolute top-2 right-2 bg-blue-500 text-white text-xs px-2 py-1 rounded">PHOTO</span>
                        </div>
                      );
                    }
                    return null;
                  })()}
                </div>
              )}
            </div>

            <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-gray-700">Features</label>
                <button
                  onClick={() => addFeature(index)}
                  className="text-sm text-[#a67b5b] hover:text-[#946b4d] flex items-center gap-1"
                >
                  <Plus size={14} /> Add Feature
                </button>
              </div>
              <div className="space-y-2">
                {pkg.features.map((feature: string, featureIndex: number) => (
                  <div key={featureIndex} className="flex gap-2">
                    <input
                      type="text"
                      value={feature}
                      onChange={(e) => updateFeature(index, featureIndex, e.target.value)}
                      className="flex-1 border border-gray-300 rounded px-4 py-2 focus:outline-none focus:border-[#a67b5b]"
                    />
                    <button
                      onClick={() => removeFeature(index, featureIndex)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id={`featured-${index}`}
                checked={pkg.featured || false}
                onChange={(e) => updatePackage(index, 'featured', e.target.checked)}
                className="w-4 h-4 text-[#a67b5b] focus:ring-[#a67b5b]"
              />
              <label htmlFor={`featured-${index}`} className="text-sm text-gray-700">
                Mark as Featured Package
              </label>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
