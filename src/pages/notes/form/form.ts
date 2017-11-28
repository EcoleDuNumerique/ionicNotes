import { Component } from '@angular/core';
import {
  Events, IonicPage, LoadingController, NavController, NavParams, ToastController,
  ViewController
} from 'ionic-angular';
import {NoteProvider} from "../../../providers/note/note";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Vibration} from "@ionic-native/vibration";

import * as AppConfig from "../../../app/app.config";

@IonicPage()
@Component({
  selector: 'page-form',
  templateUrl: 'form.html',
})
export class FormPage {

  //  Préfixe de la requête que nous allons utiliser pour le formulaire
  public postType: string = 'post';

  //  Titre de notre page
  public pageTitle: string = 'Nouvelle Note';

  //  Est ce qu'on est en mode édition ? Ou Création ?
  public isEdition: boolean = false;

  //  Notre groupe de formulaire
  public noteData: FormGroup;

  public config;

  /**
   * Constructeur
   * @param {NavController} navCtrl
   * @param {NavParams} navParams
   * @param {NoteProvider} noteProvider
   * @param {Events} events
   * @param {ViewController} viewCtrl
   * @param {FormBuilder} formBuilder
   * @param {LoadingController} loadingCtrl
   * @param {ToastController} toastCtrl
   * @param {Vibration} vibration
   */
  constructor(public navCtrl: NavController, public navParams: NavParams, public noteProvider: NoteProvider, public events: Events, public viewCtrl: ViewController, public formBuilder: FormBuilder, public loadingCtrl: LoadingController, public toastCtrl: ToastController, public vibration: Vibration) {
    this.config = AppConfig.config;

    //  On assigne des règles à notre formulaire
    this.noteData = this.formBuilder.group({
      title: ['', Validators.required],
      content: ['', Validators.required],
    });
  }

  /**
   * Selon les données passés dans le NavController, si on récupère une ID, à ce moment là
   * on récupère la note associée et on remplit nos champs de formulaire. Sinon on laisse vide.
   *
   * @returns {Promise<any>}
   */
  ionViewCanEnter(): Promise <any> {
    if( typeof this.navParams.get('id') != 'undefined' ) {  //  On a bien une ID
      return new Promise((resolve, reject) => {

        //  On récupère notre note en fonction de l'id
        this.noteProvider.getNoteById(this.navParams.get('id')).subscribe(response => {
          console.log(response);

          //  On met à jour nos informations de page
          this.pageTitle = 'Mise à jour';
          this.postType = 'put';
          this.isEdition = true;

          //  On remplit le formulaire
          this.noteData.setValue({
            title: response['note'].title,
            content: response['note'].content,
          });

          //  TOut est ok, on "résoud" la requête
          resolve();
        }, error => {
          console.log(error);
          reject(error);
        });
      });
    }
  }

  /**
   * Soumission du formulaire
   *
   * @returns {Promise<any>}
   */
  submitForm(): Promise <any> {

    //  Petit chargement pour patienter, ça mange pas de pain ;)
    let loader = this.loadingCtrl.create({content: ''});
    loader.present();

    //  On envoit la requête
    return new Promise((resolve, reject) => {
      this.noteProvider.send(this.postType, this.noteData.value, this.navParams.get('id')).subscribe(response => {
        loader.dismiss();

        if( response['success'] ) {

          //  L'évènement sera différent selon si on est en édition ou création
          if( !this.isEdition ) {
            this.events.publish('note:created', response['note']);
          } else {
            this.events.publish('note:updated', {
              index: this.navParams.get('index'),
              note: response['note']
            });
          }

          //  Petit TOAST de félicitations
          let toast = this.toastCtrl.create({
            message: this.isEdition ? 'Votre note a été mise à jour !' : 'Votre note a correctement été ajoutée !',
            cssClass: 'toast-success',
            duration: 2500
          });

          toast.present();

          //  Remise à 0 du formulaire pour la création
          if( !this.isEdition ) {
            this.noteData.setValue({title: '', content: ''});
          }
        } else {
          //  Un message d'erreur
            let toast = this.toastCtrl.create({
              message: response['error'],
            duration: 3000,
            cssClass: 'toast-danger'
          });

          //  En production, on vibre
          if( this.config.prod ) {
            this.vibration.vibrate(1000);
          }
          toast.present();
        }
        resolve();
      }, error => {
        console.log(error);
        loader.dismiss();
        reject(error);
      });
    });

  }

  /**
   * Fermeture de la modale
   */
  closeModal() {
    this.viewCtrl.dismiss();
  }

}
