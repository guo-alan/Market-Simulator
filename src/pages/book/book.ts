import { Component } from "@angular/core";
import {
  IonicPage,
  NavController,
  NavParams,
  PopoverController
} from "ionic-angular";
import { BinanceProvider } from "../../providers/binance/binance";
import { Chart } from "chart.js";
import { Trade } from "../../models/trade";
/**
 * Generated class for the BookPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: "page-book",
  templateUrl: "book.html"
})
export class BookPage {
  asks: any;
  bids: any;
  asksPrices: any = [];
  bidsPrices: any = [];
  asksVolume: any = [];
  bidsVolume: any = [];
  lineChartLabels: Array<any> = [];
  lineChartData: Array<any> = [];
  lineChartType = "line";
  loadNumber = 50;
  trades: Array<Trade>=[];
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public binance: BinanceProvider,
    private popoverCtrl: PopoverController
  ) {}

  ionViewDidEnter() {
    this.updateChart();
    this.getTrades();
  }

  updateChart() {
    this.binance.getBooks().then((res: any) => {
      if(this.asks!=res.asks){
        this.asks = res.asks;
      }
      if(this.bids!=res.bids){
        this.bids = res.bids; 
      }
      this.asksVolume.push(Number(this.asks[0].quantity));
      this.asksPrices.push(this.asks[0].price);
      for (let x = 1; x < this.loadNumber; x++) {
        this.asksPrices.push(this.asks[x].price);
        let sum = this.asksVolume[x - 1];
        sum += Number(this.asks[x].quantity);
        this.asksVolume.push(sum);
      }
      for (let x = 0; x < this.loadNumber; x++) {
        this.asksVolume.splice(0, 0, 0);
      }
      this.bidsVolume.push(Number(this.bids[0].quantity));
      this.bidsPrices.push(this.bids[0].price);
      for (let x = 1; x < this.loadNumber; x++) {
        this.bidsPrices.push(this.bids[x].price);
        let sum = this.bidsVolume[x - 1];
        sum += Number(this.bids[x].quantity);
        this.bidsVolume.push(sum);
      }
      this.lineChartLabels = this.bidsPrices.reverse().concat(this.asksPrices);
      this.lineChartData = [
        { data: this.asksVolume, label: "Asks" },
        { data: this.bidsVolume.reverse(), label: "Bids" }
      ];
    });
    setTimeout(x => {
      this.reset().then(res => {
        if (res) {
          this.updateChart();
        }
      });
    }, 1000);
  }

  reset() {
    var promise = new Promise(resolve => {
      this.asksPrices = [];
      this.asksVolume = [];
      this.bidsPrices = [];
      this.bidsVolume = [];
      if (
        this.asksPrices.length == 0 &&
        this.asksVolume.length == 0 &&
        this.bidsPrices.length == 0 &&
        this.bidsVolume.length == 0
      ) {
        resolve(true);
      }
    });
    return promise;
  }

  presentPopover(ev) {
    let popover = this.popoverCtrl.create("Popover", {});

    popover.onDidDismiss(data => {
      if (data == "smaller") {
        this.reset();
        this.loadNumber += 10;
      }
      if (data == "larger") {
        this.reset();
        this.loadNumber -= 10;
      }
    });
    popover.present({
      ev: ev
    });
  }

  getTrades(){
    this.binance.getTrades().then((res:any)=>{
      for(let x=0;x<res.length;x++){
        if(res[x].qty>0.3){
          let alreadyAdded=false;
          for(let y=0;y<this.trades.length;y++){
            if(this.trades[y].time==res[x].time){
              alreadyAdded=true;
            }
          }
          if(!alreadyAdded){
            this.trades.push({price: res[x].price, qty: res[x].qty, time: res[x].time})
          }
        }
      }
    })
    setTimeout(x => {
      this.reset().then(res => {
        if (res) {
          this.getTrades();
        }
      });
    }, 1000);
  }
}
