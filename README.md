<h1><img src="https://raw.githubusercontent.com/aurbano/robinhood-node/master/.github/robinhood-node.png"/></h1>

[![Travis](https://img.shields.io/travis/aurbano/robinhood-node.svg?style=flat-square)](https://travis-ci.org/aurbano/robinhood-node)
[![npm](https://img.shields.io/npm/v/robinhood.svg?style=flat-square)](https://www.npmjs.com/package/robinhood)
[![David](https://img.shields.io/david/aurbano/Robinhood-Node.svg?style=flat-square)](https://david-dm.org/aurbano/robinhood-node)
[![npm](https://img.shields.io/npm/dm/robinhood.svg)](https://www.npmjs.com/package/robinhood)
[![Coverage Status](https://coveralls.io/repos/github/aurbano/robinhood-node/badge.svg?branch=master)](https://coveralls.io/github/aurbano/robinhood-node?branch=master)
[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2Faurbano%2Frobinhood-node.svg?type=shield)](https://app.fossa.io/projects/git%2Bgithub.com%2Faurbano%2Frobinhood-node?ref=badge_shield)
[![TypeScript](https://badges.frapsoft.com/typescript/code/typescript.svg?v=101)](https://www.typescriptlang.org/)

NodeJS Framework to make trades with the private [Robinhood](https://www.robinhood.com/) API. Using this API is not encouraged, since it's not officially available and it has been reverse engineered.
See @Sanko's [Unofficial Documentation](https://github.com/sanko/Robinhood) for more information.

FYI [Robinhood's Terms and Conditions](https://brokerage-static.s3.amazonaws.com/assets/robinhood/legal/Robinhood%20Terms%20and%20Conditions.pdf)

<!-- toc -->
  * [Features](#features)
  * [Installation](#installation)
  * [Usage](#usage)
  * [API](#api)
    * [`auth_token()`](#auth_token)
    * [`expire_token(callback)`](#expire_token)
    * [`investment_profile(callback)`](#investment_profilecallback)
    * [`instruments(symbol, callback)`](#instrumentssymbol-callback)
    * [`quote_data(stock, callback) // Not authenticated`](#quote-datastock-callback-not-authenticated)
    * [`accounts(callback)`](#accountscallback)
    * [`user(callback)`](#usercallback)
    * [`dividends(callback)`](#dividendscallback)
    * [`earnings(option, callback)`](#earningsoption-callback)
    * [`orders(options, callback)`](#ordersoptions-callback)
    * [`positions(callback)`](#positionscallback)
    * [`nonzero_positions(callback)`](#nonzero_positionscallback)
    * [`place_buy_order(options, callback)`](#place-buy-orderoptions-callback)
      * [`trigger`](#trigger)
      * [`time`](#time)
    * [`place_sell_order(options, callback)`](#place-sell-orderoptions-callback)
      * [`trigger`](#trigger)
      * [`time`](#time)
    * [`fundamentals(symbol, callback)`](#fundamentalssymbol-callback)
      * [Response](#response)
    * [`cancel_order(order, callback)`](#cancel-orderorder-callback)
    * [`watchlists(name, callback)`](#watchlistsname-callback)
    * [`create_watch_list(name, callback)`](#create-watch-listname-callback)
    * [`sp500_up(callback)`](#sp500-upcallback)
    * [`sp500_down(callback)`](#sp500-downcallback)
    * [`splits(instrument, callback)`](#splitsinstrument-callback)
    * [`historicals(symbol, intv, span, callback)`](#historicalssymbol-intv-span-callback)
    * [`url(url, callback)`](#urlurl-callback)
    * [`news(symbol, callback)`](#newssymbol-callback)
    * [`tag(tag, callback)`](#tagtag-callback)
    * [`popularity(symbol, callback)`](#popularitysymbol-callback)
    * [`options_positions`](#options_positions)
* [Contributors](#contributors)

<!-- toc stop -->
## Features
* Quote Data
* Buy, Sell Orders
* Daily Fundamentals
* Daily, Weekly, Monthly Historicals

> Tested on the latest versions of Node 6, 7 & 8.

## Installation
```bash
$ npm install robinhood --save
```

## Usage

To authenticate, you can either use your username and password to the Robinhood app or a previously authenticated Robinhood api token:

### Robinhood API Auth Token
```js
//A previously authenticated Robinhood API auth token

var credentials = {
    token: ''
};
```

```js
var Robinhood = require('robinhood')(credentials, function(){

    //Robinhood is connected and you may begin sending commands to the api.

    Robinhood.quote_data('GOOG', function(error, response, body) {
        if (error) {
            console.error(error);
            process.exit(1);
        }
        console.log(body);
    });

});
```

### Username & Password

This type of login may have been deprecated in favor of the API Token above.

```js
//The username and password you use to sign into the robinhood app.

var credentials = {
    username: '',
    password: ''
};
```

### MFA code

Since the addition of the API Auth Token login, MFA may not work anymore. If you have any information regarding
this please open an issue to discuss it.

```js

var Robinhood = robinhood({
        username : '',
        password : ''
    }, (data) => {
        if (data && data.mfa_required) {
            var mfa_code = '123456'; // set mfa_code here

            Robinhood.set_mfa_code(mfa_code, () => {
                console.log(Robinhood.auth_token());
            });
        }
        else {
            console.log(Robinhood.auth_token());
        }
    })
```



## API

Before using these methods, make sure you have initialized Robinhood using the snippet above.

### `auth_token()`
Get the current authenticated Robinhood api authentication token

```typescript
var credentials = require("../credentials.js")();
var Robinhood = require('robinhood')(credentials, function(){
    console.log(Robinhood.auth_token());
        //      <authenticated alphanumeric token>
}
```

### `expire_token()`
Expire the current authenticated Robinhood api token (logout).

> **NOTE:** After expiring a token you will need to reinstantiate the package with username & password in order to get a new token!

```typescript
var credentials = require("../credentials.js")();
var Robinhood = require('robinhood')(credentials, function(){
    Robinhood.expire_token(function(err, response, body){
        if(err){
            console.error(err);
        }else{
            console.log("Successfully logged out of Robinhood and expired token.");
            // NOTE: body is undefined on the callback
        }
    })
});
```

### `investment_profile(callback)`
Get the current user's investment profile.

```typescript
var credentials = require("../credentials.js")();
var Robinhood = require('robinhood')(credentials, function(){
    Robinhood.investment_profile(function(err, response, body){
        if(err){
            console.error(err);
        }else{
            console.log("investment_profile");
            console.log(body);
                //    { annual_income: '25000_39999',
                //      investment_experience: 'no_investment_exp',
                //      updated_at: '2015-06-24T17:14:53.593009Z',
                //      risk_tolerance: 'low_risk_tolerance',
                //      total_net_worth: '0_24999',
                //      liquidity_needs: 'very_important_liq_need',
                //      investment_objective: 'income_invest_obj',
                //      source_of_funds: 'savings_personal_income',
                //      user: 'https://api.robinhood.com/user/',
                //      suitability_verified: true,
                //      tax_bracket: '',
                //      time_horizon: 'short_time_horizon',
                //      liquid_net_worth: '0_24999' }

        }
    })
});
```


### `instruments(symbol, callback)`

```typescript
var credentials = require("../credentials.js")();
var Robinhood = require('robinhood')(credentials, function(){
    Robinhood.instruments('AAPL',function(err, response, body){
        if(err){
            console.error(err);
        }else{
            console.log("instruments");
            console.log(body);
            //    { previous: null,
            //      results:
            //       [ { min_tick_size: null,
            //           splits: 'https://api.robinhood.com/instruments/450dfc6d-5510-4d40-abfb-f633b7d9be3e/splits/',
            //           margin_initial_ratio: '0.5000',
            //           url: 'https://api.robinhood.com/instruments/450dfc6d-5510-4d40-abfb-f633b7d9be3e/',
            //           quote: 'https://api.robinhood.com/quotes/AAPL/',
            //           symbol: 'AAPL',
            //           bloomberg_unique: 'EQ0010169500001000',
            //           list_date: '1990-01-02',
            //           fundamentals: 'https://api.robinhood.com/fundamentals/AAPL/',
            //           state: 'active',
            //           day_trade_ratio: '0.2500',
            //           tradeable: true,
            //           maintenance_ratio: '0.2500',
            //           id: '450dfc6d-5510-4d40-abfb-f633b7d9be3e',
            //           market: 'https://api.robinhood.com/markets/XNAS/',
            //           name: 'Apple Inc. - Common Stock' } ],
            //      next: null }
        }
    })
});
```


Get the user's instruments for a specified stock.

### `quote_data(stock, callback) // Not authenticated`

Get the user's quote data for a specified stock.

```js
var Robinhood = require('robinhood')(credentials, function(){
    Robinhood.quote_data('AAPL', function(err, response, body){
        if(err){
            console.error(err);
        }else{
            console.log("quote_data");
            console.log(body);
            //{
            //    results: [
            //        {
            //            ask_price: String, // Float number in a String, e.g. '735.7800'
            //            ask_size: Number, // Integer
            //            bid_price: String, // Float number in a String, e.g. '731.5000'
            //            bid_size: Number, // Integer
            //            last_trade_price: String, // Float number in a String, e.g. '726.3900'
            //            last_extended_hours_trade_price: String, // Float number in a String, e.g. '735.7500'
            //            previous_close: String, // Float number in a String, e.g. '743.6200'
            //            adjusted_previous_close: String, // Float number in a String, e.g. '743.6200'
            //            previous_close_date: String, // YYYY-MM-DD e.g. '2016-01-06'
            //            symbol: String, // e.g. 'AAPL'
            //            trading_halted: Boolean,
            //            updated_at: String, // YYYY-MM-DDTHH:MM:SS e.g. '2016-01-07T21:00:00Z'
            //        }
            //    ]
            //}
        }
    })
});
```

### `accounts(callback)`

```typescript
var Robinhood = require('robinhood')(credentials, function(){
    Robinhood.accounts(function(err, response, body){
        if(err){
            console.error(err);
        }else{
            console.log("accounts");
            console.log(body);
            //{ previous: null,
            //  results:
            //   [ { deactivated: false,
            //       updated_at: '2016-03-11T20:37:15.971253Z',
            //       margin_balances: [Object],
            //       portfolio: 'https://api.robinhood.com/accounts/asdf/portfolio/',
            //       cash_balances: null,
            //       withdrawal_halted: false,
            //       cash_available_for_withdrawal: '692006.6600',
            //       type: 'margin',
            //       sma: '692006.6600',
            //       sweep_enabled: false,
            //       deposit_halted: false,
            //       buying_power: '692006.6600',
            //       user: 'https://api.robinhood.com/user/',
            //       max_ach_early_access_amount: '1000.00',
            //       cash_held_for_orders: '0.0000',
            //       only_position_closing_trades: false,
            //       url: 'https://api.robinhood.com/accounts/asdf/',
            //       positions: 'https://api.robinhood.com/accounts/asdf/positions/',
            //       created_at: '2015-06-17T14:53:36.928233Z',
            //       cash: '692006.6600',
            //       sma_held_for_orders: '0.0000',
            //       account_number: 'asdf',
            //       uncleared_deposits: '0.0000',
            //       unsettled_funds: '0.0000' } ],
            //  next: null }
        }
    })
});
```


Get the user's accounts.

### `user(callback)`
Get the user information.

```typescript
var Robinhood = require('robinhood')(credentials, function(){
    Robinhood.user(function(err, response, body){
        if(err){
            console.error(err);
        }else{
            console.log("user");
            console.log(body);
        }
    })
});
```

### `dividends(callback)`

Get the user's dividends information.
```typescript
var Robinhood = require('robinhood')(credentials, function(){
    Robinhood.dividends(function(err, response, body){
        if(err){
            console.error(err);
        }else{
            console.log("dividends");
            console.log(body);
        }
    })
});
```

### `earnings(option, callback)`

Get the earnings information. Option should be one of:

```typescript
let option = { range: X } // X is an integer between 1 and 21. This returns all
                          // expected earnings within a number of calendar days.
```
OR
```typescript
let option = { instrument: URL } // URL is full instrument url.
```
OR
```typescript
let option = { symbol: SYMBOL } // SYMBOL is a plain ol' ticker symbol.
```

```typescript
var Robinhood = require('robinhood')(credentials, function(){
    Robinhood.earnings(option, function(err, response, body){
        if(err){
            console.error(err);
        }else{
            console.log("earnings");
            console.log(body);
        }
    })
});
```


### `orders(options, callback)`

Get the user's orders information.

#### Retreive a set of orders
Send options hash (optional) to limit to specific instrument and/or earliest date of orders.

```typescript
// optional options hash.  If no hash is sent, all orders will be returned.
let options = {
    updated_at: '2017-08-25',
    instrument: 'https://api.robinhood.com/instruments/df6c09dc-bb4f-4495-8c59-f13e6eb3641f/'
}
```

```typescript
var Robinhood = require('robinhood')(credentials, function(){
    Robinhood.orders(options, function(err, response, body){
        if(err){
            console.error(err);
        }else{
            console.log("orders");
            console.log(body);
        }
    })
});
```

#### Retreive a particular order
Send the id of the order to retreive the data for a specific order.
```typescript
let order_id = "string_identifier"; // e.g., id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
```

```typescript
var Robinhood = require('robinhood')(credentials, function(){
    Robinhood.orders(order_id, function(err, response, body){
        if(err){
            console.error(err);
        }else{
            console.log("order");
            console.log(body);
        }
    })
});
```

### `positions(callback)`

Get the user's position information.
```typescript
var Robinhood = require('robinhood')(credentials, function(){
    Robinhood.positions(function(err, response, body){
        if (err){
            console.erro(err);
        }else{
            console.log("positions");
            console.log(body);
        }
    });
});
```

### `nonzero_positions(callback)`

Get the user's nonzero position information only.
```typescript
var Robinhood = require('robinhood')(credentials, function(){
    Robinhood.nonzero_positions(function(err, response, body){
        if (err){
            console.erro(err);
        }else{
            console.log("positions");
            console.log(body);
        }
    });
});
```

### `place_buy_order(options, callback)`

Place a buy order on a specified stock.

```js
var Robinhood = require('robinhood')(credentials, function(){
    var options = {
        type: 'limit',
        quantity: 1,
        bid_price: 1.00,
        instrument: {
            url: String,
            symbol: String
        }
        // // Optional:
        // trigger: String, // Defaults to "gfd" (Good For Day)
        // time: String,    // Defaults to "immediate"
        // type: String     // Defaults to "market"
    }
    Robinhood.place_buy_order(options, function(error, response, body){
        if(error){
            console.error(error);
        }else{
            console.log(body);
        }
    })
});
```

For the Optional ones, the values can be:

*[Disclaimer: This is an unofficial API based on reverse engineering, and the following option values have not been confirmed]*

#### `trigger`

A *[trade trigger](http://www.investopedia.com/terms/t/trade-trigger.asp)* is usually a market condition, such as a rise or fall in the price of an index or security.

Values can be:

* `gfd`: Good For Day
* `gtc`: Good Till Cancelled
* `oco`: Order Cancels Other

#### `time`

The *[time in force](http://www.investopedia.com/terms/t/timeinforce.asp?layout=infini&v=3A)* for an order defines the length of time over which an order will continue working before it is canceled.

Values can be:

* `immediate` : The order will be cancelled unless it is fulfilled immediately.
* `day` : The order will be cancelled at the end of the trading day.

### `place_sell_order(options, callback)`

Place a sell order on a specified stock.

```js

var Robinhood = require('robinhood')(credentials, function(){
    var options = {
        type: 'limit',
        quantity: 1,
        bid_price: 1.00,
        instrument: {
            url: String,
            symbol: String
        },
        // // Optional:
        // trigger: String, // Defaults to "gfd" (Good For Day)
        // time: String,    // Defaults to "immediate"
        // type: String     // Defaults to "market"
    }
    Robinhood.place_sell_order(options, function(error, response, body){
        if(error){
            console.error(error);
        }else{
            console.log(body);
        }
    })
});

```

For the Optional ones, the values can be:

*[Disclaimer: This is an unofficial API based on reverse engineering, and the following option values have not been confirmed]*

#### `trigger`

A *[trade trigger](http://www.investopedia.com/terms/t/trade-trigger.asp)* is usually a market condition, such as a rise or fall in the price of an index or security.

Values can be:

* `gfd`: Good For Day
* `gtc`: Good Till Cancelled
* `oco`: Order Cancels Other

#### `time`

The *[time in force](http://www.investopedia.com/terms/t/timeinforce.asp?layout=infini&v=3A)* for an order defines the length of time over which an order will continue working before it is canceled.

Values can be:

* `immediate` : The order will be cancelled unless it is fulfilled immediately.
* `day` : The order will be cancelled at the end of the trading day.

### `fundamentals(symbol, callback)`

Get fundamental data about a symbol.

#### Response

An object containing information about the symbol:

```typescript
var Robinhood = require('robinhood')(credentials, function(){
    Robinhood.fundamentals("SBPH", function(error, response, body){
        if(error){
            console.error(error);
        }else{
            console.log(body);
            //{                               // Example for SBPH
            //    average_volume: string,     // "14381.0215"
            //    description: string,        // "Spring Bank Pharmaceuticals, Inc. [...]"
            //    dividend_yield: string,     // "0.0000"
            //    high: string,               // "12.5300"
            //    high_52_weeks: string,      // "13.2500"
            //    instrument: string,         // "https://api.robinhood.com/instruments/42e07e3a-ca7a-4abc-8c23-de49cb657c62/"
            //    low: string,                // "11.8000"
            //    low_52_weeks: string,       // "7.6160"
            //    market_cap: string,         // "94799500.0000"
            //    open: string,               // "12.5300"
            //    pe_ratio: string,           // null (price/earnings ratio)
            //    volume: string              // "4119.0000"
            //}
        }
    })
});


```

### `cancel_order(order, callback)`

Cancel an order with the order object
```typescript
var Robinhood = require('robinhood')(credentials, function(){
    //Get list of orders
    Robinhood.orders(function(error, response, body){
        if(error){
            console.error(error);
        }else{
            var orderToCancel = body.results[0];
            //Try to cancel the latest order
            Robinhood.cancel_order(orderToCancel, function(err, response, body){
                if(err){
                    //Error

                    console.error(err);     // { message: 'Order cannot be cancelled.', order: {Order} }
                }else{
                    //Success

                    console.log("Cancel Order Successful");
                    console.log(body)       //{}
                }
            })
        }
    })
})
```

Cancel an order by order id

```typescript
var order_id = 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx'
var Robinhood = require('robinhood')(credentials, function(){
        Robinhood.cancel_order(order_id, function(err, response, body){
            if(err){
                //Error
                console.error(err);     // { message: 'Order cannot be cancelled.', order: {Order} }
            }else{
                //Success
                console.log("Cancel Order Successful");
                console.log(body)       //{}
            }
        })
})
```

### `watchlists(name, callback)`
```typescript
var Robinhood = require('robinhood')(credentials, function(){
    Robinhood.watchlists(function(err, response, body){
        if(err){
            console.error(err);
        }else{
            console.log("got watchlists");
            console.log(body);

            //{ previous: null,
            //  results:
            //   [ { url: 'https://api.robinhood.com/watchlists/Default/',
            //       user: 'https://api.robinhood.com/user/',
            //      name: 'Default' } ],
            //  next: null }
        }
    })
});
```

### `create_watch_list(name, callback)`
```
//Your account type must support multiple watchlists to use this endpoint otherwise will get { detail: 'Request was throttled.' } and watchlist is not created.
Robinhood.create_watch_list('Technology', function(err, response, body){
    if(err){
        console.error(err);
    }else{
        console.log("created watchlist");
        console.log(body);
    //    {
    //        "url": "https://api.robinhood.com/watchlists/Technology/",
    //        "user": "https://api.robinhood.com/user/",
    //        "name": "Technology"
    //    }

    }
})
```

### `sp500_up(callback)`
```typescript
var Robinhood = require('robinhood')(credentials, function(){
    Robinhood.sp500_up(function(err, response, body){
        if(err){
            console.error(err);
        }else{
            console.log("sp500_up");
            console.log(body);
            //{ count: 10,
            //  next: null,
            //  previous: null,
            //  results:
            //   [ { instrument_url: 'https://api.robinhood.com/instruments/adbc3ce0-dd0d-4a7a-92e0-88c1f127cbcb/',
            //       symbol: 'NEM',
            //       updated_at: '2016-09-21T13:03:32.310184Z',
            //       price_movement: [{ market_hours_last_movement_pct: '7.55', market_hours_last_price: '41.0300' }],
            //       description: 'Newmont Mining Corp. is a gold producer, which is engaged in the acquisition, exploration and production of gold and copper properties in U.S., Australia, Peru, Indonesia, Ghana, Canada, New Zealand and Mexico. The company\'s operating segments include North America, South America, Asia Pacific and Africa. The North America segment consists of Nevada in the United States, La Herradura in Mexico and Hope Bay in Canada. The South America segment consists of Yanacocha and Conga in Peru. The Asia Pacific segment consists of Boddington in Australia, Batu Hijau in Indonesia and other smaller operations in Australia and New Zealand. The Africa segment consists of Ahafo and Akyem in Ghana. The company was founded by William Boyce Thompson on May 2, 1921 and is headquartered in Greenwood Village, CO.' },
            //     { instrument_url: 'https://api.robinhood.com/instruments/809adc21-ef75-4c3d-9c0e-5f9a167f235b/',
            //       symbol: 'ADBE',
            //       updated_at: '2016-09-21T13:01:31.748590Z',
            //       price_movement: [{ market_hours_last_movement_pct: '7.55', market_hours_last_price: '41.0300' }],
            //       description: 'Adobe Systems, Inc. provides digital marketing and digital media solutions. The company operates its business through three segments: Digital Media, Digital Marketing, and Print and Publishing. The Digital Media segment offers creative cloud services, which allow members to download and install the latest versions of products, such as Adobe Photoshop, Adobe Illustrator, Adobe Premiere Pro, Adobe Photoshop Lightroom and Adobe InDesign, as well as utilize other tools, such as Adobe Acrobat. This segment also offers other tools and services, including hobbyist products, such as Adobe Photoshop Elements and Adobe Premiere Elements, Adobe Digital Publishing Suite, Adobe PhoneGap, Adobe Typekit, as well as mobile apps, such as Adobe Photoshop Mix, Adobe Photoshop Sketch and Adobe Premiere Clip that run on tablets and mobile devices. The Digital Media serves professionals, including graphic designers, production artists, web designers and developers, user interface designers, videographers, motion graphic artists, prepress professionals, video game developers, mobile application developers, students and administrators. The Digital Marketing segment offers various solutions, including analytics, social marketing, targeting, media optimization, digital experience management and cross-channel campaign management, as well as premium video delivery and monetization. This segment also offers legacy enterprise software, such as Adobe Connect web conferencing platform and Adobe LiveCycle. The Print and Publishing segment offers legacy products and services for eLearning solutions, technical document publishing, web application development and high-end printing. Adobe Systems was founded by Charles M. Geschke and John E. Warnock in December 1982 and is headquartered in San Jose, CA.' }
            //    ]
            //}
        }
    })
});
```

### `sp500_down(callback)`
```typescript
var Robinhood = require('robinhood')(credentials, function(){
    Robinhood.sp500_down(function(err, response, body){
        if(err){
            console.error(err);
        }else{
            console.log("sp500_down");
            console.log(body);
            //{ count: 10,
            //  next: null,
            //  previous: null,
            //  results:
            //   [ { instrument_url: 'https://api.robinhood.com/instruments/adbc3ce0-dd0d-4a7a-92e0-88c1f127cbcb/',
            //       symbol: 'NEM',
            //       updated_at: '2016-09-21T13:03:32.310184Z',
            //       price_movement: [{ market_hours_last_movement_pct: '-3.70', market_hours_last_price: '13.2800' }],
            //      description: 'Newmont Mining Corp. is a gold producer, which is engaged in the acquisition, exploration and production of gold and copper properties in U.S., Australia, Peru, Indonesia, Ghana, Canada, New Zealand and Mexico. The company\'s operating segments include North America, South America, Asia Pacific and Africa. The North America segment consists of Nevada in the United States, La Herradura in Mexico and Hope Bay in Canada. The South America segment consists of Yanacocha and Conga in Peru. The Asia Pacific segment consists of Boddington in Australia, Batu Hijau in Indonesia and other smaller operations in Australia and New Zealand. The Africa segment consists of Ahafo and Akyem in Ghana. The company was founded by William Boyce Thompson on May 2, 1921 and is headquartered in Greenwood Village, CO.' },
            //     { instrument_url: 'https://api.robinhood.com/instruments/809adc21-ef75-4c3d-9c0e-5f9a167f235b/',
            //       symbol: 'ADBE',
            //       updated_at: '2016-09-21T13:01:31.748590Z',
            //       price_movement: [{ market_hours_last_movement_pct: '-3.70', market_hours_last_price: '13.2800' }],
            //       description: 'Adobe Systems, Inc. provides digital marketing and digital media solutions. The company operates its business through three segments: Digital Media, Digital Marketing, and Print and Publishing. The Digital Media segment offers creative cloud services, which allow members to download and install the latest versions of products, such as Adobe Photoshop, Adobe Illustrator, Adobe Premiere Pro, Adobe Photoshop Lightroom and Adobe InDesign, as well as utilize other tools, such as Adobe Acrobat. This segment also offers other tools and services, including hobbyist products, such as Adobe Photoshop Elements and Adobe Premiere Elements, Adobe Digital Publishing Suite, Adobe PhoneGap, Adobe Typekit, as well as mobile apps, such as Adobe Photoshop Mix, Adobe Photoshop Sketch and Adobe Premiere Clip that run on tablets and mobile devices. The Digital Media serves professionals, including graphic designers, production artists, web designers and developers, user interface designers, videographers, motion graphic artists, prepress professionals, video game developers, mobile application developers, students and administrators. The Digital Marketing segment offers various solutions, including analytics, social marketing, targeting, media optimization, digital experience management and cross-channel campaign management, as well as premium video delivery and monetization. This segment also offers legacy enterprise software, such as Adobe Connect web conferencing platform and Adobe LiveCycle. The Print and Publishing segment offers legacy products and services for eLearning solutions, technical document publishing, web application development and high-end printing. Adobe Systems was founded by Charles M. Geschke and John E. Warnock in December 1982 and is headquartered in San Jose, CA.' }
            //    ]
            //}

        }
    })
});
```
### `splits(instrument, callback)`

```typescript
var Robinhood = require('robinhood')(credentials, function(){

    Robinhood.splits("7a3a677d-1664-44a0-a94b-3bb3d64f9e20", function(err, response, body){
        if(err){
            console.error(err);
        }else{
            console.log("got splits");
            console.log(body);   //{ previous: null, results: [], next: null }
        }
    })
})
```

### `historicals(symbol, intv, span, callback)`

```typescript
var Robinhood = require('robinhood')(credentials, function(){

    //{interval=5minute|10minute (required) span=week|day| }

    Robinhood.historicals("AAPL", '5minute', 'week', function(err, response, body){
        if(err){
            console.error(err);
        }else{
            console.log("got historicals");
            console.log(body);
            //
            //    { quote: 'https://api.robinhood.com/quotes/AAPL/',
            //      symbol: 'AAPL',
            //      interval: '5minute',
            //      span: 'week',
            //      bounds: 'regular',
            //      previous_close: null,
            //      historicals:
            //       [ { begins_at: '2016-09-15T13:30:00Z',
            //           open_price: '113.8300',
            //           close_price: '114.1700',
            //           high_price: '114.3500',
            //           low_price: '113.5600',
            //           volume: 3828122,
            //           session: 'reg',
            //           interpolated: false },
            //         { begins_at: '2016-09-15T13:35:00Z',
            //           open_price: '114.1600',
            //           close_price: '114.3800',
            //           high_price: '114.7300',
            //           low_price: '114.1600',
            //           volume: 2166098,
            //           session: 'reg',
            //           interpolated: false },
            //         ... 290 more items
            //      ]}
            //
        }
    })
})
```

### `url(url, callback)`

`url` is used to get continued or paginated data from the API. Queries with long results return a reference to the next sete. Example -

```
next: 'https://api.robinhood.com/orders/?cursor=cD0yMD82LTA0LTAzKzkwJVNCNTclM0ExNC45MzYyKDYlMkIwoCUzqtAW' }
```

The url returned can be passed to the `url` method to continue getting the next set of results.

### `tag(tag, callback)`

Retrieve Robinhood's new Tags: In 2018, Robinhood Web will expose more Social and Informational tools.
You'll see how popular a security is with other Robinhood users, MorningStar ratings, etc.

Known tags:

* 10 Most Popular Instruments: `10-most-popular`
* 100 Most Popular Instruments: `100-most-popular`

Response sample:

```typescript
{
   "slug":"10-most-popular",
   "name":"10 Most Popular",
   "description":"",
   "instruments":[
      "https://api.robinhood.com/instruments/6df56bd0-0bf2-44ab-8875-f94fd8526942/",
      "https://api.robinhood.com/instruments/50810c35-d215-4866-9758-0ada4ac79ffa/",
      "https://api.robinhood.com/instruments/450dfc6d-5510-4d40-abfb-f633b7d9be3e/",
      "https://api.robinhood.com/instruments/e39ed23a-7bd1-4587-b060-71988d9ef483/",
      "https://api.robinhood.com/instruments/1e513292-5926-4dc4-8c3d-4af6b5836704/",
      "https://api.robinhood.com/instruments/39ff611b-84e7-425b-bfb8-6fe2a983fcf3/",
      "https://api.robinhood.com/instruments/ebab2398-028d-4939-9f1d-13bf38f81c50/",
      "https://api.robinhood.com/instruments/940fc3f5-1db5-4fed-b452-f3a2e4562b5f/",
      "https://api.robinhood.com/instruments/c74a93bc-58f3-4ccb-b4e3-30c65e2f88c8/",
      "https://api.robinhood.com/instruments/fdf46795-2a81-4506-880f-514c8010c163/"
   ]
}
```

### `popularity(symbol, callback)`

Get the popularity for a specified stock.


```typescript
var credentials = require("../credentials.js")();
var Robinhood = require('robinhood')(credentials, function() {
    Robinhood.popularity('GOOG', function(error, response, body) {
        if (error) {
            console.error(error);
        } else {
            console.log(body);
            // {
            //    instrument: 'https://api.robinhood.com/instruments/943c5009-a0bb-4665-8cf4-a95dab5874e4/',
            //    num_open_positions: 16319
            // }
        }
    });
});
```

### `options_positions`

Obtain list of options positions

```typescript
var credentials = require("../credentials.js")();
var Robinhood = require('robinhood')(credentials, function() {
    Robinhood.options_positions((err, response, body) => {
        if (err) {
            console.error(err);
        } else {
            console.log(body);
        }
    });
});

// {
//   "created_at": "2018-10-12T17:05:18.195533Z",
//   "direction": "credit",
//   "intraday_quantity": "35.0000",
//   "average_open_price": "56.5143",
//   "chain": "https://api.robinhood.com/options/chains/103ce21e-4921-47ed-a263-e05d2d3d5e99/",
//   "updated_at": "2018-10-12T19:11:02.984831Z",
//   "symbol": "XLF",
//   "trade_value_multiplier": "100.0000",
//   "intraday_direction": "credit",
//   "strategy": "short_put",
//   "intraday_average_open_price": "56.5143",
//   "legs": [
//     {
//       "strike_price": "26.5000",
//       "option": "https://api.robinhood.com/options/instruments/fa512b6e-c121-4ff4-b8aa-9aa2974514b7/",
//       "expiration_date": "2018-10-19",
//       "option_type": "put",
//       "id": "214e0f90-4416-427a-b119-e1a96d8e9da7",
//       "position_type": "short",
//       "position": "https://api.robinhood.com/options/positions/e18fda89-6ff2-443f-af71-cd780e558049/",
//       "ratio_quantity": 1
//     }
//   ],
//   "id": "e4e6cabe-2328-42f3-b4d9-d78da695d2ec",
//   "quantity": "35.0000"
// }

```

### `options_dates`

Obtain list of options expirations for a ticker

```typescript
var credentials = require("../credentials.js")();
var Robinhood = require('robinhood')(credentials, function() {
    Robinhood.options_positions("MSFT", (err, response, {tradable_chain_id, expiration_dates}) => {
        if (err) {
            console.error(err);
        } else {
            // Expiration dates is [<Date String>] ordered by asc date ([0] would be more recent than [1])
            Robinhood.options_available(tradable_chain_id, expiration_dates[0])
        }
    });
});
```
### `options_available`

Obtain list of options expirations for a ticker

```typescript
var credentials = require("../credentials.js")();
var Robinhood = require('robinhood')(credentials, function() {
    Robinhood.options_positions("MSFT", (err, response, {tradable_chain_id, expiration_dates}) => {
        if (err) {
            console.error(err);
        } else {
            // Expiration dates is an array of date strings ordered by asc date ([0] would be more recent than [1])
            // Tradable_chain_id respresents the options identifier for a ticker
            Robinhood.options_available(tradable_chain_id, expiration_dates[0])
        }
    });
});
```

### news(symbol, callback)

Return news about a symbol.

`Documentation lacking sample response` **Feel like contributing? :)**

# Contributors

Alejandro U. Alvarez ([@aurbano](https://github.com/aurbano))
------------------
* Jesse Spencer ([@Jspenc72](https://github.com/jspenc72))
* Justin Keller ([@nodesocket](https://github.com/nodesocket))
* Wei-Sheng Su ([@ted7726](https://github.com/ted7726))
* Dustin Moore ([@dustinmoorenet](https://github.com/dustinmoorenet))
* Alex Ryan ([@ialexryan](https://github.com/ialexryan))
* Ben Van Treese ([@vantreeseba](https://github.com/vantreeseba))
* Zaheen ([@z123](https://github.com/z123))
* Chris Busse ([@busse](https://github.com/busse))
* Jason Truluck ([@jasontruluck](https://github.com/jasontruluck))
* Matthew Herron ([@swimclan](https://github.com/swimclan))
* Chris Dituri ([@cdituri](https://github.com/cdituri))
* John Murphy ([@chiefsmurph](https://github.com/chiefsmurph))
* Ryan Hendricks ([@ryanhendricks](https://github.com/ryanhendricks))
* Patrick Michaelsen ([@prmichaelsen](https://github.com/prmichaelsen))
* Joshua Wilborn ([@joshuajwilborn](https://github.com/joshuajwilborn))

------------------

# Related Projects

* [robinhood-ruby](https://github.com/rememberlenny/robinhood-ruby) - RubyGem for interacting with Robinhood API
* [robinhood Python](https://github.com/Jamonek/Robinhood) - Python Framework to make trades with Robinhood Private API

------------------

>Even though this should be obvious: I am not affiliated in any way with Robinhood Financial LLC. I don't mean any harm or disruption in their service by providing this. Furthermore, I believe they are working on an amazing product, and hope that by publishing this NodeJS framework their users can benefit in even more ways from working with them.

[![Analytics](https://ga-beacon.appspot.com/UA-3181088-16/robinhood/readme)](https://github.com/aurbano)


## License
[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2Faurbano%2Frobinhood-node.svg?type=large)](https://app.fossa.io/projects/git%2Bgithub.com%2Faurbano%2Frobinhood-node?ref=badge_large)
