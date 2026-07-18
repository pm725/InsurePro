const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const User = require('./User');
const Tip = sequelize.define('Tip', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    title: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    content: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    upvotes: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    }
}, {
    tableName: 'tips',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});
Tip.belongsTo(User, { foreignKey: 'user_id' });

module.exports = Tip;