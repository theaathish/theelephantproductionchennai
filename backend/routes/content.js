const express = require('express');
const router = express.Router();
const Content = require('../models/Content');
const authMiddleware = require('../middleware/auth');

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
      "description": "Based in Chennai with roots in Singapore, we bring an international cinematic standard to South Indian celebrations.",
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
          "imageUrl": "/images/portfolio4.jpg",
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
      "description": "Founded on the belief that every love story deserves a cinematic masterpiece.",
      "features": [
        {
          "icon": "Users",
          "title": "The Team",
          "description": "A collective of artists, filmmakers, and editors."
        },
        {
          "icon": "Globe",
          "title": "Global Reach",
          "description": "Covering weddings across India and Southeast Asia."
        },
        {
          "icon": "Star",
          "title": "Premium Quality",
          "description": "Using industry-leading cinema cameras."
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
        "description": "Documentary-style coverage that focuses on raw emotions.",
        "imageUrl": "/images/service1.jpg",
        "features": ["Candid & Traditional Mix", "High-Res Edited Gallery"]
      },
      {
        "id": 2,
        "number": "02",
        "title": "Cinematography",
        "description": "We don't make wedding videos; we make films.",
        "imageUrl": "/images/service2.jpg",
        "features": ["3-5 Min Cinematic Teaser", "20-30 Min Wedding Film"]
      },
      {
        "id": 3,
        "number": "03",
        "title": "Signature",
        "description": "A seamless team providing both photo and video.",
        "imageUrl": "/images/service3.jpg",
        "featured": true,
        "features": ["Full Team Coverage", "Complimentary Pre-Wed Shoot"]
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
      }
    ]
  },
  "contact": {
    "hero": {
      "title": "Let's Create Magic.",
      "description": "We take on a limited number of weddings each year."
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

// Initialize database with default content if empty
const initializeContent = async () => {
  try {
    const count = await Content.countDocuments();
    if (count === 0) {
      await Content.create(defaultContent);
      console.log('✅ Database initialized with default content');
    }
  } catch (error) {
    console.error('Error initializing content:', error);
  }
};

// Initialize on startup
initializeContent();

// Get all content (public)
router.get('/', async (req, res) => {
  try {
    let content = await Content.findOne().sort({ createdAt: -1 });
    
    if (!content) {
      content = await Content.create(defaultContent);
    }
    
    res.json({
      success: true,
      data: content
    });
  } catch (error) {
    console.error('Get content error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch content' 
    });
  }
});

// Update content (protected)
router.put('/', authMiddleware, async (req, res) => {
  try {
    const newContent = req.body;
    
    if (!newContent || typeof newContent !== 'object') {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid content data' 
      });
    }

    // Find existing content or create new
    let content = await Content.findOne().sort({ createdAt: -1 });
    
    if (content) {
      // Update existing
      Object.assign(content, newContent);
      await content.save();
    } else {
      // Create new
      content = await Content.create(newContent);
    }
    
    res.json({
      success: true,
      message: 'Content updated successfully',
      data: content
    });
  } catch (error) {
    console.error('Update content error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to update content' 
    });
  }
});

// Get specific section (public)
router.get('/:section', async (req, res) => {
  try {
    const content = await Content.findOne().sort({ createdAt: -1 });
    const section = req.params.section;
    
    if (!content || !content[section]) {
      return res.status(404).json({ 
        success: false, 
        message: `Section '${section}' not found` 
      });
    }
    
    res.json({
      success: true,
      data: content[section]
    });
  } catch (error) {
    console.error('Get section error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch section' 
    });
  }
});

// Update specific section (protected)
router.put('/:section', authMiddleware, async (req, res) => {
  try {
    const section = req.params.section;
    const sectionData = req.body;
    
    let content = await Content.findOne().sort({ createdAt: -1 });
    
    if (!content) {
      content = await Content.create(defaultContent);
    }
    
    content[section] = sectionData;
    await content.save();
    
    res.json({
      success: true,
      message: `Section '${section}' updated successfully`,
      data: content[section]
    });
  } catch (error) {
    console.error('Update section error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to update section' 
    });
  }
});

module.exports = router;
