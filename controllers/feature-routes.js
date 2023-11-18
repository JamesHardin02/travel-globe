const router = require('express').Router();

// render homepage
router.get('/greece', (req, res) => {
  res.render('greece-feature', {
    loggedIn: req.session.loggedIn,
    footer: {
      video: "https://www.11-76.com/html5-videos-22/luxex/luxex.mp4",
      content: "My<br>Voyages"
    }
  });
});

module.exports = router;