/**
 * Robinhood API NodeJS Wrapper
 * @author Alejandro U. Alvarez
 * @license AGPLv3 - See LICENSE file for more details
 */

'use strict';

// Dependencies
var request = require('request');
var Promise = require('promise');

function RobinhoodWebApi(opts, callback) {

  /* +--------------------------------+ *
   * |      Internal variables        | *
   * +--------------------------------+ */
  var _apiUrl = 'https://api.robinhood.com/';

  var _options = opts || {},
      // Private API Endpoints
      _endpoints = {
        login:  'api-token-auth/',
        investment_profile: 'user/investment_profile/',
        accounts: 'accounts/',
        ach_iav_auth: 'ach/iav/auth/',
        ach_relationships:  'ach/relationships/',
        ach_transfers:'ach/transfers/',
        ach_deposit_schedules: "ach/deposit_schedules/",
        applications: 'applications/',
        dividends:  'dividends/',
        edocuments: 'documents/',
        instruments:  'instruments/',
        margin_upgrade:  'margin/upgrades/',
        markets:  'markets/',
        notifications:  'notifications/',
        notifications_devices: "notifications/devices/",
        orders: 'orders/',
        cancel_order: 'orders/',      //API expects https://api.robinhood.com/orders/{{orderId}}/cancel/
        password_reset: 'password_reset/request/',
        quotes: 'quotes/',
        document_requests:  'upload/document_requests/',
        user: 'user/',

        user_additional_info: "user/additional_info/",
        user_basic_info: "user/basic_info/",
        user_employment: "user/employment/",
        user_investment_profile: "user/investment_profile/",

        watchlists: 'watchlists/',
        positions: 'positions/',
        fundamentals: 'fundamentals/',
        sp500_up: 'midlands/movers/sp500/?direction=up',
        sp500_down: 'midlands/movers/sp500/?direction=down',
        news: 'midlands/news/'
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
        'Accept': '*/*',
        'Accept-Encoding': 'gzip, deflate',
        'Accept-Language': 'en;q=1, fr;q=0.9, de;q=0.8, ja;q=0.7, nl;q=0.6, it;q=0.5',
        'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
        'X-Robinhood-API-Version': '1.0.0',
        'Connection': 'keep-alive',
        'User-Agent': 'Robinhood/823 (iPhone; iOS 7.1.2; Scale/2.00)'
    };
    _setHeaders();
    _login(function(){
      _isInit = true;

      if (callback) {
        callback.call();
      }
    });
  }

  function _setHeaders(){
    _request = request.defaults({
      headers: _private.headers,
      json: true,
      gzip: true
    });
  }

  function _login(callback){
    _request.post({
      uri: _apiUrl + _endpoints.login,
      form: {
        password: _private.password,
        username: _private.username
      }
    }, function(err, httpResponse, body) {
      if(err) {
        throw (err);
      }

      _private.auth_token = body.token;
      _private.headers.Authorization = 'Token ' + _private.auth_token;

      _setHeaders();

      // Set account
      api.accounts(function(err, httpResponse, body) {
        if (err) {
          throw (err);
        }

        if (body.results) {
          _private.account = body.results[0].url;
        }

        callback.call();
      });
    });
  }

  /* +--------------------------------+ *
   * |      Define API methods        | *
   * +--------------------------------+ */
  api.investment_profile = function(callback){
    return _request.get({
        uri: _apiUrl + _endpoints.investment_profile
      }, callback);
  };

  api.fundamentals = function(ticker, callback){
    return _request.get({
        uri: _apiUrl + _endpoints.fundamentals,
        qs: { 'symbols': ticker }
      }, callback);
  };

  api.instruments = function(symbol, callback){
    return _request.get({
        uri: _apiUrl + _endpoints.instruments,
        qs: {'query': symbol.toUpperCase()}
      }, callback);
  };

  api.quote_data = function(symbol, callback){
    symbol = Array.isArray(symbol) ? symbol = symbol.join(',') : symbol;
    return _request.get({
        uri: _apiUrl + _endpoints.quotes,
        qs: { 'symbols': symbol.toUpperCase() }
      }, callback);
  };

  api.accounts= function(callback){
    return _request.get({
      uri: _apiUrl + _endpoints.accounts
    }, callback);
  };

  api.user = function(callback){
    return _request.get({
      uri: _apiUrl + _endpoints.user
    }, callback);
  };

  api.dividends = function(callback){
    return _request.get({
      uri: _apiUrl + _endpoints.dividends
    }, callback);
  };

  api.orders = function(callback){
    return _request.get({
      uri: _apiUrl + _endpoints.orders
    }, callback);
  };

  api.cancel_order = function(order, callback){
    if(order.cancel){
      return _request.post({
        uri: order.cancel
      }, callback);
    }else{
      callback({message: order.state=="cancelled" ? "Order already cancelled." : "Order cannot be cancelled.", order: order }, null, null);
    };
  }

  var _place_order = function(options, callback){
    return _request.post({
        uri: _apiUrl + _endpoints.orders,
        form: {
          account: _private.account,
          instrument: options.instrument.url,
          price: options.bid_price,
          stop_price: options.stop_price,
          quantity: options.quantity,
          side: options.transaction,
          symbol: options.instrument.symbol.toUpperCase(),
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

  api.positions = function(callback){
    return _request.get({
      uri: _apiUrl + _endpoints.positions
    }, callback);
  };

  api.news = function(symbol, callback){
    return _request.get({
      uri: _apiUrl + [_endpoints.news,'/'].join(symbol)
    }, callback);
  };

  api.markets = function(callback){
    return _request.get({
      uri: _apiUrl + _endpoints.markets
    }, callback);
  };

  api.sp500_up = function(callback){
    return _request.get({
      uri: _apiUrl + _endpoints.sp500_up
    }, callback);
  };

  api.sp500_down = function(callback){
    return _request.get({
      uri: _apiUrl + _endpoints.sp500_down
    }, callback);
  };

  api.create_watch_list = function(name, callback){
    return _request.post({
        uri: _apiUrl + _endpoints.watchlists,
        form: {
          name: name
        }
      }, callback);
  };

  api.watchlists = function(callback){
    return _request.get({
        uri: _apiUrl + _endpoints.watchlists
      }, callback);
  };

  api.splits = function(instrument, callback){
    return _request.get({
        uri: _apiUrl + [_endpoints.instruments,'/splits/'].join(instrument)
      }, callback);
  };

  api.historicals = function(symbol, intv, span, callback){
    return _request.get({
        uri: _apiUrl + [_endpoints.quotes + 'historicals/','/?interval='+intv+'&span='+span].join(symbol)
      }, callback);
  };
  
  api.url = function (url,callback){
    return _request.get({
      uri:url
    },callback);
  };

  _init(_options);

  return api;
}

module.exports = RobinhoodWebApi;
