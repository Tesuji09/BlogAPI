const chai = require('chai');
const chaiHttp = require('chai-http');
const mongoose = require('mongoose');
const faker = require('faker');

const blogs = require('../models')
const {app, runServer, closeServer} = require('../index');
const {DATABASE_URL} = require('../config.js')

const expect = chai.expect;

chai.use(chaiHttp);

function seedBlogData() {
  const seedData = [];
  for(let i=1; i<=5; i++) {
    seedData.push(generateBlogData());
  }
  return blogs.insertMany(seedData);

}

function generateBlogData() {
  return {
    title: faker.lorem.sentence(),
    content: faker.lorem.paragraph(),
    date: faker.date.past(),
    author: {
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName()
    }
  }
}

function tearDownDB() {
  return mongoose.connection.dropDatabase();
}

describe('Blog', function() {
  before(function() {
    return runServer(DATABASE_URL);
  });

  beforeEach(function() {
    return seedBlogData();
  });

  afterEach(function() {
    return tearDownDB();
  });

  after(function() {
    return closeServer();
  });

  describe('GET endpoint', function() {

    it('should return all blog posts', function() {
      let res;
      return chai.request(app)
      .get('/blog-posts')
      .then(function(res_) {
        res = res_
        expect(res).to.have.status(200);
        expect(res.body.blogPosts).to.have.lengthOf.least(1);
        return blogs.count();
      })
      .then(function(count) {
        expect(res.body.blogPosts).to.have.lengthOf(count);
      });
    });

    it('should list blogs on Get', function() {
      let resBP;
      return chai.request(app)
        .get('/blog-posts')
        .then(function(res) {
          expect(res).to.have.status(200);
          expect(res).to.be.json;
          expect(res.body).to.be.a('array');
          const expectedKeys = ['content', 'id', 'author', 'publishDate', 'title'];
          res.body.forEach(function(item) {
            expect(item).to.be.a('object')
            expect(item).to.include.keys(expectedKeys);
        });
        resBP = res.body.blogPosts[1]
        return blogs.findById(resBP.id)
      })
      .then(function(blog){
        expect(resBP.id).to.equal(blog.id);
        expect(resBP.content).to.equal(blog.content);
        expect(resBP.author).to.equal(blog.author);
        expect(resBP.publishDate).to.equal(blog.publishDate);
        expect(resBP.title).to.equal(blog.title)
      });
    });
  });

  describe('POST endpoint', function() {
    it('should create a new blog post on POST', function() {
      const newBlog = generateBlogData()
      return chai.request(app)
      .post('/blog-posts')
      .send(newBlog)
      .then(function(res) {
        expect(res).to.have.status(201)
        expect(res).to.be.json;
        expect(res.body).to.be.a('object');
        expect(res.body).to.include.keys('id','content','author','publishDate','title')
        expect(res.body.id).to.not.equal(null);
        expect(res.body).to.deep.equal(Object.assign(newBlog, {id: res.body.id}));
        return blogs.findById(res.body.id)
      })
      .then(function(blog){
        expect(newBlog.id).to.equal(blog.id);
        expect(newBlog.content).to.equal(blog.content);
        expect(newBlog.author).to.equal(blog.author);
        expect(newBlog.publishDate).to.equal(blog.publishDate);
        expect(newBlog.title).to.equal(blog.title)
      });
    });
  });
  describe('PUT endpoint', function(){
    it('should update items on PUT', function() {
      const updateData = {
        title: "The third best Blog Post",
        author:"Joshua Zuo",
        content: "I kinda sorta like posting blogs",
        publishDate: "September 11, 2009"
      };
      return blogs
        .findOne()
        .then(function(res) {
          updateData.id = res.body.id;
          return chai.request(app)
            .put(`/blog-posts/${updateData.id}`)
            .send(updateData)
        })
        .then(function(res) {
          expect(res).to.have.status(204);
          return blogs.findById(updateData.id);
        })
        .then(function(blog){
          expect(blog.id).to.equal(updateData.id);
          expect(blog.author).to.equal(updateData.author);
          expect(blog.content).to.equal(updateData.content);
          expect(blog.publishDate).to.equal(updateData.publishDate);
        });
    });
  });
  describe('DELETE endpoint', function() {
    it('should delete items on DELETE', function() {
      return blogs
        .findOne()
        .then(function(res) {
          return chai.request(app)
            .delete(`/blog-posts/${res.body.id}`);
        })
        .then(function(res) {
          expect(res).to.have.status(204);
        });
    });
  });
});
