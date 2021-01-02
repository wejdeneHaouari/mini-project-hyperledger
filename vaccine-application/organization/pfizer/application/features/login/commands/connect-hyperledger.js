
const { UPDATE_INFO_SUCCESS_MESSAGE, UPDATE_INFO_ERROR_MESSAGE } = require('../constants');
// Bring key classes into scope, most importantly Fabric SDK network class
const fs = require('fs');
const yaml = require('js-yaml');
const { Wallets, Gateway } = require('fabric-network');
const Vaccine = require('../../../contract/lib/vaccine.js');
var contract;


exports.HPConnect = () => {

    return new Promise((resolve, reject) => {
        if (contract) {
            console.log('in hp connect 1')
            resolve(contract);
        } else {
            console.log('in hp connect 2')
           newContract().then(
               (contract) => {
                   contract = contract;
                   resolve(contract);
               }
           )




           


        }
    });
}

async function newContract(){
    const wallet = await Wallets.newFileSystemWallet('./identity/user/james/wallet');
    const gateway = new Gateway();
    try {

    const userName = 'james';

       // Load connection profile; will be used to locate a gateway
       let connectionProfile = yaml.safeLoad(fs.readFileSync('./gateway/connection-org2.yaml', 'utf8'));

       // Set connection options; identity and wallet
       let connectionOptions = {
           identity: userName,
           wallet: wallet,
           discovery: { enabled:true, asLocalhost: true }
       };

       // Connect to gateway using application specified parameters
       console.log('Connect to Fabric gateway.');

       await gateway.connect(connectionProfile, connectionOptions);

       // Access PaperNet network
       console.log('Use network channel: mychannel.');

       const network = await gateway.getNetwork('mychannel');

       // Get addressability to  vaccine contract
       console.log('Use org.vaccinet.vaccine smart contract.');

        contract = await network.getContract('vaccinevalidation');
        return contract;
    }catch (error) {
       console.log(`Error processing transaction. ${error}`);
       console.log(error.stack);
   }
}



