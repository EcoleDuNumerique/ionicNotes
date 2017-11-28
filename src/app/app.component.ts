import { Component } from '@angular/core';
import {Events, Platform} from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import {Storage} from "@ionic/storage";
import {AuthService} from "../services/auth";
import {AuthProvider} from "../providers/auth/auth";
import {TokenExpiration} from "../services/token-expiration";

@Component({
  templateUrl: 'app.html'
})
export class MyApp {

  rootPage:any = 'LoginPage';

  public isConnected: boolean = false;

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, public authService: AuthService, public events: Events, public authProvider: AuthProvider, public tokenExpiration: TokenExpiration, public storage: Storage) {
    platform.ready().then(() => {

      /**
       * Petit effet de style sur la statusbar du téléphone, options possibles :
       * statusBar.styleDefault() : style par défaut
       * statusBar.styleLightContent: pour un contenu clair (barre claire)
       * statusBar.styleOpaqueContent: pour un contenu foncé (barre foncée)
       * statusBar.styleBlackTranslucent : effet de transparence
       * statusBar.hide : pour la cacher
       */

      statusBar.styleLightContent();

      //  Permet de cacher le "splashScreen" de démarrage
      splashScreen.hide();

      //  On vérifie si notre utilisateur est authentifié
      this.authService.checkAuthentified().then(auth => {

        if( auth ) {  //  C'est le cas
          //  On récupère le token
          let token = this.authService.getToken();
          if( token ) {

            //  Je détermine si le token est expiré
            if( this.tokenExpiration.isTokenExpired(token)  ) {

              //  Si c'est le cas, on va le raffraichir sur notre API
              this.authProvider.refresh().subscribe(response => {
                console.log(response);
                if( response['success'] ) {
                  //  On écrase l'ancien token par le nouveau récupéré
                  this.authService.storeCredentials(response['token']);
                }
              }, error => {
                console.log(error);
              });
            }
          } else {

            //  Faisons en sorte que nos informations soient rapidement accessibles
            this.storage.get('access_token').then((token) => {
              this.authService.setToken(token);
            });

            this.storage.get('user_id').then(userId => {
              this.authService.setUserId(userId);
            });
          }
        }
      });

      //  Exemple d'évènement, on écoute la connexion
      this.events.subscribe('user:logged', (boolean) => {
        // boolean = true
        this.isConnected = boolean;
      });

    });
  }
}

