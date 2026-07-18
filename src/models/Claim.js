const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const User = require('./User');

const Claim = sequelize.define('Claim', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    document_path: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    status: {
        type: DataTypes.ENUM('Pending', 'Approved', 'Rejected'),
        defaultValue: 'Pending'
    }
}, {
    tableName: 'claims',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

// ✅ ADD THIS RELATIONSHIP
Claim.belongsTo(User, { foreignKey: 'user_id' });

module.exports = Claim;