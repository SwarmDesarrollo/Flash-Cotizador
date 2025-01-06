import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from './../../../environments/environment';
import { SaleI } from './../../models/sale.interface';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SaleService {

  private url = `${environment.urlAPI}/sale`;
  private httpOptions = {
      headers: new HttpHeaders({
          'Content-Type': 'application/json',
          "authorization": `flash ${JSON.parse(sessionStorage.getItem('validate')).token}`
      })
  };
  constructor(private httpClient: HttpClient) { }

  getListSale(typeQuery,typeUser,idUser)
  {
    return this.httpClient.get<SaleI[]>(`${this.url}/`,{ headers: this.httpOptions.headers, params:{typeUser:typeUser, typeSearch:typeQuery, idUser:idUser}});
  }

  getSale(code: number): Observable<SaleI> {
    return this.httpClient.get<SaleI>(`${this.url}/${code}`, this.httpOptions);
  }

  postSale(saleData: any, base64textString: string[]): Observable<any> {
    const payload = { ...saleData, base64textString };

    return this.httpClient.post(this.url, { 'sale': payload }, this.httpOptions);
  }

  deleteSale(data: any) {
    return this.httpClient.delete(`${this.url}/${data.code}`, this.httpOptions);
  }

}
