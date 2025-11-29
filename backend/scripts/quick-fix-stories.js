const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const MONGODB_URI = process.env.MONGODB_URI;

async function quickFix() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 5000
    });
    console.log('✅ Connected\n');
    
    const baseUrl = process.env.BACKEND_URL || 'http://localhost:5001';
    
    // Direct update using findOneAndUpdate
    const result = await mongoose.connection.db.collection('contents').findOneAndUpdate(
      {},
      {
        $set: {
          'stories.items': [
            {
              id: 1,
              type: 'film',
              title: 'Kavya & Rohan',
              subtitle: 'Wedding Film • Chennai',
              imageUrl: `${baseUrl}/uploads/portfolio4-1764177326766-79291280.jpg`,
              videoUrl: '/videos/portfolio1.mp4',
              featured: true
            }
          ]
        }
      },
      { returnDocument: 'after' }
    );
    
    if (result) {
      console.log('✅ Updated stories.items successfully!');
      console.log('Story:', result.stories.items[0].title);
      console.log('Image:', result.stories.items[0].imageUrl);
    } else {
      console.log('❌ No document found to update');
    }
    
    await mongoose.disconnect();
    console.log('\n👋 Done');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

quickFix();
