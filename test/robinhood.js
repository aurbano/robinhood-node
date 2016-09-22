/**
 * Robinhood API NodeJS Wrapper - Tests
 * @author Alejandro U. Alvarez
 * @license AGPLv3 - See LICENSE file for more details
 */

var should = require('should');
var Robinhood = require('../src/robinhood');

var TEST_SYMBOL = 'GOOG';

describe('Robinhood API', function() {
    it('Should get ' + TEST_SYMBOL + ' quote', function(done) {
        Robinhood(null).quote_data(TEST_SYMBOL, function(err, response, body) {
            if(err) {
                done(err);
                return;
            }

            should(body.results[0].symbol).be.equal(TEST_SYMBOL);
            done();
        });
    });

    it('Should get markets', function(done) {
        Robinhood(null).markets(function(err, response, body) {
            if(err) {
                done(err);
                return;
            }

            should(body.results.length).be.above(0);

            done();
        });
    });

    it('Should get news about ' + TEST_SYMBOL, function(done) {
        Robinhood(null).news(TEST_SYMBOL, function(err, response, body) {
            if(err) {
                done(err);
                return;
            }

            should(body.results.length).be.above(0);

            done();
        });
    });

    it('Should get data for the SP500 index up', function(done) {
        Robinhood(null).sp500_up(function(err, response, body) {
            if(err) {
                done(err);
                return;
            }

            should(body.results.length).be.above(0);

            done();
        });
    });

    it('Should get data for the SP500 index down', function(done) {
        Robinhood(null).sp500_down(function(err, response, body) {
            if(err) {
                done(err);
                return;
            }

            should(body.results.length).be.above(0);

            done();
        });
    });

    it('Should not get positions without login', function(done) {
        Robinhood(null).positions(function(err, response, body) {
            if(err) {
                done(err);
                return;
            }

            should(body).have.property('detail');

            done();
        });
    });
});
