import { Component } from '@angular/core';
import {IonicPage, ModalController, NavController, NavParams, ViewController} from 'ionic-angular';
import {UserProvider} from "../../../providers/user/user";

@IonicPage()
@Component({
  selector: 'page-user-notes',
  templateUrl: 'user-notes.html',
})
export class UserNotesPage {

  constructor(public navCtrl: NavController, public navParams: NavParams, public userProvider: UserProvider, public viewCtrl: ViewController, public modalCtrl: ModalController) {}

  public user: any = null;
  public notes: any[] = [];

  /**
   * Récupère la liste des notes d'un utilisateur
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

  closeModal() {
    this.viewCtrl.dismiss();
  }

  openNote(note) {
    let modal = this.modalCtrl.create('NotePage', {note: note});
    modal.present();
  }

}
