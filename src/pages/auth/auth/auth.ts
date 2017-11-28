import { Component } from '@angular/core';
import {IonicPage, NavController} from 'ionic-angular';
import {AuthService} from "../../../services/auth";

@IonicPage()
@Component({
  selector: 'page-auth',
  templateUrl: 'auth.html',
})
export class AuthPage {

  /**
   * Au final, on ne sert pas de cette page, mais vous pourriez l'utiliser comme page parente d'autres
   * pages pour vérifier la connexion d'un utilisateur, au lieu d'un service.
   *
   * @param {NavController} navCtrl
   * @param {AuthService} authService
   */

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
