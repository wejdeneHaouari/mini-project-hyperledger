/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
*/

'use strict';

// Utility class for collections of ledger states --  a state list
const StateList = require('./../ledger-api/statelist.js');

const Lot = require('./lot.js');

class LotList extends StateList {

    constructor(ctx) {
        super(ctx, 'org.vaccinet.lot');
        this.use(Lot);
    }

    async addLot(lot) {
        return this.addState(lot);
    }

    async getLot(lotKey) {
        return this.getState(lotKey);
    }

    async updateLot(lot) {
        return this.updateState(lot);
    }
}


module.exports = LotList;
