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

  //  Tableau de notes vide
  public notes: any[] = [];

  /**
   * Constructeur
   *
   * @param {NavController} navCtrl
   * @param {NavParams} navParams
   * @param {LoadingController} loadingCtrl
   * @param {NoteProvider} noteProvider
   * @param {AuthService} authService
   * @param {Events} events
   * @param {ModalController} modalCtrl
   * @param {App} app
   * @param {AlertController} alertCtrl
   * @param {ToastController} toastCtrl
   */
  constructor(public navCtrl: NavController, public navParams: NavParams, public loadingCtrl: LoadingController, public noteProvider: NoteProvider, public authService: AuthService, public events: Events, public modalCtrl: ModalController, public app: App, public alertCtrl: AlertController, public toastCtrl: ToastController) {

    //  On ajoute la nouvelle note dans la liste
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

  /**
   * On charge la liste des notes pendant le chargement de la page
   *
   * @returns {Promise<any>}
   */
  ionViewCanEnter(): Promise <any> {
    let loader = this.loadingCtrl.create({content: ''});
    loader.present();

    return new Promise((resolve, reject) => {

      //  On va chercher dans notre API avec l'id de l'utilisateur
      this.noteProvider.getNotesByUserId(this.authService.getUserId()).subscribe(response => {
        this.notes = response['notes'];
        loader.dismiss();
        resolve();
      }, error => {
        loader.dismiss();
        reject(error);
      });

    });
  }

  /**
   * On ouvre une modale pour ajouter une note : formulaire de création
   */
  addNote() {
    let modal = this.modalCtrl.create('FormPage');
    modal.present();
  }

  /**
   * On ouvre une modale pour accéder à nos infos de compte : édition du profil
   */
  goToMyAccount() {
    let modal = this.modalCtrl.create('AccountPage');
    modal.present();

    //  Si il y a déconnexion, à la fermeture de la modale, on redirige sur la page de connexion
    modal.onDidDismiss(logout => {
      if( logout ) {
        this.app.getRootNavs()[0].setRoot('LoginPage');
      }
    })
  }

  /**
   * On ouvre une modale pour visualiser une note : visualisation d'une note
   *
   * @param note
   */
  openNote(note) {
    let modal = this.modalCtrl.create('NotePage', {note: note});
    modal.present();
  }

  /**
   * On ouvre une modale pour modifier une note : formulaire d'édition
   * @param id
   * @param index
   */
  editNote(id, index) {
    let modal = this.modalCtrl.create('FormPage', {id: id, index: index});
    modal.present();
  }

  /**
   * Suppression d'une note
   *
   * @param id
   * @param index
   */
  deleteNote(id, index) {
    //  Alerte de confirmation
    let alert = this.alertCtrl.create({
      title: 'Êtes vous sûr ?',
      subTitle: 'La suppression de cette note sera définitive',
      buttons: [
        {
          text: 'Non',
          role: 'cancel'    //  Il ne se passera rien
        },
        {
          text: 'Oui',
          handler: () => {    //  On a cliqué sur oui, du coup fonction !

            //  On supprime notre note sur notre API
            this.noteProvider.delete(id).subscribe(response => {
              if( response ['success'] ) {
                  //  On retire notre note du tableau
                  this.notes.splice(index, 1);
              } else {
                //  Une erreur est survenue, message !!!
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

    //  On affiche l'alerte de confirmation (ne pas oublier)
    alert.present();
  }
}
