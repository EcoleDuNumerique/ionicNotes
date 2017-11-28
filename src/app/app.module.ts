import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

import { MyApp } from './app.component';
import { ApiProvider } from '../providers/api/api';
import { UserProvider } from '../providers/user/user';
import { NoteProvider } from '../providers/note/note';
import {HomeTabsPageModule} from "../pages/tabs/home-tabs/home-tabs.module";
import {IonicStorageModule, Storage} from "@ionic/storage";
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import { AuthProvider } from '../providers/auth/auth';
import {AuthService} from "../services/auth";
import {LoginPageModule} from "../pages/auth/login/login.module";
import {TokenInterceptor} from "../services/token-interceptor";
import {JWT_OPTIONS, JwtHelperService, JwtModule} from "@auth0/angular-jwt";
import {Http} from "@angular/http";
import {TokenExpiration} from "../services/token-expiration";
import {Vibration} from "@ionic-native/vibration";
import {SocialSharing} from "@ionic-native/social-sharing";

const storage = new Storage({});

/*
export function jwtOptionsFactory() {
  return {
    tokenGetter: () => {
      return storage.get('access_token').then(token => {
        return token;
      });
    },
    config: {
      whitelistedDomains: ['localhost:3001', 'notes.api', 'localhost:8100', '[::1]:80', 'localhost', 'localhost:8200', 'localhost:8080'],
    }
  }
}
*/

@NgModule({
  declarations: [
    MyApp,
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp, {
      tabsHideOnSubPages: true,
    }),
    HttpClientModule,
    IonicStorageModule.forRoot(),
    LoginPageModule,
    HomeTabsPageModule,
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    //  Intercepteur pour les requêtes http : vient rajouter le token dans le header
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true
    },
    //  On importe nos providers
    ApiProvider,
    UserProvider,
    NoteProvider,
    AuthProvider,

    //  On importe nos services
    AuthService,
    TokenExpiration,

    //  On importe nos plugins
    Vibration,
    SocialSharing,
  ]
})
export class AppModule {}
