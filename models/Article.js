const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const User = require('./User');

const Article = sequelize.define('Article', {
    title: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    category: {
        type: DataTypes.ENUM('Tech', 'AI', 'Backend', 'Frontend', 'DevOps'),
        allowNull: false,
    },
    content: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    tags: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    shortSummary: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
});

// Association: Article belongs to User (author)
Article.belongsTo(User, { foreignKey: 'userId', as: 'author' });
User.hasMany(Article, { foreignKey: 'userId', as: 'articles' });

module.exports = Article;
