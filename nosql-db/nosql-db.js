/**
 * (c) Copyright Merative US L.P. and others 2020-2022 
 *
 * SPDX-Licence-Identifier: Apache 2.0
 *
 *  SPDX-Licence-Identifier: Apache 2.0
*/

class NoSqlDB {
    constructor(instance) {
        if (instance) {
            if (!(instance instanceof NoSqlDB)) {
                throw new Error(`Instance parameter must inherent from NoSqlDB`);
            }

            this.instance = instance;
        }
    }

    async init(args) {
        this.verifyInstance('init');
        await this.instance.init(args);
    }
    
    async getDoc(containerId, docID, args) {
        this.verifyInstance('getDoc');
        return this.instance.getDoc(containerId, docID, args);
    };

    async getAllDocs(containerId, limit, skip) {
        this.verifyInstance('getDoc');
        return this.instance.getAllDocs(containerId, limit, skip);
    }

    
    async writeDoc(containerId, doc, args) {
        this.verifyInstance('writeDoc');
        return this.instance.writeDoc(containerId, doc, args);
    };
    
    async putDoc (containerId, doc, args) {
        this.verifyInstance('putDoc');
        return this.instance.putDoc(containerId, doc, args);
    };
    
    async deleteDoc (containerId, docID, docRev, args) {
        this.verifyInstance('deleteDoc');
        return this.instance.deleteDoc(containerId, docID, docRev, args);
    };
    
    async sanitizeDoc(doc, args) {
        this.verifyInstance('sanitizeDoc');
        return this.instance.sanitizeDoc(doc, args);
    }

    verifyInstance(methodName) {
        if (!this.instance) {
            throw new Error(
                `A NoSqlDB instance must be passed to the constructor to invoke methods`
            );
        }
        if(typeof this.instance[methodName] !== 'function') {
            throw new Error(`${methodName}() method must be implemented`);
        }
    }
}

module.exports = NoSqlDB;
