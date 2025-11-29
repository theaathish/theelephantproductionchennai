const mongoose = require('mongoose');
require('dotenv').config({ path: require('path').join(__dirname, '../.env') });

async function checkContent() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');
    
    const Content = mongoose.model('Content', new mongoose.Schema({}, { strict: false, timestamps: true }), 'contents');
    const content = await Content.findOne().sort({ createdAt: -1 });
    
    if (!content) {
      console.log('❌ No content found in database');
      await mongoose.disconnect();
      return;
    }
    
    console.log('📊 Content Structure:');
    console.log('Has home:', !!content.home);
    console.log('Has home.latestJournals:', !!content.home?.latestJournals);
    console.log('Has stories:', !!content.stories);
    console.log('Has services:', !!content.services);
    
    if (content.home?.latestJournals?.stories) {
      console.log('\n📖 Latest Journals Stories (home.latestJournals.stories):');
      content.home.latestJournals.stories.forEach((s, i) => {
        console.log(`  Story ${i + 1}: ${s.title}`);
        console.log(`    imageUrl: ${s.imageUrl?.substring(0, 80)}`);
      });
    }
    
    if (content.stories?.items) {
      console.log('\n📖 Stories Items (stories.items):');
      content.stories.items.forEach((s, i) => {
        console.log(`  Item ${i + 1}: ${s.title}`);
        console.log(`    imageUrl: ${s.imageUrl?.substring(0, 80)}`);
      });
    }
    
    if (content.services?.packages) {
      console.log('\n💼 Service Packages:');
      content.services.packages.forEach((p, i) => {
        console.log(`  Package ${i + 1}: ${p.title}`);
        console.log(`    imageUrl: ${p.imageUrl?.substring(0, 80)}`);
      });
    }
    
    await mongoose.disconnect();
    console.log('\n👋 Disconnected from MongoDB');
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

checkContent();
