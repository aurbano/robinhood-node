var Robinhood = require('../src/robinhood');

Robinhood(null).quote_data('GOOG', function(error, response, body) {
    if (error) {
        console.error(error);
        process.exit(1);
    }

    console.log(body);
});
