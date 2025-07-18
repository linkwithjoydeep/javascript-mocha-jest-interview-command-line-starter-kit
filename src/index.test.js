// We support Mocha + Chai for unit testing by default.
// 
// If you prefer using Jest instead, run `npm run init:jest` in the terminal to setup Jest dependencies.
// This will switch your project to use Jest which includes built-in assertions and mocking capabilities.

const { assert } = require("chai");

describe('Mocha Test suite', function () {
    it('should expect to add', function () {
        assert.equal(2 + 3, 5);
    });
});