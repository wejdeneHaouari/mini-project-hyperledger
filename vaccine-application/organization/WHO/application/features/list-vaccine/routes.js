const { wrap } = require('async-middleware');
const acceptVaccine = require('./commands/accept-vaccine');
const declineVaccine = require('./commands/decline-vaccine');
const loadPage = require('./commands/load-page');

module.exports = (router, middlewares = []) => {
  router.get('/list-vaccine', middlewares.map(middleware => wrap(middleware)), wrap(loadPage));
  router.get('/approve-vaccine', middlewares.map(middleware => wrap(middleware)), wrap(acceptVaccine));
  router.get('/decline-vaccine', middlewares.map(middleware => wrap(middleware)), wrap(declineVaccine));
 
  return router;
};
