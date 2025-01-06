import { Injectable } from '@angular/core';
import { TypeClientI } from '../../models/type-client.inteface';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { environment } from './../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class TypeClientService {
    private httpOptions = {
        headers: new HttpHeaders({
            'Content-Type': 'application/json',
            "authorization": `flash ${JSON.parse(sessionStorage.getItem('validate')).token}`
        })
    };
    private url = `${environment.urlAPI}/type-client`;
    constructor(private httpClient: HttpClient) { }

    getAllTypeClient() {
        return this.httpClient.get<TypeClientI[]>(this.url, this.httpOptions)
    }

    getTypeClient(code) {
        return this.httpClient.get<TypeClientI[]>(`${this.url}/${code}`, this.httpOptions);
    }

    postTypeClient(typeClient) {
        return this.httpClient.post(this.url, { 'typeClient': typeClient }, this.httpOptions)
    }

    updateTypeClient(code, typeClient) {
        return this.httpClient.patch(`${this.url}/${code}`, { 'typeClient': typeClient }, this.httpOptions)
    }



}
