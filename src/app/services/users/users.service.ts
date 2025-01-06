import { Injectable } from '@angular/core';
import { UsersI } from '../../models/users.interface';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class UsersService {

    private httpOptions = {
        headers: new HttpHeaders({
            'Content-Type': 'application/json',
            "authorization": `flash ${JSON.parse(sessionStorage.getItem('validate')).token}`
        })
    };
    private url = `${environment.urlAPI}/user`;
    constructor(private httpClient: HttpClient) { }

    getAllUser() {
        return this.httpClient.get<UsersI[]>(this.url, this.httpOptions)
    }

    getUser(code) {
        return this.httpClient.get<UsersI>(`${this.url}/${code}`, this.httpOptions);
    }

    postUser(user) {
        return this.httpClient.post(this.url, { 'user': user }, this.httpOptions)
    }

    updateUser(code, user) {
        return this.httpClient.patch(`${this.url}/${code}`, { 'user': user }, this.httpOptions)
    }

    changePassword(password) {
        return this.httpClient.post(`${environment.urlAPI}/change-password`, { password }, this.httpOptions)
    }

    getAdminuser() {
        return this.httpClient.get(`${environment.urlAPI}/user-admin`, this.httpOptions)
    }


}
