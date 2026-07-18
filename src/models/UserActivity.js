const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const UserActivity = sequelize.define('UserActivity', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    activity_type: {
        type: DataTypes.STRING(50),
        allowNull: true
    },
    page: {
        type: DataTypes.STRING(100),
        allowNull: true
    }
}, {
    tableName: 'user_activities',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false
});

module.exports = UserActivity;