const apiTests = require('./api/_api.test');
const dbTests = require('./db/_db.test');

describe('All Tests', () => {
  include(apiTests, dbTests);
});
