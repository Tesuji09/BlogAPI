const mongoose = require('mongoose');


const schema = mongoose.schema({
  title: {type: String, required: true},
  content: {type: String, required: true},
  date: {type: Date, default: Date.now},
  author: {
    firstName: {type: String, required: true},
    lastName: {type: String, required: true}
  }
});

schema.methods.serialize = function() {
  return {
    id: this._id,
    author: `${this.author.firstName} ${this.author.lastName}`,
    content: this.content,
    date: this.date
  }
}

const blogPosts = mongoose.model('blog', schema);

module.export = blogPosts;
