const express = require('express');
const router = express.Router();

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

const {BlogPosts} = require('./models');



// title, content, author, publishDate
BlogPosts.create('The Best blog post', 'I really like making blog posts', 'Joshua Zuo', 'September 9, 2009')
BlogPosts.create('The Second Best Blog Post', 'I kind of like making blog posts', 'Joshua Zuo', 'September 10, 2009')



router.get('/', (req, res) => {
  res.json(BlogPosts.get());
})

router.post('/',jsonParser, (req, res) => {
  const requiredFields = ['title', 'content', 'author']

  for(let i=0; i<requiredFields.length; i++) {
    const field = requiredFields[i];
    if (!(field in req.body)){
      console.error(`Missing "${field}" in request body`)
      return res.status(400).send(`Missing "${field}" in request body`)
    }
  }
  const item = BlogPosts.create(req.body.title, req.body.content, req.body.author, req.body.publishDate)
  res.status(201).json(item)
});

router.delete('/:id', (req, res) => {
  BlogPosts.delete(req.params.id);
  console.log(`Deleted blog post \`${req.params.ID}\``);
  res.status(204).end();
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
  const updatedItem = BlogPosts.update({
    id: req.params.id,
    title: req.body.title,
    content: req.body.content,
    author: req.body.author,
    publishDate: req.body.publishDate || Date.now()
  })
  res.status(204).json(updatedItem);
})

module.exports = router;
