import { Component } from '@angular/core';
import {IonicPage, NavController} from 'ionic-angular';
import {AuthService} from "../../../services/auth";

@IonicPage()
@Component({
  selector: 'page-auth',
  templateUrl: 'auth.html',
})
export class AuthPage {

  constructor(public navCtrl: NavController, public authService: AuthService) {}

  ionViewCanEnter() {
    console.log(this.authService.isAuth);
    if( !this.authService.isAuth ) {
      this.navCtrl.setRoot('LoginPage');
    }

    /*
    this.authService.checkAuthentified().then(auth => {
      console.log(auth);
        if( !auth ) {

      }
    });
    */
  }

}
