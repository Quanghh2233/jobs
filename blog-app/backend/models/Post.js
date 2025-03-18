const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const User = require('./User');

const Post = sequelize.define('Post', {
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    content: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    tags: {
        type: DataTypes.STRING,
        allowNull: true,
        get() {
            const rawValue = this.getDataValue('tags');
            return rawValue ? rawValue.split(',') : [];
        },
        set(val) {
            if (Array.isArray(val)) {
                this.setDataValue('tags', val.join(','));
            } else {
                this.setDataValue('tags', val);
            }
        }
    },
    image: {
        type: DataTypes.STRING,
        allowNull: true
    }
}, {
    timestamps: true
});

// Set up association between Post and User
Post.belongsTo(User, {
    foreignKey: 'userId',
    as: 'user'
});

module.exports = Post;
