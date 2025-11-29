'use client';

import { useEffect, useState } from 'react';
import { GrainOverlay } from './effects/GrainOverlay';
import { Preloader } from './effects/Preloader';
import { Navigation } from './layout/Navigation';
import { Footer } from './layout/Footer';
import { HomePage } from './pages/HomePage';
import { AboutPage } from './pages/AboutPage';
import { ServicesPage } from './pages/ServicesPage';
import { StoriesPage } from './pages/StoriesPage';
import { DestinationPage } from './pages/DestinationPage';
import { ContactPage } from './pages/ContactPage';

export default function MainApp() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activePage, setActivePage] = useState('home');
  const [showHeader, setShowHeader] = useState(false);

  useEffect(() => {
    // Show header after 5 seconds
    const timer = setTimeout(() => {
      setShowHeader(true);
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setMobileMenuOpen(false);
  }, [activePage]);

  return (
    <>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,400&family=Montserrat:wght@300;400;500;600&display=swap');
        .font-serif { font-family: 'Cormorant Garamond', serif; }
        .font-sans { font-family: 'Montserrat', sans-serif; }

        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 30s linear infinite;
        }
        .animate-spin-slow {
           animation: spin 20s linear infinite;
        }
        @keyframes spin {
           from { transform: rotate(0deg); }
           to { transform: rotate(360deg); }
        }
      `}</style>

      <GrainOverlay />

      <div className="font-sans text-[#2c2420] bg-[#fdfcf8] selection:bg-[#a67b5b] selection:text-white overflow-x-hidden min-h-screen flex flex-col">

        <div className={`transition-opacity duration-1000 ${showHeader ? 'opacity-100' : 'opacity-0'}`}>
          <Navigation
            isScrolled={isScrolled}
            activePage={activePage}
            mobileMenuOpen={mobileMenuOpen}
            setActivePage={setActivePage}
            setMobileMenuOpen={setMobileMenuOpen}
          />
        </div>

        <main className="flex-grow">
          {activePage === 'home' && <HomePage setPage={setActivePage} />}
          {activePage === 'about' && <AboutPage />}
          {activePage === 'services' && <ServicesPage />}
          {activePage === 'stories' && <StoriesPage />}
          {activePage === 'destination' && <DestinationPage setPage={setActivePage} />}
          {activePage === 'contact' && <ContactPage />}
        </main>

        <Footer />
      </div>
    </>
  );
}
