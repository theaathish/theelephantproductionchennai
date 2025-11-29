const express = require('express');
const router = express.Router();
const Content = require('../models/Content');
const authMiddleware = require('../middleware/auth');

// Fix stories.items data
router.post('/fix-stories', authMiddleware, async (req, res) => {
  try {
    const content = await Content.findOne().sort({ createdAt: -1 });
    
    if (!content) {
      return res.status(404).json({ 
        success: false, 
        message: 'No content found' 
      });
    }
    
    const baseUrl = process.env.BACKEND_URL || `http://localhost:${process.env.PORT || 5001}`;
    
    // Restore complete stories.items structure
    content.stories.items = [
      {
        id: 1,
        type: 'film',
        title: 'Kavya & Rohan',
        subtitle: 'Wedding Film • Chennai',
        imageUrl: `${baseUrl}/uploads/portfolio4-1764177326766-79291280.jpg`,
        videoUrl: '/videos/portfolio1.mp4',
        featured: true
      }
    ];
    
    // Mark as modified and save
    content.markModified('stories');
    await content.save();
    
    res.json({
      success: true,
      message: 'Stories data fixed successfully',
      data: content.stories.items
    });
  } catch (error) {
    console.error('Fix stories error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fix stories data',
      error: error.message
    });
  }
});

module.exports = router;
