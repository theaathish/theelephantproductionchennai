'use client';

import { useState, useEffect } from 'react';
import { useAdmin } from '@/contexts/AdminContext';
import { Save, Plus, Trash2, Upload } from 'lucide-react';

export default function StoriesAdmin() {
  const { content, updateContent, loading } = useAdmin();
  const [storiesData, setStoriesData] = useState<any>(null);
  const [saved, setSaved] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (content?.stories) {
      setStoriesData(content.stories);
    }
  }, [content]);

  const handleSave = async () => {
    try {
      await updateContent({
        ...content,
        stories: storiesData
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (error) {
      console.error('Save failed:', error);
      alert('Failed to save changes');
    }
  };

  const updateStory = (index: number, field: string, value: string) => {
    const newItems = [...storiesData.items];
    newItems[index] = { ...newItems[index], [field]: value };
    
    // If setting mediaUrl, delete old fields
    if (field === 'mediaUrl' && value) {
      delete newItems[index].imageUrl;
      delete newItems[index].videoUrl;
    }
    
    setStoriesData({ ...storiesData, items: newItems });
  };

  const addStory = () => {
    const newStory = {
      id: Date.now(),
      type: 'photo',
      title: 'New Story',
      subtitle: 'Location • City',
      mediaUrl: '/images/placeholder.jpg',
      featured: false
    };
    setStoriesData({
      ...storiesData,
      items: [...storiesData.items, newStory]
    });
  };

  const deleteStory = (index: number) => {
    const newItems = storiesData.items.filter((_: any, i: number) => i !== index);
    setStoriesData({ ...storiesData, items: newItems });
  };

  const handleThumbnailUpload = async (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const isImage = file.type.startsWith('image');
    if (!isImage) {
      alert('Please upload an image or GIF file only');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      alert('File size must be less than 10MB');
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

      updateStory(index, 'thumbnailUrl', uploadedUrl);
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  if (loading || !storiesData) {
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
          <h1 className="text-4xl font-serif text-[#2c2420] mb-2">Manage Stories</h1>
          <p className="text-gray-600">Add, edit, or remove portfolio items</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={addStory}
            className="flex items-center gap-2 px-6 py-3 bg-[#2c2420] text-white rounded hover:bg-[#3d342f] transition-colors"
          >
            <Plus size={18} />
            Add Story
          </button>
          <button 
            onClick={handleSave}
            className="flex items-center gap-2 px-6 py-3 bg-[#a67b5b] text-white rounded hover:bg-[#946b4d] transition-colors"
          >
            <Save size={18} />
            {saved ? 'Saved!' : 'Save Changes'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {storiesData.items.map((story: any, index: number) => (
          <div key={story.id} className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <div className="flex justify-between items-start mb-4">
              <h3 className="font-serif text-lg text-[#2c2420]">Story #{index + 1}</h3>
              <button
                onClick={() => deleteStory(index)}
                className="text-red-500 hover:text-red-700 transition-colors"
              >
                <Trash2 size={18} />
              </button>
            </div>

            <div className="space-y-4">
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

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                <select
                  value={story.type}
                  onChange={(e) => updateStory(index, 'type', e.target.value)}
                  className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:border-[#a67b5b]"
                >
                  <option value="photo">Photo</option>
                  <option value="film">Film</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Media URL (YouTube Video Only)</label>
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
                    {uploading ? 'Uploading...' : 'Upload Thumbnail'}
                    <input
                      type="file"
                      accept="image/*,.gif"
                      onChange={(e) => handleThumbnailUpload(e, index)}
                      disabled={uploading}
                      className="hidden"
                    />
                  </label>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Upload photo or GIF thumbnail (Max 10MB). Shows before video plays on desktop.
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

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id={`featured-${index}`}
                  checked={story.featured || false}
                  onChange={(e) => updateStory(index, 'featured', e.target.checked.toString())}
                  className="w-4 h-4 text-[#a67b5b] focus:ring-[#a67b5b]"
                />
                <label htmlFor={`featured-${index}`} className="text-sm text-gray-700">
                  Featured (Larger display)
                </label>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
