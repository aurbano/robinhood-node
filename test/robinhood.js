/**
 * Robinhood API NodeJS Wrapper - Tests
 * @author Alejandro U. Alvarez
 * @license AGPLv3 - See LICENSE file for more details
 */

var should = require('should'),
  Robinhood = require('../src/robinhood.js');
  
describe('Robinhood API', function() {
  var trader = null;
  
  beforeAll(function(done){
    // I don't have a valid username at the moment
    // so can't really test this
    try{
      trader = Robinhood({
        username: 'user',
        password: 'pass'
      }, function(){
        done();
        return;
      });
    }catch(err){
      done(err);
      return;
    }
  });
  
  it('Should get Quote data', function(done) {
    trader.quote_data('GOOG', function(err, httpResponse, body){
      if(err){
        done(err);
        return;
      }
      console.log('Quote data:', body);
      done();
    });
  });
});
