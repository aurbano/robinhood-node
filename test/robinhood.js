/**
 * Robinhood API NodeJS Wrapper - Tests
 * @author Alejandro U. Alvarez
 * @license AGPLv3 - See LICENSE file for more details
 */

var should = require('should');
var Robinhood = require('../src/robinhood');

describe('Robinhood API', function() {
    it('Should get GOOG quote', function(done) {
        Robinhood(null).quote_data('GOOG', function(err, response, body) {
            if(err) {
                done(err);
                return;
            }

            console.log(body);
            done();
        });
    });
});
