import { Component } from '@angular/core';
import {IonicPage, ModalController, NavController, NavParams, ViewController} from 'ionic-angular';
import {UserProvider} from "../../../providers/user/user";

@IonicPage()
@Component({
  selector: 'page-user-notes',
  templateUrl: 'user-notes.html',
})
export class UserNotesPage {

  //  Notre utilisateur
  public user: any = null;

  //  Les notes de cet utilisateur, tableau vide par défaut
  public notes: any[] = [];

  /**
   * Constructeur
   *
   * @param {NavController} navCtrl
   * @param {NavParams} navParams
   * @param {UserProvider} userProvider
   * @param {ViewController} viewCtrl
   * @param {ModalController} modalCtrl
   */
  constructor(public navCtrl: NavController, public navParams: NavParams, public userProvider: UserProvider, public viewCtrl: ViewController, public modalCtrl: ModalController) {}

  /**
   * Récupère la liste des notes d'un utilisateur (grace à son ID)
   *
   * @returns {Promise<any>}
   */
  ionViewCanEnter(): Promise <any> {
    return new Promise((resolve, reject) => {
      this.userProvider.getNotesByUserId(this.navParams.get('id')).subscribe(response => {
        this.user = response['user'];
        this.notes = response['notes'];
        console.log(response);
        resolve();
      }, error => {
        console.log(error);
        reject();
      });
    });
  }

  /**
   * Fermeture de la modale
   */
  closeModal() {
    this.viewCtrl.dismiss();
  }

  /**
   * Ouverture d'une note : visualisation
   *
   * @param note
   */
  openNote(note) {
    let modal = this.modalCtrl.create('NotePage', {note: note});
    modal.present();
  }

}
