const { wrap } = require('async-middleware');


const loadPage = require('./commands/load-page');

module.exports = (router, middlewares = []) => {
  router.get('/list-vaccine', middlewares.map(middleware => wrap(middleware)), wrap(loadPage));
 
  return router;
};
