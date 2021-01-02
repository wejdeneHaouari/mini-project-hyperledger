/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
*/

'use strict';

const State = require('./../ledger-api/state.js');




class Lot extends State {

    constructor(obj) {
        super(Lot.getClass(), [obj.reference]);
        Object.assign(this, obj);
    }

    /**
     * Basic getters and setters
    */
    getNumero() {
        return this.numero;
    }

    setNumero(newNumero) {
        this.numero = newNumero;
    }


    setOwnerMSP(mspid) {
        this.mspid = mspid;
    }

    getOwnerMSP() {
        return this.mspid;
    }

    

    static fromBuffer(buffer) {
        return Lot.deserialize(buffer);
    }

    toBuffer() {
        return Buffer.from(JSON.stringify(this));
    }

    /**
     * Deserialize a state data to lot
     * @param {Buffer} data to form back into the object
     */
    static deserialize(data) {
        return State.deserializeClass(data, Lot);
    }

    /**
     * Factory method to create a lot object
     */
    static createInstance(numero, quantité, vaccineRef, fabricationDate, expirationDate ) {
        return new Lot({numero, quantité, vaccineRef, fabricationDate, expirationDate });
    }

    static getClass() {
        return 'org.vaccinet.lot';
    }
}

module.exports = Lot;
