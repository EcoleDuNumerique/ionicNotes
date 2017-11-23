import { Component } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';
import {AuthPage} from "../../auth/auth/auth";
import {AuthService} from "../../../services/auth";

@IonicPage()
@Component({
  selector: 'page-home-tabs',
  templateUrl: 'home-tabs.html'
})
export class HomeTabsPage extends AuthPage{

  notesRoot = 'NotesPage';
  usersRoot = 'UsersPage';

  constructor(public navCtrl: NavController, public authService: AuthService) {
    super(authService, navCtrl);
  }

  ionViewCanEnter() {
    super.ionViewCanEnter();
  }

}
