const express = require('express');
const router = express.Router();
const Content = require('../models/Content');
const authMiddleware = require('../middleware/auth');

// Clean up story media fields
router.post('/clean-story-media', authMiddleware, async (req, res) => {
  try {
    const content = await Content.findOne().sort({ createdAt: -1 });
    
    if (!content) {
      return res.status(404).json({ 
        success: false, 
        message: 'No content found' 
      });
    }
    
    // Clean up home.latestJournals.stories
    if (content.home?.latestJournals?.stories) {
      content.home.latestJournals.stories = content.home.latestJournals.stories.map(story => {
        // If has image, clear video
        if (story.imageUrl && story.imageUrl.trim() !== '') {
          story.videoUrl = '';
        }
        // If has video, clear image
        if (story.videoUrl && story.videoUrl.trim() !== '') {
          story.imageUrl = '';
        }
        return story;
      });
      content.markModified('home');
    }
    
    // Clean up stories.items
    if (content.stories?.items) {
      content.stories.items = content.stories.items.map(story => {
        // If has image, clear video
        if (story.imageUrl && story.imageUrl.trim() !== '') {
          story.videoUrl = '';
        }
        // If has video, clear image  
        if (story.videoUrl && story.videoUrl.trim() !== '') {
          story.imageUrl = '';
        }
        return story;
      });
      content.markModified('stories');
    }
    
    await content.save();
    
    res.json({
      success: true,
      message: 'Story media cleaned successfully'
    });
  } catch (error) {
    console.error('Clean story media error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to clean story media',
      error: error.message
    });
  }
});

module.exports = router;
