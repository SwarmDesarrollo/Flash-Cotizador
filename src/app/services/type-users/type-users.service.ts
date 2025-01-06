import { Injectable } from '@angular/core';
import { TypeUserI } from '../../models/type-users.inteface';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class TypeUsersService {
    private httpOptions = {
        headers: new HttpHeaders({
            'Content-Type': 'application/json',
            "authorization": `flash ${JSON.parse(sessionStorage.getItem('validate')).token}`
        })
    };
    private url = `${environment.urlAPI}/type-user`;
    constructor(private httpClient: HttpClient) { }

    getAllTypeUser() {
        return this.httpClient.get<TypeUserI[]>(this.url, this.httpOptions)
    }

    getTypeUser(code) {
        return this.httpClient.get<TypeUserI[]>(`${this.url}/${code}`, this.httpOptions);
    }

    postTypeUser(typeUser) {
        return this.httpClient.post(this.url, { 'typeUser': typeUser }, this.httpOptions)
    }

    updateTypeUser(code, typeUser) {
        return this.httpClient.patch(`${this.url}/${code}`, { 'typeUser': typeUser }, this.httpOptions)
    }



}
