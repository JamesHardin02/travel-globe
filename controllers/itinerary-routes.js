const router = require('express').Router();
const sequelize = require('../config/connection');
const { Post, User, Comment, Vote, Category, Itinerary, BlogMetaData } = require('../models');
const { getDestinations } = require('../utils/get-destinations');
const { getStaticItineraries } = require('../utils/static-itineraries');
const fetch = require('node-fetch')

router.get('/', async (req, res) => {
  Itinerary.findAll({
    attributes: [
      'id',
      'user_id',
      'title',
      'nation_A3',
      'nation_name',
      'content',
      'thumbnail'
    ],
    include: [
      {
        model: User,
        attributes: ['username']
      }
    ]
  })
    .then(async dbPostData => {
      // serialize data for handlebars rendering
      const itineraryArr = dbPostData.map(post => post.get({ plain: true }));
      let metaArr = [];
      for (i = 0; i < itineraryArr.length; i++) {
        const res = await BlogMetaData.findAll({
          where: {
            itinerary_id: itineraryArr[i].id
          }
        })
          .then(data => {
            return serializedBlogData = data.map(post => post.get({ plain: true }));
          })
        if (res.length > 0) {

          metaArr = [...metaArr, ...res];
        };
      };
      return { metaArr, itineraryArr };
    }).then(async ({ metaArr, itineraryArr }) => {
      for (i = 0; i < itineraryArr.length; i++) {
        const BlogsPerItineraryArr = metaArr.filter(blog => blog.itinerary_id == itineraryArr[i].id);
        const filteredBlogs = BlogsPerItineraryArr.filter(meta => {
          if (meta.post_id !== null) {
            return meta;
          } else {
            return;
          };
        });
        if (filteredBlogs.length == 0) {
          itineraryArr[i].city = "noCity";
          itineraryArr[i].blogFeed = true;
          itineraryArr[i].thumbnail = '\\' + itineraryArr[i].thumbnail;
        } else {
          const res = await Post.findOne({
            where: {
              id: filteredBlogs[0].post_id
            }
          }).then(post => {
            return post.get({ plain: true });
          });
          itineraryArr[i].city = res.city;
          itineraryArr[i].blogFeed = true;
          itineraryArr[i].thumbnail = '\\' + itineraryArr[i].thumbnail;
        };
      };
      return JSON.stringify({ itineraryArr: JSON.stringify(itineraryArr) });
    })
    .then((itineraryArr) => {
      itineraryArr = JSON.parse(itineraryArr);
      itineraryArr = JSON.parse(itineraryArr.itineraryArr);
      const cityObj = {};
      itineraryArr.forEach(itinerary => {
        for (const key in cityObj) {
          if (itinerary.city == key) {
            cityObj[key] = [...cityObj[key], itinerary];
          };
        };
        if (!cityObj[itinerary.city]) {
          cityObj[itinerary.city] = [itinerary];
        };
      });
      const objectOrder = {
        'noCity': null
      };
      const cityObjReordered = Object.assign(objectOrder, cityObj);
      let randomArr = [];
      for (const key in cityObj) {
        function getMultipleRandom(arr, num) {
          const shuffled = [...arr].sort(() => 0.5 - Math.random());

          return shuffled.slice(0, num);
        }
        if (cityObj[key] !== "noCity") {
          randomArr = [...randomArr, ...getMultipleRandom(cityObj[key], 2)];
        };
      };
      if (cityObjReordered.noCity == null) {
        cityObjReordered.noCity = randomArr.sort(() => Math.random() - 0.5);
      } else {
        cityObjReordered.noCity = [...cityObjReordered.noCity, ...randomArr].sort(() => Math.random() - 0.5);
      };
      if (itineraryArr.length == 0) {
        getDestinations().then(destinationData => {
          res.render('itinerary-page', {
            noData: true,
            loggedIn: req.session.loggedIn,
            gmaps: process.env.GMAPS,
            nav: {
              loggedIn: req.session.loggedIn,
              destinations: destinationData
            },
            hero: {
              video: "/public/html5-videos-22/About-Video2.mp4",
              content: "Voyager Itineraries",
              class: "hero-heading hero-heading-home fadeIn-element"
            },
            footer: {
              video: "/public/html5-videos-22/About-Video2.mp4",
              content: "My<br>Voyages",
              pTop: true,
              signup: true
            }
          });
          return;
        });
      } else {
        getDestinations().then(destinationData => {
          res.render('itinerary-page', {
            posts: cityObjReordered,
            loggedIn: req.session.loggedIn,
            gmaps: process.env.GMAPS,
            nav: {
              loggedIn: req.session.loggedIn,
              destinations: destinationData
            },
            hero: {
              video: "/public/html5-videos-22/About-Video2.mp4",
              content: "Voyager Itineraries",
              class: "hero-heading hero-heading-home fadeIn-element"
            },
            footer: {
              video: "/public/html5-videos-22/About-Video2.mp4",
              content: "My<br>Voyages",
              pTop: true,
              signup: true
            }
          });
        });
      };
    });
});

