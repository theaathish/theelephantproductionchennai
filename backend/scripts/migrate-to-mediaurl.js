const mongoose = require('mongoose');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

// Define schema
const contentSchema = new mongoose.Schema({}, { strict: false });
const Content = mongoose.model('Content', contentSchema);

async function migrateToMediaUrl() {
  try {
    console.log('Starting migration to mediaUrl field...\n');

    // Get all documents
    const docs = await Content.find({});
    console.log(`Found ${docs.length} documents to process\n`);

    let updatedCount = 0;
    let skippedCount = 0;

    for (const doc of docs) {
      let hasChanges = false;
      
      // Process home.latestJournals.stories
      if (doc.home?.latestJournals?.stories) {
        for (const story of doc.home.latestJournals.stories) {
          if (!story.mediaUrl) {
            // Consolidate imageUrl or videoUrl into mediaUrl
            if (story.imageUrl) {
              story.mediaUrl = story.imageUrl;
              delete story.imageUrl;
              hasChanges = true;
              console.log(`  ✓ Migrated imageUrl to mediaUrl: ${story.title}`);
            } else if (story.videoUrl) {
              story.mediaUrl = story.videoUrl;
              delete story.videoUrl;
              hasChanges = true;
              console.log(`  ✓ Migrated videoUrl to mediaUrl: ${story.title}`);
            }
          } else {
            // mediaUrl exists, clean up old fields
            if (story.imageUrl || story.videoUrl) {
              delete story.imageUrl;
              delete story.videoUrl;
              hasChanges = true;
              console.log(`  ✓ Cleaned up old fields for: ${story.title}`);
            }
          }
        }
      }

      // Process stories.items
      if (doc.stories?.items) {
        for (const item of doc.stories.items) {
          if (!item.mediaUrl) {
            // Consolidate imageUrl or videoUrl into mediaUrl
            if (item.imageUrl) {
              item.mediaUrl = item.imageUrl;
              delete item.imageUrl;
              hasChanges = true;
              console.log(`  ✓ Migrated imageUrl to mediaUrl: ${item.title}`);
            } else if (item.videoUrl) {
              item.mediaUrl = item.videoUrl;
              delete item.videoUrl;
              hasChanges = true;
              console.log(`  ✓ Migrated videoUrl to mediaUrl: ${item.title}`);
            }
          } else {
            // mediaUrl exists, clean up old fields
            if (item.imageUrl || item.videoUrl) {
              delete item.imageUrl;
              delete item.videoUrl;
              hasChanges = true;
              console.log(`  ✓ Cleaned up old fields for: ${item.title}`);
            }
          }
        }
      }

      // Process services.packages
      if (doc.services?.packages) {
        for (const pkg of doc.services.packages) {
          if (!pkg.mediaUrl) {
            // Consolidate imageUrl or videoUrl into mediaUrl
            if (pkg.imageUrl) {
              pkg.mediaUrl = pkg.imageUrl;
              delete pkg.imageUrl;
              hasChanges = true;
              console.log(`  ✓ Migrated imageUrl to mediaUrl: ${pkg.name}`);
            } else if (pkg.videoUrl) {
              pkg.mediaUrl = pkg.videoUrl;
              delete pkg.videoUrl;
              hasChanges = true;
              console.log(`  ✓ Migrated videoUrl to mediaUrl: ${pkg.name}`);
            }
          } else {
            // mediaUrl exists, clean up old fields
            if (pkg.imageUrl || pkg.videoUrl) {
              delete pkg.imageUrl;
              delete pkg.videoUrl;
              hasChanges = true;
              console.log(`  ✓ Cleaned up old fields for: ${pkg.name}`);
            }
          }
        }
      }

      // Process services.packages
      if (doc.services?.packages) {
        for (const pkg of doc.services.packages) {
          if (!pkg.mediaUrl) {
            // Consolidate imageUrl or videoUrl into mediaUrl
            if (pkg.imageUrl) {
              pkg.mediaUrl = pkg.imageUrl;
              delete pkg.imageUrl;
              hasChanges = true;
              console.log(`  ✓ Migrated imageUrl to mediaUrl: ${pkg.name || pkg.title}`);
            } else if (pkg.videoUrl) {
              pkg.mediaUrl = pkg.videoUrl;
              delete pkg.videoUrl;
              hasChanges = true;
              console.log(`  ✓ Migrated videoUrl to mediaUrl: ${pkg.name || pkg.title}`);
            }
          } else {
            // mediaUrl exists, clean up old fields
            if (pkg.imageUrl || pkg.videoUrl) {
              delete pkg.imageUrl;
              delete pkg.videoUrl;
              hasChanges = true;
              console.log(`  ✓ Cleaned up old fields for: ${pkg.name || pkg.title}`);
            }
          }
        }
      }

      if (hasChanges) {
        await doc.save();
        updatedCount++;
        console.log(`\n✅ Document updated: ${doc._id}\n`);
      } else {
        skippedCount++;
      }
    }

    console.log('\n=== Migration Complete ===');
    console.log(`✅ Updated: ${updatedCount} documents`);
    console.log(`⏭️  Skipped: ${skippedCount} documents (no changes needed)`);
    console.log('==========================\n');

  } catch (error) {
    console.error('Migration error:', error);
  } finally {
    await mongoose.connection.close();
    console.log('Database connection closed');
    process.exit(0);
  }
}

// Run migration
migrateToMediaUrl();
