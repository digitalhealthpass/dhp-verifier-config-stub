/**
 * (c) Copyright Merative US L.P. and others 2020-2022 
 *
 * SPDX-Licence-Identifier: Apache 2.0
 *
 *  SPDX-Licence-Identifier: Apache 2.0
*/

const ruleDao = require('../dao/rules-dao');
const ruleSetDao = require('../dao/ruleset-dao');
const constants = require('../helpers/constants');
const Logger = require('../config/logger');
const { validateReqBody, validateRequiredField, logAndSendErrorResponse } = require('../helpers/utils');

const logger = new Logger('base-entity-api-controller');
 


const getRule = async (req, res) => {
    const txID = req.headers[constants.REQUEST_HEADERS.TRANSACTION_ID];
    
    try {
        const cId = req.params.verConfigId;
        logger.info(`Get Rule ${cId}`, txID);
        // const result = await daoCustomer.getAllCustomers(txID);
        
        
        const result = await ruleDao.getRule(cId);
        logger.response(200, `Success`, txID);
        return res.status(200).json({
            type: constants.API_TYPENAME.RULE ,
            payload: result
        });
    } catch (error) {
        return logAndSendErrorResponse(txID, res, error, 'getRule')
    }
}

const getRulesByQuery = async (req, res) => {
    const txID = req.headers[constants.REQUEST_HEADERS.TRANSACTION_ID];

    try {
        logger.info(`getRulesByQuery`, txID);
        //tdo
        logger.response(200, `Success`, txID);
        return res.status(200).json({
            type: constants.API_TYPENAME.VERIFIER_CONFIGURATION_COLLECTION ,
            payload: { data: result }
        });
    } catch (error) {
        return logAndSendErrorResponse(txID, res, { statusCode: error.statusCode, message: error.message }, 'getRulesByQuery')
    }
}


const addRule = async (req, res) => {
    const txID = req.headers[constants.REQUEST_HEADERS.TRANSACTION_ID];    
    try {
        const entity = req.body;
        const cId = entity.id;
        logger.info(`Adding Rule ${cId}`, txID);
        
        
        const result = await ruleDao.addRule(entity);
        logger.response(200, `Success`, txID);
        return res.status(200).json({
            type: constants.API_TYPENAME.VERIFIER_CONFIGURATION ,
            payload: result
        });
    } catch (error) {
        return logAndSendErrorResponse(txID, res, error, 'getRule')
    }    
}

// todo deleteRule

/**
 * RuleSet
 */
const getRuleSet = async (req, res) => {
    const txID = req.headers[constants.REQUEST_HEADERS.TRANSACTION_ID];
    
    try {
        const cId = req.params.verConfigId;
        logger.info(`Get RuleSet ${cId}`, txID);
        // const result = await daoCustomer.getAllCustomers(txID);
        
        
        const result = await ruleSetDao.getRuleSet(cId);
        logger.response(200, `Success`, txID);
        return res.status(200).json({
            type: constants.API_TYPENAME.RULE ,
            payload: result
        });
    } catch (error) {
        return logAndSendErrorResponse(txID, res, error, 'getRuleSet')
    }
}

const addRuleSet = async (req, res) => {
    const txID = req.headers[constants.REQUEST_HEADERS.TRANSACTION_ID];    
    try {
        const entity = req.body;
        const cId = entity.id;
        logger.info(`Adding RuleSet ${cId}`, txID);
        
        
        const result = await ruleSetDao.addRuleSet(entity);
        logger.response(200, `Success`, txID);
        return res.status(200).json({
            type: constants.API_TYPENAME.VERIFIER_CONFIGURATION ,
            payload: result
        });
    } catch (error) {
        return logAndSendErrorResponse(txID, res, error, 'getRuleSet')
    }    
}



module.exports = {
    getRule,
    addRule,    
    getRulesByQuery,
    getRuleSet,
    addRuleSet,

}
