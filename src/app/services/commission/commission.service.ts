import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { environment } from './../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CommissionService {

  private url = `${environment.urlAPI}/commissions`;
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      "authorization": `flash ${JSON.parse(sessionStorage.getItem('validate')).token}`
    })
  };

  constructor(private httpClient: HttpClient) { }

  getAllCommissions() {
    return this.httpClient.get<[]>(this.url, this.httpOptions)
  }

  getCommision(code) {
    return this.httpClient.get<[]>(`${this.url}/commision/${code}`, this.httpOptions);
  }

  getCommissionSalesReportById(data) {
    return this.httpClient.post(`${this.url}/all`, data, { headers: this.httpOptions.headers, params:{typeUser: data.typeUser, typeSearch: data.typeSearch, idUser: data.idUser}})
  }

  getCommissionSetting(code: any) {
    return this.httpClient.get(`${this.url}/${code}`, this.httpOptions);
  }

  postCommissionSetting(commission: any) {
    return this.httpClient.post(this.url, { 'commission': commission }, this.httpOptions)
  }

  updateCommissionSetting(code: any, commission: any) {
    return this.httpClient.patch(`${this.url}/${code}`, { 'commission': commission }, this.httpOptions)
  }

  updateCommisionUser(code, commissionData) {
    return this.httpClient.patch(`${this.url}/commission/${code}`, commissionData, this.httpOptions);
  }

}
