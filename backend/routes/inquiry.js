const express = require('express');
const router = express.Router();
const Inquiry = require('../models/Inquiry');
const authMiddleware = require('../middleware/auth');

// Submit inquiry (public)
router.post('/submit', async (req, res) => {
  try {
    const { name, partner, email, phone, date, story } = req.body;

    // Validate required fields
    if (!name || !email || !story) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, and story are required'
      });
    }

    // Create inquiry
    const inquiry = await Inquiry.create({
      name,
      partner,
      email,
      phone,
      date: date ? new Date(date) : null,
      story,
      status: 'unread'
    });

    res.status(201).json({
      success: true,
      message: 'Inquiry submitted successfully',
      data: inquiry
    });
  } catch (error) {
    console.error('Submit inquiry error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit inquiry'
    });
  }
});

// Get all inquiries (protected)
router.get('/', authMiddleware, async (req, res) => {
  try {
    const { status } = req.query;
    const filter = status ? { status } : {};
    
    const inquiries = await Inquiry.find(filter).sort({ createdAt: -1 });
    
    res.json({
      success: true,
      data: inquiries,
      count: inquiries.length
    });
  } catch (error) {
    console.error('Get inquiries error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch inquiries'
    });
  }
});

// Get single inquiry (protected)
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const inquiry = await Inquiry.findById(req.params.id);
    
    if (!inquiry) {
      return res.status(404).json({
        success: false,
        message: 'Inquiry not found'
      });
    }

    res.json({
      success: true,
      data: inquiry
    });
  } catch (error) {
    console.error('Get inquiry error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch inquiry'
    });
  }
});

// Mark inquiry as read (protected)
router.patch('/:id/read', authMiddleware, async (req, res) => {
  try {
    const inquiry = await Inquiry.findByIdAndUpdate(
      req.params.id,
      { status: 'read' },
      { new: true }
    );
    
    if (!inquiry) {
      return res.status(404).json({
        success: false,
        message: 'Inquiry not found'
      });
    }

    res.json({
      success: true,
      message: 'Inquiry marked as read',
      data: inquiry
    });
  } catch (error) {
    console.error('Mark as read error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update inquiry'
    });
  }
});

// Mark inquiry as unread (protected)
router.patch('/:id/unread', authMiddleware, async (req, res) => {
  try {
    const inquiry = await Inquiry.findByIdAndUpdate(
      req.params.id,
      { status: 'unread' },
      { new: true }
    );
    
    if (!inquiry) {
      return res.status(404).json({
        success: false,
        message: 'Inquiry not found'
      });
    }

    res.json({
      success: true,
      message: 'Inquiry marked as unread',
      data: inquiry
    });
  } catch (error) {
    console.error('Mark as unread error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update inquiry'
    });
  }
});

// Delete inquiry (protected)
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const inquiry = await Inquiry.findByIdAndDelete(req.params.id);
    
    if (!inquiry) {
      return res.status(404).json({
        success: false,
        message: 'Inquiry not found'
      });
    }

    res.json({
      success: true,
      message: 'Inquiry deleted successfully'
    });
  } catch (error) {
    console.error('Delete inquiry error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete inquiry'
    });
  }
});

// Get inquiry statistics (protected)
router.get('/stats/summary', authMiddleware, async (req, res) => {
  try {
    const total = await Inquiry.countDocuments();
    const unread = await Inquiry.countDocuments({ status: 'unread' });
    const read = await Inquiry.countDocuments({ status: 'read' });
    
    res.json({
      success: true,
      data: {
        total,
        unread,
        read
      }
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch statistics'
    });
  }
});

module.exports = router;
