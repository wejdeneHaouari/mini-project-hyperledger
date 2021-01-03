/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
*/

'use strict';

// Fabric smart contract classes
const { Contract, Context } = require('fabric-contract-api');

// PaperNet specifc classes
const  Vaccine = require('./vaccine.js');
const  Lot = require('./lot.js');
const VaccineList = require('./vaccinelist.js');
const LotList = require('./lotlist.js');
const QueryUtils = require('./queries.js');

/**
 * A custom context provides easy access to list of all vaccines
 */
class  VaccineContext extends Context {

    constructor() {
        super();
        // All vaccines are held in a list of vaccines
        this.vaccineList = new VaccineList(this);
        this.lotList = new LotList(this);
    }

}

/**
 * Define vaccine smart contract by extending Fabric Contract class
 *
 */
class  VaccineContract extends Contract {

    constructor() {
        // Unique namespace when multiple contracts per chaincode file
        super('org.vaccinet.vaccine');
    }

    /**
     * Define a custom context for vaccine
    */
    createContext() {
        return new VaccineContext();
    }

    /**
     * Instantiate to perform any setup of the ledger that might be required.
     * @param {Context} ctx the transaction context
     */
    async instantiate(ctx) {
    
        console.log('Instantiate the contract');
    }

    /**
     * Issue vaccine
     *
     * @param {Context} ctx 
     * @param {String} name
     * @param {String} reference 
     * 
     * @param {String} composition 
    */
    async issue(ctx, name, reference , composition, owner) {
        // check if vaccine already exist
        console.log("vaccinecontract:issue:request: ",name,reference,composition,owner);
        console.log("vaccinecontract:issue:owner ", owner);
        let vaccineKey = Vaccine.makeKey([owner,reference]);
        console.log("vaccinecontract:issue:vaccine key: ",vaccineKey);
        let vaccineExist = await ctx.vaccineList.getVaccine(vaccineKey);
        if (vaccineExist) {
            throw new Error('\nVaccine  ' + reference +  ' already exist');
        }
        // check if org2
        let mspid = ctx.clientIdentity.getMSPID();
        if (mspid != "Org2MSP") {
            throw new Error('only org2 members can call this function');
        }

        let vaccine =  Vaccine.createInstance( name, reference, composition, owner);
        
        vaccine.issueDateTime =  new Date().toLocaleDateString();
       
        vaccine.setPending()

       
        vaccine.setOwnerMSP(mspid);


        console.log("vaccinecontract:issue: vaccine key", vaccine.getKey())
        console.log("vaccinecontract:issue:vaccine split key", vaccine.getSplitKey())
        await ctx.vaccineList.addVaccine(vaccine);
       
        // Must return a serialized vaccine to caller of smart contract
        return vaccine;
    }

    async addLot(ctx,numero, quantité, vaccineRef, fabricationDate, expirationDate, owner) {
        // check if vaccine  exist
        
        let vaccineKey = Vaccine.makeKey([owner,vaccineRef]);
        let vaccineExist = await ctx.vaccineList.getVaccine(vaccineKey);
        if (!vaccineExist) {
            throw new Error('\nVaccine  ' + vaccineRef +  ' does not exist');
        }
        // check if org2
        let mspid = ctx.clientIdentity.getMSPID();
        if (mspid != "Org2MSP") {
            throw new Error('only org2 members can call this function');
        }
        let lotKey = Lot.makeKey([owner, numero]);
        let lotExist = await ctx.lotList.getLot(lotKey);
        if (lotExist) {
            throw new Error('\nlot ' + numero +  ' already exist');
        }
        let lot =  Lot.createInstance( numero, quantité, vaccineRef, fabricationDate, expirationDate,owner);
        lot.addDateTime =  new Date().toLocaleDateString();
       
    
        lot.setOwnerMSP(mspid);

        await ctx.lotList.addLot(lot);

        // Must return a serialized vaccine to caller of smart contract
        return lot;
    }


   
    /**
     * @param {Context} ctx 
     * @param {String} reference 
     * @param {String} approvalDate
     * @param {String} issuingOwnerMSP 
     *  @param {String} approvedBy
     *
    */
    async acceptVaccine(ctx,reference, issuingOwnerMSP, approvedBy, owner) {

        let vaccineKey = Vaccine.makeKey([owner,reference]);

        let vaccine = await ctx.vaccineList.getVaccine(vaccineKey);

        // add only WHO can modify state

       vaccine.approvalDate =  new Date().toLocaleDateString();

        await ctx.vaccineList.updateVaccine(vaccine);
        return vaccine;
    }

