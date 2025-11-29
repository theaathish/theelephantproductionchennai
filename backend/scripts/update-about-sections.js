require('dotenv').config();
const mongoose = require('mongoose');
const Content = require('../models/Content');

const newAboutSections = {
  philosophy: {
    badge: "A NATURAL CONNECTION",
    title1: "Authentic moments,",
    title2: "captured naturally",
    description: "Some couples want their photographers and filmmakers to be an extension of their bridal party and other times they want them to fade into the background. With us, you have a team who knows when to step in and out of each role.",
    imageUrl: ""
  },
  stats: {
    items: [
      { label: "HAPPY COUPLES", value: "2,200", description: "" },
      { label: "HOURS OF MEMORIES CAPTURED", value: "14,000", description: "" },
      { label: "WEDDING CRASHERS", value: "3", description: "" },
      { label: "RINGS DUG OUT OF THE TRASH", value: "1", description: "" },
      { label: "TIMES YOU'LL WANT TO RELIVE", value: "infinite", description: "" }
    ]
  },
  testimonial: {
    quote: "A TRUE WORK OF ART",
    author: "— ALEXIS",
    backgroundImageUrl: ""
  },
  approach: {
    title1: "A Timeless Style",
    title2: "& True Expertise",
    description: "As a creative studio with high standards for quality and talent, our portfolio is a reflection of that in itself. But what really speaks loudly is how we achieve that quality behind the scenes, starting with our founder, Dave.",
    imageUrl: "",
    list: [
      "International cinematic standards applied to South Indian celebrations",
      "Natural, candid storytelling that captures real emotions",
      "Professional team that blends seamlessly into your celebration",
      "Nearly 15 years of experience creating timeless wedding films"
    ]
  }
};

async function updateAboutSections() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    const content = await Content.findOne();
    
    if (content) {
      console.log('Current about data:', content.about);
      
      // Use direct field updates
      content.about.philosophy = newAboutSections.philosophy;
      content.about.stats = newAboutSections.stats;
      content.about.testimonial = newAboutSections.testimonial;
      content.about.approach = newAboutSections.approach;
      
      content.markModified('about');
      await content.save();
      console.log('✅ About page sections updated successfully');
      console.log('Updated about data:', JSON.stringify(content.about, null, 2));
    } else {
      console.log('❌ No content document found');
    }

    await mongoose.connection.close();
    console.log('✅ Database connection closed');
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

updateAboutSections();
