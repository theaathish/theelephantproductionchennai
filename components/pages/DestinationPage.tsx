'use client';

import { useState, useEffect } from 'react';
import { ASSETS } from '@/lib/assets';
import { normalizeMediaUrl } from '@/lib/media';
import { Reveal } from '@/components/animations/Reveal';
import { TextReveal } from '@/components/animations/TextReveal';
import { ParallaxImage } from '@/components/animations/ParallaxImage';
import { Globe } from 'lucide-react';
import Image from 'next/image';

interface DestinationPageProps {
  setPage: (page: string) => void;
}

interface DestinationData {
  hero: {
    badge: string;
    title: string;
    mediaUrl: string;
  };
  sectionTitle: string;
  places: Array<{
    id: number;
    name: string;
  }>;
}

export const DestinationPage = ({ setPage }: DestinationPageProps) => {
  const [content, setContent] = useState<DestinationData | null>(null);

  useEffect(() => {
    console.log('DestinationPage: Fetching from:', `${process.env.NEXT_PUBLIC_API_URL}/content`);
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/content`)
      .then(res => res.json())
      .then(result => {
        console.log('DestinationPage: API Response:', result);
        // API returns { success: true, data: {...} }
        const data = result.data || result;
        console.log('DestinationPage: Content data:', data);
        console.log('DestinationPage: Destination data:', data.destination);
        if (data.destination) {
          setContent(data.destination);
          console.log('DestinationPage: Content set:', data.destination);
        } else {
          console.warn('DestinationPage: No destination data found');
        }
      })
      .catch(error => console.error('DestinationPage: Error fetching:', error));
  }, []);

  const badge = content?.hero?.badge || 'World Ready';
  const title = content?.hero?.title || 'Beyond Boundaries';
  const mediaUrl = content?.hero?.mediaUrl || ASSETS.destination;
  const sectionTitle = content?.sectionTitle || 'Common Destinations';
  const places = content?.places?.length ? content.places : [
    { id: 1, name: 'Udaipur' },
    { id: 2, name: 'Jaipur' },
    { id: 3, name: 'Goa' },
    { id: 4, name: 'Mahabalipuram' },
    { id: 5, name: 'Kerala' },
    { id: 6, name: 'Bali' },
    { id: 7, name: 'Thailand' },
    { id: 8, name: 'Dubai' },
    { id: 9, name: 'Singapore' },
    { id: 10, name: 'Italy' },
    { id: 11, name: 'France' },
    { id: 12, name: 'Turkey' }
  ];

  // Normalize the media URL to use correct backend domain
  const imageUrl = normalizeMediaUrl(mediaUrl);

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 pt-24">
      <div className="relative h-[80vh] overflow-hidden flex items-center justify-center">
        <div className="absolute inset-0 bg-black/40 z-10"></div>
        {mediaUrl && (
          <img 
            src={imageUrl}
            alt="Destination"
            className="absolute inset-0 w-full h-full object-cover"
          />
        )}
        <div className="relative z-20 text-center text-white max-w-5xl px-6">
          <Reveal>
            <div className="inline-flex items-center gap-2 border border-white/30 px-4 py-1 rounded-full mb-8 backdrop-blur-md">
              <Globe size={14} className="text-[#a67b5b]" />
              <span className="text-[10px] uppercase tracking-widest">{badge}</span>
            </div>
          </Reveal>
          <div className="overflow-hidden">
            <TextReveal className="text-6xl md:text-9xl font-serif mb-6">{title}</TextReveal>
          </div>
        </div>
      </div>

      <section className="py-32 bg-[#2c2420] text-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-serif mb-16 text-[#a67b5b]">{sectionTitle}</h2>
          <div className="flex flex-wrap justify-center gap-4">
            {places.map((place, i) => (
              <Reveal key={place.id} delay={i * 30}>
                <div className="px-8 py-4 border border-white/10 hover:bg-[#a67b5b] hover:border-[#a67b5b] hover:scale-105 transition-all duration-300 cursor-default uppercase tracking-widest text-xs interactive">
                  {place.name}
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