    // Query transactions

    /**
     * Query history of a vaccine
     * @param {Context} ctx the transaction context
     * @param {Integer} reference vaccine number for this name
    */
    async queryHistory(ctx, reference, owner) {

        // Get a key to be used for History query

        let query = new QueryUtils(ctx, 'org.vaccinet.vaccine');
        let results = await query.getAssetHistory(owner,reference); // (cpKey);
        return results;

    }

     /**
     * Query history of a lot
     * @param {Context} ctx the transaction context
     * @param {Integer} numero vaccine number for this name
    */
   async queryHistoryLot(ctx, numero, owner) {

    // Get a key to be used for History query

    let query = new QueryUtils(ctx, 'org.vaccinet.lot');
    let results = await query.getAssetHistory(owner,numero); // (cpKey);
    return results;

}

     /**
    * queryname vaccine: supply name of owning org, to find list of vaccines based on owner field
    * @param {Context} ctx the transaction context
    * @param {Boolean} isHistory query string created prior to calling this fn
    * 
    */
   async queryAllVaccine(ctx, isHistory,begin,end) {

    let query = new QueryUtils(ctx, 'org.vaccinet.vaccine');
    let name_results = await query.getAll(isHistory,begin,end);

    return name_results;
}
    async queryPartial(ctx, prefix) {

        let query = new QueryUtils(ctx, 'org.vaccinet.vaccine');
        let partial_results = await query.queryKeyByPartial(prefix);

        return partial_results;
    }

    /**
    * queryname vaccine: supply name of owning org, to find list of vaccines based on owner field
    * @param {Context} ctx the transaction context
    * @param {String} name vaccine owner
    */
    async queryname(ctx, name) {

        let query = new QueryUtils(ctx, 'org.vaccinet.vaccine');
        let name_results = await query.queryKeyByName(name);

        return name_results;
    }

    
    
    /**
     * 
     * 
    * queryAdHoc vaccine - supply a custom mango query
    * eg - as supplied as a param:     
    * ex1:  ["{\"selector\":{\"faceValue\":{\"$lt\":8000000}}}"]
    * ex2:  ["{\"selector\":{\"faceValue\":{\"$gt\":4999999}}}"]
    * 
    * @param {Context} ctx the transaction context
    * @param {String} queryString querystring
    */
    async queryAdhoc(ctx, queryString) {

        let query = new QueryUtils(ctx, 'org.vaccinet.vaccine');
        let querySelector = JSON.parse(queryString);
        let adhoc_results = await query.queryByAdhoc(querySelector);

        return adhoc_results;
    }


    /**
     * queryNamed - supply named query - 'case' statement chooses selector to build (pre-canned for demo purposes)
     * @param {Context} ctx the transaction context
     * @param {String} queryname the 'named' query (built here) - or - the adHoc query string, provided as a parameter
     */
    async queryNamed(ctx, queryname) {
        let querySelector = {};
        switch (queryname) {
            case "declined":
                querySelector = { "selector": { "currentState": 3 } };  // 4 = redeemd state
                break;
            case "approved":
                querySelector = { "selector": { "currentState": 2 } };  // 3 = trading state
                break;
            case "pending":
                querySelector = { "selector": { "currentState": 1 } };  // 3 = trading state
                break;
            default: // else, unknown named query
                throw new Error('invalid named query supplied: ' + queryname + '- please try again ');
        }

        let query = new QueryUtils(ctx, 'org.vaccinet.vaccine');
        let adhoc_results = await query.queryByAdhoc(querySelector);

        return adhoc_results;
    }

}

module.exports =   VaccineContract;
