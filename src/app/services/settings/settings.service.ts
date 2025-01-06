import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { SettingI } from '../../models/settings.interface';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {

  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      "authorization": `flash ${JSON.parse(sessionStorage.getItem('validate')).token}`
    })
  };
  private url = `${environment.urlAPI}/settings`;
  constructor(private httpClient: HttpClient) { }

  getAllSettings() {
    return this.httpClient.get<SettingI>(this.url, this.httpOptions)
  }

  getSettings(code) {
    return this.httpClient.get<SettingI>(`${this.url}/${code}`, this.httpOptions);
  }

  postSettings(settings) {
    return this.httpClient.post(this.url + '/settigs', { 'settings': settings }, this.httpOptions)
  }

  updateSettings(code, settings) {
    return this.httpClient.patch(`${this.url}/${code}`, { 'settings': settings }, this.httpOptions)
  }

  bulkLoad(load) {
    return this.httpClient.post(`${this.url}/bulk-category`, { load }, this.httpOptions)
  }

  bulkLoadSubcategory(load) {
    return this.httpClient.post(`${this.url}/bulk-subcategory`, { load }, this.httpOptions)
  }

  bulkLoadTariff(load) {
    return this.httpClient.post(`${this.url}/bulk-tariff`, { load }, this.httpOptions)
  }

}
