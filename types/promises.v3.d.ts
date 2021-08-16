// for typescript <4.1

import robinhood = require("./robinhood");

declare function RobinhoodPromiseAPI(
    options: robinhood.Options.WebApiOpts
): Promise<
    {
        [key in keyof robinhood.RobinhoodWebApi]: robinhood.RobinhoodWebApi[key] extends Function
            ? (...args: any[]) => Promise<any>
            : robinhood.RobinhoodWebApi[key];
    }
>;

export = RobinhoodPromiseAPI;