// get nation's itineraries
router.get('/nation/:id', (req, res) => {
  Itinerary.findAll({
    where: {
      nation_A3: req.params.id
    },
    attributes: [
      'id',
      'title',
      'nation_A3',
      'nation_name',
      'category',
      'content',
      'user_id',
      'thumbnail'
    ],
    include: [
      {
        model: User,
        attributes: ['username']
      }
    ]
  })
    .then(async dbPostData => {
      // serialize data for handlebars rendering
      const itineraryArr = dbPostData.map(post => post.get({ plain: true }));
      for (i = 0; i < itineraryArr.length; i++) {
        itineraryArr[i].blogFeed = true;
        itineraryArr[i].thumbnail = '\\' + itineraryArr[i].thumbnail;
      };
      const staticItineraries = (await getStaticItineraries()).filter(itinerary => itinerary.nation_A3 == req.params.id);
      for (i = 0; i < staticItineraries.length; i++) {
        itineraryArr.unshift(staticItineraries[i]);
      };
      if (itineraryArr.length == 0) {
        res.render('nation-itineraries', {
          noData: true
        });
      } else {
        res.render('nation-itineraries', {
          nation_name: itineraryArr[0].nation_name,
          posts: itineraryArr,
          loggedIn: req.session.loggedIn,
          gmaps: process.env.GMAPS,
          nav: {
            loggedIn: req.session.loggedIn
          },
          hero: {
            video: "/public/html5-videos-22/About-Video2.mp4",
            content: "Voyager Itineraries",
            class: "hero-heading hero-heading-home fadeIn-element"
          },
          footer: {
            video: "/public/html5-videos-22/About-Video2.mp4",
            content: "My<br>Voyages",
            noForm: true
          }
        });
      };
    })
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});


