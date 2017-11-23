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
import {AuthTabsPageModule} from "../pages/tabs/auth-tabs/auth-tabs.module";
import {IonicStorageModule, Storage} from "@ionic/storage";
import {JWT_OPTIONS, JwtModule} from "@auth0/angular-jwt";
import {HttpClientModule} from "@angular/common/http";
import { AuthProvider } from '../providers/auth/auth';
import {AuthService} from "../services/auth";

const storage = new Storage({});

export function jwtOptionsFactory() {
  return {
    tokenGetter: () => {
      return storage.get('access_token');
    }
  }
}

@NgModule({
  declarations: [
    MyApp,
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp, {
      tabsHideOnSubPages: true,
    }),
    /*
    JwtModule.forRoot({
      jwtOptionsProvider: {
        provide: JWT_OPTIONS,
        useFactory: jwtOptionsFactory
      }
    }),
    */
    IonicStorageModule.forRoot(),
    HttpClientModule,
    HomeTabsPageModule,
    AuthTabsPageModule,
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    ApiProvider,
    UserProvider,
    NoteProvider,
    AuthProvider,

    AuthService
  ]
})
export class AppModule {}
