const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');
const { improveContent, generateSummary } = require('../services/aiService');

/**
 * POST /api/ai/improve
 * Returns AI-improved version of the provided content.
 * Requires authentication.
 */
router.post('/improve', authenticate, (req, res) => {
    try {
        const { content } = req.body;

        if (!content || content.trim() === '') {
            return res.status(400).json({ message: 'Content is required.' });
        }

        const improved = improveContent(content);
        return res.status(200).json({ improved });
    } catch (error) {
        console.error('AI improve error:', error);
        return res.status(500).json({ message: 'Internal server error.' });
    }
});

/**
 * POST /api/ai/summary
 * Returns an auto-generated short summary of the provided content.
 * Requires authentication.
 */
router.post('/summary', authenticate, (req, res) => {
    try {
        const { content } = req.body;

        if (!content || content.trim() === '') {
            return res.status(400).json({ message: 'Content is required.' });
        }

        const summary = generateSummary(content);
        return res.status(200).json({ summary });
    } catch (error) {
        console.error('AI summary error:', error);
        return res.status(500).json({ message: 'Internal server error.' });
    }
});

module.exports = router;
