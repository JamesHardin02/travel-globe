const router = require('express').Router();
const { Category, Post } = require('../../models');
const upload = require('../../utils/upload');

// The `/api/categories` endpoint

router.get('/', (req, res) => {
  // find all categories
  // be sure to include its associated Posts
  Category.findAll({
    include: [
      {
        model: Post,
        attributes: ['id']
      }
    ]
  })
    .then(dbCategoryData => res.json(dbCategoryData))
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});

router.get('/:id', (req, res) => {
  // find one category by its `id` value
  // be sure to include its associated Posts
  Category.findOne({
    where: {
      id: req.params.id
    },
    include: [
      {
        model: Post,
        attributes: ['id']
      }
    ]
  })
    .then(dbCategoryData => {
      if (!dbCategoryData) {
        res.status(404).json({ message: 'No category found with this id' });
        return;
      }
      res.json(dbCategoryData);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});

router.post('/', upload.any(), (req, res) => {
  // create a new category
  Category.create({
    category_name: req.body.category_name
  })
    .then(dbCategoryData => res.json(dbCategoryData))
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});

router.put('/:id', upload.any(), (req, res) => {
  // update a category with a new name by its `id` value
  Category.update(
    { category_name: req.body.category_name },
    { where: { id: req.params.id } }
    )
  .then(updatedCategoryData => {
    if (!updatedCategoryData) {
      res.status(404).json({ message: 'No category found with this id' });
      return;
    }
    res.json(updatedCategoryData)})
  .catch(err => {
    console.log(err);
    res.status(400).json(err);
  });
});

router.delete('/:id', (req, res) => {
  // delete a category by its `id` value
  Category.destroy({
    where: {
      id: req.params.id
    }
  })
    .then(dbCategoryData => {
      if (!dbCategoryData) {
        res.status(404).json({ message: 'No category found with this id' });
        return;
      }
      res.json(dbCategoryData);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});

module.exports = router;
