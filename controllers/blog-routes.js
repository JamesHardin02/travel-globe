const router = require('express').Router();
const sequelize = require('../config/connection');
const { Post, User, Comment, Vote, Category, Itinerary } = require('../models');
const { blogFeed } = require('../utils/post-rendering');
const { getDestinations } = require('../utils/get-destinations');

// get all posts for blogpage
router.get('/:id', (req, res) => {
  if (req.params.id == 0) {
    Post.findAll({
      attributes: [
        'id',
        'content',
        'city',
        'thumbnail',
        'title',
        'category_id',
        'created_at',
        [sequelize.literal('(SELECT COUNT(*) FROM vote WHERE post.id = vote.post_id)'), 'vote_count']
      ],
      include: [
        {
          model: Category,
          attributes: ['category_name']
        },
        {
          model: Comment,
          attributes: ['id', 'comment_text', 'post_id', 'user_id', 'created_at'],
          include: {
            model: User,
            attributes: ['username']
          }
        },
        {
          model: User,
          attributes: ['username']
        }
      ]
    })
      .then(dbPostData => {
        // serialize data for handlebars rendering
        const postsImgArr = dbPostData.map(post => post.get({ plain: true }));
        const cityObj = blogFeed(postsImgArr, true);
        if (postsImgArr.length == 0) {
          getDestinations().then(destinationData => {
            res.render('blog-page', {
              noPosts: true,
              loggedIn: req.session.loggedIn,
              gmaps: process.env.GMAPS,
              nav: {
                loggedIn: req.session.loggedIn,
                destinations: destinationData
              },
              hero: {
                video: "/public/html5-videos-22/My-Voyages-(Vercion-1)website.mp4",
                content: "Itinerary Blogs",
                class: "hero-heading hero-heading-home fadeIn-element"
              },
              footer: {
                video: "/public/html5-videos-22/My-Voyages-(Vercion-1)website.mp4",
                content: "My<br>Voyages",
                pTop: true,
                signup: true
              }
            });
          });
        } else {
          getDestinations().then(destinationData => {
            res.render('blog-page', {
              posts: cityObj,
              loggedIn: req.session.loggedIn,
              gmaps: process.env.GMAPS,
              nav: {
                loggedIn: req.session.loggedIn,
                destinations: destinationData
              },
              hero: {
                video: "/public/html5-videos-22/My-Voyages-(Vercion-1)website.mp4",
                content: "Itinerary Blogs",
                class: "hero-heading hero-heading-home fadeIn-element"
              },
              footer: {
                video: "/public/html5-videos-22/My-Voyages-(Vercion-1)website.mp4",
                content: "My<br>Voyages",
                pTop: true,
                signup: true
              }
            });
          });
        };
      })
      .catch(err => {
        console.log(err);
        res.status(500).json(err);
      });
  } else {
    Post.findAll({
      where: {
        category_id: req.params.id
      },
      attributes: [
        'id',
        'content',
        'city',
        'thumbnail',
        'title',
        'category_id',
        'created_at',
        [sequelize.literal('(SELECT COUNT(*) FROM vote WHERE post.id = vote.post_id)'), 'vote_count']
      ],
      include: [
        {
          model: Category,
          attributes: ['category_name']
        },
        {
          model: Comment,
          attributes: ['id', 'comment_text', 'post_id', 'user_id', 'created_at'],
          include: {
            model: User,
            attributes: ['username']
          }
        },
        {
          model: User,
          attributes: ['username']
        }
      ]
    })
      .then(dbPostData => {
        // serialize data for handlebars rendering
        const postsImgArr = dbPostData.map(post => post.get({ plain: true }));
        const cityObj = blogFeed(postsImgArr, true);
        getDestinations().then(destinationData => {
          res.render('blog-page', {
            posts: cityObj,
            loggedIn: req.session.loggedIn,
            gmaps: process.env.GMAPS,
            nav: {
              loggedIn: req.session.loggedIn,
              destinations: destinationData
            },
            hero: {
              video: "/public/html5-videos-22/My-Voyages-(Vercion-1)website.mp4",
              content: "Itinerary Blogs",
              class: "hero-heading hero-heading-home fadeIn-element"
            },
            footer: {
              video: "/public/html5-videos-22/My-Voyages-(Vercion-1)website.mp4",
              content: "My<br>Voyages",
              pTop: true,
              signup: true
            }
          });
        });
      })
      .catch(err => {
        console.log(err);
        res.status(500).json(err);
      });
  }
});

