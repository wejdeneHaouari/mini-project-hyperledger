const { wrap } = require('async-middleware');


const verifylotInfo = require('./commands/verify-lot');
const loadPage = require('./commands/load-page');

module.exports = (router, middlewares = []) => {
  router.get('/verify-lot', middlewares.map(middleware => wrap(middleware)), wrap(loadPage));
 router.post('/verify-lot-info', wrap(verifylotInfo));
  return router;
};
