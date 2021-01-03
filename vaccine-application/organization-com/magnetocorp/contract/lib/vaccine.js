/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
*/

'use strict';

// Utility class for ledger state
const State = require('../ledger-api/state.js');

// Enumerate commercial vaccine state values
const cpState = {
    PENDING: 1,
    APPROVED: 2,
    DECLINED: 3
};

/**
 * Vaccine class extends State class
 * Class will be used by application and smart contract to define a vaccine
 */
class Vaccine extends State {

    constructor(obj) {
        super(Vaccine.getClass(), [obj.issuer, obj.reference]);
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


    /**
     * Useful methods to encapsulate commercial vaccine states
     */
    setApprouved() {
        this.currentState = cpState.APPROVED;
    }


    isApprouved() {
        return this.currentState === cpState.APPROVED;
    }

    setDeclined() {
        this.currentState = cpState.DECLINED;
    }


    isDeclined() {
        return this.currentState === cpState.DECLINED;
    }

    
    setPending() {
        this.currentState = cpState.PENDING;
    }


    isPending() {
        return this.currentState === cpState.PENDING;
    }

    static fromBuffer(buffer) {
        return Vaccine.deserialize(buffer);
    }

    toBuffer() {
        return Buffer.from(JSON.stringify(this));
    }

    /**
     * Deserialize a state data to commercial vaccine
     * @param {Buffer} data to form back into the object
     */
    static deserialize(data) {
        return State.deserializeClass(data, Vaccine);
    }

    /**
     * Factory method to create a commercial vaccine object
     */
    static createInstance( issuer, reference, name, issueDateTime, composition) {
        return new Vaccine({ issuer, reference, name, issueDateTime, composition });
    }
    

    static getClass() {
        return 'org.vaccinet.vaccine';
    }
}

module.exports = Vaccine;
