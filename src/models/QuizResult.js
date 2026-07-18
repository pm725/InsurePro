const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const QuizResult = sequelize.define('QuizResult', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    health_score: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    answers: {
        type: DataTypes.TEXT,  // JSON string
        allowNull: true
    },
    completed_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
}, {
    tableName: 'quiz_results',
    timestamps: false
});

module.exports = QuizResult;