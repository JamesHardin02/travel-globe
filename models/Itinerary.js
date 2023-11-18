const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

// creates Itinerary model
class Itinerary extends Model {};

// creates columns of Itinerary model
Itinerary.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    user_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'user',
        key: 'id'
      },
      allowNull: false
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    blurb: {
      type: DataTypes.TEXT('long'),
      allowNull: false
    },
    nation_A3: {
      type: DataTypes.STRING,
      allowNull: false
    },
    nation_name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    category: {
      type: DataTypes.STRING,
      allowNull: false
    },
    content: {
      type: DataTypes.TEXT('long'),
      allowNull: false
    },
    thumbnail: {
      type: DataTypes.STRING,
      allowNull: false
    }
  },
  {
    sequelize,
    timestamps: false,
    freezeTableName: true,
    underscored: true,
    modelName: 'itinerary'
  }
);

module.exports = Itinerary;