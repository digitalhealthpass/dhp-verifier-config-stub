/**
 * (c) Copyright Merative US L.P. and others 2020-2022 
 *
 * SPDX-Licence-Identifier: Apache 2.0
 *
 *  SPDX-Licence-Identifier: Apache 2.0
*/
const moment = require('moment');
const dbHelper = require('../helpers/nosql-db-helper');
const constants = require('../helpers/constants');
const { getErrorInfo } = require('../helpers/utils');

const LATEST_VERSION = "latest";

getVerifierConfigurations = async (eID) => {
    try {
        const retDoc = await dbHelper.getInstance().getDoc(
            constants.NOSQL_CONTAINER_ID.VERIFIER_CONFIGURATIONS_ENTITY, eID
        );
        const payload = await dbHelper.getInstance().sanitizeDoc(retDoc);
        
        return payload;
    } catch(err) {
        const { errorStatus } = getErrorInfo(err);
        if (errorStatus === 404) {
            const error = new Error('VerifierConfigurations not found');
            error.status = errorStatus;
            throw error;
        }
        throw err;
    }
}

/*
 Model
  base: createdOrg, createdUser, createdAt, updatedAt, entity
  attributes
    name, customer, customerId , organization, organizationId, label, offline, masterCatalog, refresh, verifierType, configuration
    List: specificationConfigurations, valueSets, disabledSpecifications, disabledRules
 */
const addVerifierConfigurations = async (entity) => {
    const entityCopy = JSON.parse(JSON.stringify(entity));
    
    // const id = `${schema.id};v=${schema.version}`;
    const id = `${entity.id}`;

    entityCopy.id = id;
    
    entityCopy.created_at = `${moment().toISOString().slice(0,-5)}Z`;
    entityCopy.updated_at = entityCopy.createdAt;
    // entityCopy.modelVersion = schema.version;
    entityCopy.name = entity.name;

    
    const entitySaved = await dbHelper.getInstance().writeDoc(
        constants.NOSQL_CONTAINER_ID.VERIFIER_CONFIGURATIONS_ENTITY,
        entityCopy
    );
    return dbHelper.getInstance().sanitizeDoc(entitySaved);
}

exports.deleteVerifierConfigurations = async (eID) => {
    try {
        const retDoc = await dbHelper.getInstance().deleteDoc(
            constants.NOSQL_CONTAINER_ID.VERIFIER_CONFIGURATIONS_ENTITY, eID
        );
        return await dbHelper.getInstance().sanitizeDoc(retDoc);
    } catch(err) {
        const { errorStatus } = getErrorInfo(err);
        if (errorStatus === 404) {
            const error = new Error('Rule not found');
            error.status = errorStatus;
            throw error;
        }
        throw err;
    }
}

module.exports = {
    getVerifierConfigurations,
    addVerifierConfigurations

}