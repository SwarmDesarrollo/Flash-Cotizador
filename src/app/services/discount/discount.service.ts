import { Injectable } from '@angular/core';
import { DiscountI } from '../../models/discount.interface';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DiscountService {
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      "authorization": `flash ${JSON.parse(sessionStorage.getItem('validate')).token}`
    })
  };
  private url = `${environment.urlAPI}/discount`;
  constructor(private httpClient: HttpClient) { }

  getAllDiscount() {
    return this.httpClient.get<DiscountI[]>(this.url, this.httpOptions)
  }

  getDiscount(code) {
    return this.httpClient.get<DiscountI[]>(`${this.url}/${code}`, this.httpOptions);
  }

  postDiscount(discount) {
    return this.httpClient.post(this.url, { 'discount': discount }, this.httpOptions)
  }

  updateDiscount(code, discount) {
    return this.httpClient.patch(`${this.url}/${code}`, { 'discount': discount }, this.httpOptions)
  }
}
