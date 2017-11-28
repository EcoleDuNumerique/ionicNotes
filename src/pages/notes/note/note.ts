import { Component } from '@angular/core';
import {IonicPage, NavController, NavParams, ViewController} from 'ionic-angular';
import {SocialSharing} from "@ionic-native/social-sharing";

/**
 * Generated class for the NotePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-note',
  templateUrl: 'note.html',
})
export class NotePage {

  public note: any;

  /**
   * Constructeur
   *
   * @param {NavController} navCtrl
   * @param {NavParams} navParams
   * @param {ViewController} viewCtrl
   * @param {SocialSharing} share
   */
  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController, public share: SocialSharing) {

    //  On récupère la note passée dans notre navController
    this.note = this.navParams.get('note');
  }

  /**
   * Partage d'une note avec le module natif de l'OS (iOS, Android)
   */
  shareNote() {
    this.share.share(this.note.content, this.note.title);
  }

  /**
   * Fermeture de la modale
   */
  closeModal() {
    this.viewCtrl.dismiss();
  }

}
