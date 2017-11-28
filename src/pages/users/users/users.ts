import { Component } from '@angular/core';
import {App, IonicPage, ModalController, NavController, NavParams} from 'ionic-angular';
import {UserProvider} from "../../../providers/user/user";

@IonicPage()
@Component({
  selector: 'page-users',
  templateUrl: 'users.html',
})

/**
 * Liste des utilisateurs
 */
export class UsersPage {

  //  Nos utilisateurs
  public users: any[] = [];

  //  Une variable pour enregistrer le nombre total d'éléments récupérés
  public count: number = 0;

  /**
   * Constructeur
   *
   * @param {NavController} navCtrl
   * @param {NavParams} navParams
   * @param {UserProvider} userProvider
   * @param {ModalController} modalCtrl
   * @param {App} app
   */
  constructor(public navCtrl: NavController, public navParams: NavParams, public userProvider: UserProvider, public modalCtrl: ModalController, public app: App) {}

  /**
   * On récupère nos utilisateurs, et leur nombre
   *
   * @returns {Promise<any>}
   */
  ionViewCanEnter(): Promise <any> {
    return new Promise((resolve, reject) => {
      this.userProvider.getAll().subscribe(response => {
        this.users = response['users'];
        this.count = response['count'];
        resolve();
      }, error => {
        console.log(error);
        reject();
      });
    });
  }

  /**
   * Charger plus d'utilisateurs
   */
  loadMore() {
    //TODO: Coder la fonction
  }

  /**
   * Ouverture d'une modale pour la page utilisateur : vue d'un utilisateur (+ ses notes)
   * @param id
   */
  goToUserPage(id) {
    let modal = this.modalCtrl.create('UserNotesPage', {id: id});
    modal.present();
  }

  /**
   * Ouverture d'une modale pour le compte personnel
   */
  goToMyAccount() {
    let modal = this.modalCtrl.create('AccountPage');
    modal.present();

    //  Si déconnexion, à la fermeture on redirige sur la page de connexion
    modal.onDidDismiss(logout => {
      if( logout ) {
        this.app.getRootNavs()[0].setRoot('LoginPage');
      }
    })
  }
}
