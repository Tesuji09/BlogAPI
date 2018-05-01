const chai = require('chai');
const chaiHttp = require('chai-http');

const {app, runServer, closeServer} = require('../index');

const expect = chai.expect;

chai.use(chaiHttp);

describe('Blog', function() {
  before(function() {
    return runServer();
  });

  after(function() {
    return closeServer();
  });

  it('should list blogs on Get', function() {
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
    });
  });

  it('should create a new blog post on POST', function() {
    const newBlog = {
      title: "The third best Blog Post",
      author: "Joshua Zuo",
      content: "I kinda sorta like posting blogs",
      publishDate: "September 11, 2009"
    }
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
    });
  });

  it('should update items on PUT', function() {
    const updateData = {
      title: "The third best Blog Post",
      author:"Joshua Zuo",
      content: "I kinda sorta like posting blogs",
      publishDate: "September 11, 2009"
    };
    return chai.request(app)
      .get('/blog-posts')
      .then(function(res) {
        updateData.id = res.body[0].id;
        return chai.request(app)
          .put(`/blog-posts/${updateData.id}`)
          .send(updateData)
      })
      .then(function(res) {
        expect(res).to.have.status(204);
      });
  });

  it('should delete items on DELETE', function() {
    return chai.request(app)
      .get('/blog-posts')
      .then(function(res) {
        return chai.request(app)
          .delete(`/blog-posts/${res.body[0].id}`);
      })
      .then(function(res) {
        expect(res).to.have.status(204);
      });
  });
});
