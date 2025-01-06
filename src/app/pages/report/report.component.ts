import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { AuthService } from './../../services/auth/auth.service';
import { ExportExcelService } from './../../services/export-excel.service';

import * as moment from 'moment';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.css']
})
export class ReportComponent implements OnInit {

  public meses = [];
  public anios = [];
  public salesStadistics: [];
  public salesMonthlyReport: [];
  dataForExcel = [];

  public totalMontoVenta: number = 0;
  public anioSelected: number = 0;
  public mesSelected: number = 0;

  public orderBuy: number = 0;
  public orderStore: number = 0;
  public orderDelivered: number = 0;
  public orderValidated: number = 0;

  public searchFormData: FormGroup;

  public userData: {
    typeUser: number,
    idUser: number
  };

  constructor(private formBuilder: FormBuilder, 
    private authService: AuthService,
    private exportExcelService: ExportExcelService) { }

  ngOnInit(): void {
    this.meses = [
      'Enero',
      'Febrero',
      'Marzo',
      'Abril',
      'Mayo',
      'Junio',
      'Julio',
      'Agosto',
      'Septiembre',
      'Octubre',
      'Noviembre',
      'Diciembre'
    ];

    this.userData = {
      typeUser: this.authService.getUserAuth().typeUser,
      idUser: this.authService.getUserAuth().code,
    }

    this.searchFormData = this.formBuilder.group({
      mesVenta: ["", Validators.required],
      anioVenta: ["", Validators.required]
    });

    /* Año - mes actual */
    this.mesSelected = moment().month();
    this.anioSelected = moment().year();

    this.searchFormData.patchValue({
      mesVenta: this.mesSelected + 1,
      anioVenta: this.anioSelected
    });

    this.getFillYear();
  }

  getFillYear() {
    const anioActual = moment().year();
    const intervalo = 5;

    for (let index = (anioActual - intervalo); index < ( anioActual + intervalo); index++) {
      this.anios.push(index);
    }
  }

}
