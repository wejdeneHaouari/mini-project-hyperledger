/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
*/

'use strict';

// Utility class for ledger state
const State = require('../ledger-api/state.js');



/**
 * Lot class extends State class
 * Class will be used by application and smart contract to define a lot
 */
class Lot extends State {

    constructor(obj) {
        super(Lot.getClass(), [obj.issuer, obj.reference]);
        Object.assign(this, obj);
    }

    /**
     * Basic getters and setters
    */
    getIssuer() {
        return this.issuer;
    }

    setIssuer(newIssuer) {
        this.issuer = newIssuer;
    }

    setOwnerMSP(mspid) {
        this.mspid = mspid;
    }

    getOwnerMSP() {
        return this.mspid;
    }

    toBuffer() {
        return Buffer.from(JSON.stringify(this));
    }

    /**
     * Deserialize a state data to commercial lot
     * @param {Buffer} data to form back into the object
     */
    static deserialize(data) {
        return State.deserializeClass(data, Lot);
    }

    /**
     * Factory method to create a commercial lot object
     */
    static createInstance( issuer, reference, quantité, vaccineRef, fabricationDate, expirationDate ) {
        return new Lot({  issuer, reference, quantité, vaccineRef, fabricationDate, expirationDate });
    }
    

    static getClass() {
        return 'org.vaccinet.lot';
    }
}

module.exports = Lot;
