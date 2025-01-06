import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ProductI } from '../../models/product.interface';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private url = `${environment.urlAPI}/product`;
  private urlQuotation = `${environment.urlAPI}/preorder-quotation`;
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      "authorization": `flash ${JSON.parse(sessionStorage.getItem('validate')).token}`
    })
  };
  constructor(private httpClient: HttpClient) { }

  getProduct<ProductI>(code) {
    return this.httpClient.get(`${this.url}/${code}`, this.httpOptions);
  }

  postProduct(product, image) {
    product.image = image;
    return this.httpClient.post(this.url, { 'product': product }, this.httpOptions)
  }

  updateProduct(code, product, image) {
    product.image = image;
    return this.httpClient.patch(`${this.url}/${code}`, { 'product': product }, this.httpOptions)
  }

  updateProductQuotation(code, productQuote) {
    return this.httpClient.patch(`${this.urlQuotation}/product-quote/${code}`, { 'productQuote': productQuote }, this.httpOptions)
  }

}