// get single itinerary post
router.get('/:id', (req, res) => {
  Itinerary.findOne({
    where: {
      id: req.params.id
    },
    attributes: [
      'id',
      'user_id',
      'title',
      'nation_A3',
      'nation_name',
      'content',
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
      if (!dbPostData) {
        res.status(404).json({ message: 'No post found with this id' });
        return;
      }
      // serialize data for handlebars rendering
      const postsImgArr = dbPostData.get({ plain: true });
      getDestinations().then(destinationData => {
        res.render('single-itinerary', {
          nation_A3: postsImgArr.nation_A3,
          nation_name: postsImgArr.nation_name,
          post: postsImgArr.content,
          loggedIn: req.session.loggedIn,
          gmaps: process.env.GMAPS,
          nav: {
            loggedIn: req.session.loggedIn,
            destinations: destinationData
          },
          hero: {
            video: "/public/html5-videos-22/About-Video2.mp4",
            content: `${postsImgArr.title}`,
            class: "hero-heading hero-heading-home fadeIn-element"
          },
          footer: {
            video: "/public/html5-videos-22/About-Video2.mp4",
            content: "My<br>Voyages",
            pTop: true,
            signup: true,
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

// get single itinerary post
router.get('/preview/:id', async (req, res) => {
  Itinerary.findOne({
    where: {
      id: req.params.id
    },
    attributes: [
      'id',
      'user_id',
      'title',
      'blurb',
      'nation_A3',
      'nation_name',
      'content',
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
      if (!dbPostData) {
        res.status(404).json({ message: 'No post found with this id' });
        return;
      }
      // serialize data for handlebars rendering
      const postsImgArr = dbPostData.get({ plain: true });
      const imgTagArr = [...postsImgArr.content.matchAll(/<img([\w\W]+?)[\/]?>/g)];
      const srcArr = [];

      imgTagArr.forEach(imgArr => {
        for (i = 0; i < imgArr.length; i = i + 2) {
          srcArr.push([...imgArr[i].matchAll(/src\s*=\s*"(.+?)"/g)][0][1]);
        };
      });

      res.render('preview-itinerary', {
        nation_A3: postsImgArr.nation_A3,
        nation_name: postsImgArr.nation_name,
        post: postsImgArr.content,
        blurb: postsImgArr.blurb,
        post_id: postsImgArr.id,
        images: srcArr,
        loggedIn: req.session.loggedIn,
        gmaps: process.env.GMAPS,
        nav: {
          loggedIn: req.session.loggedIn
        },
        hero: {
          video: "/public/html5-videos-22/About-Video2.mp4",
          content: `${postsImgArr.title}`,
          class: "hero-heading hero-heading-home fadeIn-element"
        },
        footer: {
          video: "/public/html5-videos-22/About-Video2.mp4",
          content: "My<br>Voyages",
          noForm: true
        }
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});

// get single itinerary post
router.get('/preview/feature/:id', async (req, res) => {
  const staticItineraries = await getStaticItineraries()
  const filteredItineraries = staticItineraries.filter(itinerary => itinerary.id.split('/')[1] == req.params.id);
  const itinerary = filteredItineraries[0];
  const imgTagArr = [...itinerary.content.matchAll(/<img([\w\W]+?)[\/]?>/g)];
  const srcArr = [];
  imgTagArr.forEach(imgArr => {
    for (i = 0; i < imgArr.length; i = i + 2) {
      srcArr.push([...imgArr[i].matchAll(/src\s*=\s*"(.+?)"/g)][0][1]);
    };
  });
  const profilePicSrc = srcArr.shift();
  res.render('preview-itinerary', {
    nation_A3: itinerary.nation_A3,
    nation_name: itinerary.nation_name,
    post_id: itinerary.id,
    post: itinerary.content,
    images: srcArr,
    blurb: itinerary.blurb,
    loggedIn: req.session.loggedIn,
    gmaps: process.env.GMAPS,
    nav: {
      loggedIn: req.session.loggedIn,
    },
    hero: {
      video: "/public/html5-videos-22/About-Video2.mp4",
      content: `${itinerary.title}`,
      class: "hero-heading hero-heading-home fadeIn-element"
    },
    footer: {
      video: "/public/html5-videos-22/About-Video2.mp4",
      content: "My<br>Voyages",
      noForm: true
    }
  });
  // Itinerary.findOne({
  //   where: {
  //     id: req.params.id
  //   },
  //   attributes: [
  //     'id',
  //     'user_id',
  //     'title',
  //     'nation_A3',
  //     'nation_name',
  //     'content',
  //     'thumbnail'
  //   ],
  //   include: [
  //     {
  //       model: User,
  //       attributes: ['username']
  //     }
  //   ]
  // })
  //   .then(dbPostData => {
  //     if (!dbPostData) {
  //       res.status(404).json({ message: 'No post found with this id' });
  //       return;
  //     }
  //     // serialize data for handlebars rendering
  //     const postsImgArr = dbPostData.get({ plain: true });
  //     console.log(postsImgArr.content.matchAll(/<img([\w\W]+?)[\/]?>/))
  //     getDestinations().then(destinationData => {
  //       res.render('preview-itinerary', {
  //         nation_A3: postsImgArr.nation_A3,
  //         nation_name: postsImgArr.nation_name,
  //         post: postsImgArr.content,
  //         loggedIn: req.session.loggedIn,
  //         gmaps: process.env.GMAPS,
  //         nav: {
  //           loggedIn: req.session.loggedIn,
  //           destinations: destinationData
  //         },
  //         hero: {
  //           video: "/public/html5-videos-22/About-Video2.mp4",
  //           content: `${postsImgArr.title}`,
  //           class: "hero-heading hero-heading-home fadeIn-element"
  //         },
  //         footer: {
  //           video: "/public/html5-videos-22/About-Video2.mp4",
  //           content: "My<br>Voyages",
  //           pTop: true,
  //           signup: true,
  //           noTopLines: true
  //         }
  //       });
  //     });
  //   })
  //   .catch(err => {
  //     console.log(err);
  //     res.status(500).json(err);
  //   });
});

// get single itinerary post
router.get('/feature/:id', async (req, res) => {
  const staticItineraries = await getStaticItineraries()
  const filteredItineraries = staticItineraries.filter(itinerary => itinerary.id.split('/')[1] == req.params.id);
  const itinerary = filteredItineraries[0];
  console.log(staticItineraries)
  res.render('single-itinerary', {
    nation_A3: itinerary.nation_A3,
    nation_name: itinerary.nation_name,
    post: itinerary.content,
    loggedIn: req.session.loggedIn,
    gmaps: process.env.GMAPS,
    nav: {
      loggedIn: req.session.loggedIn,
    },
    hero: {
      video: "/public/html5-videos-22/About-Video2.mp4",
      content: `${itinerary.title}`,
      class: "hero-heading hero-heading-home fadeIn-element"
    },
    footer: {
      video: "/public/html5-videos-22/About-Video2.mp4",
      content: "My<br>Voyages",
      noForm: true
    }
  });
});

module.exports = router;