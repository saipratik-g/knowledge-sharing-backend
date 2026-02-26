const Article = require('../models/Article');
const User = require('../models/User');
const { Op } = require('sequelize');
const { improveContent, generateSummary } = require('../services/aiService');

/**
 * POST /api/articles
 * Create a new article. Requires authentication.
 * Optionally improves content and auto-generates shortSummary via AI service.
 */
const createArticle = async (req, res) => {
    try {
        const { title, category, content, tags, useAI } = req.body;

        if (!title || !category || !content) {
            return res.status(400).json({ message: 'Title, category, and content are required.' });
        }

        const finalContent = useAI ? improveContent(content) : content;
        const shortSummary = generateSummary(finalContent);

        const article = await Article.create({
            title,
            category,
            content: finalContent,
            tags,
            shortSummary,
            userId: req.user.id,
        });

        return res.status(201).json({ message: 'Article created successfully.', article });
    } catch (error) {
        console.error('Create article error:', error);
        return res.status(500).json({ message: 'Internal server error.' });
    }
};

/**
 * GET /api/articles
 * List all articles with optional filters: category, tags, search (title/summary).
 */
const listArticles = async (req, res) => {
    try {
        const { category, tags, search } = req.query;

        const where = {};

        if (category) {
            where.category = category;
        }

        if (tags) {
            where.tags = { [Op.like]: `%${tags}%` };
        }

        if (search) {
            where[Op.or] = [
                { title: { [Op.like]: `%${search}%` } },
                { shortSummary: { [Op.like]: `%${search}%` } },
            ];
        }

        const articles = await Article.findAll({
            where,
            include: [{ model: User, as: 'author', attributes: ['id', 'username', 'email'] }],
            order: [['createdAt', 'DESC']],
        });

        return res.status(200).json({ count: articles.length, articles });
    } catch (error) {
        console.error('List articles error:', error);
        return res.status(500).json({ message: 'Internal server error.' });
    }
};

/**
 * GET /api/articles/:id
 * Get a single article by ID.
 */
const getArticle = async (req, res) => {
    try {
        const article = await Article.findByPk(req.params.id, {
            include: [{ model: User, as: 'author', attributes: ['id', 'username', 'email'] }],
        });

        if (!article) {
            return res.status(404).json({ message: 'Article not found.' });
        }

        return res.status(200).json({ article });
    } catch (error) {
        console.error('Get article error:', error);
        return res.status(500).json({ message: 'Internal server error.' });
    }
};

/**
 * PUT /api/articles/:id
 * Update an article. Only the original author can update.
 */
const updateArticle = async (req, res) => {
    try {
        const article = await Article.findByPk(req.params.id);

        if (!article) {
            return res.status(404).json({ message: 'Article not found.' });
        }

        // Authorization check
        if (article.userId !== req.user.id) {
            return res.status(403).json({ message: 'Forbidden. You are not the author of this article.' });
        }

        const { title, category, content, tags, useAI } = req.body;

        const finalContent = content
            ? useAI
                ? improveContent(content)
                : content
            : article.content;

        const shortSummary = content ? generateSummary(finalContent) : article.shortSummary;

        await article.update({
            title: title ?? article.title,
            category: category ?? article.category,
            content: finalContent,
            tags: tags ?? article.tags,
            shortSummary,
        });

        return res.status(200).json({ message: 'Article updated successfully.', article });
    } catch (error) {
        console.error('Update article error:', error);
        return res.status(500).json({ message: 'Internal server error.' });
    }
};

/**
 * GET /api/articles/my
 * List all articles written by the authenticated user.
 */
const myArticles = async (req, res) => {
    try {
        const articles = await Article.findAll({
            where: { userId: req.user.id },
            include: [{ model: User, as: 'author', attributes: ['id', 'username', 'email'] }],
            order: [['createdAt', 'DESC']],
        });

        return res.status(200).json({ count: articles.length, articles });
    } catch (error) {
        console.error('My articles error:', error);
        return res.status(500).json({ message: 'Internal server error.' });
    }
};

/**
 * DELETE /api/articles/:id
 * Delete an article. Only the original author can delete.
 */
const deleteArticle = async (req, res) => {
    try {
        const article = await Article.findByPk(req.params.id);

        if (!article) {
            return res.status(404).json({ message: 'Article not found.' });
        }

        // Authorization check
        if (article.userId !== req.user.id) {
            return res.status(403).json({ message: 'Forbidden. You are not the author of this article.' });
        }

        await article.destroy();

        return res.status(200).json({ message: 'Article deleted successfully.' });
    } catch (error) {
        console.error('Delete article error:', error);
        return res.status(500).json({ message: 'Internal server error.' });
    }
};

module.exports = { createArticle, listArticles, getArticle, myArticles, updateArticle, deleteArticle };
