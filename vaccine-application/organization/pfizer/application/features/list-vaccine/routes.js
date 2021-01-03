const { wrap } = require('async-middleware');


const listvaccineInfo = require('./commands/list-vaccine');
const loadPage = require('./commands/load-page');

module.exports = (router, middlewares = []) => {
  router.get('/list-vaccine', middlewares.map(middleware => wrap(middleware)), wrap(loadPage));
 router.post('/list-vaccine-info', wrap(listvaccineInfo));
  return router;
};
