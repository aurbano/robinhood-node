/**
 * Robinhood API NodeJS Wrapper - Tests
 * @author Alejandro U. Alvarez
 * @license AGPLv3 - See LICENSE file for more details
 * @version 0.0.1
 */

var should = require('should'),
  Robinhood = require('../src/robinhood.js');
  
describe('Robinhood API', function() {
  var trader = null;
  
  before(function(done){
    // I don't have a valid username at the moment
    // so can't really test this
    trader = Robinhood({
      username: 'user',
      password: 'pass'
    });
  });
  
  it('Should get Quote data', function(done) {
    trader.quote_data('GOOG', function(err, httpResponse, body){
      if(err){
        done(err);
      }
      console.log('Quote data:', body);
      done();
    });
  });
});
