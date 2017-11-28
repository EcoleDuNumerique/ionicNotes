import {ChangeDetectorRef, Component} from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {PhotoLibrary} from "@ionic-native/photo-library";

@IonicPage()
@Component({
  selector: 'page-pictures',
  templateUrl: 'pictures.html',
})
export class PicturesPage {

  public pictures = [];

  constructor(public navCtrl: NavController, public navParams: NavParams, private photoLibrary: PhotoLibrary, private cd: ChangeDetectorRef) {}

  ionViewDidEnter() {
    this.photoLibrary.requestAuthorization().then(() => {
      this.photoLibrary.getLibrary().subscribe({
        next: library => {

          this.pictures = this.pictures.concat(library);
          this.cd.detectChanges();

          //this.pictures = library;
          console.log(library);

          library.forEach(function(libraryItem) {

            //this.pictures = this.pictures.concat(libraryItem);

            console.log(libraryItem.id);          // ID of the photo
            console.log(libraryItem.photoURL);    // Cross-platform access to photo
            console.log(libraryItem.thumbnailURL);// Cross-platform access to thumbnail
            console.log(libraryItem.fileName);
            console.log(libraryItem.width);
            console.log(libraryItem.height);
            console.log(libraryItem.creationDate);
            console.log(libraryItem.latitude);
            console.log(libraryItem.longitude);
            console.log(libraryItem.albumIds);    // array of ids of appropriate AlbumItem, only of includeAlbumsData was used
          });
        },
        error: err => { console.log('could not get photos'); },
        complete: () => { console.log('done getting photos'); }
      });
    });
  }

}
