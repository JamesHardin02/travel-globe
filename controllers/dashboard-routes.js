const router = require('express').Router();
const sequelize = require('../config/connection');
const { Post, User, Comment, Vote, Category, Itinerary, BlogMetaData } = require('../models');
const withAuth = require('../utils/auth');
const { getDestinations } = require('../utils/get-destinations');

// get all posts for dashboard
router.get('/', withAuth, (req, res) => {
  Post.findAll({
    where: {
      user_id: req.session.user_id
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
      postsImgArr.forEach((Obj) => {
        Obj.blogFeed = true;
        Obj.thumbnail = '\\' + Obj.thumbnail;
      });
      Itinerary.findAll({
        where: {
          user_id: req.session.user_id
        },
        attributes: [
          'id',
          'title'
        ]
      })
        .then(dbItineraryData => {
          const itineraryData = dbItineraryData.map(post => post.get({ plain: true }));
          getDestinations().then(destinationData => {
            res.render('dashboard', {
              posts: postsImgArr,
              itineraries: itineraryData,
              blogCreate: true,
              loggedIn: true,
              gmaps: process.env.GMAPS,
              nav: {
                loggedIn: req.session.loggedIn,
                destinations: destinationData
              },
              hero: {
                video: "/public/html5-videos-22/About-Video2.mp4",
                content: "Your Voyages Profile",
                class: "hero-heading hero-heading-home fadeIn-element",
                noAccessBtn: true
              },
              footer: {
                noForm: true,
                pTop: true,
                noTopLines: true
              }
            });
          });
        })
        .catch(err => {
          console.log(err);
          res.status(500).json(err);
        });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});

// get all itineraries for dashboard
router.get('/itinerary', withAuth, (req, res) => {
  Itinerary.findAll({
    where: {
      user_id: req.session.user_id
    },
    attributes: [
      'id',
      'content',
      'title',
      'thumbnail'
    ],
    include: [
      {
        model: User,
        attributes: ['username']
      }
    ]
  })
    .then(dbPostData => {
      // serialize data for handlebars rendering
      const postsImgArr = dbPostData.map(post => post.get({ plain: true }));
      postsImgArr.forEach((Obj) => {
        Obj.blogFeed = true;
        Obj.thumbnail = '\\' + Obj.thumbnail;
      });
      getDestinations().then(destinationData => {
        res.render('dashboard', {
          posts: postsImgArr,
          loggedIn: true,
          gmaps: process.env.GMAPS,
          destinations: destinationData,
          nav: {
            loggedIn: req.session.loggedIn,
            destinations: destinationData
          },
          hero: {
            video: "/public/html5-videos-22/About-Video2.mp4",
            content: "Your Voyages Profile",
            class: "hero-heading hero-heading-home fadeIn-element",
            noAccessBtn: true
          },
          footer: {
            noForm: true,
            pTop: true,
            noTopLines: true
          }
        });
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});

// gets the itinerary to be edited
router.get('/itinerary/edit/:id', withAuth, (req, res) => {
  Itinerary.findByPk(req.params.id, {
    attributes: [
      'id',
      'content',
      'title',
      'thumbnail'
    ],
    include: [
      {
        model: User,
        attributes: ['username']
      }
    ]
  })
    .then(dbPostData => {
      if (dbPostData) {
        // serialize data for handlebars rendering
        const postImgArr = dbPostData.get({ plain: true });
        getDestinations().then(destinationData => {
          res.render('edit-post', {
            post: postImgArr,
            editMode: { editMode: true },
            loggedIn: true,
            gmaps: process.env.GMAPS,
            destinations: destinationData,
            nav: {
              loggedIn: req.session.loggedIn,
              destinations: destinationData
            },
            hero: {
              video: "/public/html5-videos-22/About-Video2.mp4",
              content: "Your Voyages Profile",
              class: "hero-heading hero-heading-home fadeIn-element",
              noAccessBtn: true
            }
          });
        });
      } else {
        res.status(404).end();
      }
    })
    .catch(err => {
      res.status(500).json(err);
    });
});

// gets the post to be edited
router.get('/edit/:id', withAuth, (req, res) => {
  Post.findByPk(req.params.id, {
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
      if (dbPostData) { // add itinerary select to implement itinerary select
        // serialize data for handlebars rendering
        const postImgArr = dbPostData.get({ plain: true });
        Itinerary.findAll({
          where: {
            user_id: req.session.user_id
          },
          attributes: [
            'id',
            'title'
          ]
        })
          .then(dbItineraryData => {
            const itineraryData = dbItineraryData.map(post => post.get({ plain: true }));
            getDestinations().then(destinationData => {
              res.render('edit-post', {
                post: postImgArr,
                itineraries: itineraryData,
                blogCreate: true,
                loggedIn: true,
                gmaps: process.env.GMAPS,
                nav: {
                  loggedIn: req.session.loggedIn,
                  destinations: destinationData
                },
                hero: {
                  video: "/public/html5-videos-22/About-Video2.mp4",
                  content: "Your Voyages Profile",
                  class: "hero-heading hero-heading-home fadeIn-element",
                  noAccessBtn: true
                }
              });
            });
          })
          .catch(err => {
            console.log(err);
            res.status(500).json(err);
          });
      } else {
        res.status(404).end();
      }
    })
    .catch(err => {
      res.status(500).json(err);
    });
});

module.exports = router;