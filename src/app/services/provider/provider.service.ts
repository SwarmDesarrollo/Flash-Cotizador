import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ProviderI, ProvidersI } from '../../models/provider.interface';
import { environment } from '../../../environments/environment';


@Injectable({
    providedIn: 'root'
})
export class ProviderService {
    private url = `${environment.urlAPI}/provider`;
    private httpOptions = {
        headers: new HttpHeaders({
            'Content-Type': 'application/json',
            "authorization": `flash ${JSON.parse(sessionStorage.getItem('validate')).token}`
        })
    };
    constructor(private httpClient: HttpClient) {
    }

    getAllProvider() {
        return this.httpClient.get<ProvidersI>(this.url, this.httpOptions)
    }

    getProvider(code) {
        return this.httpClient.get<ProviderI>(`${this.url}/${code}`, this.httpOptions);
    }

    postProvider(provider) {
        return this.httpClient.post(this.url, { 'provider': provider }, this.httpOptions)
    }

    updateProvider(code, provider) {
        return this.httpClient.patch(`${this.url}/${code}`, { 'provider': provider }, this.httpOptions)
    }

    deleteProvider(code) {
        return this.httpClient.delete(`${this.url}/${code}`, this.httpOptions)
    }

}
