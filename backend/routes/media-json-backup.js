const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;
const authMiddleware = require('../middleware/auth');

const MEDIA_FILE = path.join(__dirname, '../data/media.json');

// Ensure directories exist
const ensureDirectories = async () => {
  const dirs = [
    path.join(__dirname, '../uploads'),
    path.join(__dirname, '../data')
  ];
  
  for (const dir of dirs) {
    try {
      await fs.access(dir);
    } catch {
      await fs.mkdir(dir, { recursive: true });
    }
  }
};

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../uploads');
    await ensureDirectories();
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    const name = path.basename(file.originalname, ext);
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

// Initialize media database
const initializeMediaDB = async () => {
  await ensureDirectories();
  try {
    await fs.access(MEDIA_FILE);
  } catch {
    await fs.writeFile(MEDIA_FILE, JSON.stringify({ media: [] }, null, 2));
  }
};

// Get all media
router.get('/', authMiddleware, async (req, res) => {
  try {
    await initializeMediaDB();
    const data = await fs.readFile(MEDIA_FILE, 'utf8');
    const { media } = JSON.parse(data);
    
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

// Upload media (single or multiple files)
router.post('/upload', authMiddleware, upload.array('files', 10), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'No files uploaded' 
      });
    }

    await initializeMediaDB();
    const data = await fs.readFile(MEDIA_FILE, 'utf8');
    const mediaDB = JSON.parse(data);

    const uploadedFiles = req.files.map(file => ({
      id: Date.now() + '-' + Math.random().toString(36).substr(2, 9),
      name: file.originalname,
      filename: file.filename,
      url: `/uploads/${file.filename}`,
      type: file.mimetype.startsWith('image') ? 'image' : 'video',
      size: file.size,
      uploadedAt: new Date().toISOString()
    }));

    mediaDB.media.push(...uploadedFiles);
    await fs.writeFile(MEDIA_FILE, JSON.stringify(mediaDB, null, 2));

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

// Delete media
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    await initializeMediaDB();
    const data = await fs.readFile(MEDIA_FILE, 'utf8');
    const mediaDB = JSON.parse(data);
    
    const mediaIndex = mediaDB.media.findIndex(m => m.id === req.params.id);
    
    if (mediaIndex === -1) {
      return res.status(404).json({ 
        success: false, 
        message: 'Media not found' 
      });
    }

    const media = mediaDB.media[mediaIndex];
    const filePath = path.join(__dirname, '../uploads', media.filename);
    
    // Delete file from disk
    try {
      await fs.unlink(filePath);
    } catch (err) {
      console.error('File deletion error:', err);
    }

    // Remove from database
    mediaDB.media.splice(mediaIndex, 1);
    await fs.writeFile(MEDIA_FILE, JSON.stringify(mediaDB, null, 2));

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

// Get media stats
router.get('/stats', authMiddleware, async (req, res) => {
  try {
    await initializeMediaDB();
    const data = await fs.readFile(MEDIA_FILE, 'utf8');
    const { media } = JSON.parse(data);
    
    const stats = {
      total: media.length,
      images: media.filter(m => m.type === 'image').length,
      videos: media.filter(m => m.type === 'video').length,
      totalSize: media.reduce((sum, m) => sum + m.size, 0)
    };

    res.json({
      success: true,
      data: stats
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
