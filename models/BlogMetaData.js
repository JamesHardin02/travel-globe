const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

// creates BlogMetaData model
class BlogMetaData extends Model {}

// creates columns for BlogMetaData model
BlogMetaData.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    user_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'user',
        key: 'id'
      }
    },
    post_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'post',
        key: 'id'
      }
    },    
    category_id: {
      type: DataTypes.INTEGER
    },
    itinerary_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'itinerary',
        key: 'id'
      }
    }
  },
  {
    sequelize,
    timestamps: false,
    freezeTableName: true,
    underscored: true,
    modelName: 'BlogMetaData'
  }
);

module.exports = BlogMetaData;