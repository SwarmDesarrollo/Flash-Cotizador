import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { CategoryI, CategorysI } from '../../models/category.interface';
import { environment } from '../../../environments/environment';
@Injectable({
    providedIn: 'root'
})
export class CategoryService {

    private url = `${environment.urlAPI}/category`;
    private httpOptions = {
        headers: new HttpHeaders({
            'Content-Type': 'application/json',
            "authorization": `flash ${JSON.parse(sessionStorage.getItem('validate')).token}`
        })
    };
    constructor(private httpClient: HttpClient) {
    }

    getAllCategory() {
        return this.httpClient.get<CategorysI>(this.url, this.httpOptions)
    }

    getCategory(code) {
        return this.httpClient.get<CategorysI[]>(`${this.url}/${code}`, this.httpOptions);
    }

    postCategory(category) {
        return this.httpClient.post(this.url, { 'category': category }, this.httpOptions)
    }

    updateCategory(code, category) {
        return this.httpClient.patch(`${this.url}/${code}`, { 'category': category }, this.httpOptions)
    }

    deleteCategory(code) {
        return this.httpClient.delete(`${this.url}/${code}`, this.httpOptions)
    }
}
