const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const User = require('./User');


const RiskProfile = sequelize.define('RiskProfile', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    risk_score: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    premium: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 50.00
    },
    age: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    bmi: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: true
    },
    smoking: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
}, {
    tableName: 'risk_profiles',
    timestamps: true
});
RiskProfile.belongsTo(User, { foreignKey: 'user_id' });

module.exports = RiskProfile;