import { Component } from '@angular/core';
import {Events, Platform} from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import {Storage} from "@ionic/storage";
import {AuthService} from "../services/auth";
import {JwtHelperService} from "@auth0/angular-jwt";
import {AuthProvider} from "../providers/auth/auth";
import {TokenExpiration} from "../services/token-expiration";

@Component({
  templateUrl: 'app.html'
})
export class MyApp {

  rootPage:any = 'LoginPage';

  public isConnected: boolean = false;

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, public authService: AuthService, public events: Events, public authProvider: AuthProvider, public tokenExpiration: TokenExpiration) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();

      this.authService.checkAuthentified().then(auth => {
        if( auth ) {
          let token = this.authService.getToken();
          if( this.tokenExpiration.isTokenExpired(token)  ) {
            this.authProvider.refresh().subscribe(response => {
              console.log(response);
              if( response['success'] ) {
                this.authService.storeCredentials(response['token']);
              }
            }, error => {
              console.log(error);
            })
          }
        }
      });

      this.events.subscribe('user:logged', (boolean) => {
        // boolean = true
        this.isConnected = boolean;
      });

    });
  }
}

