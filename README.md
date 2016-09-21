<h1><img src="https://raw.githubusercontent.com/aurbano/robinhood-node/master/.github/robinhood-node.png"/></h1>

[![Travis](https://img.shields.io/travis/aurbano/robinhood-node.svg?style=flat-square)](https://travis-ci.org/aurbano/robinhood-node)
[![npm](https://img.shields.io/npm/v/robinhood.svg?style=flat-square)](https://www.npmjs.com/package/robinhood)
[![David](https://img.shields.io/david/aurbano/Robinhood-Node.svg?style=flat-square)](https://david-dm.org/aurbano/robinhood-node)

NodeJS Framework to make trades with the private [Robinhood](https://www.robinhood.com/) API. Using this API is not encouraged, since it's not officially available and it has been reverse engineered. See this [blog post](https://medium.com/@rohanpai25/reversing-robinhood-free-accessible-automated-stock-trading-f40fba1e7d8b) for more information on the API.

I have read [Robinhood's Terms and Conditions](https://brokerage-static.s3.amazonaws.com/assets/robinhood/legal/Robinhood%20Terms%20and%20Conditions.pdf) and, without being a lawyer and/or this being valid in any way, it doesn't seem like interacting with their servers using the API is against them.

> This framework was inspired by a deprecated Python framework originally developed by [@Rohanpai](https://github.com/rohanpai).

## Features

* Placing buy orders `Robinhood.place_buy_order`
* Placing sell order `Robinhood.place_sell_order`
* Quote Information `Robinhood.quote_data`
* Get Dividend information `Robinhood.dividends (v0.2+)`
* Get User information `Robinhood.user (v0.2+)`
* Get Orders `Robinhood.orders (v0.2+)`
* Get Fundamentals `Robinhood.fundamentals (v0.4+)`
* _More coming soon..._

## Installation

```bash
$ npm install --save robinhood
```

## Usage

```js
var Robinhood = require('robinhood');

Robinhood(null).quote_data('GOOG', function(error, response, body) {
    if (error) {
        console.error(error);
        process.exit(1);
    }

    console.log(body);
});
```

## API

Before using these methods, make sure you have initialized Robinhood using the snippet above.

*Feel free to send a pull request expanding this with examples or info about the return objects*

### `investment_profile(callback)`

Get the current user's investment profile.

### `instruments(stock, callback)`

Get the user's instruments for a specified stock.

### `quote_data(stock, callback) // Not authenticated`

Get the user's quote data for a specified stock.

Return message: (passed to the callback)

```js
{
    results: [
        {
            ask_price: String, // Float number in a String, e.g. '735.7800'
            ask_size: Number, // Integer
            bid_price: String, // Float number in a String, e.g. '731.5000'
            bid_size: Number, // Integer
            last_trade_price: String, // Float number in a String, e.g. '726.3900'
            last_extended_hours_trade_price: String, // Float number in a String, e.g. '735.7500'
            previous_close: String, // Float number in a String, e.g. '743.6200'
            adjusted_previous_close: String, // Float number in a String, e.g. '743.6200'
            previous_close_date: String, // YYYY-MM-DD e.g. '2016-01-06'
            symbol: String, // e.g. 'GOOG'
            trading_halted: Boolean, 
            updated_at: String, // YYYY-MM-DDTHH:MM:SS e.g. '2016-01-07T21:00:00Z'
        }
    ]
}
```

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
    trigger: String, // Defaults to "gfd" (Good For Day)
    time: String,    // Defaults to "immediate"
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
    trigger: String, // Defaults to "gfd" (Good For Day)
    time: String,    // Defaults to "immediate"
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

### `fundamentals(ticker, callback)`

Get fundamental data about a symbol.

#### Response

An object containing information about the symbol:

```typescript
{                               // Example for SBPH
    average_volume: string,     // "14381.0215"
    description: string,        // "Spring Bank Pharmaceuticals, Inc. [...]"
    dividend_yield: string,     // "0.0000"
    high: string,               // "12.5300"
    high_52_weeks: string,      // "13.2500"
    instrument: string,         // "https://api.robinhood.com/instruments/42e07e3a-ca7a-4abc-8c23-de49cb657c62/"
    low: string,                // "11.8000"
    low_52_weeks: string,       // "7.6160"
    market_cap: string,         // "94799500.0000"
    open: string,               // "12.5300"
    pe_ratio: string,           // null (price/earnings ratio)
    volume: string              // "4119.0000"
}
```

### `cancel_order(order, callback)`

Cancel an order
```typescript
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
```

### `create_watch_list(name, callback)`

### `sp500_up(callback)`
```typescript
{ count: 10,
  next: null,
  previous: null,
  results: 
   [ { instrument_url: 'https://api.robinhood.com/instruments/adbc3ce0-dd0d-4a7a-92e0-88c1f127cbcb/',
       symbol: 'NEM',
       updated_at: '2016-09-21T13:03:32.310184Z',
       price_movement: [{ market_hours_last_movement_pct: '7.55', market_hours_last_price: '41.0300' }],
       description: 'Newmont Mining Corp. is a gold producer, which is engaged in the acquisition, exploration and production of gold and copper properties in U.S., Australia, Peru, Indonesia, Ghana, Canada, New Zealand and Mexico. The company\'s operating segments include North America, South America, Asia Pacific and Africa. The North America segment consists of Nevada in the United States, La Herradura in Mexico and Hope Bay in Canada. The South America segment consists of Yanacocha and Conga in Peru. The Asia Pacific segment consists of Boddington in Australia, Batu Hijau in Indonesia and other smaller operations in Australia and New Zealand. The Africa segment consists of Ahafo and Akyem in Ghana. The company was founded by William Boyce Thompson on May 2, 1921 and is headquartered in Greenwood Village, CO.' },
     { instrument_url: 'https://api.robinhood.com/instruments/809adc21-ef75-4c3d-9c0e-5f9a167f235b/',
       symbol: 'ADBE',
       updated_at: '2016-09-21T13:01:31.748590Z',
       price_movement: [{ market_hours_last_movement_pct: '7.55', market_hours_last_price: '41.0300' }],
       description: 'Adobe Systems, Inc. provides digital marketing and digital media solutions. The company operates its business through three segments: Digital Media, Digital Marketing, and Print and Publishing. The Digital Media segment offers creative cloud services, which allow members to download and install the latest versions of products, such as Adobe Photoshop, Adobe Illustrator, Adobe Premiere Pro, Adobe Photoshop Lightroom and Adobe InDesign, as well as utilize other tools, such as Adobe Acrobat. This segment also offers other tools and services, including hobbyist products, such as Adobe Photoshop Elements and Adobe Premiere Elements, Adobe Digital Publishing Suite, Adobe PhoneGap, Adobe Typekit, as well as mobile apps, such as Adobe Photoshop Mix, Adobe Photoshop Sketch and Adobe Premiere Clip that run on tablets and mobile devices. The Digital Media serves professionals, including graphic designers, production artists, web designers and developers, user interface designers, videographers, motion graphic artists, prepress professionals, video game developers, mobile application developers, students and administrators. The Digital Marketing segment offers various solutions, including analytics, social marketing, targeting, media optimization, digital experience management and cross-channel campaign management, as well as premium video delivery and monetization. This segment also offers legacy enterprise software, such as Adobe Connect web conferencing platform and Adobe LiveCycle. The Print and Publishing segment offers legacy products and services for eLearning solutions, technical document publishing, web application development and high-end printing. Adobe Systems was founded by Charles M. Geschke and John E. Warnock in December 1982 and is headquartered in San Jose, CA.' }
    ]
}
```

### `sp500_down(callback)`
```typescript
{ count: 10,
  next: null,
  previous: null,
  results: 
   [ { instrument_url: 'https://api.robinhood.com/instruments/adbc3ce0-dd0d-4a7a-92e0-88c1f127cbcb/',
       symbol: 'NEM',
       updated_at: '2016-09-21T13:03:32.310184Z',
       price_movement: [{ market_hours_last_movement_pct: '-3.70', market_hours_last_price: '13.2800' }],
       description: 'Newmont Mining Corp. is a gold producer, which is engaged in the acquisition, exploration and production of gold and copper properties in U.S., Australia, Peru, Indonesia, Ghana, Canada, New Zealand and Mexico. The company\'s operating segments include North America, South America, Asia Pacific and Africa. The North America segment consists of Nevada in the United States, La Herradura in Mexico and Hope Bay in Canada. The South America segment consists of Yanacocha and Conga in Peru. The Asia Pacific segment consists of Boddington in Australia, Batu Hijau in Indonesia and other smaller operations in Australia and New Zealand. The Africa segment consists of Ahafo and Akyem in Ghana. The company was founded by William Boyce Thompson on May 2, 1921 and is headquartered in Greenwood Village, CO.' },
     { instrument_url: 'https://api.robinhood.com/instruments/809adc21-ef75-4c3d-9c0e-5f9a167f235b/',
       symbol: 'ADBE',
       updated_at: '2016-09-21T13:01:31.748590Z',
       price_movement: [{ market_hours_last_movement_pct: '-3.70', market_hours_last_price: '13.2800' }],
       description: 'Adobe Systems, Inc. provides digital marketing and digital media solutions. The company operates its business through three segments: Digital Media, Digital Marketing, and Print and Publishing. The Digital Media segment offers creative cloud services, which allow members to download and install the latest versions of products, such as Adobe Photoshop, Adobe Illustrator, Adobe Premiere Pro, Adobe Photoshop Lightroom and Adobe InDesign, as well as utilize other tools, such as Adobe Acrobat. This segment also offers other tools and services, including hobbyist products, such as Adobe Photoshop Elements and Adobe Premiere Elements, Adobe Digital Publishing Suite, Adobe PhoneGap, Adobe Typekit, as well as mobile apps, such as Adobe Photoshop Mix, Adobe Photoshop Sketch and Adobe Premiere Clip that run on tablets and mobile devices. The Digital Media serves professionals, including graphic designers, production artists, web designers and developers, user interface designers, videographers, motion graphic artists, prepress professionals, video game developers, mobile application developers, students and administrators. The Digital Marketing segment offers various solutions, including analytics, social marketing, targeting, media optimization, digital experience management and cross-channel campaign management, as well as premium video delivery and monetization. This segment also offers legacy enterprise software, such as Adobe Connect web conferencing platform and Adobe LiveCycle. The Print and Publishing segment offers legacy products and services for eLearning solutions, technical document publishing, web application development and high-end printing. Adobe Systems was founded by Charles M. Geschke and John E. Warnock in December 1982 and is headquartered in San Jose, CA.' }
    ]
}
```
### `splits(instrument, callback)`

```typescript
    Robinhood.splits("7a3a677d-1664-44a0-a94b-3bb3d64f9e20", function(err, response, body){
        if(err){
            console.error(err);
        }else{
            console.log("got splits");
            console.log(body);   //{ previous: null, results: [], next: null }
        }
    })
```
### `historicals(symbol, intv, span, callback) {interval=5minute|10minute (required) span=week|day| }`    

```typescript

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

```

# Contributors

* Alejandro U. Alvarez ([@aurbano](https://github.com/aurbano))
* Wei-Sheng Su ([@ted7726](https://github.com/ted7726))
* Alex Ryan ([@ialexryan](https://github.com/ialexryan))
* Dustin Moore ([@dustinmoorenet](https://github.com/dustinmoorenet))
* Ben Van Treese ([@vantreeseba](https://github.com/vantreeseba))
* Jason Truluck ([@jasontruluck](https://github.com/jasontruluck))
* Justin Keller ([@nodesocket](https://github.com/nodesocket))
* Chris Busse ([@busse](https://github.com/busse))
* Jesse Spencer ([@Jspenc72](https://github.com/jspenc72))

------------------
This framework is still in a very alpha version and will likely change, so production usage is completely discouraged.

>Even though this should be obvious: I am not affiliated in any way with Robinhood Financial LLC. I don't mean any harm or disruption in their service by providing this. Furthermore, I believe they are working on an amazing product, and hope that by publishing this NodeJS framework their users can benefit in even more ways from working with them.

[![Analytics](https://ga-beacon.appspot.com/UA-3181088-16/robinhood/readme)](https://github.com/aurbano)
