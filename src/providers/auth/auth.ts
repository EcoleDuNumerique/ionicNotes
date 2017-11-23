import { Injectable } from '@angular/core';
import {ApiProvider} from "../api/api";
import {HttpHeaders} from "@angular/common/http";

@Injectable()
export class AuthProvider {

  /**
   * Constructeur
   * @param {ApiProvider} api
   */
  constructor(public api: ApiProvider) {}

  /**
   * Permet de raffraichir le token utilisateur
   *
   * @returns {Observable<ArrayBuffer>}
   */
  refresh() {
    let headers = new HttpHeaders();
    //headers.set('Authorization', 'Bearer ' + token);
    return this.api.get('refresh', {
      //headers: headers
    });
  }

  login(email, password) {
    return this.api.post('auth/connexion', {
      email: email,
      password: password
    });
  }

  register(data) {
    return this.api.post('auth/inscription', data);
  }

}
