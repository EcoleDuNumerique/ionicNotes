import { Component } from '@angular/core';
import {IonicPage, NavController, NavParams, ToastController, ViewController} from 'ionic-angular';
import {AuthService} from "../../../services/auth";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {AuthProvider} from "../../../providers/auth/auth";
import {PasswordValidation} from "../../../validators/PasswordValidation";

@IonicPage()
@Component({
  selector: 'page-account',
  templateUrl: 'account.html',
})
export class AccountPage {

  public accountData: FormGroup;

  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController, public authService: AuthService, public formBuilder: FormBuilder, public authProvider: AuthProvider, public toastCtrl: ToastController) {
    this.accountData = this.formBuilder.group({
      email: ['', Validators.compose([Validators.required, Validators.email])],
      firstname: ['', Validators.compose([Validators.required, Validators.maxLength(60)])],
      lastname: ['', Validators.compose([Validators.required, Validators.maxLength(60)])],
      password: ['', Validators.compose([Validators.required, Validators.minLength(6)])],
      passwordConfirmation: ['', Validators.required],
    }, {
      validator: PasswordValidation.MatchPassword
    });
  }

  ionViewCanEnter(): Promise <any> {
    return new Promise((resolve, reject) => {
      this.authProvider.getAccountData().subscribe(response => {
        console.log(response);
        if( response['success'] ) {
          console.log('ok');
          this.accountData.setValue({
            email:  response['user'].email,
            firstname: response['user'].first_name,
            lastname: response['user'].last_name,
            password: '',
            passwordConfirmation: '',
          });
          resolve();
        } else {
          let toast = this.toastCtrl.create({
            message: response['error'],
            duration: 2500,
            cssClass: 'toast-danger'
          });
          toast.present();
          toast.onDidDismiss(() => {
            this.viewCtrl.dismiss();
          })
        }

      }, error => {
        console.log(error);
        reject();
      });
    });
  }

  submit() {
    this.authProvider.updateAccount(this.accountData.value).subscribe(response => {
      if( response ['success'] ) {
        let toast = this.toastCtrl.create({
          message: 'Votre profil a correctement été mis à jour ! Vous allez être redirigé.',
          duration: 3000,
          cssClass: 'toast-success',
        });

        toast.present();
        toast.onDidDismiss(() => {
          this.viewCtrl.dismiss();
        });
      } else {
        let toast = this.toastCtrl.create({
          message: response['error'],
          duration: 3000,
          cssClass: 'toast-danger',
        });

        toast.present();
      }

    });
  }

  /**
   * Déconnexion
   */
  logout() {
    this.authService.logout();
    this.viewCtrl.dismiss({
      logout: true
    });
  }

  /**
   * Fermeture de la modale
   */
  closeModal() {
    this.viewCtrl.dismiss();
  }

}
