const router = require('express').Router();
const { getDestinations } = require('../utils/get-destinations');
// render homepage
router.get('/', async (req, res) => {
  getDestinations().then(destinationData => {
    res.render('index', {
      loggedIn: req.session.loggedIn,
      nav: {
        loggedIn: req.session.loggedIn,
        destinations: destinationData
      },
      hero: {
        video: "/public/html5-videos-22/My-Voyages-(Vercion-1)website-resize2.mp4",
        title: "Welcome to<br /><span id='hero-title-space'>My Voyages</span>",
        content: "Turn your vacation into a voyage through social interaction and curated itineraries provided by experienced world travelers who know the best spots for your travel destinations.",
        button: true
      },
      promoVideo: {
        video: "https://player.vimeo.com/external/363737257.sd.mp4?s=56f6959fc24ef2533531ddba2895bb8f4be7d2ed&profile_id=164&oauth2_token_id=57447761",
        content: "My Voyages is a next generation travel app that allows its users to curate better lifestyle and travel experiences through social interaction."
      },
      footer: {
        video: "/public/html5-videos-22/My-Voyages-(Vercion-1)website.mp4",
        content: "My<br>Voyages",
        noForm: true
      }
    });
  });
});

router.get('/ambassador', (req, res) => {
  getDestinations().then(destinationData => {
    res.render('ambassador', {
      loggedIn: req.session.loggedIn,
      nav: {
        loggedIn: req.session.loggedIn,
        destinations: destinationData
      },
      hero: {
        video: "/public/html5-videos-22/About-Video2.mp4",
        title: "Become a <span id='hero-title-space'>Voyager</span>",
        content: "Turn your vacation into a voyage through social interaction and curated itineraries provided by experienced world travelers who know the best spots for your travel destinations.",
        button: false
      },
      promoVideo: {
        video: "/public/html5-videos-22/About-Video2.mp4",
        content: "ARE YOU THE PERSON WHO FINDS THE COOLEST SPOTS AND MAKES SURE EVERYONE HAS A WONDERFUL TIME?",
        noAccessBtn: true
      },
      footer: {
        video: "/public/html5-videos-22/Luxex.mp4",
        content: "My<br>Voyages",
        noForm: true,
        pTop: true
      }
    });
  });
});

router.get('/contact', (req, res) => {
  getDestinations().then(destinationData => {
    res.render('contact-page', {
      loggedIn: req.session.loggedIn,
      nav: {
        loggedIn: req.session.loggedIn,
        destinations: destinationData
      },
      hero: {
        video: "/public/html5-videos-22/My-Voyages-(Vercion-1)website.mp4",
        content: "Contact Us",
        class: "hero-heading hero-heading-home fadeIn-element",
        noAccessBtn: true
      },
      footer: {
        video: "https://www.11-76.com/html5-videos-22/luxex/luxex.mp4",
        content: "ARE YOU THE PERSON WHO FINDS THE COOLEST SPOTS AND MAKES SURE EVERYONE HAS A WONDERFUL TIME?",
        contactUs: true,
        pBottom: true,
        noTopLines: true
      }
    });
  });
});

// login page
router.get('/login-signup', (req, res) => {
  if (req.session.loggedIn) {
    res.redirect('/');
    return;
  };
  getDestinations().then(destinationData => {
    res.render('login-signup', {
      loggedIn: req.session.loggedIn,
      nav: {
        loggedIn: req.session.loggedIn,
        destinations: destinationData
      },
      hero: {
        video: "/public/html5-videos-22/About-Video2.mp4",
        content: "Login / Sign Up",
        class: "hero-heading hero-heading-home fadeIn-element",
        noAccessBtn: true
      },
      footer: {
        signup: true,
        noTopLines: true
      }
    });
  });
});

module.exports = router;