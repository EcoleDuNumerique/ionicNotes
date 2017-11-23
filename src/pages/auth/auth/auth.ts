import { Component } from '@angular/core';
import {IonicPage, NavController} from 'ionic-angular';
import {AuthService} from "../../../services/auth";

@IonicPage()
@Component({
  selector: 'page-auth',
  templateUrl: 'auth.html',
})
export class AuthPage {

  public isAuth: boolean = false;

  constructor(public authService: AuthService, public navCtrl: NavController) {}

  ionViewCanEnter() {
    this.authService.checkAuthentified().then(auth => {
      console.log(auth);
        if( !auth ) {
        this.navCtrl.setRoot('AuthTabsPage');
      }
    });
  }

}
