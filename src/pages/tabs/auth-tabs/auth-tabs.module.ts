import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AuthTabsPage } from './auth-tabs';

@NgModule({
  declarations: [
    AuthTabsPage,
  ],
  imports: [
    IonicPageModule.forChild(AuthTabsPage),
  ]
})
export class AuthTabsPageModule {}
