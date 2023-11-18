// import important parts of sequelize library
const { Model, DataTypes } = require('sequelize');

// import database connection from config.js
const sequelize = require('../config/connection.js');

// set up fields and rules for Product model
class Category extends Model {}

// set up fields and rules for Product model
Category.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    category_name: {
      type: DataTypes.STRING,
      allowNull: false
    },
  },
  {
    sequelize,
    timestamps: false,
    freezeTableName: true,
    underscored: true,
    modelName: 'category',
  }
);

module.exports = Category;