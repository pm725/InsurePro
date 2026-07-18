const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const TipUpvote = sequelize.define('TipUpvote', {
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
    }
}, {
    tableName: 'tip_upvotes',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false
});

module.exports = TipUpvote;