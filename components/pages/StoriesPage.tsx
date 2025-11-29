'use client';

import { useState, useEffect } from 'react';
import { ASSETS } from '@/lib/assets';
import { TextReveal } from '@/components/animations/TextReveal';
import { MediaCard } from '@/components/cards/MediaCard';
import { useAdmin } from '@/contexts/AdminContext';

export const StoriesPage = () => {
  const { content } = useAdmin();
  const [activeFilmIndex, setActiveFilmIndex] = useState(0);
  const [isAutoPlayPaused, setIsAutoPlayPaused] = useState(false);

  // Featured films for carousel (only featured items)
  const films = content?.stories?.items?.filter((item: any) => item.featured === true) || [];
  // All stories for grid
  const allStories = content?.stories?.items || [];

  // Auto-advance to next film every 8 seconds (only if not paused)
  useEffect(() => {
    if (films.length === 0 || isAutoPlayPaused) return;
    
    const interval = setInterval(() => {
      setActiveFilmIndex((prev) => (prev + 1) % films.length);
    }, 8000); // 8 seconds per video

    return () => clearInterval(interval);
  }, [films.length, isAutoPlayPaused]);

  // Handle user interaction - pause auto-play
  const handleFilmInteraction = (index: number) => {
    setActiveFilmIndex(index);
    setIsAutoPlayPaused(true);
  };

  // Handle clicking outside - resume auto-play
  const handleOutsideClick = () => {
    setIsAutoPlayPaused(false);
  };

  return (
  <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 pt-24">
    <div className="container mx-auto px-6 py-24 text-center">
       <TextReveal className="text-7xl md:text-9xl font-serif text-[#2c2420] mb-20">{content?.stories?.hero?.title || 'The Journal'}</TextReveal>
    </div>

    {/* Auto-Playing Films Carousel */}
    {films.length > 0 && (
      <div className="mb-32 overflow-hidden">
        <div className="container mx-auto px-6 mb-8">
          <h2 className="text-3xl font-serif text-[#2c2420]">Featured Films</h2>
        </div>
        
        <div 
          className="relative h-[70vh] flex items-center justify-center gap-4 px-6"
          onMouseLeave={handleOutsideClick}
        >
          {/* Pause Message Overlay */}
          {isAutoPlayPaused && (
            <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-30 px-6 py-3 bg-black/70 backdrop-blur-sm rounded-full text-white text-sm">
              Auto-play paused • Move mouse away to resume
            </div>
          )}

          {films.map((film: any, index: number) => {
            const isActive = index === activeFilmIndex;
            const offset = index - activeFilmIndex;
            
            return (
              <div
                key={film.id || index}
                onClick={() => handleFilmInteraction(index)}
                onMouseEnter={() => setIsAutoPlayPaused(true)}
                className={`absolute transition-all duration-700 ease-out cursor-pointer ${
                  isActive 
                    ? 'w-[70vw] md:w-[60vw] lg:w-[50vw] h-[70vh] z-20 scale-100 opacity-100' 
                    : 'w-[30vw] md:w-[25vw] lg:w-[20vw] h-[50vh] z-10 scale-90 opacity-60 hover:opacity-80'
                }`}
                style={{
                  transform: `translateX(${offset * (isActive ? 0 : offset > 0 ? 400 : -400)}px)`,
                }}
              >
                <MediaCard 
                  mediaUrl={film.mediaUrl || film.imageUrl || film.videoUrl || ''} 
                  thumbnailUrl={film.thumbnailUrl}
                  title={film.title} 
                  subtitle={film.subtitle} 
                  className="w-full h-full"
                />
              </div>
            );
          })}
        </div>

        {/* Progress Indicators */}
        <div className="flex justify-center gap-2 mt-8">
          {films.map((_: any, index: number) => (
            <button
              key={index}
              onClick={(e) => {
                e.stopPropagation();
                handleFilmInteraction(index);
              }}
              className={`h-1 rounded-full transition-all duration-300 ${
                index === activeFilmIndex ? 'w-12 bg-[#a67b5b]' : 'w-8 bg-gray-300'
              }`}
            />
          ))}
        </div>
      </div>
    )}

    {/* Normal Grid - All Stories */}
    <div className="container mx-auto px-6 pb-24">
      <h2 className="text-3xl font-serif text-[#2c2420] mb-12 text-center">All Stories</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {allStories.map((item: any, index: number) => (
          <div key={item.id || index} className="aspect-square">
            <MediaCard 
              mediaUrl={item.mediaUrl || item.imageUrl || item.videoUrl || ''} 
              thumbnailUrl={item.thumbnailUrl}
              title={item.title} 
              subtitle={item.subtitle} 
              className="w-full h-full" 
            />
          </div>
        ))}
      </div>
    </div>

    <style jsx global>{`
      .scrollbar-hide::-webkit-scrollbar {
        display: none;
      }
      .scrollbar-hide {
        -ms-overflow-style: none;
        scrollbar-width: none;
      }
    `}</style>
  </div>
  );
};
