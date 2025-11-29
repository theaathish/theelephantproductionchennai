const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env') });

// Import models
const Content = require('../models/Content');
const Media = require('../models/Media');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
  });

const OLD_BASE_URL = 'http://localhost:5001';
const NEW_BASE_URL = process.env.BACKEND_URL || 'https://0jdbg6kb-5001.inc1.devtunnels.ms';

/**
 * Update a URL to use the new backend base URL
 */
function updateUrl(url) {
  if (!url || typeof url !== 'string') {
    return url;
  }

  // If URL contains localhost:5001, replace it
  if (url.includes('localhost:5001')) {
    return url.replace(/http:\/\/localhost:5001/g, NEW_BASE_URL);
  }

  // If URL is already using new base, keep it
  if (url.startsWith(NEW_BASE_URL)) {
    return url;
  }

  // If it's a relative /uploads/ path, make it absolute
  if (url.startsWith('/uploads/')) {
    return `${NEW_BASE_URL}${url}`;
  }

  // If it's external (YouTube, etc), keep it as is
  if (url.startsWith('http') && !url.includes('localhost')) {
    return url;
  }

  return url;
}

/**
 * Recursively update URLs in an object
 */
function updateUrlsInObject(obj) {
  if (!obj || typeof obj !== 'object') {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map(item => updateUrlsInObject(item));
  }

  const updated = {};
  for (const [key, value] of Object.entries(obj)) {
    // Skip MongoDB internal fields
    if (key === '_id' || key === '__v' || key === 'createdAt' || key === 'updatedAt') {
      continue;
    }
    
    // Check if this is likely a URL field
    if (
      typeof value === 'string' && 
      (key.toLowerCase().includes('url') || 
       key.toLowerCase().includes('image') || 
       key.toLowerCase().includes('video') ||
       key.toLowerCase().includes('media') ||
       key.toLowerCase().includes('thumbnail') ||
       key.toLowerCase().includes('poster'))
    ) {
      updated[key] = updateUrl(value);
    } else if (value && typeof value === 'object') {
      updated[key] = updateUrlsInObject(value);
    } else {
      updated[key] = value;
    }
  }
  
  return updated;
}

async function updateImageUrls() {
  try {
    console.log(`\n🔄 Updating image URLs from ${OLD_BASE_URL} to ${NEW_BASE_URL}\n`);

    // Update Content collection
    console.log('📝 Updating Content collection...');
    const content = await Content.findOne();
    
    if (!content) {
      console.log('⚠️  No content found in database');
    } else {
      const contentObj = content.toObject();
      const originalContent = JSON.stringify(contentObj);
      
      // Update only the content fields, exclude MongoDB metadata
      const updatedFields = {};
      const fieldsToUpdate = ['site', 'home', 'about', 'services', 'stories', 'destination', 'contact', 'footer'];
      
      let hasChanges = false;
      for (const field of fieldsToUpdate) {
        if (contentObj[field]) {
          const updatedField = updateUrlsInObject(contentObj[field]);
          if (JSON.stringify(contentObj[field]) !== JSON.stringify(updatedField)) {
            updatedFields[field] = updatedField;
            hasChanges = true;
          }
        }
      }
      
      // Check if there were any changes
      if (hasChanges) {
        // Update only the changed fields
        for (const [field, value] of Object.entries(updatedFields)) {
          content.set(field, value);
        }
        await content.save();
        console.log('✅ Content collection updated');
      } else {
        console.log('ℹ️  No URLs to update in Content collection');
      }
    }

    // Update Media collection
    console.log('\n📸 Updating Media collection...');
    const mediaItems = await Media.find();
    
    let mediaUpdated = 0;
    for (const media of mediaItems) {
      const originalUrl = media.url;
      const updatedUrl = updateUrl(originalUrl);
      
      if (originalUrl !== updatedUrl) {
        media.url = updatedUrl;
        await media.save();
        mediaUpdated++;
        console.log(`  ✓ Updated: ${media.filename}`);
      }
    }
    
    if (mediaUpdated > 0) {
      console.log(`✅ Updated ${mediaUpdated} media items`);
    } else {
      console.log('ℹ️  No URLs to update in Media collection');
    }

    console.log('\n✨ URL update completed successfully!\n');
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Error updating URLs:', error);
    process.exit(1);
  }
}

// Run the script
updateImageUrls();
