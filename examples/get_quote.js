var Robinhood = require('robinhood');

Robinhood(null).quote_data('GOOG', function(error, response, body) {
    if (error) {
        console.error(error);
        return;
    }

    console.log(body);
});
