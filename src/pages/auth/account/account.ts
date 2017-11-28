import { Component } from '@angular/core';
import {IonicPage, NavController, NavParams, ToastController, ViewController} from 'ionic-angular';
import {AuthService} from "../../../services/auth";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {AuthProvider} from "../../../providers/auth/auth";
import {PasswordValidation} from "../../../validators/PasswordValidation";
import * as AppConfig from "../../../app/app.config";
import {Vibration} from "@ionic-native/vibration";

@IonicPage()
@Component({
  selector: 'page-account',
  templateUrl: 'account.html',
})
export class AccountPage {

  public config;

  //  Notre groupe de formulaire (<form>)
  public accountData: FormGroup;

  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController, public authService: AuthService, public formBuilder: FormBuilder, public authProvider: AuthProvider, public toastCtrl: ToastController, public vibration: Vibration) {

    this.config = AppConfig.config;

    //  On attribute des règles à chaque champ de notre formulaire
    this.accountData = this.formBuilder.group({
      //  Ici : champs recquis et de type email
      email: ['', Validators.compose([Validators.required, Validators.email])],
      firstname: ['', Validators.compose([Validators.required, Validators.maxLength(60)])],
      lastname: ['', Validators.compose([Validators.required, Validators.maxLength(60)])],
      password: ['', Validators.compose([Validators.required, Validators.minLength(6)])],
      passwordConfirmation: ['', Validators.required],
    }, {
      //  On ajoute notre validateur personnel
      validator: PasswordValidation.MatchPassword
    });
  }

  ionViewCanEnter(): Promise <any> {
    //  Une promise pour un chargement instantanné
    return new Promise((resolve, reject) => {
      //  On récupère les notes du compte courant
      this.authProvider.getAccountData().subscribe(response => {

        if( response['success'] ) {   //  Tout s'est bien déroulé

          //  On remplit le formulaire avec ces données
          this.accountData.setValue({
            email:  response['user'].email,
            firstname: response['user'].first_name,
            lastname: response['user'].last_name,
            password: '',
            passwordConfirmation: '',
          });
          resolve();
        } else {            //  Erreur côté serveur ou token manquant

          //  Petit toast d'erreur !
          let toast = this.toastCtrl.create({
            message: response['error'],
            duration: 2500,
            cssClass: 'toast-danger'
          });

          //  En production, on fait vibrer le portable
          if( this.config.prod ) {
            this.vibration.vibrate(1000);
          }
          toast.present();

          //  Une fois le toast fermé, on ferme la modale car il y a eu une erreur
          toast.onDidDismiss(() => {
            this.viewCtrl.dismiss();
          });
        }

      }, error => {
        console.log(error);
        reject();
      });
    });
  }

  /**
   * Soumission du formulaire de MAJ du compte
   */
  submit() {
    //  On met à jour le compte utilisateur
    this.authProvider.updateAccount(this.accountData.value).subscribe(response => {
      if( response ['success'] ) {
        //  Tout s'est bien passé, on informe l'utilisateur (TOAST) que tout s'est bien passé
        let toast = this.toastCtrl.create({
          message: 'Votre profil a correctement été mis à jour ! Vous allez être redirigé.',
          duration: 3000,
          cssClass: 'toast-success',
        });

        //  On affiche le toast, et quand il est fini (3s) on ferme la modale
        toast.present();
        toast.onDidDismiss(() => {
          this.viewCtrl.dismiss();
        });
      } else {
        //  Ca ne s'est pas bien passé, message d'erreur
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
    //  On déconnecte notre utilisateur et on ferme la vue
    this.authService.logout();

    //  En fermant la vue, on passe un boolean true pour indiquer que l'utilisateur s'est déconnecté
    this.viewCtrl.dismiss({
      logout: true
    });
  }

  /**
   * Fermeture de la modale
   */
  closeModal() {
    //  Du coup ici on ne passe aucun argument, car l'utilisateur est tjrs connecté
    this.viewCtrl.dismiss();
  }

}
