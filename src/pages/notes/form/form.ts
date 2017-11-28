import { Component } from '@angular/core';
import {
  Events, IonicPage, LoadingController, NavController, NavParams, ToastController,
  ViewController
} from 'ionic-angular';
import {NoteProvider} from "../../../providers/note/note";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {HttpClient} from "@angular/common/http";

/**
 * Generated class for the FormPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-form',
  templateUrl: 'form.html',
})
export class FormPage {

  public postType: string = 'post';
  public pageTitle: string = 'Nouvelle Note';
  public isEdition: boolean = false;

  public noteData: FormGroup;

  constructor(public navCtrl: NavController, public navParams: NavParams, public noteProvider: NoteProvider, public events: Events, public viewCtrl: ViewController, public formBuilder: FormBuilder, public loadingCtrl: LoadingController, public toastCtrl: ToastController) {
    this.noteData = this.formBuilder.group({
      title: ['', Validators.required],
      content: ['', Validators.required],
    });
  }

  ionViewCanEnter(): Promise <any> {
    if( typeof this.navParams.get('id') != 'undefined' ) {
      return new Promise((resolve, reject) => {
        this.noteProvider.getNoteById(this.navParams.get('id')).subscribe(response => {
          console.log(response);
          this.pageTitle = 'Mise à jour';
          this.postType = 'put';
          this.isEdition = true;

          this.noteData.setValue({
            title: response['note'].title,
            content: response['note'].content,
          });

          resolve();
        }, error => {
          console.log(error);
          reject(error);
        });
      });
    }
  }

  submitForm(): Promise <any> {
    let loader = this.loadingCtrl.create({content: ''});
    loader.present();

    return new Promise((resolve, reject) => {
      this.noteProvider.send(this.postType, this.noteData.value, this.navParams.get('id')).subscribe(response => {
        loader.dismiss();
        console.log(response);

        if( response['success'] ) {

          //  S'il s'agit d'une nouvelle note, on lance l'évènement
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
            let toast = this.toastCtrl.create({
              message: response['error'],
            duration: 3000,
            cssClass: 'toast-danger'
          });
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

  closeModal() {
    this.viewCtrl.dismiss();
  }

}
