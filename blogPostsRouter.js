const express = require('express');
const router = express.Router();

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

const blogPosts = require('./models');



// title, content, author, publishDate



router.get('/', (req, res) => {
  blogPosts
    .find()
    .then(blogs => {
      return {
        blogs: blogs.map(blog => {blog.serialize})
      }
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({message: "Internal server error"})
    });
});

router.get('/:id', (req, res) => {
  blogPosts
    .findById(req.params.id)
    .then(blog => {res.json(blog.serialize)})
    .catch(err => {
      console.log(err);
      res.status(500).json({message: "Internal server error'"})
  });
});

router.post('/',jsonParser, (req, res) => {
  const requiredFields = ['title', 'content', 'author']

  for(let i=0; i<requiredFields.length; i++) {
    const field = requiredFields[i];
    if (!(field in req.body)){
      console.error(`Missing "${field}" in request body`)
      return res.status(400).send(`Missing "${field}" in request body`)
    }
  }
  BlogPosts
    .create({
      title: req.body.title,
      content: req.body.content,
      author: {
        firstName: req.body.author.firstName,
        lastName: req.body.author.lastName,
      date: req.body.date
    })
    .then(blog => {
      blog.status(201).json(blog.serialize())
    });
});

router.delete('/:id', (req, res) => {
  BlogPosts
  .findByIdAndRemove(req.params.id)
  .then(blog => {res.status(204).end()})
  .catch(err => {
    console.log(err)
    res.status(500).json({message: "Internal server error"})
  });
});

router.put('/:id', jsonParser, (req, res) => {
  const requiredFields = ['title', 'content', 'author', 'id'];
  for(let i=0; i<requiredFields.length; i++) {
    const field = requiredFields[i];
    if (!(field in req.body)) {
      console.error(`Missing "${field}" in request body`)
      return res.status(400).send(`Missing "${field}" in request body`)
    }
  }
  if (req.params.id !== req.body.id) {
    const message = (
      `Request path id (${req.params.id}) and request body id `
      `(${req.body.id}) must match`);
    console.error(message);
    return res.status(400).send(message);
  }
  // title, content, author, publishDate
  console.log(`Updating Blog Post "${req.params.id}"`);
  blogPosts
    .update({
      id: req.params.id,
      title: req.body.title,
      content: req.body.content,
      author: req.body.author,
      date: req.body.date || Date.now()
    })
    .then(blog => {
      blog.status(204).json(blog.serialize())
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({message: "Internal server error"})
    })
})

module.exports = router;
