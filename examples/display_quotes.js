// Simple example on how to display quotes

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
