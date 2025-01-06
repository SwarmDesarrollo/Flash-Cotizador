import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";

import { UserAuth } from './../../models/user-auth.interface';
import { LoginI } from "../../models/login.interface";

import { environment } from './../../../environments/environment';
@Injectable({
    providedIn: "root",
})
export class AuthService {
    constructor(private httpClient: HttpClient) { }

    signIn(auth: LoginI) {
        var httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
            })
        };
        return this.httpClient.post(`${environment.urlAPI}/auth/login`, { auth: auth }, httpOptions);
    }
    getUserAuth(): UserAuth {
      const validate = window.sessionStorage.getItem('validate');
      if (validate) {
          return JSON.parse(validate);
      } else {
          // Manejar el caso en el que 'validate' sea nulo
          return Object.create(null); // O devuelve un objeto vacío, dependiendo de tus necesidades
      }
  }

}
