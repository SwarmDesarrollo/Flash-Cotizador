import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { environment } from './../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CompanyService {

  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      "authorization": `flash ${JSON.parse(sessionStorage.getItem('validate')).token}`
    })
  };
  private url = `${environment.urlAPI}/company`;
  constructor(private httpClient: HttpClient) { }

  getAllCompany() {
    return this.httpClient.get<[]>(this.url, this.httpOptions)
  }

  getCompany(code: any) {
    return this.httpClient.get<[]>(`${this.url}/${code}`, this.httpOptions);
  }

  postCompany(company: any) {
    return this.httpClient.post(this.url, { 'company': company }, this.httpOptions)
  }

  updateCompany(code: any, company: any) {
    return this.httpClient.patch(`${this.url}/${code}`, { 'company': company }, this.httpOptions)
  }
}
