/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
*/

'use strict';

const State = require('./../ledger-api/state.js');


const cpState = {
    PENDING: 1,
    APPROVED: 2,
    DECLINED: 3
};


class Vaccine extends State {

    constructor(obj) {
        super(Vaccine.getClass(), [obj.reference]);
        Object.assign(this, obj);
    }

    /**
     * Basic getters and setters
    */
    getName() {
        return this.name;
    }

    setName(newName) {
        this.name = newName;
    }

    setOwnerMSP(mspid) {
        this.mspid = mspid;
    }

    getOwnerMSP() {
        return this.mspid;
    }

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
     * Deserialize a state data to vaccine
     * @param {Buffer} data to form back into the object
     */
    static deserialize(data) {
        return State.deserializeClass(data, Vaccine);
    }

    /**
     * Factory method to create a vaccine object
     */
    static createInstance(name, reference, issueDateTime, composition ) {
        return new Vaccine({name, reference, issueDateTime, composition });
    }

    static getClass() {
        return 'org.vaccinet.vaccine';
    }
}

module.exports = Vaccine;
