import { Injectable } from '@angular/core';
import {ApiProvider} from "../api/api";
import {HttpClient} from "@angular/common/http";

@Injectable()
export class UserProvider {

  constructor(public api: ApiProvider, public http: HttpClient) {}

  getAll() {
    return this.api.get('users');
  }

  getNotesByUserId(id) {
    return this.api.get('users/' + id);
  }
}
