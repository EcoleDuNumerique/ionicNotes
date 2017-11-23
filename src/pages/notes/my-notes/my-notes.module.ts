import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MyNotesPage } from './my-notes';

@NgModule({
  declarations: [
    MyNotesPage,
  ],
  imports: [
    IonicPageModule.forChild(MyNotesPage),
  ],
})
export class MyNotesPageModule {}
