const { listVaccine } = require('./list-vaccine.js');
const { getUser } = require('../repository');
const connectionHP = require('../../login/commands/connect-hyperledger.js')

async function loadPage(req, res) {
  let userInfo;
  const { user } = req;
  let vaccines;
  try {
    userInfo = await getUser(user && user.id);
    vaccines = await listVaccine();
      
    
  } catch (getUserError) {
    req.session.messages = { databaseError: FETCH_INFO_ERROR_MESSAGE };
  }
  
  req.session.messages = { success: " vaccine successfully issued " };
  res.render('pages/list-vaccine', {vaccines : vaccines});
}

module.exports = loadPage;
