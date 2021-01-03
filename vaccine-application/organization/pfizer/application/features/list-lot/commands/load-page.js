const { listLot } = require('./list-lot.js');
const { getUser } = require('../repository');
const connectionHP = require('../../login/commands/connect-hyperledger.js')

async function loadPage(req, res) {
  let userInfo;
  const { user } = req;
  let lots;
  try {
    userInfo = await getUser(user && user.id);
    lots = await listLot();
      
    
  } catch (getUserError) {
    req.session.messages = { databaseError: FETCH_INFO_ERROR_MESSAGE };
  }
  
  
  res.render('pages/list-lot', {lots : lots});
}

module.exports = loadPage;
