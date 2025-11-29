'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { api } from '@/lib/api';

const defaultContent = {
  "site": {
    "title": "THE ELEPHANT PRODUCTION",
    "subtitle": "Chennai",
    "tagline": "Now Booking 2025-26"
  },
  "home": {
    "hero": {
      "title1": "Your story,",
      "title2": "crafted with soul.",
      "ctaText": "VIEW PORTFOLIO",
      "videoUrl": "/hero-final.mp4",
      "posterUrl": "/images/hero-poster.jpg"
    },
    "marquee": {
      "items": ["Cinematic", "Emotional", "Timeless", "Authentic", "Raw"]
    },
    "philosophy": {
      "badge": "The Philosophy",
      "title1": "We don't just capture moments.",
      "title2": "We bottle feelings.",
      "description": "Based in Chennai with roots in Singapore, we bring an international cinematic standard to South Indian celebrations. We trade stiff poses for messy, beautiful, real interactions.",
      "ctaText": "Read Our Story",
      "imageUrl": "/images/about.jpg"
    },
    "latestJournals": {
      "title": "Latest Journals",
      "stories": [
        {
          "id": 1,
          "title": "Kavya & Rohan",
          "subtitle": "The Wedding Film",
          "imageUrl": "/images/portfolio2.jpg",
          "videoUrl": "/videos/portfolio1.mp4"
        },
        {
          "id": 2,
          "title": "Meera & Sunder",
          "subtitle": "Pre-Wedding in Mahabalipuram",
          "imageUrl": "/portfolio4.jpg",
          "videoUrl": "/videos/portfolio2.mp4"
        }
      ]
    }
  },
  "about": {
    "hero": {
      "title": "Our Story",
      "imageUrl": "/images/about-hero.jpg"
    },
    "content": {
      "title": "From Chennai to Singapore",
      "description": "Founded on the belief that every love story deserves a cinematic masterpiece, The Elephant Productions began as a small team of dreamers in Chennai.",
      "features": [
        {
          "icon": "Users",
          "title": "The Team",
          "description": "A collective of artists, filmmakers, and editors obsessed with light."
        },
        {
          "icon": "Globe",
          "title": "Global Reach",
          "description": "Covering weddings across India and Southeast Asia."
        },
        {
          "icon": "Star",
          "title": "Premium Quality",
          "description": "Using industry-leading cinema cameras and optics."
        }
      ]
    }
  },
  "services": {
    "hero": {
      "title": "Our Services",
      "subtitle": "Curated Experiences for the Modern Couple"
    },
    "packages": [
      {
        "id": 1,
        "number": "01",
        "title": "Photography",
        "description": "Documentary-style coverage that focuses on raw emotions. We capture the in-between moments.",
        "imageUrl": "/images/service1.jpg",
        "features": [
          "Candid & Traditional Mix",
          "High-Res Edited Gallery"
        ]
      },
      {
        "id": 2,
        "number": "02",
        "title": "Cinematography",
        "description": "We don't make wedding videos; we make films. 4K cinema quality, drone shots, and narrative storytelling.",
        "imageUrl": "/images/service2.jpg",
        "features": [
          "3-5 Min Cinematic Teaser",
          "20-30 Min Wedding Film"
        ]
      },
      {
        "id": 3,
        "number": "03",
        "title": "Signature",
        "description": "A seamless team providing both photo and video. Perfect for multi-day luxury celebrations.",
        "imageUrl": "/images/service3.jpg",
        "featured": true,
        "features": [
          "Full Team Coverage",
          "Complimentary Pre-Wed Shoot"
        ]
      }
    ]
  },
  "stories": {
    "hero": {
      "title": "The Journal"
    },
    "items": [
      {
        "id": 1,
        "type": "film",
        "title": "Kavya & Rohan",
        "subtitle": "Wedding Film • Chennai",
        "imageUrl": "/images/portfolio2.jpg",
        "videoUrl": "/videos/portfolio1.mp4",
        "featured": true
      },
      {
        "id": 2,
        "type": "photo",
        "title": "Deepa & Karthik",
        "subtitle": "Photography • Chennai",
        "imageUrl": "/images/portfolio1.jpg"
      },
      {
        "id": 3,
        "type": "photo",
        "title": "Haldi",
        "subtitle": "Details • Bangalore",
        "imageUrl": "/images/portfolio3.jpg"
      },
      {
        "id": 4,
        "type": "film",
        "title": "Meera & Sunder",
        "subtitle": "Cinematic Teaser • Mahabalipuram",
        "imageUrl": "/images/portfolio4.jpg",
        "videoUrl": "/videos/portfolio2.mp4",
        "featured": true
      }
    ]
  },
  "contact": {
    "hero": {
      "title": "Let's Create Magic.",
      "description": "We take on a limited number of weddings each year to ensure we can give our full heart to every couple."
    },
    "details": {
      "phone": "+91 98765 43210",
      "email": "hello@elephantproductions.in"
    }
  },
  "footer": {
    "title": "THE ELEPHANT",
    "subtitle": "Productions • Chennai",
    "copyright": "© 2024 The Elephant Productions. by Strucureo"
  }
};

interface AdminContextType {
  isAdmin: boolean;
  loading: boolean;
  login: (password: string) => Promise<boolean>;
  logout: () => void;
  content: any;
  updateContent: (newContent: any) => Promise<void>;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const AdminProvider = ({ children }: { children: ReactNode }) => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [content, setContent] = useState<any>(defaultContent);

  useEffect(() => {
    // Check if admin is logged in and verify token
    const initAuth = async () => {
      const token = localStorage.getItem('adminToken');
      if (token) {
        try {
          await api.verifyToken();
          setIsAdmin(true);
        } catch (error) {
          console.error('Token verification failed:', error);
          localStorage.removeItem('adminToken');
          setIsAdmin(false);
        }
      }
      setLoading(false);
    };

    // Load content from backend
    const loadContent = async () => {
      try {
        const response = await api.getContent();
        setContent(response.data);
      } catch (error) {
        console.error('Failed to load content:', error);
        // Fallback to default content
        setContent(defaultContent);
      }
    };

    initAuth();
    loadContent();
  }, []);

  const login = async (password: string) => {
    try {
      const response = await api.login(password);
      localStorage.setItem('adminToken', response.token);
      setIsAdmin(true);
      return true;
    } catch (error) {
      console.error('Login failed:', error);
      return false;
    }
  };

  const logout = () => {
    setIsAdmin(false);
    localStorage.removeItem('adminToken');
    api.logout().catch(console.error);
  };

  const updateContent = async (newContent: any) => {
    try {
      await api.updateContent(newContent);
      setContent(newContent);
    } catch (error) {
      console.error('Failed to update content:', error);
      throw error;
    }
  };

  return (
    <AdminContext.Provider value={{ isAdmin, loading, login, logout, content, updateContent }}>
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within AdminProvider');
  }
  return context;
};
