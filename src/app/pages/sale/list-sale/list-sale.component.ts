import { Subject } from 'rxjs';
import { Component, OnInit, AfterViewInit , OnDestroy } from '@angular/core';

import { SaleI } from './../../../models/sale.interface';
import { SaleService } from '../../../services/sale/sale.service';
import { environment } from 'src/environments/environment';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';

import * as $ from 'jquery';
// import DataTable from 'datatables.net-dt';
import 'datatables.net';
import 'datatables.net-dt';

/**
 * Componente para listar las ventas.
 * Utiliza DataTables para mostrar una tabla interactiva con las ventas.
 */
@Component({
  selector: 'app-list-sale',
  templateUrl: './list-sale.component.html',
  styleUrls: ['./list-sale.component.css']
})


export class ListSaleComponent implements OnInit, OnDestroy {

  /**
   * Información del usuario.
   */
  public userData: {
    typeUser: string | null,
    idUser: string | null
  };
  /**
   * Configuración de DataTables.
   */
  public dtQuotation;
   /**
   * Sujeto de RxJS para desencadenar la inicialización de DataTables.
   */
  public quoTrigger = new Subject();
  /**
   * Arreglo que contiene las ventas obtenidas del servicio.
   */
  public iSale: SaleI[] = [];

  /**
   * Estado de la cotización.
   */
  public state_quotation: string = '';

  /**
   * Estado del botón.
   */
  public status_btn: boolean = false;

  /**
   * URL base para las imágenes, obtenida del entorno.
   */
  public urlImage: string = `${environment.urlImage}`;


  /**
   * Constructor que inyecta los servicios necesarios.
   * @param saleService Servicio para obtener las ventas.
   * @param toastr Servicio para mostrar notificaciones.
   */
  constructor(private saleService: SaleService, private toastr: ToastrService) { }

  /**
   * Método que se ejecuta cuando el componente se inicializa.
   * Configura DataTables y obtiene los datos de ventas desde el servicio.
   */
  ngOnInit(): void {
    // this.dtQuotation["Config"] = {
    //   pagingType: 'full_numbers',
    //   pageLength: 10,
    //   language: {
    //     url: 'https://cdn.datatables.net/plug-ins/1.10.21/i18n/Spanish.json'
    //   }
    // }
    const userData = JSON.parse(window.sessionStorage.getItem('validate') || '{}');
    this.userData = {
      typeUser: userData.typeUser,
      idUser: userData.code,
    }
    this.getListSales();

  }

  ngAfterViewInit(): void {
    $(document).ready(function () {
      $('#list').DataTable({
        pagingType: 'full_numbers',
        pageLength: 10,
        language: {
          url: 'https://cdn.datatables.net/plug-ins/1.10.21/i18n/Spanish.json'
        }
      });
    });
  }

   /**
   * Método que se ejecuta cuando el componente se destruye.
   * Desuscribe del sujeto `quoTrigger`.
   */
  ngOnDestroy(): void {
    this.quoTrigger.unsubscribe();
  }

  onDelete(row: SaleI): void {
    Swal.fire({
      title: '¿ Realmente desea eliminar el registro ?',
      showCancelButton: true,
      confirmButtonText: `Eliminar Venta`,
      cancelButtonColor: '#d33',
      cancelButtonText: 'Cancelar'
    }).then((resp) => {
      if (resp.isConfirmed) {
        this.saleService.deleteSale(row).subscribe(res => {
          this.toastr.success('Venta eliminada correctamente...', 'Venta', {
            timeOut: 5000
          });
          this.getListSales();
        }, error => {
          let errors: any = error.error
          this.toastr.error(errors.error, 'Error deleting sale', {
            timeOut: 10000
          });
        });
      }
    });
  }

  colorStateFunction(state: number): string {
    let span_text: string;
    switch (state) {
      case 1:
        span_text = "bg-info";
        this.state_quotation = "Subido";
        this.status_btn = false;
        break;
      case 2:
        span_text = "bg-success";
        this.state_quotation = "Aceptada";
        this.status_btn = true;
        break;
      default:
        span_text = "bg-danger";
        this.state_quotation = "Rechazada";
        this.status_btn = true;
    }
    return span_text;
  }

  getListSales() {
    this.saleService.getListSale(1, this.userData.typeUser, this.userData.idUser).subscribe(list => {
      this.iSale = list;

      if (this.iSale.length > 0) {
        this.iSale = this.iSale;

      } else {
        this.iSale = [];
      }

    }, error => {
      console.error(error);
    });
  }
}
