const router = require('express').Router();

const api = require('./api/');
const homeRoutes = require('./home-routes');
const blogRoutes = require('./blog-routes');
const dashboardRoutes = require('./dashboard-routes.js');
const featureRoutes = require('./feature-routes.js');
const itineraryRoutes = require('./itinerary-routes.js');

router.use('/', homeRoutes);
router.use('/feature', featureRoutes);
router.use('/blog', blogRoutes);
router.use('/itinerary', itineraryRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/api', api);

module.exports = router;
