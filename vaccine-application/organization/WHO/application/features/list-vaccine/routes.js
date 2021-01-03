const { wrap } = require('async-middleware');
const acceptVaccine = require('./commands/accept-vaccine');

const loadPage = require('./commands/load-page');

module.exports = (router, middlewares = []) => {
  router.get('/list-vaccine', middlewares.map(middleware => wrap(middleware)), wrap(loadPage));
  router.get('/accept-vaccine', middlewares.map(middleware => wrap(middleware)), wrap(acceptVaccine));
 
  return router;
};
