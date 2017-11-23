import { Component } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-auth-tabs',
  templateUrl: 'auth-tabs.html'
})
export class AuthTabsPage {

  loginRoot = 'LoginPage';
  registerRoot = 'RegisterPage';


  constructor(public navCtrl: NavController) {}

}
