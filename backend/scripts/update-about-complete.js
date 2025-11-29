const mongoose = require('mongoose');
const Content = require('../models/Content');
require('dotenv').config();

const updateAboutContent = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    const content = await Content.findOne().sort({ createdAt: -1 });
    
    if (!content) {
      console.log('❌ No content found');
      process.exit(1);
    }

    console.log('📄 Found content document');

    // Update about section with complete data
    content.about = {
      hero: {
        title: "Our Story",
        imageUrl: content.about?.hero?.imageUrl || "https://0jdbg6kb-5001.inc1.devtunnels.ms/uploads/estee-tyler-preview-044-1764411317448-87240753.jpg"
      },
      content: {
        title: "From Chennai to Singapore",
        description: "Founded on the belief that every love story deserves a cinematic masterpiece, The Elephant Productions began as a small team of dreamers in Chennai.",
        features: [
          {
            icon: "Camera",
            title: "Cinematic Excellence",
            description: "We bring international standards to every frame, crafting visual stories that transcend traditional wedding videography."
          },
          {
            icon: "Heart",
            title: "Emotional Storytelling",
            description: "Every couple has a unique story. We capture the raw emotions and authentic moments that make your celebration truly yours."
          },
          {
            icon: "Globe",
            title: "Global Perspective",
            description: "With roots in Singapore and base in Chennai, we blend diverse cultural influences into stunning cinematic experiences."
          }
        ]
      },
      philosophy: {
        badge: "Our Philosophy",
        title1: "A Timeless Style",
        title2: "& True Expertise",
        description: "As a creative studio with high standards for quality and talent, our portfolio is a reflection of that in itself. But what really speaks loudly is how we achieve that quality behind the scenes, starting with our founder, Dave.",
        imageUrl: content.about?.philosophy?.imageUrl || "/images/approach.jpg"
      },
      stats: {
        items: [
          {
            label: "YEARS OF EXPERIENCE",
            value: "15+",
            description: ""
          },
          {
            label: "WEDDINGS COVERED",
            value: "2,200",
            description: ""
          },
          {
            label: "COUNTRIES",
            value: "3",
            description: ""
          },
          {
            label: "BAGS DUG OUT OF THE TRASH",
            value: "1",
            description: ""
          },
          {
            label: "TIMES YOU'LL WANT TO RELIVE",
            value: "infinite",
            description: ""
          }
        ]
      },
      testimonial: {
        quote: "A TRUE WORK OF ART",
        author: "— ALEXIS",
        backgroundImageUrl: content.about?.testimonial?.backgroundImageUrl || "/images/testimonial-bg.jpg"
      },
      approach: {
        title1: "A Timeless Style",
        title2: "& True Expertise",
        description: "As a creative studio with high standards for quality and talent, our portfolio is a reflection of that in itself. But what really speaks loudly is how we achieve that quality behind the scenes, starting with our founder, Dave.",
        imageUrl: content.about?.approach?.imageUrl || "/images/approach.jpg",
        list: [
          "International cinematic standards applied to South Indian celebrations",
          "Natural, candid storytelling that captures real emotions",
          "Professional team that blends seamlessly into your celebration",
          "Nearly 15 years of experience creating timeless wedding films"
        ]
      }
    };

    await content.save();
    console.log('✅ About section updated successfully');
    console.log('📊 Updated sections:', Object.keys(content.about));

    mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

updateAboutContent();
