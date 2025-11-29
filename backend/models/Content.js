const mongoose = require('mongoose');

const ContentSchema = new mongoose.Schema({
  site: {
    title: String,
    subtitle: String,
    tagline: String
  },
  home: {
    hero: {
      title1: String,
      title2: String,
      ctaText: String,
      videoUrl: String,
      posterUrl: String
    },
    marquee: {
      items: [String]
    },
    philosophy: {
      badge: String,
      title1: String,
      title2: String,
      description: String,
      ctaText: String,
      imageUrl: String
    },
    latestJournals: {
      title: String,
      stories: [{
        id: Number,
        title: String,
        subtitle: String,
        mediaUrl: String,
        thumbnailUrl: String,
        imageUrl: String,
        videoUrl: String
      }]
    }
  },
  about: {
    hero: {
      title: String,
      imageUrl: String
    },
    content: {
      title: String,
      description: String,
      features: [{
        icon: String,
        title: String,
        description: String
      }]
    },
    philosophy: {
      badge: String,
      title1: String,
      title2: String,
      description: String,
      imageUrl: String
    },
    stats: {
      items: [{
        label: String,
        value: String,
        description: String
      }]
    },
    testimonial: {
      quote: String,
      author: String,
      backgroundImageUrl: String
    },
    approach: {
      title1: String,
      title2: String,
      description: String,
      imageUrl: String,
      list: [String]
    }
  },
  services: {
    hero: {
      title: String,
      subtitle: String
    },
    packages: [{
      id: Number,
      number: String,
      title: String,
      description: String,
      mediaUrl: String,
      thumbnailUrl: String,
      imageUrl: String,
      features: [String],
      featured: Boolean
    }]
  },
  stories: {
    hero: {
      title: String
    },
    items: [{ 
      id: Number,
      type: { type: String },  // Must specify nested 'type' field this way to avoid Mongoose confusion
      title: String,
      subtitle: String,
      mediaUrl: String,
      thumbnailUrl: String,
      imageUrl: String,
      videoUrl: String,
      featured: Boolean
    }]
  },
  destination: {
    hero: {
      badge: String,
      title: String,
      mediaUrl: String,
      imageUrl: String
    },
    sectionTitle: String,
    places: [{
      id: Number,
      name: String
    }]
  },
  contact: {
    hero: {
      title: String,
      description: String
    },
    details: {
      phone: String,
      email: String
    }
  },
  footer: {
    title: String,
    subtitle: String,
    copyright: String
  }
}, {
  timestamps: true,
  strict: false
});

// Delete cached model if it exists
if (mongoose.models.Content) {
  delete mongoose.models.Content;
}

module.exports = mongoose.model('Content', ContentSchema);
