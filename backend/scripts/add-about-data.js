require('dotenv').config();
const mongoose = require('mongoose');
const Content = require('../models/Content');

const aboutData = {
  hero: {
    title: "Our Story",
    imageUrl: ""
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
  }
};

async function addAboutData() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    const content = await Content.findOne();
    
    if (content) {
      content.about = aboutData;
      await content.save();
      console.log('✅ About data added successfully');
      console.log('About data:', JSON.stringify(content.about, null, 2));
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

addAboutData();
