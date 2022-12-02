/**
 * (c) Copyright Merative US L.P. and others 2020-2022 
 *
 * SPDX-Licence-Identifier: Apache 2.0
 *
 *  SPDX-Licence-Identifier: Apache 2.0
*/
const dbHelper = require('../helpers/nosql-db-helper');
const constants = require('../helpers/constants');
const { getErrorInfo } = require('../helpers/utils');



const getRuleSet = async (eID) => {
    try {
        const retDoc = await dbHelper.getInstance().getDoc(
            constants.NOSQL_CONTAINER_ID.RULE_SET, eID
        );
        return await dbHelper.getInstance().sanitizeDoc(retDoc);
    } catch(err) {
        const { errorStatus } = getErrorInfo(err);
        if (errorStatus === 404) {
            const error = new Error('RuleSet not found');
            error.status = errorStatus;
            throw error;
        }
        throw err;
    }
}


/*
 Model
  base: version, id, unrestricted
  attributes
    name,  predicate
    type  enum IssuerType
    category   CertificateCategory
    specID
 */
const addRuleSet = async (entity) => {
    const entityCopy = JSON.parse(JSON.stringify(entity));
        
    const id = `${entity.id}`;  //todo if id not specified

    entityCopy.id = id;
    
    // entityCopy.modelVersion = schema.version;
    //todo category, type as enums

    
    const entitySaved = await dbHelper.getInstance().writeDoc(
        constants.NOSQL_CONTAINER_ID.RULE_SET,
        entityCopy
    );
    return dbHelper.getInstance().sanitizeDoc(entitySaved);
}


module.exports = {
    getRuleSet,
    addRuleSet,
    
}