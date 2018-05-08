'use strict';
exports.DATABASE_URL = process.env.DATABASE_URL || 'mongodb://josh:blogpassword@ds217350.mlab.com:17350/blog';
exports.TEST_DATABASE_URL = process.env.TEST_DATABASE_URL || 'mongodb://localhost/test-restaurants-app';
exports.PORT = process.env.PORT || 17350;
