import {Storage} from "@ionic/storage";
import {Injectable} from "@angular/core";
import {App, Events} from "ionic-angular";

@Injectable()
export class AuthService {

  public id: number;
  public token: string;
  public isAuth: boolean = false;

  constructor(public storage: Storage, public app: App, public events: Events){
    //this.storage.remove('access_token');
  }

  getAuth() {
    return this.isAuth;
  }

  checkAuthentified(): Promise <any> {
    return new Promise((resolve) => {
      this.storage.get('access_token').then(token => {
          if( token ) {
          this.token = token;
          this.isAuth = true;
          resolve(true);
        } else {
          resolve(false);
        }
      });
    });
  }

  getId(): Promise <any> {

    return new Promise((resolve) => {
      this.storage.get('user_id').then(userId => {
        if( userId ) {
          console.log(userId);
          this.id = userId;
          resolve(userId);
          return userId;
        }
        resolve(null);
        return null;
      });
    });
  }

  storeId(id) {
    this.id = id;
    this.storage.set('user_id', id);
  }

  storeCredentials(token, id ?: number) {
    this.isAuth = true;
    this.token = token;

    this.events.publish('user:login', true);

    if( id ) {
      this.id = id;
      this.storage.set('user_id', id);
    }
    return this.storage.set('access_token', token);
  }

  logout() {
    this.storage.remove('user_id');
    this.storage.remove('access_token').then(() => {
      this.events.publish('user:login', false);
    });
  }


  getToken() {
    return this.token;
    /*
    return new Promise((resolve) => {
      this.storage.get('access_token').then(token => {
        console.log(token);
        resolve(token);
        return token;
      });
    });
    /*

     */
  }

}
