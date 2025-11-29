require('dotenv').config();
const mongoose = require('mongoose');

async function cleanDatabase() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    console.log('🗑️  Dropping contents collection...');
    await mongoose.connection.db.dropCollection('contents').catch(() => console.log('Collection not found, skipping...'));
    
    console.log('🗑️  Dropping media collection...');
    await mongoose.connection.db.dropCollection('media').catch(() => console.log('Collection not found, skipping...'));
    
    console.log('✅ Database cleaned successfully');
    
    await mongoose.connection.close();
    console.log('👋 Disconnected from MongoDB');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error cleaning database:', error);
    process.exit(1);
  }
}

cleanDatabase();
