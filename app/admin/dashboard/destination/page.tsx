'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Save, Plus, X, Upload, Image as ImageIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { normalizeMediaUrl } from '@/lib/media';
import Image from 'next/image';

interface Place {
  id: number;
  name: string;
}

interface DestinationContent {
  hero: {
    badge: string;
    title: string;
    mediaUrl: string;
  };
  sectionTitle: string;
  places: Place[];
}

export default function DestinationAdmin() {
  const [content, setContent] = useState<DestinationContent>({
    hero: {
      badge: '',
      title: '',
      mediaUrl: ''
    },
    sectionTitle: '',
    places: []
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      console.log('Fetching from:', `${process.env.NEXT_PUBLIC_API_URL}/content`);
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/content`);
      console.log('Response status:', response.status);
      const result = await response.json();
      console.log('Fetched result:', result);
      
      // API returns { success: true, data: {...} }
      const data = result.data || result;
      console.log('Content data:', data);
      console.log('Destination data:', data.destination);
      
      if (data.destination) {
        setContent(data.destination);
        console.log('Content set successfully:', data.destination);
      } else {
        console.warn('No destination data found in response');
      }
    } catch (error) {
      console.error('Fetch error:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch content',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/content`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        },
        body: JSON.stringify({
          destination: content
        }),
      });

      if (response.ok) {
        toast({
          title: 'Success',
          description: 'Destination content updated successfully'
        });
      } else {
        throw new Error('Failed to save');
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save content',
        variant: 'destructive'
      });
    } finally {
      setSaving(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('files', file);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/media/upload`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        },
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        const uploadedUrl = result.data[0].url;
        setContent(prev => ({
          ...prev,
          hero: {
            ...prev.hero,
            mediaUrl: uploadedUrl
          }
        }));
        toast({
          title: 'Success',
          description: 'Image uploaded successfully'
        });
      } else {
        throw new Error('Upload failed');
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to upload image',
        variant: 'destructive'
      });
    } finally {
      setUploading(false);
    }
  };

  const addPlace = () => {
    const newId = content.places.length > 0 
      ? Math.max(...content.places.map(p => p.id)) + 1 
      : 1;
    
    setContent(prev => ({
      ...prev,
      places: [...prev.places, { id: newId, name: '' }]
    }));
  };

  const updatePlace = (id: number, name: string) => {
    setContent(prev => ({
      ...prev,
      places: prev.places.map(place => 
        place.id === id ? { ...place, name } : place
      )
    }));
  };

  const removePlace = (id: number) => {
    setContent(prev => ({
      ...prev,
      places: prev.places.filter(place => place.id !== id)
    }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  const imageUrl = normalizeMediaUrl(content.hero.mediaUrl);

  return (
    <div className="container mx-auto py-8 max-w-4xl">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Destination Page</h1>
          <p className="text-muted-foreground mt-2">
            Manage hero section and destination places
          </p>
        </div>
        <Button onClick={handleSave} disabled={saving}>
          {saving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Save Changes
            </>
          )}
        </Button>
      </div>

      <div className="space-y-6">
        {/* Hero Section */}
        <Card>
          <CardHeader>
            <CardTitle>Hero Section</CardTitle>
            <CardDescription>Main banner content</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="badge">Badge Text</Label>
              <Input
                id="badge"
                value={content.hero.badge}
                onChange={(e) => setContent(prev => ({
                  ...prev,
                  hero: { ...prev.hero, badge: e.target.value }
                }))}
                placeholder="e.g., World Ready"
              />
            </div>

            <div>
              <Label htmlFor="title">Main Title</Label>
              <Input
                id="title"
                value={content.hero.title}
                onChange={(e) => setContent(prev => ({
                  ...prev,
                  hero: { ...prev.hero, title: e.target.value }
                }))}
                placeholder="e.g., Beyond Boundaries"
              />
            </div>

            <div>
              <Label>Hero Image</Label>
              <div className="mt-2 space-y-4">
                {content.hero.mediaUrl && (
                  <div className="relative w-full h-64 rounded-lg overflow-hidden border">
                    <Image
                      src={imageUrl}
                      alt="Hero"
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
                <div className="flex gap-2">
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={uploading}
                    className="hidden"
                    id="hero-upload"
                  />
                  <Button
                    variant="outline"
                    onClick={() => document.getElementById('hero-upload')?.click()}
                    disabled={uploading}
                  >
                    {uploading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Uploading...
                      </>
                    ) : (
                      <>
                        <Upload className="mr-2 h-4 w-4" />
                        Upload Image
                      </>
                    )}
                  </Button>
                  {content.hero.mediaUrl && (
                    <Input
                      value={content.hero.mediaUrl}
                      onChange={(e) => setContent(prev => ({
                        ...prev,
                        hero: { ...prev.hero, mediaUrl: e.target.value }
                      }))}
                      placeholder="Or paste image URL"
                      className="flex-1"
                    />
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Destinations Section */}
        <Card>
          <CardHeader>
            <CardTitle>Destinations Section</CardTitle>
            <CardDescription>Section title and places list</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="sectionTitle">Section Title</Label>
              <Input
                id="sectionTitle"
                value={content.sectionTitle}
                onChange={(e) => setContent(prev => ({
                  ...prev,
                  sectionTitle: e.target.value
                }))}
                placeholder="e.g., Common Destinations"
              />
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <Label>Destination Places</Label>
                <Button onClick={addPlace} size="sm" variant="outline">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Place
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {content.places.map((place, index) => (
                  <div key={place.id} className="flex gap-2 items-center">
                    <Input
                      value={place.name}
                      onChange={(e) => updatePlace(place.id, e.target.value)}
                      placeholder={`Place ${index + 1}`}
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removePlace(place.id)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>

              {content.places.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-8">
                  No places added yet. Click "Add Place" to get started.
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
