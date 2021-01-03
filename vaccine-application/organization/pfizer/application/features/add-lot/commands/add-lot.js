const { updateUserInfo } = require('../repository');
const { UPDATE_INFO_SUCCESS_MESSAGE, UPDATE_INFO_ERROR_MESSAGE } = require('../constants');
// Bring key classes into scope, most importantly Fabric SDK network class
const fs = require('fs');
const yaml = require('js-yaml');
const Lot = require('../../../../contract/lib/lot.js');
const connectionHP = require('../../login/commands/connect-hyperledger.js')
async function addLot(req, res) {

    let user = {};
   
    let numero, quantite, vaccineRef, fabricationDate, expirationDate;
    let owner = "pfizer";
    const {
      user: { id },
    } = req;
   
    if  (req.body && req.body.numero && req.body.quantite && req.body.vaccineRef && req.body.fabricationDate && req.body.expirationDate){
         numero = req.body.numero;
         quantite = req.body.quantite;
         vaccineRef = req.body.vaccineRef;
         fabricationDate = req.body.fabricationDate;
         expirationDate = req.body.expirationDate;
    }else{
       
        req.session.messages = {
            errors: "invalid input",
          };
          return res.status(500).redirect('/add-lot');
    }
   
   
    try {
      

        const contract = await connectionHP.HPConnect();
       
         // issue  lot
        console.log('Submit lot add transaction.');
      
        const issueResponse = await contract.submitTransaction('addLot',
        owner, numero, quantite, vaccineRef, fabricationDate, expirationDate);
        

         //const issueResponse = await contract.submitTransaction('queryHistory',
         // '00004');

        // process response
        console.log('Process add lot transaction response.'+issueResponse);

        let lot = Lot.fromBuffer(issueResponse);

        console.log(`${lot.manufacturer}  lot : ${lot.reference} successfully added`);
        console.log('Transaction complete.');
     




    } catch (error) {
        console.log(`Error processing transaction. ${error}`);
        console.log(error.stack);
        req.session.messages = { errors: `Error processing transaction. ${error.stack}`};
           return res.status(500).redirect('/add-lot');


        
    }
  
 
       req.session.messages = { success: " lot successfully issued " };
       res.redirect('/add-lot');
    
  

}

module.exports = addLot;
