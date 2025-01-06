import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { TariffI, TariffsI } from '../../models/tariff.interface';
import { environment } from 'src/environments/environment';

@Injectable({
	providedIn: 'root'
})
export class TariffService {

	private httpOptions = {
		headers: new HttpHeaders({
			'Content-Type': 'application/json',
			"authorization": `flash ${JSON.parse(sessionStorage.getItem('validate')).token}`
		})
	};
	private url = `${environment.urlAPI}/tariff`;
	constructor(private httpClient: HttpClient) { }

	getAllTariff() {
		return this.httpClient.get<TariffsI>(this.url, this.httpOptions)
	}

	getTariff(code) {
		return this.httpClient.get<TariffI>(`${this.url}/${code}`, this.httpOptions);
	}

	postTariff(tariff) {
		return this.httpClient.post(this.url, { 'tariff': tariff }, this.httpOptions)
	}

	updateTariff(code, tariff) {
		return this.httpClient.patch(`${this.url}/${code}`, { 'tariff': tariff }, this.httpOptions)
	}
}
