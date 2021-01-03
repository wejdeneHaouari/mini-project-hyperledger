
/*
SPDX-License-Identifier: Apache-2.0
*/
'use strict';

const State = require('../ledger-api/state.js');
//const CommercialPaper = require('./paper.js');
/**
 * Query Class for query functions such as history etc
 *
 */
class QueryUtils {

    constructor(ctx, listName) {
        this.ctx = ctx;
        this.name = listName;
        //this.supportedTypes = {};
    }

    // =========================================================================================
    // getAssetHistory takes the composite key as arg, gets returns results as JSON to 'main contract'
    // =========================================================================================
    /**
    * Get Asset History for a vaccine
    * @param {String} issuer the CP issuer
    * @param {String} reference vaccine number
    */
    async getAssetHistory(issuer, reference) {

        let ledgerKey = await this.ctx.stub.createCompositeKey(this.name, [issuer, reference]);
        const resultsIterator = await this.ctx.stub.getHistoryForKey(ledgerKey);
        let results = await this.getAllResults(resultsIterator, true);

        return results;
    }

    // ===========================================================================================
    // queryKeyByPartial performs a partial query based on the namespace and  asset key prefix provided

    // Read-only function results are not typically submitted to ordering. If the read-only
    // results are submitted to ordering, or if the query is used in an update transaction
    // and submitted to ordering, then the committing peers will re-execute to guarantee that
    // result sets are stable between endorsement time and commit time. The transaction is
    // invalidated by the committing peers if the result set has changed between endorsement
    // time and commit time.
    // 
    // ===========================================================================================
    /**
    * queryOwner vaccine
    * @param {String} assetspace the asset space (eg MagnetoCorp's assets)
    */
    async queryKeyByPartial(assetspace) {

        if (arguments.length < 1) {
            throw new Error('Incorrect number of arguments. Expecting 1');
        }
       
        const resultsIterator = await this.ctx.stub.getStateByPartialCompositeKey(this.name, [assetspace]);
        let method = this.getAllResults;
        let results = await method(resultsIterator, false);

        return results;
    }



    /**
     * Function getAllResults
     * @param {resultsIterator} iterator within scope passed in
     * @param {Boolean} isHistory query string created prior to calling this fn
    */
    async getAllResults(iterator, isHistory) {
        let allResults = [];
        let res = { done: false, value: null };

        while (true) {
            res = await iterator.next();
            let jsonRes = {};
            if (res.value && res.value.value.toString()) {
                if (isHistory && isHistory === true) {
                    //jsonRes.TxId = res.value.tx_id;
                    jsonRes.TxId = res.value.txId;
                    jsonRes.Timestamp = res.value.timestamp;
                    jsonRes.Timestamp = new Date((res.value.timestamp.seconds.low * 1000));
                    let ms = res.value.timestamp.nanos / 1000000;
                    jsonRes.Timestamp.setMilliseconds(ms);
                    if (res.value.is_delete) {
                        jsonRes.IsDelete = res.value.is_delete.toString();
                    } else {
                        try {
                            jsonRes.Value = JSON.parse(res.value.value.toString('utf8'));
                            // report the vaccine states during the asset lifecycle, just for asset history reporting
                            switch (jsonRes.Value.currentState) {
                                case 1:
                                    jsonRes.Value.currentState = 'PENDING';
                                    break;
                                case 2:
                                    jsonRes.Value.currentState = 'APPROVED';
                                    break;
                                case 3:
                                    jsonRes.Value.currentState = 'DECLINED';
                                    break;
        
                                default: // else, unknown named query
                                    jsonRes.Value.currentState = 'UNKNOWN';
                            }

                        } catch (err) {
                            console.log(err);
                            jsonRes.Value = res.value.value.toString('utf8');
                        }
                    }
                } else { // non history query ..
                    jsonRes.Key = res.value.key;
                    try {
                        jsonRes.Record = JSON.parse(res.value.value.toString('utf8'));
                    } catch (err) {
                        console.log(err);
                        jsonRes.Record = res.value.value.toString('utf8');
                    }
                }
                allResults.push(jsonRes);
            }
            // check to see if we have reached the end
            if (res.done) {
                // explicitly close the iterator 
                console.log('iterator is done');
                await iterator.close();
                return allResults;
            }

        }  // while true
    }

}
module.exports = QueryUtils;