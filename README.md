# Robinhood NodeJS
[![Travis](https://img.shields.io/travis/aurbano/robinhood-node.svg?style=flat-square)](https://travis-ci.org/aurbano/robinhood-node)
[![npm](https://img.shields.io/npm/v/robinhood.svg?style=flat-square)](https://www.npmjs.com/package/robinhood)
[![David](https://img.shields.io/david/aurbano/Robinhood-Node.svg?style=flat-square)](https://david-dm.org/aurbano/robinhood-node)
[![GitHub license](https://img.shields.io/github/license/aurbano/Robinhood-Node.svg?style=flat-square)](https://github.com/aurbano/robinhood-node/blob/master/LICENSE)

NodeJS Framework to make trades with the private [Robinhood](https://www.robinhood.com/) API. Using this API is not encouraged, since it's not officially available. See this [blog post](https://medium.com/@rohanpai25/reversing-robinhood-free-accessible-automated-stock-trading-f40fba1e7d8b) for more information on the API.

> This framework was inspired by a deprecated Python framework originally developed by [@Rohanpai](https://github.com/rohanpai).

## Features

* Placing buy orders (Robinhood.place_buy_order)
* Placing sell order (Robinhood.place_sell_order)
* Quote Information (Robinhood.quote_data)
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

------------------
This framework is still in a very alpha version and will likely change, so production usage is completely discouraged.

[![Analytics](https://ga-beacon.appspot.com/UA-3181088-16/robinhood/readme)](https://github.com/aurbano)
