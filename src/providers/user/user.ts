import { Injectable } from '@angular/core';
import {ApiProvider} from "../api/api";

@Injectable()
export class UserProvider {

  constructor(public api: ApiProvider) {}


}
