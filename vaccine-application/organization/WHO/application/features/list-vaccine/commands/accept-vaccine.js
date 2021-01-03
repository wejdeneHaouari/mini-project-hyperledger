const { updateUserInfo } = require('../repository');
const { UPDATE_INFO_SUCCESS_MESSAGE, UPDATE_INFO_ERROR_MESSAGE } = require('../constants');
// Bring key classes into scope, most importantly Fabric SDK network class
const fs = require('fs');
const yaml = require('js-yaml');
const Vaccine = require('../../../../contract/lib/vaccine.js');
const connectionHP = require('../../login/commands/connect-hyperledger.js')
const { listVaccine } = require('./list-vaccine.js');
const { getUser } = require('../repository');

async function appoveVaccine(ref) {
   
    let owner = "pfizer";
    
  
    try {
      

        const contract = await connectionHP.HPConnect();
       
  
       
       const issueResponse = await contract.submitTransaction('approveVaccine',
       owner, ref);
        


        // process response
        console.log('Process issue transaction response.'+ issueResponse);

        let vaccine = Vaccine.fromBuffer(issueResponse);

        console.log(`${vaccine.manufacturer}  vaccine : ${vaccine.reference} successfully issued`);
        console.log('Transaction complete.');
     
      

    } catch (error) {
        
      throw new Error(error)

        
    }
  

    return vaccine;
     
  
  

}

async function loadPage(req, res) {
  let acceptedVaccine;
  const { user } = req;
  let vaccines;
  let ref;
  ref = req.query.ref;

  console.log("ref: ", ref);
  try {
    //acceptedVaccine = await appoveVaccine(ref);
    
    vaccines = await listVaccine();
      
    
  } catch (error) {
    req.session.messages = { error: error};
  }
  

  req.session.messages = { success: " vaccine successfully issued " };
  res.render('pages/list-vaccine', {vaccines : vaccines,   });
}

module.exports = loadPage;
