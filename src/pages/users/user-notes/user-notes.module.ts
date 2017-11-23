import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { UserNotesPage } from './user-notes';

@NgModule({
  declarations: [
    UserNotesPage,
  ],
  imports: [
    IonicPageModule.forChild(UserNotesPage),
  ],
})
export class UserNotesPageModule {}
