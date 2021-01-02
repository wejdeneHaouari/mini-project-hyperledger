const { updateUserInfo } = require('../repository');
const { UPDATE_INFO_SUCCESS_MESSAGE, UPDATE_INFO_ERROR_MESSAGE } = require('../constants');
// Bring key classes into scope, most importantly Fabric SDK network class
const fs = require('fs');
const yaml = require('js-yaml');
const Vaccine = require('../../../contract/lib/vaccine.js');
const connectionHP = require('../../login/commands/connect-hyperledger.js')
async function addVaccine(req, res) {
console.log("add vaccine 2")
    let user = {};
    const {
      user: { id },
    } = req;
console.log("req:")
    console.log(req.body);
    
   
    try {
      

        const contract = await connectionHP.HPConnect();
       
         // issue  vaccine
        console.log('Submit vaccine issue transaction.');

        const issueResponse = await contract.submitTransaction('issue',
         'covid', '00001', 'xxxx,xxx,xxxqfmqhfm');

         //const issueResponse = await contract.submitTransaction('queryHistory',
         // '00004');

        // process response
        console.log('Process issue transaction response.'+issueResponse);

        let vaccine = Vaccine.fromBuffer(issueResponse);

        console.log(`${vaccine.manufacturer}  vaccine : ${vaccine.reference} successfully issued for value ${vaccine.faceValue}`);
        console.log('Transaction complete.');
     




    } catch (error) {
        console.log(`Error processing transaction. ${error}`);
        console.log(error.stack);
    }
  
 
      req.session.messages = { success: "hhh" };
     
      //res.redirect('/profile');
    
  

}

module.exports = addVaccine;
