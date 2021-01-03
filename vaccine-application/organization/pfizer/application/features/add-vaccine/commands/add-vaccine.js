const { updateUserInfo } = require('../repository');
const { UPDATE_INFO_SUCCESS_MESSAGE, UPDATE_INFO_ERROR_MESSAGE } = require('../constants');
// Bring key classes into scope, most importantly Fabric SDK network class
const fs = require('fs');
const yaml = require('js-yaml');
const Vaccine = require('../../../../contract/lib/vaccine.js');
const connectionHP = require('../../login/commands/connect-hyperledger.js')

async function addVaccine(req, res) {
    let user = {};
    let owner = "pfizer";
    let nameVaccine, ref, composition, issueDateTime;
    const {
      user: { id },
    } = req;
    console.log("req:")
    console.log(req.body);
    if (req.body && req.body.name && req.body.reference && req.body.composition){
         nameVaccine = req.body.name;
         ref = req.body.reference;
         composition = req.body.composition;
         issueDateTime = req.body.issueDateTime;
    }else{
       
        req.session.messages = {
            errors: "invalid input" 
          };
          return res.status(500).redirect('/add-vaccine');
    }
   
   
    try {
      

        const contract = await connectionHP.HPConnect();
       
         // issue  vaccine
        console.log('Submit vaccine issue transaction.');
       
       const issueResponse = await contract.submitTransaction('issue',
       owner, ref, nameVaccine,issueDateTime,composition);
        

         //const issueResponse = await contract.submitTransaction('queryHistory',
         // '00004');

        // process response
        console.log('Process issue transaction response.'+ issueResponse);

        let vaccine = Vaccine.fromBuffer(issueResponse);

        console.log(`${vaccine.manufacturer}  vaccine : ${vaccine.reference} successfully issued`);
        console.log('Transaction complete.');
     
       



    } catch (error) {
        console.log(`Error processing transaction. ${error.stack}`);
        
        req.session.messages = { errors: `Error processing transaction. ${error.stack}`};
          return res.status(500).redirect('/add-vaccine');


        
    }
  
 
      req.session.messages = { success: " vaccine successfully issued " };
      res.redirect('/add-vaccine');
    
  

}

module.exports = addVaccine;
