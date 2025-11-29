'use client';

import { Instagram, Facebook, Youtube } from 'lucide-react';
import { useAdmin } from '@/contexts/AdminContext';

export const Footer = () => {
  const { content } = useAdmin();
  
  return (
    <footer className="bg-[#1a1a1a] text-white/40 py-16 border-t border-white/5">
      <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
        <div className="flex flex-col items-center md:items-start gap-2">
          <span className="font-serif text-xl text-white">{content?.footer?.title || 'THE ELEPHANT'}</span>
          <span className="text-[10px] tracking-widest uppercase">{content?.footer?.subtitle || 'Productions • Chennai'}</span>
          <span className="text-xs mt-4">{content?.footer?.copyright || '© 2024 The Elephant Productions. by Strucureo'}</span>
        </div>
        <div className="flex gap-8">
          <div className="interactive"><Instagram className="hover:text-[#a67b5b] transition-colors cursor-pointer" size={20} /></div>
          <div className="interactive"><Facebook className="hover:text-[#a67b5b] transition-colors cursor-pointer" size={20} /></div>
          <div className="interactive"><Youtube className="hover:text-[#a67b5b] transition-colors cursor-pointer" size={20} /></div>
        </div>
      </div>
    </footer>
  );
};
