const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const TipComment = sequelize.define('TipComment', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    tip_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    comment: {
        type: DataTypes.TEXT,
        allowNull: false
    }
}, {
    tableName: 'tip_comments',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false
});

module.exports = TipComment;