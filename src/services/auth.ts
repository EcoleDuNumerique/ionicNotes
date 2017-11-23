import {Storage} from "@ionic/storage";
import {Injectable} from "@angular/core";
import {Observable} from "rxjs/Observable";

@Injectable()
export class AuthService {

  public id: number;
  public token: string;
  public isAuth: boolean = false;

  constructor(public storage: Storage){}

  /*
  checkAuth() {
    this.storage.get('access_token').then(token => {
      if( token ) {
        this.token = token;
        this.isAuth = true;
        return true;
      }
      return false;
    });

    return this.isAuth;
  }
  */

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

  getId() {
    if( !this.id ) {
      this.storage.get('user_id').then(id => {
        if( id ) {
          this.id = id;
          return id;
        }
      });
    }

    return this.id;
  }

  storeToken(token) {
    this.isAuth = true;
    this.token = token;
    return this.storage.set('access_token', token);
  }

}
