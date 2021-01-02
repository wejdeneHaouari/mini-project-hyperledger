const { wrap } = require('async-middleware');

const requestBodyValidation = require('./commands/verify-request-body');
const updateUserInfo = require('./commands/update-user-info');
const addVaccineInfo = require('./commands/add-vaccine');
const loadPage = require('./commands/load-page');

module.exports = (router, middlewares = []) => {
  router.get('/add-vaccine', middlewares.map(middleware => wrap(middleware)), wrap(loadPage));

  router.post('/update-vaccine-info', wrap(requestBodyValidation), wrap(updateUserInfo));
 router.post('/add-vaccine-info', wrap(addVaccineInfo));
  return router;
};
