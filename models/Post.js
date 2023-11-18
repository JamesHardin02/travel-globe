const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');
// create our Post model
class Post extends Model {
  // method added to post as though it inherited it from Model via 'static'
  // creates a vote in Vote model through the post that was voted on
  static upvote(body, models) {
    return models.Vote.create({
      user_id: body.user_id,
      post_id: body.post_id
    }).then(() => {
      return Post.findOne({
        where: {
          id: body.post_id
        },
        attributes: [
          'id',
          'title',
          'content',
          'created_at',
          [sequelize.literal('(SELECT COUNT(*) FROM vote WHERE post.id = vote.post_id)'), 'vote_count']
        ],
        include: [
          {
            model: models.Comment,
            attributes: ['id', 'comment_text', 'post_id', 'user_id', 'created_at'],
            include: {
              model: models.User,
              attributes: ['username']
            }
          }
        ]
      });
    });
  };
  static unvote(body, models) {
    return models.Vote.destroy({
      where: {
        user_id: body.user_id,
        post_id: body.post_id
      }
    }).then(() => {
      return Post.findOne({
        where: {
          id: body.post_id
        },
        attributes: [
          'id',
          'title',
          'content',
          'created_at',
          [sequelize.literal('(SELECT COUNT(*) FROM vote WHERE post.id = vote.post_id)'), 'vote_count']
        ],
        include: [
          {
            model: models.Comment,
            attributes: ['id', 'comment_text', 'post_id', 'user_id', 'created_at'],
            include: {
              model: models.User,
              attributes: ['username']
            }
          }
        ]
      });
    });
  };
  static connectItinerary(body, models) {
    return models.BlogMetaData.create({
      user_id: body.user_id,
      post_id: body.id,
      category_id: body.category_id,
      itinerary_id: body.itinerary_id
    }).then(() => {
      return Post.findOne({
        where: {
          id: body.id
        },
        attributes: [
          'id',
          'title',
          'created_at',
          [sequelize.literal('(SELECT COUNT(*) FROM vote WHERE post.id = vote.post_id)'), 'vote_count']
        ],
        include: [
          {
            model: models.Comment,
            attributes: ['id', 'comment_text', 'post_id', 'user_id', 'created_at'],
            include: {
              model: models.User,
              attributes: ['username']
            }
          }
        ]
      });
    });
  };
};

// create fields/columns for Post model
Post.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    title: {
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
    },
    city: {
      type: DataTypes.STRING,
      allowNull: false
    },
    user_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'user',
        key: 'id'
      },
      allowNull: false
    },
    category_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'category',
        key: 'id'
      },
      allowNull: false
    },
    itinerary_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'itinerary',
        key: 'id'
      },
      allowNull: false
    },
  },
  {
    hooks: {
      // hooks can run async functions before or after a model is created or updated
      async beforeCreate(newUserData) {
        switch (newUserData.category_id) {
          case "Stay":
            newUserData.category_id = 1
            return newUserData;
          case "Taste":
            newUserData.category_id = 2
            return newUserData;
          case "Vibe":
            newUserData.category_id = 3
            return newUserData;
          case "Experience":
            newUserData.category_id = 4
            return newUserData;
          default:
            return newUserData;
        }
      },

      async beforeUpdate(updatedUserData) {
        switch (updatedUserData.category_id) {
          case "Stay":
            updatedUserData.category_id = 1
            return updatedUserData;
          case "Taste":
            updatedUserData.category_id = 2
            return updatedUserData;
          case "Vibe":
            updatedUserData.category_id = 3
            return updatedUserData;
          case "Experience":
            updatedUserData.category_id = 4
            return updatedUserData;
          default:
            return updatedUserData;
        }
      }
    },
    sequelize,
    freezeTableName: true,
    underscored: true,
    modelName: 'post'
  }
);

module.exports = Post;
