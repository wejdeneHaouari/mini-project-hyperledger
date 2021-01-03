/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
*/

'use strict';

// Utility class for collections of ledger states --  a state list
const StateList = require('./../ledger-api/statelist.js');

const Vaccine = require('./vaccine.js');

class VaccineList extends StateList {

    constructor(ctx) {
        super(ctx, 'org.vaccinet.vaccine');
        this.use(Vaccine);
    }

    async addVaccine(vaccine) {
        return this.addState(vaccine);
    }

    async getVaccine(vaccineKey) {
        return this.getState(vaccineKey);
    }

    async updateVaccine(vaccine) {
        return this.updateState(vaccine);
    }

    async getAllVaccine(){
        return this.GetAllAssets();
    }
}


module.exports = VaccineList;
