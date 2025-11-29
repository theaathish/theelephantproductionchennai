'use client';

import { useState, useEffect, useRef } from 'react';
import { useAdmin } from '@/contexts/AdminContext';
import { normalizeMediaUrl } from '@/lib/media';
import { Save, Eye, Upload, Plus, Trash2, Image as ImageIcon, Video, Film } from 'lucide-react';
import ImageEditor from '@/components/admin/ImageEditor';

export default function HomePageAdmin() {
  const { content, updateContent, loading } = useAdmin();
  const [homeData, setHomeData] = useState<any>(null);
  const [saved, setSaved] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [showImageEditor, setShowImageEditor] = useState(false);
  const [currentImage, setCurrentImage] = useState<string>('');
  const [editingField, setEditingField] = useState<{type: string, index?: number, field?: string} | null>(null);

  useEffect(() => {
    if (content?.home) {
      setHomeData(content.home);
    }
  }, [content]);

  const handleSave = async () => {
    try {
      await updateContent({
        ...content,
        home: homeData
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (error) {
      console.error('Save failed:', error);
      alert('Failed to save changes');
    }
  };

  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 100 * 1024 * 1024) {
      alert('File size must be less than 100MB');
      return;
    }

    setUploading(true);
    try {
      // For now, store in public folder - in production use backend upload
      const videoUrl = `/hero-final.mp4`; // Default video
      updateHero('videoUrl', videoUrl);
      alert('Video updated! For custom videos, upload to /public folder and enter the path.');
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const updateHero = (field: string, value: string) => {
    setHomeData({
      ...homeData,
      hero: { ...homeData.hero, [field]: value }
    });
  };

  const updatePhilosophy = (field: string, value: string) => {
    setHomeData({
      ...homeData,
      philosophy: { ...homeData.philosophy, [field]: value }
    });
  };

  const updateStory = (index: number, field: string, value: string) => {
    const stories = homeData?.latestJournals?.stories || [];
    const newStories = [...stories];
    newStories[index] = { ...newStories[index], [field]: value };
    // Clear old fields when updating mediaUrl
    if (field === 'mediaUrl') {
      delete newStories[index].imageUrl;
      delete newStories[index].videoUrl;
    }
    setHomeData({
      ...homeData,
      latestJournals: { ...homeData.latestJournals, stories: newStories }
    });
  };

  const addStory = () => {
    const stories = homeData?.latestJournals?.stories || [];
    const newId = Math.max(...stories.map((s: any) => s.id || 0), 0) + 1;
    const newStory = {
      id: newId,
      title: 'New Story',
      subtitle: 'Subtitle',
      mediaUrl: '/images/portfolio1.jpg'
    };
    setHomeData({
      ...homeData,
      latestJournals: { 
        ...homeData.latestJournals, 
        stories: [...stories, newStory] 
      }
    });
  };

  const deleteStory = (index: number) => {
    if (!confirm('Are you sure you want to delete this story?')) return;
    const stories = homeData?.latestJournals?.stories || [];
    const newStories = stories.filter((_: any, i: number) => i !== index);
    setHomeData({
      ...homeData,
      latestJournals: { ...homeData.latestJournals, stories: newStories }
    });
  };

  const handleMediaUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: string, index?: number, field?: string) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const isImage = file.type.startsWith('image');
    const isGif = file.name.toLowerCase().endsWith('.gif') || file.type === 'image/gif';

    if (!isImage) {
      alert('Please upload an image or GIF file only. For videos, use YouTube links.');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      alert('File size must be less than 10MB');
      return;
    }

    setUploading(true);
    try {
      // Step 1: Upload original image to server first
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

      setUploading(false);

      // Step 2: Handle based on file type
      if (isGif) {
        // GIFs go directly without cropping
        if (type === 'hero') {
          updateHero(field || 'imageUrl', uploadedUrl);
        } else if (type === 'philosophy') {
          updatePhilosophy(field || 'imageUrl', uploadedUrl);
        } else if (type === 'story' && index !== undefined) {
          updateStory(index, field || 'mediaUrl', uploadedUrl);
        } else if (type === 'thumbnail' && index !== undefined) {
          updateStory(index, 'thumbnailUrl', uploadedUrl);
        }
      } else {
        // Step 3: Open editor with uploaded image URL
        setCurrentImage(uploadedUrl);
        setEditingField({ type, index, field: field || (type === 'thumbnail' ? 'thumbnailUrl' : 'imageUrl') });
        setShowImageEditor(true);
      }
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Upload failed. Please try again.');
      setUploading(false);
    }
  };

  const applyCroppedImage = async (croppedImageDataUrl: string) => {
    if (!editingField) return;
    
    const { type, index, field } = editingField;
    
    setShowImageEditor(false);
    setUploading(true);
    
    try {
      // Step 4: Convert base64 data URL to blob
      const base64Response = await fetch(croppedImageDataUrl);
      const blob = await base64Response.blob();
      
      if (!blob || blob.size === 0) {
        throw new Error('Failed to create image blob');
      }

      // Step 5: Upload cropped image to server
      const formData = new FormData();
      formData.append('files', blob, `cropped-${Date.now()}.jpg`);

      const uploadResponse = await fetch('https://0jdbg6kb-5001.inc1.devtunnels.ms/api/media/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        },
        body: formData
      });

      if (!uploadResponse.ok) {
        const errorData = await uploadResponse.json().catch(() => ({}));
        throw new Error(errorData.message || 'Upload failed');
      }

      const result = await uploadResponse.json();
      
      if (!result.success || !result.data || !result.data[0]) {
        throw new Error('Invalid response from server');
      }

      const uploadedUrl = result.data[0].url;

      // Step 6: Update the appropriate field with the cropped image URL
      if (type === 'hero') {
        updateHero('imageUrl', uploadedUrl);
      } else if (type === 'philosophy') {
        updatePhilosophy('imageUrl', uploadedUrl);
      } else if (type === 'story' && index !== undefined) {
        updateStory(index, field || 'mediaUrl', uploadedUrl);
      } else if (type === 'thumbnail' && index !== undefined) {
        updateStory(index, 'thumbnailUrl', uploadedUrl);
      }
      
      console.log('Image uploaded successfully:', uploadedUrl);
    } catch (error) {
      console.error('Failed to upload cropped image:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      alert(`Failed to crop image: ${errorMessage}\n\nPlease try again or check the console for details.`);
    } finally {
      setUploading(false);
      setEditingField(null);
    }
  };

  if (loading || !homeData) {
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
          <h1 className="text-4xl font-serif text-[#2c2420] mb-2">Edit Home Page</h1>
          <p className="text-gray-600">Update hero section, philosophy, and featured stories</p>
        </div>
        <div className="flex gap-3">
          {/*
          <button className="flex items-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors">
            <Eye size={18} />
            Preview
          </button>
          */}
          <button 
            onClick={handleSave}
            className="flex items-center gap-2 px-6 py-3 bg-[#a67b5b] text-white rounded hover:bg-[#946b4d] transition-colors"
          >
            <Save size={18} />
            {saved ? 'Saved!' : 'Save Changes'}
          </button>
        </div>
      </div>

      {/* Hero Section */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 mb-6">
        <h2 className="text-xl font-serif text-[#2c2420] mb-4">Hero Section</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Title Line 1</label>
            <input
              type="text"
              value={homeData.hero.title1}
              onChange={(e) => updateHero('title1', e.target.value)}
              className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:border-[#a67b5b]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Title Line 2</label>
            <input
              type="text"
              value={homeData.hero.title2}
              onChange={(e) => updateHero('title2', e.target.value)}
              className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:border-[#a67b5b]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">CTA Button Text</label>
            <input
              type="text"
              value={homeData.hero.ctaText}
              onChange={(e) => updateHero('ctaText', e.target.value)}
              className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:border-[#a67b5b]"
            />
          </div>
         {/* 
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Video URL</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={homeData.hero?.videoUrl || ''}
                onChange={(e) => updateHero('videoUrl', e.target.value)}
                className="flex-1 border border-gray-300 rounded px-4 py-2 focus:outline-none focus:border-[#a67b5b]"
                placeholder="/hero-final.mp4"
              />
              <label className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded cursor-pointer hover:bg-gray-200 transition-colors">
                <Upload size={18} />
                {uploading ? 'Uploading...' : 'Upload'}
                <input
                  type="file"
                  accept="video/*"
                  onChange={handleVideoUpload}
                  disabled={uploading}
                  className="hidden"
                />
              </label>
            </div>
            <p className="text-xs text-gray-500 mt-1">Upload video to /public folder or enter path directly</p>
          </div>
          */}
        </div>
      </div>

      {/* Philosophy Section */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 mb-6">
        <h2 className="text-xl font-serif text-[#2c2420] mb-4">Philosophy Section</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Badge Text</label>
            <input
              type="text"
              value={homeData.philosophy.badge}
              onChange={(e) => updatePhilosophy('badge', e.target.value)}
              className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:border-[#a67b5b]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Title Line 1</label>
            <input
              type="text"
              value={homeData.philosophy.title1}
              onChange={(e) => updatePhilosophy('title1', e.target.value)}
              className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:border-[#a67b5b]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Title Line 2</label>
            <input
              type="text"
              value={homeData.philosophy.title2}
              onChange={(e) => updatePhilosophy('title2', e.target.value)}
              className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:border-[#a67b5b]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <textarea
              value={homeData.philosophy.description}
              onChange={(e) => updatePhilosophy('description', e.target.value)}
              rows={4}
              className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:border-[#a67b5b]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Philosophy Image</label>
            <div className="space-y-3">
              {homeData.philosophy.imageUrl && (
                <div className="relative w-full h-64 rounded border overflow-hidden">
                  <img
                    src={normalizeMediaUrl(homeData.philosophy.imageUrl)}
                    alt="Philosophy"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={homeData.philosophy.imageUrl || ''}
                  onChange={(e) => updatePhilosophy('imageUrl', e.target.value)}
                  className="flex-1 border border-gray-300 rounded px-4 py-2 focus:outline-none focus:border-[#a67b5b]"
                  placeholder="/images/philosophy.jpg or paste URL"
                />
                <label className="flex items-center gap-2 px-4 py-2 bg-[#a67b5b] text-white rounded cursor-pointer hover:bg-[#946b4d] transition-colors">
                  <Upload size={18} />
                  {uploading ? 'Uploading...' : 'Upload'}
                  <input
                    type="file"
                    accept="image/*,.gif"
                    onChange={(e) => handleMediaUpload(e, 'philosophy', undefined, 'imageUrl')}
                    disabled={uploading}
                    className="hidden"
                  />
                </label>
              </div>
              <p className="text-xs text-gray-500">Upload image or GIF (Max 10MB) • Photos will be cropped to 16:9</p>
            </div>
          </div>
        </div>
      </div>

      {/* Latest Journals */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-serif text-[#2c2420]">Featured Stories</h2>
          <button
            onClick={addStory}
            className="flex items-center gap-2 px-4 py-2 bg-[#a67b5b] text-white rounded hover:bg-[#946b4d] transition-colors"
          >
            <Plus size={18} />
            Add Story
          </button>
        </div>
        
        <div className="space-y-6">
          {homeData?.latestJournals?.stories?.map((story: any, index: number) => (
            <div key={story.id} className="p-6 border-2 border-gray-200 rounded-lg hover:border-[#a67b5b] transition-colors">
              <div className="flex justify-between items-start mb-4">
                <h3 className="font-serif text-lg text-gray-900">Story {index + 1}</h3>
                <button
                  onClick={() => deleteStory(index)}
                  className="text-red-500 hover:text-red-700 flex items-center gap-1"
                >
                  <Trash2 size={16} />
                  Delete
                </button>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                  <input
                    type="text"
                    value={story.title}
                    onChange={(e) => updateStory(index, 'title', e.target.value)}
                    className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:border-[#a67b5b]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Subtitle</label>
                  <input
                    type="text"
                    value={story.subtitle}
                    onChange={(e) => updateStory(index, 'subtitle', e.target.value)}
                    className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:border-[#a67b5b]"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Media URL (YouTube Video Only)
                  </label>
                  <input
                    type="text"
                    value={story.mediaUrl || story.imageUrl || story.videoUrl || ''}
                    onChange={(e) => updateStory(index, 'mediaUrl', e.target.value)}
                    className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:border-[#a67b5b]"
                    placeholder="https://youtu.be/VIDEO_ID"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Paste YouTube link only • No file uploads
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Thumbnail (Photo or GIF)
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={story.thumbnailUrl || ''}
                      onChange={(e) => updateStory(index, 'thumbnailUrl', e.target.value)}
                      className="flex-1 border border-gray-300 rounded px-4 py-2 focus:outline-none focus:border-[#a67b5b]"
                      placeholder="/images/thumbnail.jpg"
                    />
                    <label className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded cursor-pointer hover:bg-green-600 transition-all">
                      <Upload size={16} />
                      Upload Thumbnail
                      <input
                        type="file"
                        accept="image/*,.gif"
                        onChange={(e) => handleMediaUpload(e, 'thumbnail', index)}
                        disabled={uploading}
                        className="hidden"
                      />
                    </label>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Upload photo or GIF thumbnail (Max 10MB). Shows before video plays (desktop). Mobile auto-plays video.
                  </p>
                  <div className="mt-3 flex gap-4">
                    {/* Media Preview */}
                    {(story.mediaUrl || story.imageUrl || story.videoUrl) && (
                      <div className="relative">
                        {(() => {
                          const url = story.mediaUrl || story.imageUrl || story.videoUrl || '';
                          const isYouTube = /(?:youtube\.com|youtu\.be)/.test(url);
                          const isGif = url.toLowerCase().endsWith('.gif');
                          
                          if (isYouTube) {
                            return (
                              <div className="relative">
                                <div className="h-32 w-56 rounded border bg-gray-100 flex items-center justify-center">
                                  <div className="text-center">
                                    <div className="text-red-600 font-bold mb-1">▶ YouTube</div>
                                    <div className="text-xs text-gray-600">High Quality</div>
                                  </div>
                                </div>
                                <span className="absolute top-2 right-2 bg-red-600 text-white text-xs px-2 py-1 rounded">YOUTUBE</span>
                              </div>
                            );
                          } else if (isGif) {
                            return (
                              <div className="relative">
                                <img src={url} alt="Preview" className="h-32 w-auto rounded border" />
                                <span className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded">GIF</span>
                              </div>
                            );
                          } else if (url.trim() !== '') {
                            return (
                              <div className="relative">
                                <img src={url} alt="Preview" className="h-32 w-auto rounded border" />
                                <span className="absolute top-2 right-2 bg-blue-500 text-white text-xs px-2 py-1 rounded">PHOTO</span>
                              </div>
                            );
                          }
                          return null;
                        })()}
                      </div>
                    )}
                    
                    {/* Thumbnail Preview */}
                    {story.thumbnailUrl && (
                      <div className="relative">
                        <img src={story.thumbnailUrl} alt="Thumbnail" className="h-32 w-auto rounded border" />
                        <span className="absolute top-2 right-2 bg-purple-600 text-white text-xs px-2 py-1 rounded">THUMBNAIL</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Image Editor Modal */}
      {showImageEditor && currentImage && (
        <ImageEditor
          imageUrl={currentImage}
          onSave={applyCroppedImage}
          onCancel={() => {
            setShowImageEditor(false);
            setEditingField(null);
          }}
          aspectRatio={16 / 9}
        />
      )}
    </div>
  );
}
