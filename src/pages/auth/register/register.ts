import { Component } from '@angular/core';
import {App, IonicPage, LoadingController, NavController, NavParams, ToastController} from 'ionic-angular';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {AuthService} from "../../../services/auth";
import {PasswordValidation} from "../../../validators/PasswordValidation";
import {AuthProvider} from "../../../providers/auth/auth";

@IonicPage()
@Component({
  selector: 'page-register',
  templateUrl: 'register.html',
})

export class RegisterPage {

  public registerData: FormGroup;

  constructor(public navCtrl: NavController, public navParams: NavParams, public formBuilder: FormBuilder, public authService: AuthService, public loadingCtrl: LoadingController, public authProvider: AuthProvider, public toastCtrl: ToastController, public app: App) {
    this.registerData = this.formBuilder.group({
      email: ['', Validators.compose([Validators.required, Validators.email])],
      firstname: ['', Validators.compose([Validators.required, Validators.maxLength(60)])],
      lastname: ['', Validators.compose([Validators.required, Validators.maxLength(60)])],
      password: ['', Validators.compose([Validators.required, Validators.minLength(6)])],
      passwordConfirmation: ['', Validators.required],
    }, {
      validator: PasswordValidation.MatchPassword
    });
  }

  submitRegistration() {
    let loader = this.loadingCtrl.create({content: ''});
    loader.present();

    this.authProvider.register(this.registerData.value).subscribe(response => {
      console.log(response);
      if( response['success'] ) {
         this.authService.storeCredentials(response['token'], response['user'].id);
         loader.dismiss();
         let toast = this.toastCtrl.create({
           message: 'Votre compte a correctement été crée ' + response['user'].first_name + ' ! Bienvenue parmis nous.',
           cssClass: 'toast-success',
           showCloseButton: true,
           closeButtonText: 'Merci !',
         });

         toast.present();
         toast.onDidDismiss(() => {
            this.navCtrl.setRoot('HomeTabsPage');
           //this.app.getRootNav().setRoot('HomeTabsPage');
         });
      } else {
        loader.dismiss();
        let toast = this.toastCtrl.create({
          message: response['error'],
          cssClass: 'toast-danger',
          duration: 3000,
        });

        toast.present();
      }
    });
  }

  goToLogin() {
    this.navCtrl.setRoot('LoginPage');
  }
}
