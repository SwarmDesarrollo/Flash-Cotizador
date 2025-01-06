import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ListQuotationI, QuotationI } from '../../models/quotation.interface';
// import { Body } from '@angular/http/src/body'; // This line is not needed and can be removed
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class QuotationService {

    private url = `${environment.urlAPI}/preorder-quotation`;
    private urlPdf = `${environment.urlAPI}/`;
    private httpOptions = {
        headers: new HttpHeaders({
            'Content-Type': 'application/json',
            "authorization": `flash ${JSON.parse(sessionStorage.getItem('validate')).token}`
        })
    };
    constructor(private httpClient: HttpClient) { }

    getListQuotation(typeQuery,typeUser,idUser)
    {
      return this.httpClient.get<ListQuotationI>(`${this.url}/`,{ headers: this.httpOptions.headers, params:{typeUser:typeUser, typeSearch:typeQuery, idUser:idUser}},);
    }

    getQuotation(code) {
      return this.httpClient.get<QuotationI>(`${this.url}/products/${code}`, this.httpOptions)
    }

    createQuotation(preorder) {
      return this.httpClient.post(this.url, { 'preorder': preorder }, this.httpOptions)
    }

    getLinks(code) {
      return this.httpClient.get<QuotationI>(`${this.url}/links/${code}`, this.httpOptions)
    }

    createNewLink(code, link) {
      link.codeClient = code;
      return this.httpClient.post(`${this.url}/add-link`, { "preorder": link }, this.httpOptions)
    }

    updateClient(client) {
        let code = client.code;
        delete (client.code);
        return this.httpClient.patch(`${this.url}/client/${code}`, { "client": client }, this.httpOptions)
    }

    updateProductQuotation(code, productQuotation) {
        return this.httpClient.patch(`${this.url}/product-quote/${code}`, { "productQuote": productQuotation }, this.httpOptions)
    }

    generatePDF(codePreorder) {
        var httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                "authorization": `flash ${JSON.parse(sessionStorage.getItem('validate')).token}`
            }),
            responseType: 'blob' as 'json'
        };
        return this.httpClient.post(`${this.urlPdf}quotation/cotizacion/${codePreorder}`, { 'body': { name: 'name' } }, httpOptions)
    }

    getDataPDF(codePreorder) {
        var httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                "authorization": `flash ${JSON.parse(sessionStorage.getItem('validate')).token}`
            }),
        };
        return this.httpClient.post(`${this.urlPdf}quotation/pdf/${codePreorder}`, { 'body': { name: 'name' } }, httpOptions)
    }

}
