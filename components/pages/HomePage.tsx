'use client';

import { useState, useEffect } from 'react';
import { ASSETS } from '@/lib/assets';
import { normalizeMediaUrl } from '@/lib/media';
import { Reveal } from '@/components/animations/Reveal';
import { TextReveal } from '@/components/animations/TextReveal';
import { ParallaxImage } from '@/components/animations/ParallaxImage';
import { VideoCard } from '@/components/cards/VideoCard';
import { MediaCard } from '@/components/cards/MediaCard';
import { useAdmin } from '@/contexts/AdminContext';

interface HomePageProps {
  setPage: (page: string) => void;
}

export const HomePage = ({ setPage }: HomePageProps) => {
  const { content } = useAdmin();
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    // Show hero content after 5 seconds
    const timer = setTimeout(() => {
      setShowContent(true);
    }, 5000);
    return () => clearTimeout(timer);
  }, []);
  
  return (
  <div className="animate-in fade-in duration-500">
    <header className="relative h-screen w-full overflow-hidden flex items-center justify-center text-center bg-black">
      <div className="absolute inset-0 overflow-hidden">
          {/* Fallback gradient background */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#2c2420] via-[#3d3330] to-[#1a1512]"></div>
          
          {/* Video background */}
          <video 
            autoPlay
            loop 
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
            style={{ opacity: 0.9 }}
          >
            <source src="/hero-final.mp4" type="video/mp4" />
          </video>
          
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/80"></div>
      </div>
      <div className={`relative z-10 container px-4 transition-opacity duration-1000 ${showContent ? 'opacity-100' : 'opacity-0'}`}>
        <Reveal>
          <div className="inline-flex items-center gap-3 mb-8 border border-white/20 px-4 py-1 rounded-full backdrop-blur-sm">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
              <span className="text-white/90 text-[10px] tracking-[0.2em] uppercase">
                {content?.site?.tagline || 'Now Booking 2025-26'}
              </span>
          </div>
        </Reveal>
        <div className="overflow-hidden mb-12">
            <TextReveal type="word" className="text-5xl md:text-7xl lg:text-9xl text-white font-serif leading-[0.9] drop-shadow-2xl">
               {content?.home?.hero?.title1 || 'Your story,'}
            </TextReveal>
             <TextReveal type="word" delay={150} className="text-5xl md:text-7xl lg:text-9xl text-[#e8e0d9] font-serif leading-[0.9] drop-shadow-2xl italic opacity-90">
               {content?.home?.hero?.title2 || 'crafted with soul.'}
            </TextReveal>
        </div>
        <Reveal delay={300}>
            <div className="flex flex-col md:flex-row items-center justify-center gap-8 interactive">
              <button onClick={() => setPage('stories')} className="group relative px-12 py-5 bg-transparent border border-white/30 text-white overflow-hidden transition-all hover:border-white/0 rounded-sm">
                <span className="relative z-10 text-xs tracking-[0.3em] font-bold group-hover:text-[#2c2420] transition-colors duration-300">
                  {content?.home?.hero?.ctaText || 'VIEW PORTFOLIO'}
                </span>
                <div className="absolute inset-0 bg-white transform scale-y-0 group-hover:scale-y-100 transition-transform origin-bottom duration-300 ease-out"></div>
              </button>
            </div>
        </Reveal>
      </div>
    </header>

    <div className="bg-[#2c2420] py-6 overflow-hidden border-y border-white/5">
       <div className="flex gap-12 animate-marquee whitespace-nowrap text-[#e8e0d9]/20 font-serif text-4xl italic">
          <span>Cinematic •</span><span>Emotional •</span><span>Timeless •</span><span>Authentic •</span><span>Raw •</span><span>Cinematic •</span><span>Emotional •</span><span>Timeless •</span><span>Authentic •</span><span>Raw •</span>
       </div>
    </div>

    <section className="py-32 bg-[#fdfcf8]">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-24 items-center">
          <div className="relative group">
            <Reveal>
              <div className="w-full h-[700px] relative z-10 shadow-2xl overflow-hidden">
                <ParallaxImage 
                  src={normalizeMediaUrl(content?.home?.philosophy?.imageUrl) || ASSETS.about} 
                  alt="Philosophy" 
                  className="w-full h-full" 
                />
              </div>
            </Reveal>
            <div className="absolute -bottom-12 -right-12 z-20 hidden md:block">
               <div className="w-48 h-48 bg-[#2c2420] rounded-full flex items-center justify-center animate-spin-slow">
                  <svg viewBox="0 0 100 100" className="w-full h-full fill-white opacity-80 p-2">
                     <path id="curve" d="M 50 50 m -37 0 a 37 37 0 1 1 74 0 a 37 37 0 1 1 -74 0" fill="transparent" />
                     <text className="text-[11px] uppercase tracking-[0.35em]"><textPath href="#curve">The Elephant Productions • Est 2012 •</textPath></text>
                  </svg>
               </div>
            </div>
          </div>
          <div className="space-y-12">
            <Reveal delay={100}>
              <div className="flex items-center gap-4">
                <div className="h-[1px] w-12 bg-[#a67b5b]"></div>
                <span className="text-[#a67b5b] uppercase tracking-[0.3em] text-xs font-bold">
                  {content?.home?.philosophy?.badge || 'The Philosophy'}
                </span>
              </div>
            </Reveal>
            <div className="overflow-hidden">
               <TextReveal type="word" className="text-5xl md:text-6xl font-serif text-[#2c2420] leading-[1.1]">
                  {content?.home?.philosophy?.title1 || "We don't just capture moments."}
               </TextReveal>
               <TextReveal type="word" delay={150} className="text-5xl md:text-6xl font-serif text-[#a67b5b] italic leading-[1.1]">
                  {content?.home?.philosophy?.title2 || 'We bottle feelings.'}
               </TextReveal>
            </div>
            <Reveal delay={250}>
              <p className="text-gray-600 leading-loose font-light text-lg max-w-md">
                {content?.home?.philosophy?.description || 'Based in Chennai with roots in Singapore, we bring an international cinematic standard to South Indian celebrations. We trade stiff poses for messy, beautiful, real interactions.'}
              </p>
            </Reveal>
            <Reveal delay={300}>
              <button onClick={() => setPage('about')} className="group text-[#2c2420] text-sm uppercase tracking-widest font-bold flex items-center gap-4 interactive">
                {content?.home?.philosophy?.ctaText || 'Read Our Story'} <span className="group-hover:translate-x-2 transition-transform duration-200">→</span>
              </button>
            </Reveal>
          </div>
        </div>
      </div>
    </section>

    <section className="py-32 bg-[#e8e0d9]/20">
      <div className="container mx-auto px-6">
         <Reveal><h2 className="text-4xl md:text-6xl font-serif text-[#2c2420] text-center mb-20">{content?.home?.latestJournals?.title || 'Latest Journals'}</h2></Reveal>
         <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {content?.home?.latestJournals?.stories?.map((story: any, index: number) => (
              <Reveal key={story.id || index} delay={50 + (index * 50)}>
                <MediaCard 
                  mediaUrl={story.mediaUrl || story.imageUrl || story.videoUrl || ''} 
                  thumbnailUrl={story.thumbnailUrl}
                  title={story.title} 
                  subtitle={story.subtitle} 
                  className={`h-[600px] w-full ${index === 1 ? 'mt-0 md:mt-24' : ''}`} 
                />
              </Reveal>
            )) || (
              <>
                <Reveal delay={50}><VideoCard imageSrc={ASSETS.portfolio2} videoSrc={ASSETS.portfolioVideo1} title="Kavya & Rohan" subtitle="The Wedding Film" className="h-[600px] w-full" /></Reveal>
                <Reveal delay={100}><VideoCard imageSrc={ASSETS.portfolio4} videoSrc={ASSETS.portfolioVideo2} title="Meera & Sunder" subtitle="Pre-Wedding in Mahabalipuram" className="h-[600px] w-full mt-0 md:mt-24" /></Reveal>
              </>
            )}
         </div>
         <div className="text-center mt-24">
           <button onClick={() => setPage('stories')} className="interactive px-10 py-4 border border-[#2c2420] text-[#2c2420] text-xs uppercase tracking-[0.2em] hover:bg-[#2c2420] hover:text-white transition-colors duration-200">View All Stories</button>
         </div>
      </div>
    </section>
  </div>
);
};
