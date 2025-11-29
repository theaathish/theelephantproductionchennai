const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

async function resetAndFixStories() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');
    
    const Content = mongoose.model('Content', new mongoose.Schema({}, { strict: false, timestamps: true }), 'contents');
    const content = await Content.findOne().sort({ createdAt: -1 });
    
    if (!content) {
      console.log('❌ No content found');
      await mongoose.disconnect();
      return;
    }
    
    // Get available uploaded files
    const uploadsDir = path.join(__dirname, '../uploads');
    const uploadedFiles = fs.existsSync(uploadsDir) 
      ? fs.readdirSync(uploadsDir).filter(f => /\.(jpg|jpeg|png|gif)$/i.test(f))
      : [];
    
    console.log('📁 Available uploaded files:');
    uploadedFiles.forEach(f => console.log(`  - ${f}`));
    console.log('');
    
    const baseUrl = process.env.BACKEND_URL || 'http://localhost:5001';
    
    // Reset stories.items to proper structure with correct image URLs
    content.stories.items = [
      {
        id: 1,
        type: "film",
        title: "Kavya & Rohan",
        subtitle: "Wedding Film • Chennai",
        imageUrl: uploadedFiles[0] ? `${baseUrl}/uploads/${uploadedFiles[0]}` : "/images/portfolio2.jpg",
        videoUrl: "/videos/portfolio1.mp4",
        featured: true
      }
    ];
    
    content.markModified('stories');
    await content.save();
    
    console.log('✅ Database reset and updated successfully!\n');
    
    console.log('📊 Updated stories.items:');
    console.log(JSON.stringify(content.stories.items, null, 2));
    
    await mongoose.disconnect();
    console.log('\n👋 Disconnected from MongoDB');
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

resetAndFixStories();
