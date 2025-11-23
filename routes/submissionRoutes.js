const express = require('express');
const router = express.Router();
const upload = require('../middleware/multer');
const { submitGuestArticle } = require('../controllers/submissionController');

// Submit guest article (public)
router.post('/guest', upload.single('featuredImage'), submitGuestArticle);

module.exports = router;

