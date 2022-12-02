/**
 * (c) Copyright Merative US L.P. and others 2020-2022 
 *
 * SPDX-Licence-Identifier: Apache 2.0
 *
 *  SPDX-Licence-Identifier: Apache 2.0
*/

const vconfDao = require('../dao/verifier-config-dao');

const constants = require('../helpers/constants');
const Logger = require('../config/logger');
const { validateReqBody, validateRequiredField, logAndSendErrorResponse } = require('../helpers/utils');

const logger = new Logger('verifier-configapi-controller');
 

const getVerifierConfig = async (req, res) => {
    const txID = req.headers[constants.REQUEST_HEADERS.TRANSACTION_ID];
    
    try {
        const cId = req.params.verConfigId;
        logger.info(`Get VerifierConfig ${cId}`, txID);
        // const result = await daoCustomer.getAllCustomers(txID);
        
        
        const result = await vconfDao.getVerifierConfigurations(cId);
        logger.response(200, `Success`, txID);
        return res.status(200).json({
            type: constants.API_TYPENAME.VERIFIER_CONFIGURATION ,
            payload: result
        });
    } catch (error) {
        return logAndSendErrorResponse(txID, res, error, 'getVerifierConfig')
    }
}

  

const getAllVerifierConfig = async (req, res) => {
    const txID = req.headers[constants.REQUEST_HEADERS.TRANSACTION_ID];

    try {
        logger.info(`GetAll VerifierConfig`, txID);
        // const result = await daoCustomer.getAllCustomers(txID);

        logger.response(200, `Success`, txID);
        return res.status(200).json({
            type: constants.API_TYPENAME.VERIFIER_CONFIGURATION_COLLECTION ,
            payload: { data: result }
        });
    } catch (error) {
        return logAndSendErrorResponse(txID, res, { statusCode: error.statusCode, message: error.message }, 'getAllVerifierConfig')
    }
}


const addVerifierConfig = async (req, res) => {
    const txID = req.headers[constants.REQUEST_HEADERS.TRANSACTION_ID];    
    try {
        const entity = req.body;
        const cId = entity.id;
        logger.info(`Adding VerifierConfig ${cId}`, txID);
        
        
        const result = await vconfDao.addVerifierConfigurations(entity);
        logger.response(200, `Success`, txID);
        return res.status(200).json({
            type: constants.API_TYPENAME.VERIFIER_CONFIGURATION ,
            payload: result
        });
    } catch (error) {
        return logAndSendErrorResponse(txID, res, error, 'getVerifierConfig')
    }    
}

// todo deleteVerifierConfig

const getVerifierConfigContent = async (req, res) => {
    const txID = req.headers[constants.REQUEST_HEADERS.TRANSACTION_ID];
    const scontent = require('../helpers/static');
    try {
        logger.info(`Get getVerifierConfigContent`, txID);
        const payload = scontent.verifierConfigContent;
        

        logger.response(200, `Success`, txID);
        return res.status(200).json({
            type: constants.API_TYPENAME.VERIFIER_CONFIGURATION_CONTENT ,
            payload
        });
    } catch (error) {
        return logAndSendErrorResponse(txID, res, { statusCode: error.statusCode, message: error.message }, 'getAllVerifierConfig')
    }
}
module.exports = {
    getVerifierConfig,
    addVerifierConfig,
    getVerifierConfigContent,
    getAllVerifierConfig
}
