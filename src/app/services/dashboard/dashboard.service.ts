import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { environment } from './../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private url = `${environment.urlAPI}/dashboard/`;
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      "authorization": `flash ${JSON.parse(sessionStorage.getItem('validate')).token}`
    })
  };

  constructor(private httpClient: HttpClient) { }

  getQuotationPending() {
    return this.httpClient.get(`${this.url}quotation-pending`, this.httpOptions)
  }

  getWorkInProgress() {
    return this.httpClient.get(`${this.url}work-in-progress`, this.httpOptions)
  }

  getQuotationAceptadas() {
    return this.httpClient.get(`${this.url}quotation-aceptadas`, this.httpOptions)
  }

  getBestCategory() {
    return this.httpClient.get(`${this.url}best-category`, this.httpOptions)
  }

  getFirstQuotation() {
    return this.httpClient.get(`${this.url}first-quotation`, this.httpOptions)
  }

  getSalesSeller(data) {
    return this.httpClient.post(`${this.url}sales-sellers`, data, this.httpOptions)
  }

  getSalesSellerById(data) {
    return this.httpClient.post(`${this.url}sales-sellers/${data.code}`, data, this.httpOptions)
  }

  getClientsSeller(data) {
    return this.httpClient.post(`${this.url}clients-sellers`, data, this.httpOptions)
  }

  getSalesMonthlyReport(data) {
    return this.httpClient.post(`${this.url}sales-monthly-report`, data, this.httpOptions)
  }

  getSalesMonthlyReportById(data) {
    return this.httpClient.post(`${this.url}sales-monthly-report/${data.code}`, data, this.httpOptions)
  }

  getQuotationsReportCount(typeQuery: any,typeUser: any,idUser: any, estados = [], mes: string, anio: string) {
    return this.httpClient.post<any>(`${this.url}quotation-count`, { estados: estados, mesVenta: mes, anioVenta: anio },
            { headers: this.httpOptions.headers, params:{typeUser:typeUser, typeSearch:typeQuery, idUser:idUser}});
  }
}
