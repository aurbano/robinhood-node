/**
 * Robinhood API NodeJS Wrapper
 * @author Alejandro U. Alvarez
 * @license AGPLv3 - See LICENSE file for more details
 */

'use strict';

// Dependencies
var request = require('request');

function RobinhoodWebApi(opts, callback) {

  // Internal variables
  var _options = opts || {},
      // Private API Endpoints
      _endpoints = {
        login:  "https://api.robinhood.com/api-token-auth/",
        investment_profile: "https://api.robinhood.com/user/investment_profile/",
        accounts: "https://api.robinhood.com/accounts/",
        ach_iav_auth: "https://api.robinhood.com/ach/iav/auth/",
        ach_relationships:  "https://api.robinhood.com/ach/relationships/",
        ach_transfers:"https://api.robinhood.com/ach/transfers/",
        applications: "https://api.robinhood.com/applications/",
        dividends:  "https://api.robinhood.com/dividends/",
        edocuments: "https://api.robinhood.com/documents/",
        instruments:  "https://api.robinhood.com/instruments/",
        margin_upgrade:  "https://api.robinhood.com/margin/upgrades/",
        markets:  "https://api.robinhood.com/markets/",
        notifications:  "https://api.robinhood.com/notifications/",
        orders: "https://api.robinhood.com/orders/",
        password_reset: "https://api.robinhood.com/password_reset/request/",
        quotes: "https://api.robinhood.com/quotes/",
        document_requests:  "https://api.robinhood.com/upload/document_requests/",
        user: "https://api.robinhood.com/user/",
        watchlists: "https://api.robinhood.com/watchlists/"
    },
    _isInit = false,
    _request = request.defaults(),
    _private = {
      session : {},
      account: null,
      username : null,
      password : null,
      headers : null,
      auth_token : null
    },
    api = {};
  
  function _init(){
    _private.username = _options.username;
    _private.password = _options.password;
    _private.headers = {
        "Accept": "*/*",
        "Accept-Encoding": "gzip, deflate",
        "Accept-Language": "en;q=1, fr;q=0.9, de;q=0.8, ja;q=0.7, nl;q=0.6, it;q=0.5",
        "Content-Type": "application/x-www-form-urlencoded; charset=utf-8",
        "X-Robinhood-API-Version": "1.0.0",
        "Connection": "keep-alive",
        "User-Agent": "Robinhood/823 (iPhone; iOS 7.1.2; Scale/2.00)"
    };
    _setHeaders();
    _login(function(){
      _isInit = true;
      callback.call();
    });
  }
  
  function _setHeaders(){
    _request = request.defaults({
      headers: _private.headers
    });
  }
  
  function _login(callback){
    var data = 'password=' + _private.password + '&username=' + _private.username;
    
    _request.post(_endpoints.login, {form: {
      password: _private.password,
      username: _private.username
    }}, function(err, httpResponse, body) {
      if(err) {
        throw (err);
        return;
      }
      
      _private.account = body.account;
      _private.auth_token = body.token;
      _private.headers.Authorization = 'Token ' + _private.auth_token;
      
      _setHeaders();
      
      callback.call();
    });
  }
  
  // Define API methods
  api.investment_profile = function(callback){
    return _request.get({
        url: _endpoints.investment_profile
      }, callback);
  };
  
  api.instruments = function(stock, callback){
    return _request.get({
        url: _endpoints.instruments,
        qs: {'query': stock.upper()}
      }, callback);
  };
  
  api.quote_data = function(stock, callback){
    return _request.get({
        url: _endpoints.quote_data,
        qs: { 'symbols': stock }
      }, callback);
  };
  
  var _place_order = function(options, callback){
    return _request.post({
        url: _endpoints.orders,
        form: {
          account: _private.account,
          instrument: options.instrument.url,
          price: options.bid_price,
          quantity: options.quantity,
          side: options.transaction,
          symbol: options.instrument.symbol,
          time_in_force: options.time || 'gfd',
          trigger: options.trigger || 'immediate',
          type: options.type || 'market'
        }
      }, callback);
  };
  
  api.place_buy_order = function(options, callback){
    options.transaction = 'buy';
    return _place_order(options, callback);
  };
  
  api.place_sell_order = function(options, callback){
    options.transaction = 'sell';
    return _place_order(options, callback);
  };
  
  _init(_options);
  
  return api;
}

module.exports = RobinhoodWebApi;
