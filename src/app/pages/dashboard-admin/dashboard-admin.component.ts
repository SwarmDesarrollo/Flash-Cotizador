import { Validators } from '@angular/forms';
import { FormGroup } from '@angular/forms';
import { FormBuilder } from '@angular/forms';
import { Component, OnInit } from '@angular/core';

import { DashboardService } from '../../services/dashboard/dashboard.service';
import { OrdersService } from 'src/app/services/orders/orders.service';
import { ExportExcelService } from './../../services/export-excel.service';

import Chart from 'chart.js';
import * as moment from 'moment';

// core components
import { chartPie } from "../../variables/charts";
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-dashboard-admin',
  templateUrl: './dashboard-admin.component.html',
  styleUrls: ['./dashboard-admin.component.css']
})
export class DashboardAdminComponent implements OnInit {
  public chartMontos: any;
  public montosChart: any;
  public chartTotal: any;
  public totalChart: any;
  public quotationPending: number = 0;
  public quotationWorkInProgress: number = 0;
  public quotationPendingAceptadas: number = 0;
  public bestCategory: [];
  public firstQuotation: [];
  public salesStadistics: [];
  public totalMontoVenta: number = 0;
  public anioSelected: number = 0;
  public mesSelected: number = 0;
  public meses = [];
  public anios = [];
  public searchFormData: FormGroup;

  public orderBuy: number = 0;
  public orderStore: number = 0;
  public orderDelivered: number = 0;
  public orderValidated: number = 0;

  public userData: {
    typeUser: number,
    idUser: number
  };

  dataForExcel = [];

  constructor(private formBuilder: FormBuilder,
    private dashboardService: DashboardService,
    private orderService: OrdersService,
    private authService: AuthService,
    private exportExcelService: ExportExcelService) { }

  ngOnInit() {
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

    this.chartTotal = document.getElementById('chart-total');

    this.totalChart = new Chart(this.chartTotal, {
      type: 'pie',
      options: {
        title: {
          display: true,
          text: "No. Cotizaciones por Vendedor"
        },
        plugins: {
          datalabels: {
            color: '#36A2EB'
          }
        }
      },
      data: {...chartPie.data}
    });

    this.chartMontos = document.getElementById('chart-montos');

    this.montosChart = new Chart(this.chartMontos, {
      type: 'pie',
      options: {
        title: {
          display: true,
          text: "Montos por Vendedor"
        },
        plugins: {
          datalabels: {
            color: '#eb36a6'
          }
        }
      },
      data: {...chartPie.data}
    });


    this.getFirstQuotation();
    this.getSales(this.searchFormData.value);
    this.getFillYear();

  }

  getFillYear() {
    const anioActual = moment().year();
    const intervalo = 5;

    for (let index = (anioActual - intervalo); index < ( anioActual + intervalo); index++) {
      this.anios.push(index);
    }
  }

  randomInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  getQuotationPending() {
    this.dashboardService.getQuotationsReportCount(1,this.userData.typeUser,this.userData.idUser, [1], `${this.mesSelected + 1}`, `${this.anioSelected}`).subscribe( response => {
      this.quotationPending  = response ?? 0;
    }, error => {
      console.log(`Error de consulta de informacion: ${error}`);
    });
  }

  getQuotationAceptadas() {
    this.dashboardService.getQuotationsReportCount(1,this.userData.typeUser,this.userData.idUser, [3], `${this.mesSelected + 1}`, `${this.anioSelected}`).subscribe( response => {
      this.quotationPendingAceptadas = response ?? 0;
    }, error => {
      console.log(`Error de consulta de informacion: ${error}`);
    });
  }

  getWorkInProgress() {
    this.dashboardService.getQuotationsReportCount(1,this.userData.typeUser,this.userData.idUser, [2], `${this.mesSelected + 1}`, `${this.anioSelected}`).subscribe( response => {
      this.quotationWorkInProgress = response ?? 0;
    }, error => {
      console.log(`Error de consulta de informacion: ${error}`);
    });
  }

  getFirstQuotation() {
    this.dashboardService.getFirstQuotation().subscribe(res => {
      let first: any = res;
      this.firstQuotation = first;
    }, error => {
      console.log(error)
    })
  }

