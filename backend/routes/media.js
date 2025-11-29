const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;
const Media = require('../models/Media');
const authMiddleware = require('../middleware/auth');

// Ensure upload directory exists
const ensureUploadDir = async () => {
  const uploadDir = path.join(__dirname, '../uploads');
  try {
    await fs.access(uploadDir);
  } catch {
    await fs.mkdir(uploadDir, { recursive: true });
  }
};

ensureUploadDir();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../uploads');
    await ensureUploadDir();
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    const name = path.basename(file.originalname, ext).replace(/[^a-z0-9]/gi, '-').toLowerCase();
    cb(null, `${name}-${uniqueSuffix}${ext}`);
  }
});

const upload = multer({
  storage,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 100 * 1024 * 1024 // 100MB default
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp|mp4|mov|avi|webm/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (extname && mimetype) {
      cb(null, true);
    } else {
      cb(new Error('Only image and video files are allowed'));
    }
  }
});

// Get all media (protected)
router.get('/', authMiddleware, async (req, res) => {
  try {
    const media = await Media.find().sort({ uploadedAt: -1 });
    
    res.json({
      success: true,
      data: media,
      count: media.length
    });
  } catch (error) {
    console.error('Get media error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch media' 
    });
  }
});

// Upload media files (protected)
router.post('/upload', authMiddleware, upload.array('files', 10), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'No files uploaded' 
      });
    }

    const uploadedFiles = [];

    for (const file of req.files) {
      // Build the full URL for the uploaded file
      const baseUrl = process.env.BACKEND_URL || `http://localhost:${process.env.PORT || 5001}`;
      const fileUrl = `${baseUrl}/uploads/${file.filename}`;
      
      const mediaDoc = await Media.create({
        name: file.originalname,
        filename: file.filename,
        url: fileUrl,
        type: file.mimetype.startsWith('image') ? 'image' : 'video',
        mimetype: file.mimetype,
        size: file.size
      });

      uploadedFiles.push(mediaDoc);
    }

    res.json({
      success: true,
      message: 'Files uploaded successfully',
      data: uploadedFiles
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message || 'Failed to upload files' 
    });
  }
});

// Delete media (protected)
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const media = await Media.findById(req.params.id);
    
    if (!media) {
      return res.status(404).json({ 
        success: false, 
        message: 'Media not found' 
      });
    }

    // Delete file from disk
    const filePath = path.join(__dirname, '../uploads', media.filename);
    try {
      await fs.unlink(filePath);
    } catch (err) {
      console.error('File deletion error:', err);
    }

    // Remove from database
    await Media.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Media deleted successfully'
    });
  } catch (error) {
    console.error('Delete media error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to delete media' 
    });
  }
});

// Get media stats (protected)
router.get('/stats', authMiddleware, async (req, res) => {
  try {
    const totalMedia = await Media.countDocuments();
    const images = await Media.countDocuments({ type: 'image' });
    const videos = await Media.countDocuments({ type: 'video' });
    
    const sizeAgg = await Media.aggregate([
      {
        $group: {
          _id: null,
          totalSize: { $sum: '$size' }
        }
      }
    ]);
    
    const totalSize = sizeAgg.length > 0 ? sizeAgg[0].totalSize : 0;

    res.json({
      success: true,
      data: {
        total: totalMedia,
        images,
        videos,
        totalSize
      }
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch stats' 
    });
  }
});

module.exports = router;
