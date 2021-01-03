const { updateUserInfo } = require('../repository');
const { UPDATE_INFO_SUCCESS_MESSAGE, UPDATE_INFO_ERROR_MESSAGE } = require('../constants');
// Bring key classes into scope, most importantly Fabric SDK network class
const fs = require('fs');
const yaml = require('js-yaml');
const Vaccine = require('../../../../contract/lib/vaccine.js');
const connectionHP = require('../../login/commands/connect-hyperledger.js')
const { listVaccine } = require('./list-vaccine.js');
const { getUser } = require('../repository');

async function declineVaccineAndGetListVaccine(ref) {
   
    let owner = "pfizer";
    
  
    try {
      

        const contract = await connectionHP.HPConnect();
       
  
       
       const issueResponse = await contract.submitTransaction('declineVaccine',
       owner, ref);
        


        let vaccine = Vaccine.fromBuffer(issueResponse);

        console.log(`${vaccine.issuer}  vaccine : ${vaccine.reference} successfully accepted`);
        
        console.log("---get list vaccines -----")

        let queryResponse = await contract.evaluateTransaction('queryPartialVaccine', 'pfizer' );
        let json = JSON.parse(queryResponse.toString());

        console.log("vaccine list ", json)
         
        return json;
      

    } catch (error) {
        
      throw new Error(error)

        
    }

   
     
}

async function loadPage(req, res) {
  let acceptedVaccine;
  const { user } = req;
  let vaccines;
  let ref;
  ref = req.query.ref;


  try {
    vaccines = await declineVaccineAndGetListVaccine(ref);
    
      
    
  } catch (error) {
    req.session.messages = { error: error};
  }
  

  res.render('pages/list-vaccine', {vaccines : vaccines});
}

module.exports = loadPage;
