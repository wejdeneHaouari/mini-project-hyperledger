const { wrap } = require('async-middleware');


const addlotInfo = require('./commands/add-lot');
const loadPage = require('./commands/load-page');

module.exports = (router, middlewares = []) => {
  router.get('/add-lot', middlewares.map(middleware => wrap(middleware)), wrap(loadPage));
 router.post('/add-lot-info', wrap(addlotInfo));
  return router;
};
