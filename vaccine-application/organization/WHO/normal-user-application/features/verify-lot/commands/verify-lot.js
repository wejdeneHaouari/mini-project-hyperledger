const { updateUserInfo } = require('../repository');
const { UPDATE_INFO_SUCCESS_MESSAGE, UPDATE_INFO_ERROR_MESSAGE } = require('../constants');
// Bring key classes into scope, most importantly Fabric SDK network class
const fs = require('fs');
const yaml = require('js-yaml');
const Lot = require('../../../../contract/lib/lot.js');
const connectionHP = require('./connect-hyperledger')
async function verifyLot(req, res) {

    
   
    let numero;
    let owner = "pfizer";
    
   
    if  (req.body && req.body.numero){
         numero = req.body.numero;
         
    }else{
       
        req.session.messages = {
            errors: "invalid input",
          };
          return res.status(500).redirect('/verify-lot');
    }
   
   
    try {
      

        const contract = await connectionHP.HPConnect();
       
        let queryResponse = await contract.evaluateTransaction('getVaccineOfLot', 'pfizer', numero );
        let json = JSON.parse(queryResponse.toString());
        console.log("vaccine", json  )
        
        let queryResponse2 = await contract.evaluateTransaction('queryHistoryLot', 'pfizer',numero );
        let json2 = JSON.parse(queryResponse2.toString());
        console.log("history",json2)
        req.session.messages = { vaccine: json, lot:json2};
        res.redirect('/verify-lot');



    } catch (error) {
        req.session.messages = {
            errors: "error",
          };
           return res.status(500).redirect('/verify-lot');


        
    }
  
 
      
    
  

}

module.exports = verifyLot;
