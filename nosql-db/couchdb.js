/**
 * (c) Copyright Merative US L.P. and others 2020-2022 
 *
 * SPDX-Licence-Identifier: Apache 2.0
 *
 *  SPDX-Licence-Identifier: Apache 2.0
*/

// TODO: partition containers

const nano = require('nano');

const NoSqlDB = require('./nosql-db');
const constants = require('../helpers/constants');
const dbHelper = require('../helpers/nosql-db-helper');
const { getErrorInfo } = require('../helpers/utils');
const Logger = require('../config/logger');

const logger = new Logger('couch-db');


const couch = nano(process.env.COUCHDB_URL);

const verConfigDbName = constants.NOSQL_CONTAINER_ID.VERIFIER_CONFIGURATIONS_ENTITY
const schemaDbName = constants.NOSQL_CONTAINER_ID.SCHEMA;
const revokedDbName = constants.NOSQL_CONTAINER_ID.REVOKED_CREDENTIAL;
const keysDbName = constants.NOSQL_CONTAINER_ID.KEYS;
const metadataDbName = constants.NOSQL_CONTAINER_ID.META_DATA;

let verConfigDB;
let schemaDB;
let revokedCredentialDB;
let keysDB;
let metadataDB

class CouchDB extends NoSqlDB {
    async init() {
        try {
            const dbList = await couch.db.list();
            verConfigDB = await this.createDb(verConfigDbName, dbList, false);
            
        } catch(err) {
            const { errorMsg } = getErrorInfo(err);
            logger.error(`Unable to initialize CouchDB: ${errorMsg}`);
            throw err;
        }
    }

    async getDoc(dbName, docID) {
        logger.info(`getDoc ${docID} from ${dbName} database`);

        const db = this.getDB(dbName);

        try {
            const response = await db.get(docID);
            return dbHelper.removeUnderscores(response);
        } catch(err) {
            dbHelper.handleError(err, 'getDoc', docID);
        }
    };

    async getAllDocs(dbName, limit, skip) {
        logger.info(`getAllDocs from ${dbName} database`);
        const db = this.getDB(dbName);

        const options = {
            include_docs: true,
            limit,
            skip,
            descending: false
        }

        try {
            const response = await db.list(options);
            return {
                total_rows: response.rows.length,
                limit,
                skip,
                rows: response.rows,
            };
        } catch(err) {
            const { errorStatus, errorMsg } = getErrorInfo(err);
            const error = new Error(`Method: getAllDocs; Error: ${errorMsg}`);
            error.status = errorStatus;
            throw error;
        }
    }

    
    
    async writeDoc(dbName, doc) {
        logger.info(`writeDoc ${doc.id} to ${dbName} database`);
        dbHelper.verifyDoc(doc);

        const db = this.getDB(dbName);

        try {
            const response = await db.insert(dbHelper.addUnderscores(doc));
            return response;
        } catch(err) {
            dbHelper.handleError(err, 'writeDoc', doc.id);
        }
    };
    
    async putDoc (dbName, doc) {
        logger.info(`putDoc ${doc.id} from ${dbName} database`);
        dbHelper.verifyDoc(doc);
        if (!doc.rev) {
            const error = new Error('Document is missing rev');
            error.status = 400;
            throw error;
        }

        const db = this.getDB(dbName);

        try {
            const response = await db.insert(dbHelper.addUnderscores(doc));
            return response;
        } catch(err) {
            dbHelper.handleError(err, 'putDoc', doc.id);
        }
    };
    
    async deleteDocWithRev(dbName, docID, docRev) {
        logger.info(
            `deleteDoc with id ${docID} and rev ${docRev} from ${dbName} database`
        );

        const db = this.getDB(dbName);

        return await db.destroy(docID, docRev);
    }

    async deleteDocWithoutRev(dbName, docID) {
        logger.info(
            `deleteDoc with id ${docID} from ${dbName} database`
        );

        const db = this.getDB(dbName);

        const doc = await this.getDoc(dbName, docID);
        const docRev = doc.rev;

        return await db.destroy(docID, docRev);
    }

    async deleteDoc (dbName, docID, docRev) {
        try {
            if (docRev) {
                return await this.deleteDocWithRev(dbName, docID, docRev);
            }
            return await this.deleteDocWithoutRev(dbName, docID);
        } catch(err) {
            const { errorStatus } = getErrorInfo(err);
            if (errorStatus === 404) {
                const error = new Error(`Document not found`);
                error.status = 404;
                throw error;
            }
            dbHelper.handleError(err, 'deleteDoc', docID);
        }
    };
    
    async sanitizeDoc(doc) {
        return doc;
    }

    getDB(dbName) {
        switch (dbName) {
            case constants.NOSQL_CONTAINER_ID.VERIFIER_CONFIGURATIONS_ENTITY:
                return verConfigDB;
            case constants.NOSQL_CONTAINER_ID.SCHEMA:
                return schemaDB;
            case constants.NOSQL_CONTAINER_ID.REVOKED_CREDENTIAL:
                return revokedCredentialDB;
            case constants.NOSQL_CONTAINER_ID.KEYS:
                return keysDB;
            case constants.NOSQL_CONTAINER_ID.META_DATA:
                return metadataDB;
            default:
                const error = new Error(`Unknown database id ${dbName}`);
                error.status = 500;
                throw error;
        }
    }

    async createDb(dbName, dbList, partitioned) {
        if (dbList.includes(dbName)) {
            console.log(`CouchDB ${dbName} already exists`);
        } else {
            await couch.db.create(dbName, { partitioned });
            console.log(`Successfully created CouchDB ${dbName}`);
        }
        return couch.use(dbName);
    }
}

module.exports = CouchDB;
