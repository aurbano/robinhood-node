/**
 * Robinhood API NodeJS Wrapper
 * @author Alejandro U. Alvarez
 * @license AGPLv3 - See LICENSE file for more details
 * @version 1.1.2
 */

'use strict';

// Dependencies
var request = require('request');
var Promise = require('promise');
var _ = require('lodash');
var queryString = require('query-string');

function RobinhoodWebApi(opts, callback) {
  /* +--------------------------------+ *
   * |      Internal variables        | *
   * +--------------------------------+ */
  var _apiUrl = 'https://api.robinhood.com/';

  var _options = opts || {},
    // Private API Endpoints
    _endpoints = {
      login: 'oauth2/token/',
      logout: 'oauth2/revoke_token/',
      investment_profile: 'user/investment_profile/',
      accounts: 'accounts/',
      ach_iav_auth: 'ach/iav/auth/',
      ach_relationships: 'ach/relationships/',
      ach_transfers: 'ach/transfers/',
      ach_deposit_schedules: 'ach/deposit_schedules/',
      applications: 'applications/',
      dividends: 'dividends/',
      edocuments: 'documents/',
      earnings: 'marketdata/earnings/',
      instruments: 'instruments/',
      margin_upgrade: 'margin/upgrades/',
      markets: 'markets/',
      notifications: 'notifications/',
      notifications_devices: 'notifications/devices/',
      orders: 'orders/',
      cancel_order: 'orders/', //API expects https://api.robinhood.com/orders/{{orderId}}/cancel/
      password_reset: 'password_reset/request/',
      quotes: 'quotes/',
      document_requests: 'upload/document_requests/',
      user: 'user/',

      user_additional_info: 'user/additional_info/',
      user_basic_info: 'user/basic_info/',
      user_employment: 'user/employment/',
      user_investment_profile: 'user/investment_profile/',

      options_chains: 'options/chains/',
      options_positions: 'options/aggregate_positions/',
      options_instruments: 'options/instruments/',
      options_marketdata: 'marketdata/options/',

      watchlists: 'watchlists/',
      positions: 'positions/',
      fundamentals: 'fundamentals/',
      sp500_up: 'midlands/movers/sp500/?direction=up',
      sp500_down: 'midlands/movers/sp500/?direction=down',
      news: 'midlands/news/',
      tag: 'midlands/tags/tag/'
    },
    _clientId = 'c82SH0WZOsabOXGP2sxqcj34FxkvfnWRZBKlBjFS',
    _isInit = false,
    _request = request.defaults(),
    _private = {
      session: {},
      account: null,
      username: null,
      password: null,
      headers: null,
      auth_token: null,
      refresh_token: null
    },
    api = {};

  function _init() {
    _private.username = _.has(_options, 'username') ? _options.username : null;
    _private.password = _.has(_options, 'password') ? _options.password : null;
    _private.auth_token = _.has(_options, 'token') ? _options.token : null;
    _private.headers = {
      Host: 'api.robinhood.com',
      Accept: '*/*',
      'Accept-Encoding': 'gzip, deflate',
      Referer: 'https://robinhood.com/',
      Origin: 'https://robinhood.com'
    };
    _setHeaders();
    if (!_private.auth_token) {
      _login(function (data) {
        _isInit = true;

        if (callback) {
          if (data) {
            callback(data);
          } else {
            callback.call();
          }
        }
      });
    } else {
      _build_auth_header(_private.auth_token);
      _setHeaders();
      _set_account()
        .then(function () {
          callback.call();
        })
        .catch(function (err) {
          throw err;
        });
    }
  }

  function _setHeaders() {
    _request = request.defaults({
      headers: _private.headers,
      json: true,
      gzip: true
    });
  }

  function _login(callback) {
    _request.post(
      {
        uri: _apiUrl + _endpoints.login,
        form: {
          grant_type: 'password',
          scope: 'internal',
          client_id: _clientId,
          // expires_in: 86400,
          password: _private.password,
          username: _private.username
        }
      },
      function (err, httpResponse, body) {
        if (err) {
          throw err;
        }

        if (!body.access_token) {
          throw new Error('token not found ' + JSON.stringify(httpResponse));
        }
        _private.auth_token = body.access_token;
        _private.refresh_token = body.refresh_token;
        _build_auth_header(_private.auth_token);

        _setHeaders();

        // Set account
        _set_account()
          .then(function () {
            callback.call();
          })
          .catch(function (err) {
            throw err;
          });
      }
    );
  }

  function _set_account() {
    return new Promise(function (resolve, reject) {
      api.accounts(function (err, httpResponse, body) {
        if (err) {
          reject(err);
        }
        // Being defensive when user credentials are valid but RH has not approved an account yet
        if (
          body.results &&
          body.results instanceof Array &&
          body.results.length > 0
        ) {
          _private.account = body.results[0].url;
        }
        resolve();
      });
    });
  }

  function _build_auth_header(token) {
    _private.headers.Authorization = 'Bearer ' + token;
  }

  function options_from_chain({ next, results }) {
    return new Promise((resolve, reject) => {
      if (!next) return resolve(results);
      _request.get(
        {
          url: next
        },
        (err, response, body) =>
          resolve(
            options_from_chain({
              next: body.next,
              results: results.concat(body.results)
            })
          )
      );
    });
  }

  function filter_bad_options(options) {
    return options.filter(option => option.tradability == 'tradable');
  }

  function stitch_options_with_details([details, options]) {
    let paired = details.map(detail => {
      let match = options.find(option => option.url == detail.instrument);
      if (match) {
        Object.keys(match).forEach(key => (detail[key] = match[key]));
      }
      return detail;
    });
    // Remove nulls
    return paired.filter(item => item);
  }

  function get_options_details(options) {
    let grouped_options = group_options_by_max_per_request(options);
    return Promise.all(
      grouped_options.map(group => {
        let option_urls = group.map(option => encodeURIComponent(option.url));
        return new Promise((resolve, reject) => {
          let request = _request.get(
            {
              uri:
                _apiUrl +
                _endpoints.options_marketdata +
                '?instruments=' +
                option_urls.join('%2C')
            },
            (err, response, { results }) => {
              resolve(results);
            }
          );
        });
      })
    ).then(options_details => {
      return [options_details.flat(), grouped_options.flat()];
    });
  }

  const max_options_details_per_request = 17;
  function group_options_by_max_per_request(options) {
    let filtered = filter_bad_options(options);
    let groups = [];
    for (
      let i = 0;
      i < filtered.length - 1;
      i += max_options_details_per_request
    ) {
      groups.push(filtered.slice(i, i + max_options_details_per_request));
    }
    return groups;
  }

  /* +--------------------------------+ *
   * |      Define API methods        | *
   * +--------------------------------+ */

  api.auth_token = function () {
    return _private.auth_token;
  };

  // Invoke robinhood logout.  Note: User will need to reintantiate
  // this package to get a new token!
  api.expire_token = function (callback) {
    return _request.post(
      {
        uri: _apiUrl + _endpoints.logout,
        form: {
          client_id: _clientId,
          token: _private.refresh_token
        }
      },
      callback
    );
  };

  api.investment_profile = function (callback) {
    return _request.get(
      {
        uri: _apiUrl + _endpoints.investment_profile
      },
      callback
    );
  };

  api.fundamentals = function (ticker, callback) {
    return _request.get(
      {
        uri:
          _apiUrl +
          [_endpoints.fundamentals, '/'].join(String(ticker).toUpperCase())
      },
      callback
    );
  };

  api.instruments = function (symbol, callback) {
    return _request.get(
      {
        uri: _apiUrl + _endpoints.instruments,
        qs: { query: symbol.toUpperCase() }
      },
      callback
    );
  };

  api.popularity = function (symbol, callback) {
    return api.quote_data(symbol, function (error, response, body) {
      if (error) {
        return callback(error, response, body);
      }

      // ex. https://api.robinhood.com/instruments/edf89445-db53-4f97-9de9-a599a293c63f/
      var symbol_uuid = body.results[0].instrument.split('/')[4];

      return _request.get(
        {
          uri: _apiUrl + _endpoints.instruments + symbol_uuid + '/popularity/'
        },
        callback
      );
    });
  };

  api.quote_data = function (symbol, callback) {
    symbol = Array.isArray(symbol) ? (symbol = symbol.join(',')) : symbol;
    return _request.get(
      {
        uri: _apiUrl + _endpoints.quotes,
        qs: { symbols: symbol.toUpperCase() }
      },
      callback
    );
  };

  api.accounts = function (callback) {
    return _request.get(
      {
        uri: _apiUrl + _endpoints.accounts
      },
      callback
    );
  };

  api.user = function (callback) {
    return _request.get(
      {
        uri: _apiUrl + _endpoints.user
      },
      callback
    );
  };

  api.dividends = function (callback) {
    return _request.get(
      {
        uri: _apiUrl + _endpoints.dividends
      },
      callback
    );
  };

  api.earnings = function (options, callback) {
    return _request.get(
      {
        uri:
          _apiUrl +
          _endpoints.earnings +
          (options.instrument
            ? '?instrument=' + options.instrument
            : options.symbol
              ? '?symbol=' + options.symbol
              : '?range=' + (options.range ? options.range : 1) + 'day')
      },
      callback
    );
  };

  api.orders = function () {
    var options = {},
      callback = new Function(),
      args = _.values(arguments),
      id = null;
    args.forEach(function (arg) {
      if (typeof arg === 'function') callback = arg;
      if (typeof arg === 'string') id = arg;
      if (typeof arg === 'object') options = arg; // Keep in mind, instrument option must be the full instrument url!
    });

    var hasId = typeof id !== 'undefined' && id !== null;
    var hasOptions = _.keys(options).length > 0;

    if (hasId && hasOptions) {
      // remove ambiguitiy from choosing both an id and options
      console.warn(
        'Warning : both id and options were defined for robinhood.orders(). Options are mutually exclusive. Defaulting to id only.'
      );
      hasOptions = false;
    }

    if (hasOptions) {
      options['updated_at[gte]'] = options.updated_at;
      _.unset(options, 'updated_at');
    }
    return _request.get(
      {
        uri:
          _apiUrl +
          _endpoints.orders +
          (hasId ? id + '/' : '') +
          (hasOptions ? '?' + queryString.stringify(options) : '')
      },
      callback
    );
  };

  api.cancel_order = function (order, callback) {
    var cancel_url = false;
    if (typeof order == 'string') {
      // if string, the string is the id of the order
      cancel_url = _apiUrl + _endpoints.cancel_order + order + '/cancel/'; // e.g., https://api.robinhood.com/orders/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/cancel/
    } else if (order.cancel) {
      // if the order object was passed, we can extract the cancel url from the object
      cancel_url = order.cancel; // note, if cancel is not posible this will return null
    }
    if (cancel_url) {
      // if we have a non null, non false url, make the request
      return _request.post(
        {
          uri: cancel_url // use the cancel url provided by the order object
        },
        callback
      );
    } else {
      return callback(
        {
          message:
            order.state == 'cancelled'
              ? 'Order already cancelled.'
              : 'Order cannot be cancelled.',
          order: order
        },
        null,
        null
      ); // else the order is alread
    }
  };

  var _place_order = function (options, callback) {
    return _request.post(
      {
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
      },
      callback
    );
  };

  api.place_buy_order = function (options, callback) {
    options.transaction = 'buy';
    return _place_order(options, callback);
  };

  api.place_sell_order = function (options, callback) {
    options.transaction = 'sell';
    return _place_order(options, callback);
  };

  api.positions = function (callback) {
    return _request.get(
      {
        uri: _apiUrl + _endpoints.positions
      },
      callback
    );
  };

  api.nonzero_positions = function (callback) {
    return _request.get(
      {
        uri: _apiUrl + _endpoints.positions,
        qs: { nonzero: true }
      },
      callback
    );
  };

  api.options_positions = function (callback) {
    return _request.get(
      {
        uri: _apiUrl + _endpoints.options_positions
      },
      callback
    );
  };

  api.options_dates = function (symbol, callback) {
    api.instruments(symbol, function (err, response, { results }) {
      if (err) throw err;
      let [{ tradable_chain_id }] = results;
      _request.get(
        {
          uri:
            _apiUrl + [_endpoints.options_chains, '/'].join(tradable_chain_id)
        },
        function (err, response, { expiration_dates }) {
          if (err) throw err;
          callback({ expiration_dates, tradable_chain_id });
        }
      );
    });
  };

  api.options_available = function (
    chain_id,
    expiration_date,
    type = 'put'
  ) {
    return new Promise((resolve, reject) => {
      let request = _request.get(
        {
          uri: _apiUrl + _endpoints.options_instruments,
          qs: {
            chain_id,
            type,
            expiration_date,
            state: 'active',
            tradability: 'tradable'
          }
        },
        (err, response, body) =>
          options_from_chain(body)
            .then(get_options_details)
            .then(stitch_options_with_details)
            .then(resolve)
      );
      console.log();
    });
  };

  api.news = function (symbol, callback) {
    return _request.get(
      {
        uri: _apiUrl + [_endpoints.news, '/'].join(symbol)
      },
      callback
    );
  };

  api.tag = function (tag, callback) {
    return _request.get(
      {
        uri: _apiUrl + _endpoints.tag + tag
      },
      callback
    );
  };

  api.markets = function (callback) {
    return _request.get(
      {
        uri: _apiUrl + _endpoints.markets
      },
      callback
    );
  };

  api.sp500_up = function (callback) {
    return _request.get(
      {
        uri: _apiUrl + _endpoints.sp500_up
      },
      callback
    );
  };

  api.sp500_down = function (callback) {
    return _request.get(
      {
        uri: _apiUrl + _endpoints.sp500_down
      },
      callback
    );
  };

  api.create_watch_list = function (name, callback) {
    return _request.post(
      {
        uri: _apiUrl + _endpoints.watchlists,
        form: {
          name: name
        }
      },
      callback
    );
  };

  api.watchlists = function (callback) {
    return _request.get(
      {
        uri: _apiUrl + _endpoints.watchlists
      },
      callback
    );
  };

  api.splits = function (instrument, callback) {
    return _request.get(
      {
        uri: _apiUrl + [_endpoints.instruments, '/splits/'].join(instrument)
      },
      callback
    );
  };

  api.historicals = function (symbol, intv, span, callback) {
    return _request.get(
      {
        uri:
          _apiUrl +
          [
            _endpoints.quotes + 'historicals/',
            '/?interval=' + intv + '&span=' + span
          ].join(symbol)
      },
      callback
    );
  };

  api.url = function (url, callback) {
    return _request.get(
      {
        uri: url
      },
      callback
    );
  };

  _init(_options);

  return api;
}

module.exports = RobinhoodWebApi;
