import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { environment } from './../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OrdersService {

  private url = `${environment.urlAPI}/orders`;
  private httpOptions = {
      headers: new HttpHeaders({
          'Content-Type': 'application/json',
          "authorization": `flash ${JSON.parse(sessionStorage.getItem('validate')).token}`
      })
  };
  constructor(private httpClient: HttpClient) { }

  getListQuotations(typeQuery: any,typeUser: any,idUser: any) {
    return this.httpClient.get<any>(`${this.url}/quotations`,{ headers: this.httpOptions.headers, params:{typeUser:typeUser, typeSearch:typeQuery, idUser:idUser}});
  }

  getQuotationById(typeQuery: any,typeUser: any,idUser: any, id: any) {
    return this.httpClient.get<any>(`${this.url}/quotations/${id}`,{ headers: this.httpOptions.headers, params:{typeUser:typeUser, typeSearch:typeQuery, idUser:idUser}});
  }

  getAllOrders(typeQuery: any,typeUser: any,idUser: any, estados = []) {
    return this.httpClient.post<any>(`${this.url}/all`, { estados: estados },{ headers: this.httpOptions.headers, params:{typeUser:typeUser, typeSearch:typeQuery, idUser:idUser}});
  }

  getAllOrdersForDelivery(typeQuery: any,typeUser: any,idUser: any, estados = []) {
    return this.httpClient.post<any>(`${this.url}/for-delivery`, { estados: estados },{ headers: this.httpOptions.headers, params:{typeUser:typeUser, typeSearch:typeQuery, idUser:idUser}});
  }

  getAllOrdersForValidate(typeQuery: any,typeUser: any,idUser: any, estados = []) {
    return this.httpClient.post<any>(`${this.url}/for-validate`, { estados: estados },{ headers: this.httpOptions.headers, params:{typeUser:typeUser, typeSearch:typeQuery, idUser:idUser}});
  }

  postOrder(order: any, files: any) {
    order.first = files?.first ?? '';
    order.payOnline = files?.online ?? '';
    order.letter = files?.letter ?? '';
    return this.httpClient.post(this.url, { 'order': order }, this.httpOptions);
  }

  deleteOrder(data: any) {
    return this.httpClient.delete(`${this.url}/${data.code}`, this.httpOptions);
  }

  getOrdersBuy(typeQuery: any,typeUser: any,idUser: any) {
    return this.httpClient.get<any>(`${this.url}/orders-buy`,{ headers: this.httpOptions.headers, params:{typeUser:typeUser, typeSearch:typeQuery, idUser:idUser}});
  }

  getOrdersStore(typeQuery: any,typeUser: any,idUser: any) {
    return this.httpClient.get<any>(`${this.url}/orders-store`,{ headers: this.httpOptions.headers, params:{typeUser:typeUser, typeSearch:typeQuery, idUser:idUser}});
  }

  getOrdersDelivered(typeQuery: any,typeUser: any,idUser: any) {
    return this.httpClient.get<any>(`${this.url}/orders-delivered`,{ headers: this.httpOptions.headers, params:{typeUser:typeUser, typeSearch:typeQuery, idUser:idUser}});
  }

  getOrdersValidated(typeQuery: any,typeUser: any,idUser: any) {
    return this.httpClient.get<any>(`${this.url}/orders-validated`,{ headers: this.httpOptions.headers, params:{typeUser:typeUser, typeSearch:typeQuery, idUser:idUser}});
  }

  updateOrder(order) {
    const { code } = order;
    delete (order.code);
    return this.httpClient.patch(`${this.url}/order/${code}`, { "order": order }, this.httpOptions);
  }

  getAllOrdersCount(typeQuery: any,typeUser: any,idUser: any, estados = []) {
    return this.httpClient.post<any>(`${this.url}/status-count`, { estados: estados },{ headers: this.httpOptions.headers, params:{typeUser:typeUser, typeSearch:typeQuery, idUser:idUser}});
  }

  getAllOrdersReportCountDashboard(typeQuery: any,typeUser: any,idUser: any, estados = [], mes: string, anio: string) {
    return this.httpClient.post<any>(`${this.url}/count-by-user-dashboard`, { estados: estados, mesVenta: mes, anioVenta: anio },{ headers: this.httpOptions.headers, params:{typeUser:typeUser, typeSearch:typeQuery, idUser:idUser}});
  }

  getAllOrdersReportCount(typeQuery: any,typeUser: any,idUser: any, estados = [], mes: string, anio: string) {
    return this.httpClient.post<any>(`${this.url}/count-by-user`, { estados: estados, mesVenta: mes, anioVenta: anio },
            { headers: this.httpOptions.headers, params:{typeUser:typeUser, typeSearch:typeQuery, idUser:idUser}});
  }

}
