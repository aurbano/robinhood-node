/**
 * Robinhood API NodeJS Wrapper - Tests
 * @author Alejandro U. Alvarez
 * @license AGPLv3 - See LICENSE file for more details
 */

var test = require('ava');
var Robinhood = require('../src/robinhood');

var TEST_SYMBOL = 'GOOG';

test('Should get ' + TEST_SYMBOL + ' quote', function(t) {
    Robinhood(null).quote_data(TEST_SYMBOL, function(err, response, body) {
        if(err) {
            done(err);
            return;
        }

        t.is(body.results[0].symbol, TEST_SYMBOL);
    });
});

test('Should get ' + TEST_SYMBOL + ' fundamentals', function(t) {
    Robinhood(null).fundamentals(TEST_SYMBOL, function(err, response, body) {
        if(err) {
            done(err);
            return;
        }

        // TODO make this test better
        t.is(Object.keys(body).length, 21);
    });
});

test('Should get markets', function(t) {
    Robinhood(null).markets(function(err, response, body) {
        if(err) {
            done(err);
            return;
        }

        t.true(body.results.length > 0);
    });
});

test('Should get news about ' + TEST_SYMBOL, function(t) {
    Robinhood(null).news(TEST_SYMBOL, function(err, response, body) {
        if(err) {
            done(err);
            return;
        }

        t.true(body.results.length > 0);
    });
});

test('Should get data for the SP500 index up', function(t) {
    Robinhood(null).sp500_up(function(err, response, body) {
        if(err) {
            done(err);
            return;
        }

        t.true(body.results.length > 0);
    });
});

test('Should get data for the SP500 index down', function(t) {
    Robinhood(null).sp500_down(function(err, response, body) {
        if(err) {
            done(err);
            return;
        }

        t.true(body.results.length > 0);
    });
});

test('Should not get positions without login', function(t) {
    Robinhood(null).positions(function(err, response, body) {
        if(err) {
            done(err);
            return;
        }

        t.true(body.detail);
    });
});

test('Should not get nonzero positions without credentials', function(t){
    Robinhood(null).nonzero_positions(function(err,response,body) {
        if(err) {
            done(err);
            return;
        }

        t.true(body.detail);
    });
});