// GET /city/:city
// get all posts by city name
router.get('/city/:city', (req, res) => {
  Post.findAll({
    where: {
      city: req.params.city
    },
    attributes: [
      'id',
      'content',
      'city',
      'thumbnail',
      'title',
      'category_id',
      'created_at',
      [sequelize.literal('(SELECT COUNT(*) FROM vote WHERE post.id = vote.post_id)'), 'vote_count']
    ],
    include: [
      {
        model: Category,
        attributes: ['category_name']
      },
      {
        model: Comment,
        attributes: ['id', 'comment_text', 'post_id', 'user_id', 'created_at'],
        include: {
          model: User,
          attributes: ['username']
        }
      },
      {
        model: User,
        attributes: ['username']
      }
    ]
  })
    .then(dbPostData => {
      // serialize data for handlebars rendering
      const postsImgArr = dbPostData.map(post => post.get({ plain: true }));
      if (postsImgArr[0] === undefined) {
        getDestinations().then(destinationData => {
          res.render('blog-page', {
            noData: true,
            nav: {
              loggedIn: req.session.loggedIn,
              destinations: destinationData
            },
            footer: {
              video: "/public/html5-videos-22/My-Voyages-(Vercion-1)website.mp4",
              content: "My<br>Voyages",
              pTop: true,
              signup: true
            }
          });
        });
        return;
      };
      const cityObj = blogFeed(postsImgArr, true);
      getDestinations().then(destinationData => {
        res.render('blog-page', {
          posts: cityObj,
          loggedIn: req.session.loggedIn,
          gmaps: process.env.GMAPS,
          hero: {
            video: "/public/html5-videos-22/My-Voyages-(Vercion-1)website.mp4",
            content: "Itinerary Blogs",
            class: "hero-heading hero-heading-home fadeIn-element"
          },
          footer: {
            video: "/public/html5-videos-22/My-Voyages-(Vercion-1)website.mp4",
            content: "My<br>Voyages",
            pTop: true,
            signup: true
          }
        });
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});

// GET /city/:city
// get all posts by city name
router.get('/city/:city/:category', (req, res) => {
  if (req.params.category == 0) {
    Post.findAll({
      where: {
        city: req.params.city
      },
      attributes: [
        'id',
        'content',
        'city',
        'thumbnail',
        'title',
        'category_id',
        'created_at',
        [sequelize.literal('(SELECT COUNT(*) FROM vote WHERE post.id = vote.post_id)'), 'vote_count']
      ],
      include: [
        {
          model: Category,
          attributes: ['category_name']
        },
        {
          model: Comment,
          attributes: ['id', 'comment_text', 'post_id', 'user_id', 'created_at'],
          include: {
            model: User,
            attributes: ['username']
          }
        },
        {
          model: User,
          attributes: ['username']
        }
      ]
    })
      .then(dbPostData => {
        // serialize data for handlebars rendering
        const postsImgArr = dbPostData.map(post => post.get({ plain: true }));
        if (postsImgArr[0] === undefined) {
          res.render('blog-page', {
            noData: true
          });
          return;
        }
        const cityObj = blogFeed(postsImgArr, true);
        getDestinations().then(destinationData => {
          res.render('blog-page', {
            posts: cityObj,
            loggedIn: req.session.loggedIn,
            gmaps: process.env.GMAPS,
            nav: {
              loggedIn: req.session.loggedIn,
              destinations: destinationData
            },
            hero: {
              video: "/public/html5-videos-22/My-Voyages-(Vercion-1)website.mp4",
              content: "Itinerary Blogs",
              class: "hero-heading hero-heading-home fadeIn-element"
            },
            footer: {
              video: "/public/html5-videos-22/My-Voyages-(Vercion-1)website.mp4",
              content: "My<br>Voyages",
              pTop: true,
              signup: true
            }
          });
        });
      })
      .catch(err => {
        console.log(err);
        res.status(500).json(err);
      });
  } else {
    Post.findAll({
      where: {
        city: req.params.city,
        category_id: req.params.category
      },
      attributes: [
        'id',
        'content',
        'city',
        'thumbnail',
        'title',
        'category_id',
        'created_at',
        [sequelize.literal('(SELECT COUNT(*) FROM vote WHERE post.id = vote.post_id)'), 'vote_count']
      ],
      include: [
        {
          model: Category,
          attributes: ['category_name']
        },
        {
          model: Comment,
          attributes: ['id', 'comment_text', 'post_id', 'user_id', 'created_at'],
          include: {
            model: User,
            attributes: ['username']
          }
        },
        {
          model: User,
          attributes: ['username']
        }
      ]
    })
      .then(dbPostData => {
        // serialize data for handlebars rendering
        const postsImgArr = dbPostData.map(post => post.get({ plain: true }));
        if (postsImgArr[0] === undefined) {
          getDestinations().then(destinationData => {
            res.render('blog-page', {
              loggedIn: req.session.loggedIn,
              noData: true
            });
          });
          return;
        }
        const cityObj = blogFeed(postsImgArr, true);
        getDestinations().then(destinationData => {
          res.render('blog-page', {
            posts: cityObj,
            loggedIn: req.session.loggedIn,
            gmaps: process.env.GMAPS,
            nav: {
              loggedIn: req.session.loggedIn,
              destinations: destinationData
            },
            hero: {
              video: "/public/html5-videos-22/My-Voyages-(Vercion-1)website.mp4",
              content: "Itinerary Blogs",
              class: "hero-heading hero-heading-home fadeIn-element"
            },
            footer: {
              video: "/public/html5-videos-22/My-Voyages-(Vercion-1)website.mp4",
              content: "My<br>Voyages",
              pTop: true,
              signup: true
            }
          });
        });
      })
      .catch(err => {
        console.log(err);
        res.status(500).json(err);
      });
  };
});

// get single blog post
router.get('/post/:id', (req, res) => {
  Post.findOne({
    where: {
      id: req.params.id
    },
    attributes: [
      'id',
      'content',
      'city',
      'thumbnail',
      'title',
      'category_id',
      'itinerary_id',
      'created_at',
      [sequelize.literal('(SELECT COUNT(*) FROM vote WHERE post.id = vote.post_id)'), 'vote_count']
    ],
    include: [
      {
        model: Category,
        attributes: ['category_name']
      },
      {
        model: Comment,
        attributes: ['id', 'comment_text', 'post_id', 'user_id', 'created_at'],
        include: {
          model: User,
          attributes: ['username']
        }
      },
      {
        model: User,
        attributes: ['username']
      }
    ]
  })
    .then(dbPostData => {
      if (!dbPostData) {
        res.status(404).json({ message: 'No post found with this id' });
        return;
      }
      // serialize data for handlebars rendering
      const postsImgArr = dbPostData.get({ plain: true });
      getDestinations().then(destinationData => {
        res.render('single-blog', {
          post: postsImgArr,
          loggedIn: req.session.loggedIn,
          gmaps: process.env.GMAPS,
          nav: {
            loggedIn: req.session.loggedIn,
            destinations: destinationData
          },
          hero: {
            video: "/public/html5-videos-22/My-Voyages-(Vercion-1)website.mp4",
            content: "Itinerary Blogs",
            class: "hero-heading hero-heading-home fadeIn-element"
          },
          footer: {
            video: "/public/html5-videos-22/My-Voyages-(Vercion-1)website.mp4",
            content: "My<br>Voyages",
            pTop: true,
            signup: true
          }
        });
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});

module.exports = router;