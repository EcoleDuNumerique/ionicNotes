import {Component} from '@angular/core';
import {
  AlertController, App, Events, IonicPage, LoadingController, ModalController, NavController,
  NavParams, ToastController
} from 'ionic-angular';
import {AuthService} from "../../../services/auth";
import {NoteProvider} from "../../../providers/note/note";

@IonicPage()
@Component({
  selector: 'page-notes',
  templateUrl: 'notes.html',
})
export class NotesPage {

  public notes: any[] = [];

  constructor(public navCtrl: NavController, public navParams: NavParams, public loadingCtrl: LoadingController, public noteProvider: NoteProvider, public authService: AuthService, public events: Events, public modalCtrl: ModalController, public app: App, public alertCtrl: AlertController, public toastCtrl: ToastController) {

    //  On ajoute la nouvelle note dans la liste, en 1ère place
    this.events.subscribe('note:created', (note) => {
      console.log(note);
      if( note ) {
        //this.notes = this.notes.concat(note); ===> Fin de liste
        this.notes.splice(0, 0, note); // ===> Début de liste
      }
    });

    //  Dès que la note est mise à jour, on actualise la liste
    this.events.subscribe('note:updated', (data) => {
      console.log(data);
      this.notes[data.index].title = data.note.title;
      this.notes[data.index].content = data.note.content;
    });
  }

  ionViewCanEnter(): Promise <any> {
    let loader = this.loadingCtrl.create({content: ''});
    loader.present();

    return new Promise((resolve, reject) => {
      this.authService.getId().then(userId => {
        console.log(userId);
        if( userId ) {
          this.noteProvider.getNotesByUserId(userId).subscribe(response => {
            console.log(response);
            this.notes = response['notes'];
            resolve();
          }, error => {
            reject(error);
          });
        }
        resolve();
      });
      loader.dismiss();
    });
  }

  addNote() {
    let modal = this.modalCtrl.create('FormPage');
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

  openNote(note) {
    let modal = this.modalCtrl.create('NotePage', {note: note});
    modal.present();
  }

  editNote(id, index) {
    let modal = this.modalCtrl.create('FormPage', {id: id, index: index});
    modal.present();
  }

  deleteNote(id, index) {
    console.log(index);
    let alert = this.alertCtrl.create({
      title: 'Êtes vous sûr ?',
      subTitle: 'La suppression de cette note sera définitive',
      buttons: [
        {
          text: 'Non',
          role: 'cancel'
        },
        {
          text: 'Oui',
          handler: () => {
            this.noteProvider.delete(id).subscribe(response => {
              if( response ['success'] ) {
                //setTimeout(() => {
                  this.notes.splice(index, 1);
                //}, 500);
              } else {
                let toast = this.toastCtrl.create({
                  message: response['error'],
                  duration: 2500,
                  cssClass: 'toast-danger',
                });
                toast.present();
              }
            });
          }
        }
      ]
    });
    alert.present();
  }
}
