import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { BookPage } from './book';
import { ChartsModule } from 'ng2-charts';


@NgModule({
  declarations: [
    BookPage,
  ],
  imports: [
    IonicPageModule.forChild(BookPage),
    ChartsModule,
  ],
})
export class BookPageModule {}
