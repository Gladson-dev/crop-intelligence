import express from 'express';
import path from 'path';
import fs from 'fs';
import auth from '../middleware/auth.js';
import upload from '../middleware/upload.js';

const router = express.Router();

// @route   POST api/images/upload
// @desc    Upload an image
// @access  Private
router.post('/upload', auth, upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ msg: 'No file uploaded' });
    }

    // Return the file path (relative to the 'uploads' directory)
    res.json({
      msg: 'File uploaded successfully',
      filePath: `/uploads/${req.file.filename}`
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   DELETE api/images/:filename
// @desc    Delete an image
// @access  Private
router.delete('/:filename', auth, (req, res) => {
  try {
    const filePath = path.join(__dirname, '../uploads', req.params.filename);
    
    // Check if file exists
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      res.json({ msg: 'File deleted successfully' });
    } else {
      return res.status(404).json({ msg: 'File not found' });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

export default router;
