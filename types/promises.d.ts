// requires typescript 4.1+

import robinhood = require("./robinhood");

type LastTupleElement<T extends unknown[]> = T extends [infer X]
    ? X
    : T extends [infer H, ...infer R]
    ? LastTupleElement<R>
    : T;

type RemoveLastParam<
    F extends (...args: unknown[]) => unknown
> = Parameters<F> extends [...infer B, infer E] ? B : [];

type ExtendsOr<T, E, OR> = T extends E ? T : OR;

declare function RobinhoodPromiseAPI(
    options: robinhood.Options.WebApiOpts
): Promise<
    {
        [key in keyof robinhood.RobinhoodWebApi]: LastTupleElement<
            Parameters<
                ExtendsOr<
                    robinhood.RobinhoodWebApi[key],
                    Function,
                    (a: 0) => void
                >
            >
        > extends Function
            ? (
                  // @ts-expect-error: this must be a function here
                  ...args: RemoveLastParam<robinhood.RobinhoodWebApi[key]>
              ) => Promise<
                  LastTupleElement<
                      Parameters<
                          // @ts-expect-error: this must be a function here
                          LastTupleElement<
                              Parameters<
                                  // @ts-expect-error: this must be a function here
                                  robinhood.RobinhoodWebApi[key]
                              >
                          >
                      >
                  >
              >
            : robinhood.RobinhoodWebApi[key];
    }
>;

export = RobinhoodPromiseAPI;
