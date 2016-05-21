var Robinhood = require('../src/robinhood');

// The quote_data() method can take a string or an array of symbols,
// and is case insensitive. ex: 'GOOG' or ['goog', 'AAPL', 'spy']
Robinhood(null).quote_data('GOOG', function(error, response, body) {
    if (error) {
        console.error(error);
        process.exit(1);
    }

    console.log(body);
});
