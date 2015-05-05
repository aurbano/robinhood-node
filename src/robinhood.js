/**
 * Robinhood API NodeJS Wrapper
 * @author Alejandro U. Alvarez
 * @license AGPLv3 - See LICENSE file for more details
 * @version 0.0.1
 */

'use strict';

// Dependencies
var request = require('request');

function RobinhoodWebApi(options) {

  // Internal variables
  var _options = options || {},
      // Private API Endpoints
      _endpoints = endpoints = {
            "login": "https://api.robinhood.com/api-token-auth/",
            "investment_profile": "https://api.robinhood.com/user/investment_profile/",
            "accounts":"https://api.robinhood.com/accounts/",
            "ach_iav_auth":"https://api.robinhood.com/ach/iav/auth/",
            "ach_relationships":"https://api.robinhood.com/ach/relationships/",
            "ach_transfers":"https://api.robinhood.com/ach/transfers/",
            "applications":"https://api.robinhood.com/applications/",
            "dividends":"https://api.robinhood.com/dividends/",
            "edocuments":"https://api.robinhood.com/documents/",
            "instruments":"https://api.robinhood.com/instruments/",
            "margin_upgrades":"https://api.robinhood.com/margin/upgrades/",
            "markets":"https://api.robinhood.com/markets/",
            "notifications":"https://api.robinhood.com/notifications/",
            "orders":"https://api.robinhood.com/orders/",
            "password_reset":"https://api.robinhood.com/password_reset/request/",
            "quotes":"https://api.robinhood.com/quotes/",
            "document_requests":"https://api.robinhood.com/upload/document_requests/",
            "user":"https://api.robinhood.com/user/",
            "watchlists":"https://api.robinhood.com/watchlists/"
    },
    _isInit = false,
    _private = {
      session : {},
      username : null,
      password : null,
      headers : null,
      auth_token : null
    },
    api = {};
  
  function _init(options){
    //_private.session = requests.session();
    //_private.session.proxies = urllib.getproxies();
    _private.username = options.username;
    _private.password = options.password;
    _private.headers = {
        "Accept": "*/*",
        "Accept-Encoding": "gzip, deflate",
        "Accept-Language": "en;q=1, fr;q=0.9, de;q=0.8, ja;q=0.7, nl;q=0.6, it;q=0.5",
        "Content-Type": "application/x-www-form-urlencoded; charset=utf-8",
        "X-Robinhood-API-Version": "1.0.0",
        "Connection": "keep-alive",
        "User-Agent": "Robinhood/823 (iPhone; iOS 7.1.2; Scale/2.00)"
    };
    _private.session.headers = self.headers;
    _login(function(){
      _isInit = true;
    });
  }
  
  function _login(callback){
    var data = 'password=' + _private.password + '&username=' + _private.username';
    
    request.post(_private.endpoints.login, {form: {
      password: _private.password,
      username: _private.username
    }}, function(err, httpResponse, body) {
      if(err) {
        throw (err);
        return;
      }
      _private.auth_token = body.token;
      _private.headers.Authorization = 'Token ' + _private.auth_token;
      
      callback.call();
    });
  }
  
  // Define API methods
  api.investment_profile = function(callback){
    request.get(_private.endpoints.investment_profile, callback);
    self.session.get(self.endpoints['investment_profile'])
  }

  /*  def instruments(self, stock=None):
        res = self.session.get(self.endpoints['instruments'], params={'query':stock.upper()})
        res = res.json()
        return res['results']

    def quote_data(self, stock):
        params = { 'symbols': stock }
        res = self.session.get(self.endpoints['quotes'], params=params)
        res = res.json()
        return res['results']

    def place_order(self, instrument, quantity=1, bid_price = None, transaction=None):
        if bid_price == None:
            bid_price = self.quote_data(instrument['symbol'])[0]['bid_price']
        data = 'account=%s&instrument=%s&price=%f&quantity=%d&side=buy&symbol=%s&time_in_force=gfd&trigger=immediate&type=market' % (urllib.quote('https://api.robinhood.com/accounts/5PY93481/'), urllib.unquote(instrument['url']), float(bid_price), quantity, instrument['symbol']) 
        res = self.session.post(self.endpoints['orders'], data=data)
        return res

    def place_buy_order(self, instrument, quantity, bid_price=None):
        transaction = "buy"
        return self.place_order(instrument, quantity, bid_price, transaction)

    def place_sell_order(self, instrument, quantity, bid_price=None):
        transaction = "sell"
        return self.place_order(instrument, quantity, bid_price, transaction)
        */
  
  return api;
}

module.exports = RobinhoodWebApi;
