'use client';

import { useEffect, useState } from 'react';

interface PreloaderProps {
  onComplete: () => void;
}

export const Preloader = ({ onComplete }: PreloaderProps) => {
  const [videoEnded, setVideoEnded] = useState(false);

  useEffect(() => {
    // Fallback timer in case video fails to load
    const fallbackTimer = setTimeout(() => {
      setVideoEnded(true);
      onComplete();
    }, 5000);

    return () => clearTimeout(fallbackTimer);
  }, [onComplete]);

  const handleVideoEnd = () => {
    setVideoEnded(true);
    onComplete();
  };

  if (videoEnded) return null;

  return (
    <div className="fixed inset-0 z-[200] bg-black flex items-center justify-center">
      <video 
        autoPlay 
        muted 
        playsInline
        onEnded={handleVideoEnd}
        className="w-full h-full object-cover"
      >
        <source src="/hero.mp4" type="video/mp4" />
      </video>
    </div>
  );
};
