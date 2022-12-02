/**
 * (c) Copyright Merative US L.P. and others 2020-2022 
 *
 * SPDX-Licence-Identifier: Apache 2.0
 *
 *  SPDX-Licence-Identifier: Apache 2.0
*/

const express = require('express');
const requestLogger = require('../middleware/request-logger');

const constants = require('../helpers/constants');
// const authStrategy = require('../middleware/auth-strategy');
const verifierconfigController = require('../controllers/verifier-configapi');
const baseEntityController = require('../controllers/base-entity-api');

const router = express.Router();

// todo checkAuthUser
router.get("/verifier-configurations/content", requestLogger, verifierconfigController.getVerifierConfigContent); 
router.get("/verifier-configurations",  requestLogger, verifierconfigController.getAllVerifierConfig);

router.post('/verifier-configurations', requestLogger, verifierconfigController.addVerifierConfig);

router.get("/verifier-configurations/:verConfigId",  requestLogger, verifierconfigController.getVerifierConfig);
router.get("/verifier-configurations/:verConfigId/latest", requestLogger, verifierconfigController.getVerifierConfig);
router.get("/verifier-configurations/:verConfigId/:version/content", requestLogger, verifierconfigController.getVerifierConfigContent); // Resolve all content

/* todo
 master-data
 displays
 rules
 trust-lists
 value-sets
 classifier-rules
 */
router.post('/rules', requestLogger, baseEntityController.addRule);
router.post('/rules/:ruleId', requestLogger, baseEntityController.addRule);
router.get("/rules/:ruleId/:version",  requestLogger, baseEntityController.getRule);

router.post('/rule-sets', requestLogger, baseEntityController.addRuleSet);
router.post('/rules-sets/:setId', requestLogger, baseEntityController.addRuleSet);
router.get("/rule-sets/:setId/:version",  requestLogger, baseEntityController.getRuleSet);

module.exports = router;

