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
});
