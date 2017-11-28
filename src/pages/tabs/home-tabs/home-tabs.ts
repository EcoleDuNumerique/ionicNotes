import {Component} from '@angular/core';
import {IonicPage, NavController} from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-home-tabs',
  templateUrl: 'home-tabs.html'
})
export class HomeTabsPage {

  notesRoot = 'NotesPage';
  usersRoot = 'UsersPage';
  picturesRoot = 'PicturesPage';

  constructor(public navCtrl: NavController) {}
}
