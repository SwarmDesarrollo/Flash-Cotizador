import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MenuI, AccessI } from '../../models/menu.interface';

import { environment } from './../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class MenuService {
    private httpOptions = {
        headers: new HttpHeaders({
            'Content-Type': 'application/json',
            "authorization": `flash ${JSON.parse(sessionStorage.getItem('validate')).token}`
        })
    };
    private url = `${environment.urlAPI}/menu`;
    constructor(private httpClient: HttpClient) { }

    getMenu(code) {
        return this.httpClient.get<MenuI[]>(`${this.url}/menu/${code}`, this.httpOptions);
    }

    getAccess(code) {
        return this.httpClient.get<AccessI[]>(`${this.url}/access/${code}`, this.httpOptions);
    }

    getAllAccess() {
        return this.httpClient.get<MenuI[]>(`${this.url}/access`, this.httpOptions);
    }

    newAssigmenMenu(menu) {
        return this.httpClient.post(`${this.url}/menu`, menu, this.httpOptions);
    }

    updateMenu(code, menu) {
        return this.httpClient.patch(`${this.url}/menu/${code}`, menu, this.httpOptions);
    }




}
