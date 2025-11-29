require('dotenv').config();
const mongoose = require('mongoose');
const Content = require('../models/Content');

async function fixImagePaths() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Get current content
    const content = await Content.findOne().sort({ createdAt: -1 });
    
    if (!content) {
      console.log('❌ No content found in database');
      return;
    }

    console.log('\n📊 Current Latest Journals:');
    console.log(JSON.stringify(content.home.latestJournals.stories, null, 2));

    // Get available uploaded files
    const fs = require('fs');
    const path = require('path');
    const uploadsDir = path.join(__dirname, '../uploads');
    const files = fs.readdirSync(uploadsDir).filter(f => f.endsWith('.jpg') || f.endsWith('.png'));
    
    console.log('\n📁 Available uploaded files:');
    files.forEach(f => console.log(`  - ${f}`));

    // Update paths to use uploaded files
    const baseUrl = process.env.BACKEND_URL || 'http://localhost:5001';
    
    if (files.length >= 2) {
      content.home.latestJournals.stories[0].imageUrl = `${baseUrl}/uploads/${files[0]}`;
      content.home.latestJournals.stories[1].imageUrl = `${baseUrl}/uploads/${files[1]}`;
      
      // Also update services
      if (files.length >= 3) {
        content.services.packages[0].imageUrl = `${baseUrl}/uploads/${files[0]}`;
        content.services.packages[1].imageUrl = `${baseUrl}/uploads/${files[1]}`;
        content.services.packages[2].imageUrl = `${baseUrl}/uploads/${files[2]}`;
      }

      await content.save();
      
      console.log('\n✅ Updated image paths:');
      console.log(JSON.stringify(content.home.latestJournals.stories, null, 2));
      console.log('\n✅ Database updated successfully!');
    } else {
      console.log('\n⚠️  Not enough uploaded files. Please upload images through the admin panel.');
    }

    await mongoose.connection.close();
    console.log('\n👋 Disconnected from MongoDB');
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

fixImagePaths();
