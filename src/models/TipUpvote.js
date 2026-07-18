const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const User = require('./User');


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
TipUpvote.belongsTo(User, { foreignKey: 'user_id' });
module.exports = TipUpvote;