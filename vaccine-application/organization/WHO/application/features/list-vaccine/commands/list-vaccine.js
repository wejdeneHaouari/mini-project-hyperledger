const { updateUserInfo } = require('../repository');
const { UPDATE_INFO_SUCCESS_MESSAGE, UPDATE_INFO_ERROR_MESSAGE } = require('../constants');
// Bring key classes into scope, most importantly Fabric SDK network class
const fs = require('fs');
const yaml = require('js-yaml');
const Lot = require('../../../../contract/lib/lot.js');
const connectionHP = require('../../login/commands/connect-hyperledger.js')


async function listVaccine() {

    
   
    try {
      

        const contract = await connectionHP.HPConnect();
        
        
         let queryResponse = await contract.evaluateTransaction('queryPartialVaccine', 'pfizer' );
         let json = JSON.parse(queryResponse.toString());
         
        return json;
       
        
    } catch (error) {
        console.log(`Error processing transaction. ${error}`);
        console.log(error.stack);
        throw Error(`Error processing transaction. ${error}`)

        
    }
  

}

module.exports = {listVaccine};
