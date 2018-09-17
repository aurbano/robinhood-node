import request = require('request')

declare function robinhood(options: robinhood.Options.WebApiOpts, callback: robinhood.InitCallback): robinhood.RobinhoodWebApi;

declare namespace robinhood {

  export namespace Options {
    interface InitResponse {
      mfa_required: boolean
    }

    interface WebApiOpts {
      username?: string
      password?: string
      token?: string
    }

    interface OrdersOptions {
      updated_at: string
      instrument: string
    }

    interface EarningsOptionsWithSymbol {
      range?: number
      symbol: string
    }

    interface EarningsOptionsWithInstrument {
      range?: number
      instrument: string
    }

    interface BuySellOptions {
      type: OrderType
      quantity: number
      bid_price: number
      instrument: {
        url?: string
        symbol?: string
      }
      trigger: TriggerType
      time: TimeInForceType
    }
  }

  type TagType = TagTypes
  type OrderType = OrderTypes
  type IntervalType = IntervalTypes
  type SpanType = SpanTypes
  type TriggerType = TriggerTypes
  type TimeInForceType = TimeInForceTypes
  type InitCallback = (data?: Options.InitResponse) => void

  enum TagTypes {
    TopTen = '10-most-popular',
    TopOneHundred = '100-most-popular'
  }

  enum TimeInForceTypes {
    Immediate = 'immediate',
    Day = 'day'
  }

  enum TriggerTypes {
    GoodForDay = 'gfd',
    GoodTillCancelled = 'gtc',
    OrderCancelsOther = 'oco'
  }

  enum OrderTypes {
    Limit = 'limit',
    Market = 'market'
  }

  enum IntervalTypes {
    FiveMinute = '5minute',
    TenMinute = '10minute'
  }

  enum SpanTypes {
    Week = 'week',
    Day = 'day'
  }


  interface RobinhoodWebApi {
    /**
     * Revokes the current token for this session.
     * @param callback
     */
    expire_token (callback: request.RequestCallback): void

    /**
     * Returns the token for the current session.
     */
    auth_token (): string|null

    /**
     * Get the current user's investment profile.
     * @param callback
     */
    investment_profile (callback: request.RequestCallback): void

    /**
     * Set the MFA code for the user if required.
     * @param code
     * @param callback
     */
    set_mfa_code (code: string, callback: InitCallback): void

    /**
     * Return all instruments, or those for a given symbol.
     * @param callback
     */
    instruments(callback: request.RequestCallback): void
    instruments(symbol: string, callback: request.RequestCallback): void

    /**
     * Get fundamental data about a symbol.
     * @param symbol
     * @param callback
     */
    fundamentals (symbol: string, callback: request.RequestCallback): void

    /**
     * Get the popularity for a specified stock.
     * @param symbol
     * @param callback
     */
    popularity (symbol: string, callback: request.RequestCallback): void

    /**
     * Returns account information for the current user session.
     * @param callback
     */
    accounts (callback: request.RequestCallback): void

    /**
     * Get the user's quote data for a specified stock.
     * @param symbol
     * @param callback
     */
    quote_data (symbol: string, callback: request.RequestCallback): void
    quote_data (symbol: string[], callback: request.RequestCallback): void

    /**
     * Get the user's order information for the given options or specific order.
     * @param options
     * @param callback
     */
    orders (options: Options.OrdersOptions, callback: request.RequestCallback): void
    orders (orderId: string, callback: request.RequestCallback): void

    /**
     * Get the user's position information.
     * @param callback
     */
    positions (callback: request.RequestCallback): void

    /**
     * Get the user's nonzero position information only.
     * @param callback
     */
    nonzero_positions (callback: request.RequestCallback): void

    /**
     * Place a buy order on a specified stock.
     * @param options
     * @param callback
     */
    place_buy_order (options: Options.BuySellOptions, callback: request.RequestCallback): void

    /**
     * Place a sell order on a specified stock.
     * @param options
     * @param callback
     */
    place_sell_order (options: Options.BuySellOptions, callback: request.RequestCallback): void

    /**
     * Cancel an order with the order object or order ID.
     * @param order
     * @param callback
     */
    cancel_order (order: object, callback: request.RequestCallback): void
    cancel_order (orderId: string, callback: request.RequestCallback): void

    /**
     * Get historical information for the given symbol.
     * @param symbol
     * @param intv
     * @param span
     * @param callback
     */
    historicals (symbol: string, intv: IntervalType, span: SpanType, callback: request.RequestCallback): void

    /**
     * Get user information.
     * @param callback
     */
    user (callback: request.RequestCallback): void

    /**
     * Returns the user's watchlists
     * @param callback
     */
    watchlists (callback: request.RequestCallback): void

    /**
     * Get the earnings information using either the symbol or instrument.
     * @param options
     * @param callback
     */
    earnings (options: Options.EarningsOptionsWithInstrument|Options.EarningsOptionsWithSymbol, callback: request.RequestCallback): void

    /**
     * Get the user's dividends information.
     * @param callback
     */
    dividends (callback: request.RequestCallback): void

    /**
     *
     * @param instrument
     * @param callback
     */
    splits (instrument: string, callback: request.RequestCallback): void

    /**
     * Returns news for a given symbol.
     * @param symbol
     * @param callback
     */
    news (symbol: string, callback: request.RequestCallback): void

    /**
     * Returns information for the given tag.
     * Retrieve Robinhood's new Tags: In 2018, Robinhood Web will expose more
     * Social and Informational tools. You'll see how popular a security is with
     * other Robinhood users, MorningStar ratings, etc.
     * @param tag
     * @param callback
     */
    tag (tag: TagType, callback: request.RequestCallback): void

    /**
     * Perform a GET request against the given URL.
     * Used to get continued or paginated data from the API. Queries with long
     * results return a reference to the next set.
     * @param url
     * @param callback
     */
    url (url: string, callback: request.RequestCallback): void

    /**
     *
     * @param callback
     */
    sp500_down (callback: request.RequestCallback): void

    sp500_up (callback: request.RequestCallback): void
  }
}

export = robinhood
