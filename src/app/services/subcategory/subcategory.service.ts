import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { SubcategoryI, SubcategorysI } from '../../models/subcategory.interface';
import { environment } from '../../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class SubcategoryService {

  private url = `${environment.urlAPI}/subcategory`;
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      "authorization": `flash ${JSON.parse(sessionStorage.getItem('validate')).token}`
    })
  };
  constructor(private httpClient: HttpClient) { }

  getAllSubcategory() {
    return this.httpClient.get<SubcategorysI>(this.url, this.httpOptions)
  }

  getSubcategory(code) {
    return this.httpClient.get<SubcategoryI>(`${this.url}/search/${code}`, this.httpOptions);
  }

  getSubcategoryPerCategory(code) {
    return this.httpClient.get<Array<SubcategoryI>>(`${this.url}/category/${code}`, this.httpOptions);
  }

  getSubcategoryPerCategoryAssigment(code) {
    return this.httpClient.get<Array<SubcategoryI>>(`${this.url}/categorys/${code}`, this.httpOptions);
  }

  postSubcategory(subcategory) {
    return this.httpClient.post(this.url, { 'subcategory': subcategory }, this.httpOptions)
  }

  updateSubcategory(code, subcategory) {
    return this.httpClient.patch(`${this.url}/${code}`, { 'subcategory': subcategory }, this.httpOptions)
  }

  deleteSubcategory(code) {
    return this.httpClient.delete(`${this.url}/${code}`, this.httpOptions)
  }
}
