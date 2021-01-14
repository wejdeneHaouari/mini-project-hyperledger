const { getUser } = require('../repository');

const { FETCH_INFO_ERROR_MESSAGE } = require('../constants');

async function loadPage(req, res) {
 
  
  res.render('pages/verify-lot');
}

module.exports = loadPage;
