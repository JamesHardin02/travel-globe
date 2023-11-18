// import all models
const Post = require('./Post');
const User = require('./User');
const Vote = require('./Vote');
const Comment = require('./Comment');
const Category = require('./Category');
const Itinerary = require('./Itinerary');
const BlogMetaData = require('./BlogMetaData');

// create associations
// One to many relationship between user and post
User.hasMany(Post, {
  foreignKey: 'user_id'
});

Post.belongsTo(User, {
  foreignKey: 'user_id',
  onDelete: 'SET NULL'
});

// create associations
// One to many relationship between user and itinerary
User.hasMany(Itinerary, {
  foreignKey: 'user_id'
});

Itinerary.belongsTo(User, {
  foreignKey: 'user_id',
  onDelete: 'SET NULL'
});

// Categories have many Post (one to many)
Category.hasMany(Post, {
  foreignKey: 'category_id'
});
// Post belongsTo Category (one to many)
Post.belongsTo(Category, {
  foreignKey: 'category_id',
});

// // Categories has many itinearies (one to many)
// Category.hasMany(Itinerary, {
//   foreignKey: 'category_id'
// });
// // Itinerary belongs To Category (one to many)
// Itinerary.belongsToMany(Category, {
//   foreignKey: 'category_id',
// });

// through table connection between user and post via vote
User.belongsToMany(Post, {
  through: Vote,
  as: 'voted_posts',
  foreignKey: 'user_id'
});

Post.belongsToMany(User, {
  through: Vote,
  as: 'voted_posts',
  foreignKey: 'post_id'
});

// one to one relationship between a vote 
// and a user and a vote and a post
Vote.belongsTo(User, {
  foreignKey: 'user_id',
  onDelete: 'SET NULL'
});

Vote.belongsTo(Post, {
  foreignKey: 'post_id',
  onDelete: 'SET NULL'
});

// many to many relationship between user and votes
// and post and votes.
User.hasMany(Vote, {
  foreignKey: 'user_id'
});

Post.hasMany(Vote, {
  foreignKey: 'post_id'
});

// one to one relatioship between a comment and a user
// and a comment and a post
Comment.belongsTo(User, {
  foreignKey: 'user_id',
  onDelete: 'SET NULL'
});

Comment.belongsTo(Post, {
  foreignKey: 'post_id',
  onDelete: 'SET NULL'
});

// One to many relationship between a user and their comments
// and a post and its comments
User.hasMany(Comment, {
  foreignKey: 'user_id',
  onDelete: 'SET NULL'
});

Post.hasMany(Comment, {
  foreignKey: 'post_id'
});

// create associations
// One to many relationship between an itinerary and blog posts
Itinerary.hasMany(Post, {
  foreignKey: 'itinerary_id'
})
Post.belongsTo(Itinerary, {
  foreignKey: 'itinerary_id',
  onDelete: 'SET NULL'
});

// one to one relationship between the BlogMetaData 
// and a itinerary and likewise the BlogMetaData and a BlogMetaData
BlogMetaData.belongsTo(Itinerary, {
  foreignKey: 'itinerary_id',
  onDelete: 'SET NULL'
});

BlogMetaData.belongsTo(Post, {
  foreignKey: 'post_id',
  onDelete: 'SET NULL'
});

// many to many relationship between itinerary and BlogMetaData
// and one to one between a blog and its BlogMetaData.
Itinerary.hasMany(BlogMetaData, {
  foreignKey: 'itinerary_id'
});

Post.hasOne(BlogMetaData, {
  foreignKey: 'post_id'
});

module.exports = { User, Post, Vote, Comment, Category, Itinerary, BlogMetaData };