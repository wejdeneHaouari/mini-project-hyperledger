/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
*/

'use strict';

// Fabric smart contract classes
const { Contract, Context } = require('fabric-contract-api');

// VaccineNet specifc classes
const Vaccine = require('./vaccine.js');
const VaccineList = require('./vaccinelist.js');
const LotList = require('./lotlist.js');
const QueryUtils = require('./queries.js');

/**
 * A custom context provides easy access to list of all  vaccines
 */
class VaccineContext extends Context {

    constructor() {
        super();
        // All vaccines are held in a list of vaccines
        this.vaccineList = new VaccineList(this);

        this.lotList = new Lotlist(this);
    }

}

/**
 * Define  vaccine smart contract by extending Fabric Contract class
 *
 */
class VaccineContract extends Contract {

    constructor() {
        // Unique namespace when multiple contracts per chaincode file
        super('org.vaccinet.vaccine');
    }

    /**
     * Define a custom context for  vaccine
    */
    createContext() {
        return new VaccineContext();
    }

    /**
     * Instantiate to perform any setup of the ledger that might be required.
     * @param {Context} ctx the transaction context
     */
    async instantiate(ctx) {
        // No implementation required with this example
        // It could be where data migration is performed, if necessary
        console.log('Instantiate the contract');
    }

    
    async issue(ctx, issuer, reference, name, issueDateTime, composition) {

        // check if vaccine already exist
        
        let vaccineKey = Vaccine.makeKey([issuer,reference]);
        let vaccineExist = await ctx.vaccineList.getVaccine(vaccineKey);
        if (vaccineExist) {
            throw new Error('\nVaccine  ' + reference +  ' already exist');
        }

        // check if org2
        let mspid = ctx.clientIdentity.getMSPID();
        if (mspid != "Org2MSP") {
            throw new Error('only org2 members can call this function');
        }

        // create an instance of the vaccine
        let vaccine = Vaccine.createInstance(issuer, reference, name, issueDateTime, composition);

        
        vaccine.setPending();

        // save the owner's MSP 
        let mspid = ctx.clientIdentity.getMSPID();
        vaccine.setOwnerMSP(mspid);

    

        // Add the vaccine to the list of all similar  vaccines in the ledger world state
        await ctx.vaccineList.addVaccine(vaccine);

        // Must return a serialized vaccine to caller of smart contract
        return vaccine;
    }



    async approveVaccine(ctx, issuer, reference) {

        // Retrieve the current vaccine using key fields provided
        let vaccineKey = Vaccine.makeKey([issuer, reference]);
        let vaccine = await ctx.vaccineList.getvaccine(vaccineKey);

        if (!vaccine) {
            throw new Error('\nVaccine  ' + reference +  '  doent exist');
        }

        //check org1
        let mspid = ctx.clientIdentity.getMSPID();
        if (mspid != "Org1MSP") {
            throw new Error('only org1 members can call this function');
        }

       vaccine.approvalDate =  new Date().toLocaleDateString();
       vaccine.setApprouved();
        await ctx.vaccineList.updateVaccine(vaccine);
        return vaccine;
       
    }

    async declineVaccine(ctx, issuer, reference) {

        // Retrieve the current vaccine using key fields provided
        let vaccineKey = Vaccine.makeKey([issuer, reference]);
        let vaccine = await ctx.vaccineList.getvaccine(vaccineKey);

        if (!vaccine) {
            throw new Error('\nVaccine  ' + reference +  ' doent exist');
        }

        //check org1
        let mspid = ctx.clientIdentity.getMSPID();
        if (mspid != "Org1MSP") {
            throw new Error('only org1 members can call this function');
        }

       vaccine.approvalDate =  new Date().toLocaleDateString();
       vaccine.setDeclined();
        await ctx.vaccineList.updateVaccine(vaccine);
        return vaccine;
       
    }

   

    async addLot(ctx, issuer, reference, quantité, vaccineRef, fabricationDate, expirationDate ) {

        // check if lot already exist
        
        let lotKey = Lot.makeKey([issuer,reference]);
        let lotExist = await ctx.lotList.getLot(lotKey);
        if (lotExist) {
            throw new Error('\nlot  ' + reference +  ' already exist');
        }

        // Retrieve the current vaccine using key fields provided
        let vaccineKey = Vaccine.makeKey([issuer, vaccineRef]);
        let vaccine = await ctx.vaccineList.getvaccine(vaccineKey);

        if (!vaccine) {
            throw new Error('\nVaccine  ' + vaccineRef +  ' doesnt exist');
        }

        // check if org2
        let mspid = ctx.clientIdentity.getMSPID();
        if (mspid != "Org2MSP") {
            throw new Error('only org2 members can call this function');
        }

        // create an instance of the vaccine
        let lot = Lot.createInstance(issuer, reference, quantité, vaccineRef, fabricationDate, expirationDate );

        


        // save the owner's MSP 
        let mspid = ctx.clientIdentity.getMSPID();
        lot.setOwnerMSP(mspid);

    

       
        await ctx.lotList.addLot(lot);

        
        return lot;
    }

    
    async getVaccineOfLot(ctx, issuer, reference){
       
        
        let lotKey = Lot.makeKey([issuer,reference]);
        let lotExist = await ctx.lotList.getLot(lotKey);
        if (!lotExist) {
            throw new Error('\nlot  ' + reference +  ' does not exist');
        } 

        let vaccineRef = lotExist.vaccineRef;
        // Retrieve the current vaccine using key fields provided
        let vaccineKey = Vaccine.makeKey([issuer, vaccineRef]);
        let vaccine = await ctx.vaccineList.getvaccine(vaccineKey);

        if (!vaccine) {
            throw new Error('\nVaccine  ' + reference +  ' doesnt exist');
        }

        return vaccine;

    }

    
    // Query transactions

    
    async queryHistoryVaccine(ctx, issuer, reference ) {

        // Get a key to be used for History query

        let query = new QueryUtils(ctx, 'org.vaccinet.vaccine');
        let results = await query.getAssetHistory(issuer, reference ); // (cpKey);
        return results;

    }

    async queryHistoryLot(ctx, issuer, reference ) {

        // Get a key to be used for History query

        let query = new QueryUtils(ctx, 'org.vaccinet.lot');
        let results = await query.getAssetHistory(issuer, reference ); // (cpKey);
        return results;

    }

    

    async queryPartialVaccine(ctx, prefix) {

        let query = new QueryUtils(ctx, 'org.vaccinet.vaccine');
        let partial_results = await query.queryKeyByPartial(prefix);

        return partial_results;
    }
    async queryPartialLot(ctx, prefix) {

        let query = new QueryUtils(ctx, 'org.vaccinet.lot');
        let partial_results = await query.queryKeyByPartial(prefix);

        return partial_results;
    }
    


    

}

module.exports = VaccineContract;
