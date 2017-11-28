import { Component } from '@angular/core';
import {App, IonicPage, LoadingController, NavController, NavParams, ToastController} from 'ionic-angular';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {AuthService} from "../../../services/auth";
import {PasswordValidation} from "../../../validators/PasswordValidation";
import {AuthProvider} from "../../../providers/auth/auth";
import * as AppConfig from "../../../app/app.config";
import {Vibration} from "@ionic-native/vibration";

@IonicPage()
@Component({
  selector: 'page-register',
  templateUrl: 'register.html',
})

export class RegisterPage {

  public config;

  //  Notre group de formulaire (<form>)
  public registerData: FormGroup;

  constructor(public navCtrl: NavController, public navParams: NavParams, public formBuilder: FormBuilder, public authService: AuthService, public loadingCtrl: LoadingController, public authProvider: AuthProvider, public toastCtrl: ToastController, public app: App, public vibration: Vibration) {
    this.config = AppConfig.config;

    //  On définit des règles pour notre formulaire avec le FormBuilder
    this.registerData = this.formBuilder.group({
      //  Ici : champ recquis et de type email
      email: ['', Validators.compose([Validators.required, Validators.email])],
      firstname: ['', Validators.compose([Validators.required, Validators.maxLength(60)])],
      lastname: ['', Validators.compose([Validators.required, Validators.maxLength(60)])],
      password: ['', Validators.compose([Validators.required, Validators.minLength(6)])],
      passwordConfirmation: ['', Validators.required],
    }, {
      validator: PasswordValidation.MatchPassword
    });
  }

  /**
   * Soumission du formulaire d'inscription
   */
  submitRegistration() {
    //  Petit loader de chargement, ça fait patienter ;)
    let loader = this.loadingCtrl.create({content: ''});
    loader.present();

    //  On envoit l'inscription sur notre API
    this.authProvider.register(this.registerData.value).subscribe(response => {
      console.log(response);
      if( response['success'] ) {   //  Inscription réussie !

          //  On sauvegarde notre token et l'id de l'user en local pour plus tard
         this.authService.storeCredentials(response['token'], response['user'].id);

         // On n'oublit pas d'arrêter le loader ;)
         loader.dismiss();

         // Petit message de félicitations pour le nouvel inscrit
         let toast = this.toastCtrl.create({
           message: 'Votre compte a correctement été crée ' + response['user'].first_name + ' ! Bienvenue parmis nous.',
           cssClass: 'toast-success',
           showCloseButton: true,
           closeButtonText: 'Merci !',
         });

         toast.present();

         // Quand le toast est fini, on redirige sur la page d'accueil
         toast.onDidDismiss(() => {
            this.navCtrl.setRoot('HomeTabsPage');
           //this.app.getRootNav().setRoot('HomeTabsPage');
         });
      } else {      //  Aie, soucis d'inscription

        //  On ferme le loade, ça ne sert à rien qu'il tourne pour rien.
        loader.dismiss();

        //  Message d'erreur
        let toast = this.toastCtrl.create({
          message: response['error'],
          cssClass: 'toast-danger',
          duration: 3000,
        });

        //  En production, on fait vibrer le téléphone
        if( this.config.prod ) {
          this.vibration.vibrate(1000);
        }

        toast.present();
      }
    });
  }

  /**
   * Direction la page de connexion
   */
  goToLogin() {
    this.navCtrl.setRoot('LoginPage');
  }
}
