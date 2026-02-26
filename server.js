require('dotenv').config();
const express = require('express');
const cors = require('cors');

const sequelize = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const articleRoutes = require('./routes/articleRoutes');
const aiRoutes = require('./routes/aiRoutes');

// Import models to ensure associations are registered
require('./models/User');
require('./models/Article');

const app = express();
const PORT = process.env.PORT || 5000;

// ─── Middleware ───────────────────────────────────────────────────────────────
app.use(cors({
    origin: process.env.CLIENT_URL || '*', // Set CLIENT_URL in .env for production
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json());

// ─── Routes ──────────────────────────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/articles', articleRoutes);
app.use('/api/ai', aiRoutes);

// Health check
app.get('/', (req, res) => {
    res.json({ message: 'Knowledge Sharing Platform API is running.' });
});

// ─── 404 Handler ─────────────────────────────────────────────────────────────
app.use((req, res) => {
    res.status(404).json({ message: 'Route not found.' });
});

// ─── Global Error Handler ─────────────────────────────────────────────────────
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong.', error: err.message });
});

// ─── Database Sync & Server Start ─────────────────────────────────────────────
sequelize
    .sync({ alter: true }) // alter:true updates tables to match models without dropping data
    .then(() => {
        console.log('✅ Database synced successfully.');
        app.listen(PORT, () => {
            console.log(`🚀 Server running on http://localhost:${PORT}`);
        });
    })
    .catch((err) => {
        console.error('❌ Failed to sync database:', err);
        process.exit(1);
    });
