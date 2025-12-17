const admin = require('firebase-admin');
const functions = require('firebase-functions');
const sinon = require('sinon');
const assert = require('assert');

// Initialize test sdk
const test = require('firebase-functions-test')();

describe('Commit+ Backend Tests', () => {
    let myFunctions, adminInitStub;

    before(() => {
        // Stub admin.initializeApp so it doesn't try to connect to real firebase
        // Check if called already
        if (admin.apps.length === 0) {
            adminInitStub = sinon.stub(admin, 'initializeApp');
        }

        // We need to require index.js *after* initializing firebase-functions-test
        // but ideally we test modules directly if possible or mock dependencies first.
        // For simplicity, let's mock the internal requirements of the function if possible
        // or just mock admin methods.

        // Actually, simple requires might fail if they trigger logic on load.
        // Let's try requiring the partners module directly? 
        // No, partners.js requires 'firebase-admin'.

        myFunctions = require('../index.js');
    });

    after(() => {
        test.cleanup();
        if (adminInitStub) adminInitStub.restore();
    });

    describe('partners.sendPartnerInvite', () => {
        it('should throw error if user is not authenticated', async () => {
            const wrapped = test.wrap(myFunctions.sendPartnerInvite);
            try {
                await wrapped({ email: 'test@example.com' }, {}); // No auth in context
                assert.fail('Should have thrown unauthenticated error');
            } catch (error) {
                assert.equal(error.code, 'unauthenticated');
            }
        });

        it('should throw error if email is missing', async () => {
            const wrapped = test.wrap(myFunctions.sendPartnerInvite);
            const context = { auth: { uid: 'user123' } };
            try {
                await wrapped({}, context);
                assert.fail('Should have thrown invalid-argument error');
            } catch (error) {
                assert.equal(error.code, 'invalid-argument');
            }
        });
    });
});
