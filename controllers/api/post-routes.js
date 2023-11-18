const router = require('express').Router();
const sequelize = require('../../config/connection');
const { User, Post, Vote, Comment, Category, Itinerary, BlogMetaData } = require('../../models');
const withAuth = require('../../utils/auth');
const upload = require('../../utils/upload');
const blogImages = require('../../utils/blog-images');
const {getStaticItineraries} = require('../../utils/static-itineraries');

// GET api/posts/itinerary
// get all itineraries
router.get('/itinerary', (req, res) => {
  Itinerary.findAll({
    attributes: [
      'id',
      'user_id',
      'nation_A3',
      'nation_name',
      'category',
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
      res.json(dbPostData);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});

router.get('/itinerary/feature', async (req, res) => {
  res.json(await getStaticItineraries());
});

// GET api/posts/itinerary/:id
// get itinerary by id
router.get('/itinerary/:id', (req, res) => {
  Itinerary.findOne({
    where: {
      id: req.params.id
    },
    attributes: [
      'id',
      'content',
      'blurb',
      'nation_A3',
      'category',
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
    .then(dbPostData => {
      res.json(dbPostData);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});

// create a itinerary
// POST api/posts/itinerary
router.post('/itinerary', withAuth, upload.single('thumbnail'), async (req, res) => {
  const imgDataArr = JSON.parse(req.body.srcArr);
  let html = req.body.itinerary;
  if (imgDataArr.length > 0) {
    html = await blogImages(html, imgDataArr);
  };
  Itinerary.create({
    title: req.body.title,
    blurb: req.body.blurb,
    nation_A3: req.body.nation_A3,
    nation_name: req.body.nation_name,
    category: req.body.category,
    content: html,
    user_id: req.session.user_id,
    thumbnail: req.file.path
  })
    .then(dbPostData => {
      res.json(dbPostData);
    })
    .catch(err => {
      console.log(err);
    });
});

// edit a itinerary
// PUT api/posts/itinerary/:id
router.put('/itinerary/:id', withAuth, upload.single('thumbnail'), async (req, res) => {
  let html = req.body.itinerary;
  const base64Imgs = [];
  const imgDataArr = JSON.parse(req.body.srcArr);

  for (i = 0; i < imgDataArr.length; i++) {
    if (imgDataArr[i].base64.includes('base64')) {
      base64Imgs.push(imgDataArr[i]);
    };
  };
  if (base64Imgs.length > 0) {
    html = await blogImages(html, base64Imgs);
  };

  Itinerary.update(
    {
      title: req.body.title,
      blurb: req.body.blurb,
      content: html,
      user_id: req.session.user_id,
      thumbnail: req.file.path
    },
    {
      where: {
        id: req.params.id
      }
    }
  )
    .then(dbPostData => {
      if (!dbPostData) {
        res.status(404).json({ message: 'No post found with this id' });
        return;
      }
      res.json(dbPostData);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});

// delete a post
// DELETE api/posts/:id
router.delete('/itinerary/:id', withAuth, (req, res) => {
  Itinerary.destroy({
    where: {
      id: req.params.id
    }
  })
    .then(dbPostData => {
      if (!dbPostData) {
        res.status(404).json({ message: 'No itinerary found with this id' });
        return;
      }
      res.json(dbPostData);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});

// GET api/posts
// get all posts
router.get('/', (req, res) => {
  Post.findAll({
    attributes: [
      'id',
      'content',
      'city',
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
      res.json(dbPostData);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});

// GET api/posts
// get all posts
router.get('/user', (req, res) => {
  Post.findAll({
    where: {
      user_id: req.session.user_id
    },
    attributes: [
      'id',
      'content',
      'city',
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
      },
      {
        model: BlogMetaData,
        attributes: ['itinerary_id']
      }
    ]
  })
    .then(dbPostData => {
      res.json(dbPostData);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});

// GET api/posts
// get all posts
router.get('/itinerary-blogs/:id', (req, res) => {
  Post.findAll({
    where: {
      itinerary_id: req.params.id
    },
    attributes: [
      'id',
      'title'
    ]
  })
    .then(dbPostData => {
      res.json(dbPostData);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});

// GET api/posts/:id
// get individual post
router.get('/:id', (req, res) => {
  Post.findOne({
    where: {
      id: req.params.id
    },
    attributes: [
      'id',
      'title',
      'content',
      'city',
      'category_id',
      'thumbnail',
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
      },
      {
        model: BlogMetaData,
        attributes: ['itinerary_id']
      }
    ]
  })
    .then(dbPostData => {
      if (!dbPostData) {
        res.status(404).json({ message: 'No post found with this id' });
        return;
      }
      res.json(dbPostData);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});

// Create a post
// POST api/posts
router.post('/', withAuth, upload.single('thumbnail'), async (req, res) => {
  const imgDataArr = JSON.parse(req.body.imgData);
  let html = req.body.content;
  if (imgDataArr.length > 0) {
    html = await blogImages(html, imgDataArr);
  };
  Post.create({
    title: req.body.title,
    content: html,
    city: req.body.city,
    user_id: req.session.user_id,
    category_id: req.body.category_id,
    itinerary_id: req.body.itinerary_id,
    thumbnail: req.file.path
  })
    .then(dbPostData => {
      const metaData = dbPostData.get({ plain: true });
      Post.connectItinerary({ ...metaData, user_id: req.session.user_id }, { BlogMetaData, Comment, User })
        .then(connectionData => res.json(connectionData))
        .catch(err => {
          console.log(err);
        });
    })
    .catch(err => {
      console.log(err);
    });
});

// vote on a post
// PUT api/posts/upvote
router.put('/upvote', withAuth, upload.any(), (req, res) => {
  // custom static method created in models/Post.js
  if (req.session) {
    Post.upvote({ ...req.body, user_id: req.session.user_id }, { Vote, Comment, User })
      .then(updatedVoteData => res.json(updatedVoteData))
      .catch(err => {
        console.log(err);
        res.status(500).json(err);
      });
  };
});

// unvote on a post
// PUT api/posts/unvote
router.put('/unvote', withAuth, upload.any(), (req, res) => {
  // custom static method created in models/Post.js
  if (req.session) {
    Post.unvote({ ...req.body, user_id: req.session.user_id }, { Vote, Comment, User })
      .then(updatedVoteData => res.json(updatedVoteData))
      .catch(err => {
        console.log(err);
        res.json(err);
      });
  };
});

// edit a post
// PUT api/posts/:id
router.put('/:id', withAuth, upload.single('thumbnail'), async (req, res) => {
  const imgDataArr = JSON.parse(req.body.imgData);
  let html = req.body.content;
  if (imgDataArr.length > 0) {
    html = await blogImages(html, imgDataArr);
  };
  Post.update(
    {
      title: req.body.title,
      content: html,
      city: req.body.city,
      user_id: req.session.user_id,
      category_id: req.body.category_id,
      thumbnail: req.file.path
    },
    {
      where: {
        id: req.params.id
      },
      individualHooks: true,
    }
  )
    .then(dbPostData => {
      if (!dbPostData) {
        res.status(404).json({ message: 'No post found with this id' });
        return;
      }
      res.json(dbPostData);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});

// delete a post
// DELETE api/posts/:id
router.delete('/:id', withAuth, (req, res) => {
  Post.destroy({
    where: {
      id: req.params.id
    }
  })
    .then(dbPostData => {
      if (!dbPostData) {
        res.status(404).json({ message: 'No post found with this id' });
        return;
      }
      res.json(dbPostData);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});

module.exports = router;