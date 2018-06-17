import { Injectable } from "@angular/core";
import moment from "moment";
import Binance from "binance-api-node";

/*
  Generated class for the BinanceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class BinanceProvider {
  tracking = false;
  trading = false;
  pnl = 0;
  step = 0;
  order_id = 0;
  buy_price = 0.0;
  switch_price = 0.0;
  stop_price = 0.0;
  loss_price = 0.0;
  sell_price = 0.0;
  minute_price = 0.0;
  minute_prices = [];
  minute_volume = 0.0;
  curr_min_delta = 0.0;
  last_min_delta = 0.0;
  prev_min_delta = 0.0;
  half_hour_delta = 0.0;
  one_hour_delta = 0.0;
  two_hour_delta = 0.0;
  last_price = 0.0;
  price_direction = 0;
  precision = 8;
  tot_cancel = 0;
  default_pair=null;
  client = Binance({
    apiKey: 'APIKEY',
    apiSecret: 'APISECRET'
  })
  constructor() {
    this.default_pair = "BTCUSDT";
  }

  fetch(){
    this.client.candles({
      symbol: this.default_pair,
      interval:"1m"
    }).then(candles => {
      candles.forEach((candle) => {
        this.minute_prices.unshift(parseFloat(candle.close))
      })

      this.minute_price = parseFloat(candles[candles.length - 1].close)
      this.minute_volume = parseFloat(candles[candles.length - 1].volume)
      this.curr_min_delta = 100.00 * (Number(candles[candles.length - 1].close) - Number(candles[candles.length - 1].open)) / Number(candles[candles.length - 1].open)
      this.last_min_delta = 100.00 * (Number(candles[candles.length - 2].close) - Number(candles[candles.length - 2].open)) / Number(candles[candles.length - 2].open)
      this.prev_min_delta = 100.00 * (Number(candles[candles.length - 3].close) - Number(candles[candles.length - 3].open)) / Number(candles[candles.length - 3].open)
      this.half_hour_delta = 100.00 * (Number(candles[candles.length - 1].close) - Number(candles[candles.length - 30].close)) / Number(candles[candles.length - 30].open)
      this.one_hour_delta = 100.00 * (Number(candles[candles.length - 1].close) - Number(candles[candles.length - 60].close)) / Number(candles[candles.length - 60].open)
      this.two_hour_delta = 100.00 * (Number(candles[candles.length - 1].close) - Number(candles[candles.length - 120].close)) / Number(candles[candles.length - 120].open)
      this.price_direction = (parseFloat(candles[candles.length - 1].close) > this.last_price) ? 1 : ((parseFloat(candles[candles.length - 1].close) < this.last_price) ? -1 : 0)
      this.last_price = parseFloat(candles[candles.length - 1].close)

      const clean_candles = this.client.ws.candles(this.default_pair, '1m', candle => {

        if (candle.isFinal) {
          this.minute_prices.unshift(parseFloat(candle.close))
        }

        this.minute_volume = parseFloat(candle.volume)
        this.minute_price = parseFloat(candle.close)
        this.curr_min_delta = 100.00 * (Number(candle.close) - Number(candle.open)) / Number(candle.open)
        this.last_min_delta = 100.00 * (this.minute_prices[0] - this.minute_prices[1]) / this.minute_prices[1]
        this.prev_min_delta = 100.00 * (this.minute_prices[1] - this.minute_prices[2]) / this.minute_prices[2]
        this.half_hour_delta = 100.00 * (this.minute_prices[0] - this.minute_prices[30]) / this.minute_prices[30]
        this.one_hour_delta = 100.00 * (this.minute_prices[0] - this.minute_prices[60]) / this.minute_prices[60]
        this.two_hour_delta = 100.00 * (this.minute_prices[0] - this.minute_prices[120]) / this.minute_prices[120]
        this.price_direction = (parseFloat(candle.close) > this.last_price) ? 1 : ((parseFloat(candle.close) < this.last_price) ? -1 : 0)
        this.last_price = parseFloat(candle.close)

        if (this.minute_prices.length > 130) this.minute_prices.pop()
      })

    })
    .catch(error => {
      console.error("ERROR 6 " + error)
      this.fetch()
    })
  }

  public getBooks(){
    var promise = new Promise(resolve => {
      this.client.book({symbol:this.default_pair}).then((res:any)=>{
        resolve(res);
      })
    });
    return promise;
  }

  public getTrades(){
    var promise = new Promise(resolve => {
      this.client.trades({symbol:this.default_pair}).then((res:any)=>{
        resolve(res);
      })
    });
    return promise;
  }

}
