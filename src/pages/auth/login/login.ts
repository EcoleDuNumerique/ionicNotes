import { Component } from '@angular/core';
import {App, Events, IonicPage, NavController, NavParams, ToastController} from 'ionic-angular';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {AuthProvider} from "../../../providers/auth/auth";
import {AuthService} from "../../../services/auth";

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  public loginData: FormGroup;

  constructor(public navCtrl: NavController, public navParams: NavParams, public formBuilder: FormBuilder, public authProvider: AuthProvider, public toastCtrl: ToastController, public authService: AuthService) {
    this.loginData = this.formBuilder.group({
      email: ['', Validators.compose([Validators.required, Validators.email])],
      password: ['', Validators.compose([Validators.required])]
    });
  }

  ionViewCanEnter() {
    this.authService.checkAuthentified().then(auth => {
      if( auth ) {
        this.navCtrl.setRoot('HomeTabsPage');
      }
    });
  }

  goToRegister() {
    this.navCtrl.setRoot('RegisterPage');
  }

  submitLogin() {
    this.authProvider.login(this.loginData.value.email, this.loginData.value.password).subscribe(response => {
      if( response['success'] ) {
        this.authService.storeCredentials(response['token'], response['user'].id).then(() => {
          this.navCtrl.setRoot('HomeTabsPage');
        });
      } else {
        let toast = this.toastCtrl.create({
          message: response['error'],
          cssClass: 'toast-danger',
          duration: 3000,
        });
        toast.present();
      }
    }, error => {
      console.log(error);
    });
  }

}
