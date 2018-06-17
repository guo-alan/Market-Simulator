import { Component } from '@angular/core';
import { IonicPage, ViewController } from "ionic-angular";

@IonicPage()
@Component({
  selector: 'popover',
  templateUrl: 'popover.html',
})

export class Popover {
  appointmentId: number = null;
  parentNavCtrl: any = null;
  constructor(
    private viewCtrl: ViewController) {
  }

  
  change(size) {
    this.viewCtrl.dismiss(size);
  }

}