  getSales(filter: any) {
    this.mesSelected = Number(filter.mesVenta) - 1 ?? 0;
    this.anioSelected = Number(filter.anioVenta) ?? 0;
    this.dashboardService.getSalesSeller(filter).subscribe( ( res : any ) => {
      this.salesStadistics = res ?? [];
      this.getTotalAmount(this.salesStadistics);

      let labels = [];
      let valuesCotizaciones = [];
      let colors = [];
      let montosCotizaciones = [];

      this.salesStadistics.forEach((item) => {
        const { name, cantCotizaciones, amountTotal } = item;
        const red = this.randomInteger(1,250);
        const green = this.randomInteger(1,250);
        const blue = this.randomInteger(1,250);
        labels.push(name);
        valuesCotizaciones.push(cantCotizaciones);
        colors.push(`rgba(${red},${green},${blue},1)`);
        montosCotizaciones.push(amountTotal);
      },[]);

      this.totalChart.data.labels = [...labels];
      this.totalChart.data.datasets.forEach((dataset) => {
        dataset.data.pop();
        dataset.backgroundColor = [...colors];
        dataset.data = [...valuesCotizaciones];
        console.log('dataset total ' , valuesCotizaciones);
      });
      this.totalChart.update();

      console.log(' totalChart ', this.totalChart.data.datasets);

      document.getElementById("grafico2").innerHTML = '<canvas id="chart-montos" class="chart-canvas"></canvas>';
      this.chartMontos = document.getElementById('chart-montos');

      this.montosChart = new Chart(this.chartMontos, {
        type: 'pie',
        options: {
          title: {
            display: true,
            text: "Montos por Vendedor"
          },
          plugins: {
            datalabels: {
              color: '#eb36a6'
            }
          }
        },
        data: {
          labels: [...labels],
          datasets: [{
            data: [...montosCotizaciones],
            backgroundColor: [...colors]
          }]
        }
      });

    }, error => {
      console.log(error);
    });

    this.getQuotationPending();
    this.getWorkInProgress();
    this.getQuotationAceptadas();

    this.getOrdersBuy();
    this.getOrderStore();
    this.getOrderDelivered();
    this.getOrderValidated();
  }

  getTotalAmount(registros: []) {
    this.totalMontoVenta = 0;
    registros.map((item: any) => {
      this.totalMontoVenta += Number(item.amountTotal) ?? 0
    });
  }

  exportToExcel() {

    this.salesStadistics.forEach((row: any) => {
      this.dataForExcel.push(Object.values(row))
    })

    let reportData = {
      title: 'Reporte Estadisticas de Ventas - Flash',
      data: this.dataForExcel,
      headers: Object.keys({
        "Codigo Vendedor": 23,
        "Nomnre Vendedor": "Fernando Monroy",
        "No Articulos Vendidos": "1",
        "Monto Total de Venta": "240.00",
        "cantCotizaciones": 1,
        "No Cotizaciones Total": 1,
        "Mes de Venta": 10,
        "Año de Venta": "2022",
        "Ultima Actualizacion": "2022-10-22T01:06:58.000Z"
      })
    }

    this.exportExcelService.exportExcel(reportData);
  }

  getOrdersBuy() {
    this.orderService.getAllOrdersReportCount(1,this.userData.typeUser,this.userData.idUser, [1], `${this.mesSelected + 1}`, `${this.anioSelected}`).subscribe( response => {
      this.orderBuy = response ?? 0;
    }, error => {
      console.log(`Error de consulta de informacion: ${error}`);
    });
  }

  getOrderStore() {
    this.orderService.getAllOrdersReportCount(1,this.userData.typeUser,this.userData.idUser, [2], `${this.mesSelected + 1}`, `${this.anioSelected}`).subscribe( response => {
      this.orderStore = response ?? 0;
    }, error => {
      console.log(`Error de consulta de informacion: ${error}`);
    });
  }

  getOrderDelivered() {
    this.orderService.getAllOrdersReportCount(1,this.userData.typeUser,this.userData.idUser, [3], `${this.mesSelected + 1}`, `${this.anioSelected}`).subscribe( response => {
      this.orderDelivered = response ?? 0;
    }, error => {
      console.log(`Error de consulta de informacion: ${error}`);
    });
  }

  getOrderValidated() {
    this.orderService.getAllOrdersReportCount(1,this.userData.typeUser,this.userData.idUser, [4], `${this.mesSelected + 1}`, `${this.anioSelected}`).subscribe( response => {
      this.orderValidated = response ?? 0;
    }, error => {
      console.log(`Error de consulta de informacion: ${error}`);
    });
  }

}
