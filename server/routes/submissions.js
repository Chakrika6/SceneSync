const express = require('express');
const upload = require('../middleware/upload');
const { create, getAll } = require('../controllers/submissionController');

const router = express.Router();

router.post('/upload', upload.single('image'), create);
router.get('/', getAll);

module.exports = router;
