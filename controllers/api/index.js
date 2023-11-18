const router = require('express').Router();

// api endpoints
const userRoutes = require('./user-routes');
const postRoutes = require('./post-routes');
const commentRoutes = require('./comment-routes');
const categoryRoutes = require('./category-routes');

// uses end point modules to find route
router.use('/users', userRoutes);
router.use('/posts', postRoutes);
router.use('/comments', commentRoutes);
router.use('/categories', categoryRoutes);

module.exports = router;