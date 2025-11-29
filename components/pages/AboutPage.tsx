'use client';

import { Reveal } from '@/components/animations/Reveal';
import { TextReveal } from '@/components/animations/TextReveal';
import { ParallaxImage } from '@/components/animations/ParallaxImage';
import { normalizeMediaUrl } from '@/lib/media';
import { Users, Globe, Star, Camera, Heart } from 'lucide-react';
import { useAdmin } from '@/contexts/AdminContext';

export const AboutPage = () => {
  const { content } = useAdmin();
  
  const iconMap: Record<string, any> = {
    Users,
    Globe,
    Star,
    Camera,
    Heart
  };
  
  return (
  <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 pt-24">
     <div className="h-[80vh] relative overflow-hidden">
        {content?.about?.hero?.imageUrl && (
          <ParallaxImage src={normalizeMediaUrl(content.about.hero.imageUrl)} className="w-full h-full" alt="Team" />
        )}
        <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
            {content?.about?.hero?.title && (
              <TextReveal className="text-7xl md:text-9xl font-serif text-white drop-shadow-2xl italic">{content.about.hero.title}</TextReveal>
            )}
        </div>
     </div>
     <section className="py-32 bg-[#fdfcf8]">
        <div className="container mx-auto px-6 max-w-4xl text-center space-y-12">
           {content?.about?.content?.title && (
             <Reveal>
               <h2 className="text-4xl font-serif text-[#2c2420]">{content.about.content.title}</h2>
             </Reveal>
           )}
           {content?.about?.content?.description && (
             <Reveal delay={100}>
               <p className="text-gray-600 leading-loose font-light text-xl">
                 {content.about.content.description}
               </p>
             </Reveal>
           )}
           <Reveal delay={200}>
             <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mt-20 border-t border-[#e8e0d9] pt-12">
               {content?.about?.content?.features?.map((feature: any, index: number) => {
                 const IconComponent = iconMap[feature.icon] || Users;
                 return (
                   <div key={index} className="text-center">
                     <IconComponent className="w-12 h-12 text-[#a67b5b] mx-auto mb-6" />
                     <h3 className="font-serif text-2xl mb-3">{feature.title}</h3>
                     <p className="text-sm text-gray-500 leading-relaxed">{feature.description}</p>
                   </div>
                 );
               })}
             </div>
           </Reveal>
        </div>
     </section>

     {/* Philosophy Section */}
     {content?.about?.philosophy && (
       <section className="py-32 bg-white">
         <div className="container mx-auto px-6">
           <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
             <Reveal>
               <div className="space-y-6">
                 {content.about.philosophy.badge && (
                   <div className="inline-block px-6 py-2 border border-[#a67b5b] text-[#a67b5b] text-xs uppercase tracking-widest">
                     {content.about.philosophy.badge}
                   </div>
                 )}
                 {content.about.philosophy.title1 && (
                   <h2 className="text-4xl md:text-5xl font-serif text-[#2c2420]">
                     {content.about.philosophy.title1}
                   </h2>
                 )}
                 {content.about.philosophy.title2 && (
                   <h3 className="text-3xl md:text-4xl font-serif italic text-[#a67b5b]">
                     {content.about.philosophy.title2}
                   </h3>
                 )}
                 {content.about.philosophy.description && (
                   <p className="text-gray-600 leading-loose font-light text-lg">
                     {content.about.philosophy.description}
                   </p>
                 )}
               </div>
             </Reveal>
             {content.about.philosophy.imageUrl && (
               <Reveal delay={150}>
                 <div className="h-[600px] relative overflow-hidden shadow-2xl">
                   <ParallaxImage 
                     src={normalizeMediaUrl(content.about.philosophy.imageUrl)} 
                     alt="Philosophy" 
                     className="w-full h-full"
                   />
                 </div>
               </Reveal>
             )}
           </div>
         </div>
       </section>
     )}

     {/* Stats Section */}
     {content?.about?.stats?.items && content.about.stats.items.length > 0 && (
       <section className="py-20 bg-[#2c2420] text-white">
         <div className="container mx-auto px-6">
           <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
             {content.about.stats.items.map((stat: any, index: number) => (
               <Reveal key={index} delay={index * 50}>
                 <div className="text-center">
                   {stat.label && (
                     <p className="text-[10px] uppercase tracking-[0.3em] mb-4 text-white/60">
                       {stat.label}
                     </p>
                   )}
                   {stat.value && (
                     <p className="text-4xl md:text-5xl font-serif text-[#a67b5b] mb-2">
                       {stat.value}
                     </p>
                   )}
                   {stat.description && (
                     <p className="text-xs italic text-white/80">
                       {stat.description}
                     </p>
                   )}
                 </div>
               </Reveal>
             ))}
           </div>
         </div>
       </section>
     )}

     {/* Testimonial Section */}
     {content?.about?.testimonial && (
       <section className="py-32 bg-[#e8e0d9]/30 relative overflow-hidden">
         {content.about.testimonial.backgroundImageUrl && (
           <div className="absolute inset-0 opacity-20">
             <img 
               src={normalizeMediaUrl(content.about.testimonial.backgroundImageUrl)} 
               alt="Background" 
               className="w-full h-full object-cover"
             />
           </div>
         )}
         <div className="container mx-auto px-6 relative z-10">
           <div className="max-w-4xl mx-auto text-center space-y-8">
             {content.about.testimonial.quote && (
               <Reveal>
                 <blockquote className="text-3xl md:text-4xl font-serif italic text-[#2c2420] leading-relaxed">
                   "{content.about.testimonial.quote}"
                 </blockquote>
               </Reveal>
             )}
             {content.about.testimonial.author && (
               <Reveal delay={100}>
                 <p className="text-sm uppercase tracking-[0.3em] text-[#a67b5b]">
                   {content.about.testimonial.author}
                 </p>
               </Reveal>
             )}
           </div>
         </div>
       </section>
     )}

     {/* Approach Section */}
     {content?.about?.approach && (
       <section className="py-32 bg-white">
         <div className="container mx-auto px-6">
           <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
             {content.about.approach.imageUrl && (
               <Reveal>
                 <div className="h-[600px] relative overflow-hidden shadow-2xl">
                   <ParallaxImage 
                     src={normalizeMediaUrl(content.about.approach.imageUrl)} 
                     alt="Our Approach" 
                     className="w-full h-full"
                   />
                 </div>
               </Reveal>
             )}
             <Reveal delay={150}>
               <div className="space-y-6">
                 {content.about.approach.title1 && (
                   <h2 className="text-4xl md:text-5xl font-serif text-[#2c2420]">
                     {content.about.approach.title1}
                   </h2>
                 )}
                 {content.about.approach.title2 && (
                   <h3 className="text-3xl md:text-4xl font-serif italic text-[#a67b5b]">
                     {content.about.approach.title2}
                   </h3>
                 )}
                 {content.about.approach.description && (
                   <p className="text-gray-600 leading-loose font-light text-lg">
                     {content.about.approach.description}
                   </p>
                 )}
                 {content.about.approach.list && content.about.approach.list.length > 0 && (
                   <ul className="space-y-4 mt-8">
                     {content.about.approach.list.map((item: string, index: number) => (
                       <li key={index} className="flex items-start gap-3">
                         <span className="text-[#a67b5b] text-xl">•</span>
                         <span className="text-gray-600">{item}</span>
                       </li>
                     ))}
                   </ul>
                 )}
               </div>
             </Reveal>
           </div>
         </div>
       </section>
     )}
  </div>
  );
};
