const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');
const {
    createArticle,
    listArticles,
    getArticle,
    myArticles,
    updateArticle,
    deleteArticle,
} = require('../controllers/articleController');

// Public routes
router.get('/', listArticles);

// Protected: must come BEFORE /:id so Express doesn't treat "my" as an ID
router.get('/my', authenticate, myArticles);

router.get('/:id', getArticle);

// Protected routes (require valid JWT)
router.post('/', authenticate, createArticle);
router.put('/:id', authenticate, updateArticle);
router.delete('/:id', authenticate, deleteArticle);

module.exports = router;
