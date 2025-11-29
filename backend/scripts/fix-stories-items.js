const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

async function fixStoriesItems() {
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
    
    // Update stories.items array
    if (content.stories && content.stories.items) {
      console.log('📖 Current stories.items:');
      content.stories.items.forEach((item, i) => {
        console.log(`  Item ${i + 1}: ${item.title}`);
        console.log(`    Current imageUrl: ${item.imageUrl}`);
      });
      
      console.log('\n🔄 Updating stories.items...');
      
      // Update each story item with uploaded files
      content.stories.items = content.stories.items.map((item, index) => {
        const itemObj = item.toObject ? item.toObject() : item;
        if (uploadedFiles[index]) {
          const newImageUrl = `${baseUrl}/uploads/${uploadedFiles[index]}`;
          console.log(`  ✅ Updated "${itemObj.title}" → ${newImageUrl}`);
          return {
            ...itemObj,
            imageUrl: newImageUrl
          };
        }
        return itemObj;
      });
      
      // Mark the nested path as modified for Mongoose
      content.markModified('stories');
      await content.save();
      console.log('\n✅ Database updated successfully!');
      
      console.log('\n📊 Updated stories.items:');
      content.stories.items.forEach((item, i) => {
        console.log(`  Item ${i + 1}: ${item.title}`);
        console.log(`    New imageUrl: ${item.imageUrl}`);
      });
    } else {
      console.log('⚠️  No stories.items found in content');
    }
    
    await mongoose.disconnect();
    console.log('\n👋 Disconnected from MongoDB');
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

fixStoriesItems();
