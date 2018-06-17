import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { BinanceProvider } from '../../providers/binance/binance';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  constructor(public navCtrl: NavController, public binance: BinanceProvider) {

  }

  ionViewDidEnter(){
   this.binance.fetch();
  }
}
