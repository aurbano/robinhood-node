/**
 * Robinhood API NodeJS Wrapper - Tests
 * @author Alejandro U. Alvarez
 * @license AGPLv3 - See LICENSE file for more details
 */

var should = require('should');
var Robinhood = require('../src/robinhood');

describe('Robinhood API', function() {
    it('Should accept an array of ticker symbols', (done) => {
        Robinhood(null).quote_data(['GOOG', 'AAPL', 'FB'], (err, response, body) => {
            should.not.exist(err);
            body.results.should.be.an.instanceOf(Array).and.have.lengthOf(3);
            console.log(body);
            done();
        });
    });
    it('Should accept a single ticker symbol', (done) => {
      Robinhood(null).quote_data('GOOG', (err, response, body) => {
        should.not.exist(err);
        body.results.should.be.an.instanceOf(Array).and.have.lengthOf(1);
        console.log(body);
        done();
      })
    });
    it('Should be case insensitive', (done) => {
      Robinhood(null).quote_data(['AaPl', 'goog', 'FB'], (err, response, body) => {
        should.not.exist(err);
        body.results.should.be.an.instanceOf(Array).and.have.lengthOf(3);
        console.log(body);
        done();
      });
    });
});
