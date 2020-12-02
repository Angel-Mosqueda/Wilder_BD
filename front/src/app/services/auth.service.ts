import { Injectable } from '@angular/core';
import * as Cookies from 'js-cookie';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor() { }

  public isAuthenticated(): boolean {
    const galleta = Cookies.get('logged');
    return galleta != null && galleta == 'true';
  }

  public getInfo() {
    var info = Cookies.get('usrinfo');
    return JSON.parse(info);
  }
}

