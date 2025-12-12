const pool = require('../db');
const { analyzeImage } = require('../utils/vision');
const exifr = require('exifr');
const { io } = require('../index');
const cloudinary = require('cloudinary').v2;
require('dotenv').config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const create = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const userId = req.body.user_id || 1; // Mock user_id for now

    // Extract GPS from image buffer
    let lat = null;
    let lng = null;
    try {
      const exifData = await exifr.parse(req.file.buffer);
      if (exifData?.latitude && exifData?.longitude) {
        lat = exifData.latitude;
        lng = exifData.longitude;
      }
    } catch (err) {
      console.log('EXIF extraction error:', err.message);
    }

    // Analyze image with Vision API
    const visionResult = await analyzeImage(req.file.buffer);
    const aiScore = visionResult.aiScore;

    // Upload to Cloudinary
    let imageUrl = null;
    try {
      const uploadStream = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { resource_type: 'auto' },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        stream.end(req.file.buffer);
      });
      imageUrl = uploadStream.secure_url;
    } catch (err) {
      console.log('Cloudinary upload error:', err.message);
      imageUrl = 'https://via.placeholder.com/300?text=Upload+Error';
    }

    // Insert into database
    const query =
      'INSERT INTO submissions (user_id, image_url, ai_score, lat, lng, created_at) VALUES ($1, $2, $3, $4, $5, NOW()) RETURNING *';
    const values = [userId, imageUrl, aiScore, lat, lng];

    const result = await pool.query(query, values);
    const submission = result.rows[0];

    // Emit Socket.io event
    io.emit('new_submission', {
      id: submission.id,
      image_url: submission.image_url,
      ai_score: submission.ai_score,
      lat: submission.lat,
      lng: submission.lng,
      created_at: submission.created_at,
      user_id: submission.user_id,
    });

    res.status(201).json({
      message: 'Submission created successfully',
      submission: submission,
    });
  } catch (error) {
    console.error('Submission error:', error);
    res.status(500).json({ error: error.message });
  }
};

const getAll = async (req, res) => {
  try {
    const query =
      'SELECT id, user_id, image_url, ai_score, lat, lng, created_at FROM submissions ORDER BY created_at DESC';
    const result = await pool.query(query);
    res.json(result.rows);
  } catch (error) {
    console.error('Fetch error:', error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = { create, getAll };
