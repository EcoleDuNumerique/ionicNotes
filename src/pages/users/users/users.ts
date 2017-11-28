import { Component } from '@angular/core';
import {App, IonicPage, ModalController, NavController, NavParams} from 'ionic-angular';
import {UserProvider} from "../../../providers/user/user";

@IonicPage()
@Component({
  selector: 'page-users',
  templateUrl: 'users.html',
})
export class UsersPage {

  public users: any[] = [];
  public count: number = 0;

  constructor(public navCtrl: NavController, public navParams: NavParams, public userProvider: UserProvider, public modalCtrl: ModalController, public app: App) {}

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

  loadMore() {

  }

  goToUserPage(id) {
    let modal = this.modalCtrl.create('UserNotesPage', {id: id});
    modal.present();
  }

  goToMyAccount() {
    let modal = this.modalCtrl.create('AccountPage');
    modal.present();


    modal.onDidDismiss(data => {
      if( data ) {
        this.app.getRootNavs()[0].setRoot('LoginPage');
      }
    })
  }
}
