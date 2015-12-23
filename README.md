<h1><img src="https://brokerage-static.s3.amazonaws.com/assets/robinhood/images/logo.png"/> Robinhood NodeJS</h1>

[![Travis](https://img.shields.io/travis/aurbano/robinhood-node.svg?style=flat-square)](https://travis-ci.org/aurbano/robinhood-node)
[![npm](https://img.shields.io/npm/v/robinhood.svg?style=flat-square)](https://www.npmjs.com/package/robinhood)
[![David](https://img.shields.io/david/aurbano/Robinhood-Node.svg?style=flat-square)](https://david-dm.org/aurbano/robinhood-node)
[![GitHub license](https://img.shields.io/github/license/aurbano/Robinhood-Node.svg?style=flat-square)](https://github.com/aurbano/robinhood-node/blob/master/LICENSE)

NodeJS Framework to make trades with the private [Robinhood](https://www.robinhood.com/) API. Using this API is not encouraged, since it's not officially available. See this [blog post](https://medium.com/@rohanpai25/reversing-robinhood-free-accessible-automated-stock-trading-f40fba1e7d8b) for more information on the API.

I have read [Robinhood's Terms and Conditions](https://brokerage-static.s3.amazonaws.com/assets/robinhood/legal/Robinhood%20Terms%20and%20Conditions.pdf) and, without being a lawyer and/or this being valid in any way, it doesn't seem like interacting with their servers using the API is against them.

> This framework was inspired by a deprecated Python framework originally developed by [@Rohanpai](https://github.com/rohanpai).

## Features

* Placing buy orders `Robinhood.place_buy_order`
* Placing sell order `Robinhood.place_sell_order`
* Quote Information `Robinhood.quote_data`
* Get Dividend information `Robinhood.dividends (v0.2+)`
* Get User information `Robinhood.user (v0.2+)`
* Get Orders `Robinhood.orders (v0.2+)`
* _More coming soon..._

## Installation

```bash
$ npm install --save robinhood
```

## Usage

```js
var Robinhood = require('robinhood');

// Initialize
var trader = Robinhood(
    {
        username: 'user',
        password: 'password'
    },
    function() {
        trader.quote_data('GOOG', function(err, httpResponse, body){
            if (err) {
                console.error(err);
                return;
            }
            console.log('Quote data:', body);
        });
    }
);
```

## API

Before using these methods, make sure you have initialized Robinhood using the snippet above.

*Feel free to send a pull request expanding this with examples or info about the return objects*

### `investment_profile(callback)`

Get the current user's investment profile.

### `instruments(stock, callback)`

Get the user's instruments for a specified stock.

### `quote_data(stock, callback)`

Get the user's quote data for a specified stock.

### `accounts(callback)`

Get the user's accounts.

### `user(callback)`

Get the user information.

### `dividends(callback)`

Get the user's dividends information.

### `orders(callback)`

Get the user's orders information.

### `place_buy_order(options, callback)`

Place a buy order on a specified stock.

Options must contain:

```js
{
    bid_price: Number,
    quantity: Number,
    instrument: {
        url: String,
        symbol: String
    },
    // Optional:
    trigger: String, // Defaults to "immediate"
    time: String,    // Defaults to "gfd" (Good For Day)
    type: String     // Defaults to "market"
}
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

Options must contain:

```js
{
    bid_price: Number,
    quantity: Number,
    instrument: {
        url: String,
        symbol: String
    },
    // Optional:
    trigger: String, // Defaults to "immediate"
    time: String,    // Defaults to "gfd" (Good For Day)
    type: String     // Defaults to "market"
}
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


------------------
This framework is still in a very alpha version and will likely change, so production usage is completely discouraged.

>Even though this should be obvious: I am not affiliated in any way with Robinhood Financial LLC. I don't mean any harm or disruption in their service by providing this. Furthermore, I believe they are working on an amazing product, and hope that by publishing this NodeJS framework their users can benefit in even more ways from working with them.

[![Analytics](https://ga-beacon.appspot.com/UA-3181088-16/robinhood/readme)](https://github.com/aurbano)
