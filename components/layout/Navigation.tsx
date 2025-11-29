'use client';

import { Menu, X } from 'lucide-react';
import { useAdmin } from '@/contexts/AdminContext';

interface NavigationProps {
  isScrolled: boolean;
  activePage: string;
  mobileMenuOpen: boolean;
  setActivePage: (page: string) => void;
  setMobileMenuOpen: (open: boolean) => void;
}

export const Navigation = ({ isScrolled, activePage, mobileMenuOpen, setActivePage, setMobileMenuOpen }: NavigationProps) => {
  const { content } = useAdmin();
  
  return (
    <>
      <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${isScrolled || activePage !== 'home' ? 'bg-[#fdfcf8]/95 backdrop-blur-sm shadow-sm py-4' : 'bg-transparent py-8'}`}>
        <div className="container mx-auto px-6 flex justify-between items-center">
          <div className="flex flex-col cursor-pointer group interactive" onClick={() => setActivePage('home')}>
            <span className={`font-serif text-2xl md:text-3xl tracking-widest font-semibold transition-colors duration-200 ${isScrolled || activePage !== 'home' ? 'text-[#2c2420]' : 'text-white'}`}>{content?.site?.title || 'THE ELEPHANT PRODUCTION'}</span>
            <div className="flex items-center gap-2 transition-all duration-200">
              <div className={`h-[1px] w-8 transition-colors ${isScrolled || activePage !== 'home' ? 'bg-[#a67b5b]' : 'bg-white/50'}`}></div>
              <span className={`text-[10px] tracking-[0.3em] uppercase text-center transition-colors ${isScrolled || activePage !== 'home' ? 'text-[#a67b5b]' : 'text-white/80'}`}>{content?.site?.subtitle || 'Chennai'}</span>
            </div>
          </div>

          <div className={`hidden md:flex items-center gap-8 text-xs tracking-[0.2em] font-medium uppercase ${isScrolled || activePage !== 'home' ? 'text-[#2c2420]' : 'text-white'}`}>
            {['home', 'about', 'services', 'stories', 'destination'].map((page) => (
               <button key={page} onClick={() => setActivePage(page)} className={`hover:text-[#a67b5b] transition-colors relative group interactive ${activePage === page ? 'text-[#a67b5b]' : ''}`}>
                 {page}
                 <span className={`absolute -bottom-2 left-0 h-[1px] bg-[#a67b5b] transition-all duration-200 ${activePage === page ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
               </button>
            ))}
            <button onClick={() => setActivePage('contact')} className={`px-8 py-3 border transition-all duration-200 hover:scale-105 interactive ${isScrolled || activePage !== 'home' ? 'border-[#a67b5b] text-[#a67b5b] hover:bg-[#a67b5b] hover:text-white' : 'border-white text-white hover:bg-white hover:text-[#2c2420]'}`}>Inquire</button>
          </div>

          <button className={`md:hidden text-2xl interactive ${isScrolled || activePage !== 'home' ? 'text-[#2c2420]' : 'text-white'}`} onClick={() => setMobileMenuOpen(true)}><Menu /></button>
        </div>
      </nav>

      <div className={`fixed inset-0 z-[60] bg-[#2c2420] text-white transition-transform duration-400 ease-out ${mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="p-8 flex justify-end"><button onClick={() => setMobileMenuOpen(false)}><X size={32} /></button></div>
        <div className="flex flex-col items-center justify-center h-[80vh] gap-10 font-serif text-4xl">
          {['home', 'about', 'services', 'stories', 'destination', 'contact'].map(page => (
            <button key={page} onClick={() => setActivePage(page)} className="capitalize hover:text-[#a67b5b] transition-colors">{page}</button>
          ))}
        </div>
      </div>
    </>
  );
};
