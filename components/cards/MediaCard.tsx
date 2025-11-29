'use client';

import { useRef, useState, useEffect } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { isYouTubeUrl, getYouTubeEmbedUrl, getYouTubeThumbnail } from '@/lib/youtube';

interface MediaCardProps {
  mediaUrl: string;
  thumbnailUrl?: string; // Custom thumbnail for videos/YouTube
  title: string;
  subtitle: string;
  className?: string;
  autoPlay?: boolean; // Force video to load immediately (for carousels)
}

export const MediaCard = ({ mediaUrl, thumbnailUrl, title, subtitle, className = "", autoPlay = false }: MediaCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout>();

  // Detect mobile on mount
  useEffect(() => {
    setIsMobile(/iPhone|iPad|iPod|Android/i.test(navigator.userAgent));
  }, []);

  // Determine media type from URL
  const isYouTube = isYouTubeUrl(mediaUrl);
  // Always use autoplay for smooth hover experience (muted so it's allowed)
  const youtubeEmbedUrl = isYouTube ? getYouTubeEmbedUrl(mediaUrl, true) : null;
  const defaultYoutubeThumbnail = isYouTube ? getYouTubeThumbnail(mediaUrl) : null;
  
  const isVideo = mediaUrl && mediaUrl.match(/\.(mp4|webm|mov)$/i);
  const isGif = mediaUrl && mediaUrl.toLowerCase().endsWith('.gif');
  const isImage = mediaUrl && !isVideo && !isGif && !isYouTube;

  // Use custom thumbnail if provided, otherwise use YouTube's or none
  const displayThumbnail = thumbnailUrl || (isYouTube ? defaultYoutubeThumbnail : null);

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setIsHovered(true);
      if (isVideo && videoRef.current) {
        videoRef.current.play().catch(() => {});
      }
    }, 200);
  };

  const handleMouseLeave = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsHovered(false);
    if (isVideo && videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  };

  return (
    <div 
      className={`relative group overflow-hidden cursor-pointer interactive ${className}`} 
      onMouseEnter={handleMouseEnter} 
      onMouseLeave={handleMouseLeave}
    >
      {/* YouTube Video */}
      {isYouTube && youtubeEmbedUrl && (
        <>
          {/* Thumbnail (shown when not hovered on desktop, hidden on mobile/autoPlay) */}
          {displayThumbnail && !isMobile && !autoPlay && (
            <img 
              src={displayThumbnail} 
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 z-[6] pointer-events-none ${
                isHovered ? 'opacity-0' : 'opacity-100'
              }`}
              alt={title} 
              loading="lazy" 
            />
          )}
          {/* YouTube Embed - loads immediately on mobile/autoPlay, on hover for desktop */}
          <iframe
            src={isMobile || autoPlay ? youtubeEmbedUrl : (isHovered ? youtubeEmbedUrl : '')}
            className={`absolute inset-0 w-full h-full transition-opacity duration-500 z-[5] ${
              isMobile || autoPlay ? 'opacity-100' : (isHovered ? 'opacity-100' : 'opacity-0')
            }`}
            allow="autoplay; encrypted-media; picture-in-picture"
            allowFullScreen
            style={{ border: 'none', pointerEvents: isHovered || isMobile || autoPlay ? 'auto' : 'none' }}
            title={title}
          />
        </>
      )}

      {/* Image or GIF */}
      {(isImage || isGif) && (
        <img 
          src={mediaUrl} 
          className={`w-full h-full object-cover transition-all duration-300 ${
            isHovered && !isVideo ? 'scale-110' : 'scale-100'
          }`}
          alt={title} 
          loading="lazy" 
        />
      )}

      {/* Video */}
      {isVideo && (
        <video 
          ref={videoRef} 
          src={mediaUrl} 
          muted 
          loop 
          playsInline 
          preload="none" 
          className="w-full h-full object-cover"
        />
      )}

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-300 z-10"></div>

      {/* Title and Subtitle */}
      <div className="absolute bottom-0 left-0 w-full p-8 text-white z-20 translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
         <h3 className="font-serif text-3xl mb-1">{title}</h3>
         <p className="text-xs uppercase tracking-widest opacity-80 flex items-center gap-2">
           {subtitle} <ArrowUpRight size={12} />
         </p>
      </div>
    </div>
  );
};
