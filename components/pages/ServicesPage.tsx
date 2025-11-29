'use client';

import { ASSETS } from '@/lib/assets';
import { normalizeMediaUrl } from '@/lib/media';
import { Reveal } from '@/components/animations/Reveal';
import { TextReveal } from '@/components/animations/TextReveal';
import { useAdmin } from '@/contexts/AdminContext';

export const ServicesPage = () => {
  const { content } = useAdmin();
  
  return (
  <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 pt-24">
    <div className="bg-[#2c2420] py-32 text-center text-white">
       <div className="container mx-auto px-6">
          <TextReveal className="text-6xl md:text-8xl font-serif mb-6">{content?.services?.hero?.title || 'Our Services'}</TextReveal>
          <p className="text-[#a67b5b] tracking-[0.2em] uppercase text-xs">{content?.services?.hero?.subtitle || 'Curated Experiences for the Modern Couple'}</p>
       </div>
    </div>

    <section className="py-32 bg-[#fdfcf8]">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {content?.services?.packages?.map((pkg: any, index: number) => {
            const mediaUrl = normalizeMediaUrl(pkg.mediaUrl || pkg.imageUrl || pkg.videoUrl || '');
            const isVideo = mediaUrl && mediaUrl.match(/\.(mp4|webm|mov)$/i);
            const isGif = mediaUrl && mediaUrl.toLowerCase().endsWith('.gif');
            
            return (
            <Reveal key={pkg.id || index} delay={index * 100}>
              <div className={`group h-full p-10 hover:shadow-2xl transition-all duration-300 relative overflow-hidden hover:-translate-y-2 interactive ${pkg.featured ? 'bg-[#1a1a1a] text-white' : 'bg-white border border-gray-100'}`}>
                {pkg.featured && (
                  <div className="absolute top-0 right-0 bg-[#a67b5b] px-6 py-2 text-[10px] font-bold uppercase tracking-widest">Recommended</div>
                )}
                <div className="h-80 mb-10 overflow-hidden relative">
                  {isVideo ? (
                    <video src={mediaUrl} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out" muted loop playsInline autoPlay />
                  ) : (
                    <img src={mediaUrl} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out" alt={pkg.title} loading="lazy" />
                  )}
                </div>
                <div className="flex justify-between items-baseline mb-6">
                  <h3 className={`text-4xl font-serif ${pkg.featured ? 'text-white' : 'text-[#2c2420]'}`}>{pkg.title}</h3>
                  <span className="text-[#a67b5b] font-serif italic text-xl">{pkg.number}</span>
                </div>
                <p className={`font-light leading-relaxed mb-8 ${pkg.featured ? 'text-white/70' : 'text-gray-500'}`}>{pkg.description}</p>
                <ul className={`space-y-4 text-sm ${pkg.featured ? 'text-white/60' : 'text-gray-600'}`}>
                  {pkg.features?.map((feature: string, fIdx: number) => (
                    <li key={fIdx} className="flex gap-3 items-center">
                      <div className="w-1 h-1 bg-[#a67b5b] rounded-full"></div> {feature}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  </div>
  );
};
