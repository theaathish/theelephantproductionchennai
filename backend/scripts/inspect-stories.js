const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

async function inspectStories() {
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
    
    console.log('📖 Full stories.items structure:');
    console.log(JSON.stringify(content.stories.items, null, 2));
    
    await mongoose.disconnect();
    console.log('\n👋 Disconnected from MongoDB');
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

inspectStories();
