import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';

declare var $;

import { OrderI } from './../../../models/order.interface';

import { OrdersService } from './../../../services/orders/orders.service';
import { AuthService } from './../../../services/auth/auth.service';

import { environment } from './../../../../environments/environment';

import { ToastrService } from 'ngx-toastr';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
// import { FileUploadValidators } from '@iplab/ngx-file-upload';

@Component({
  selector: 'app-for-delivery',
  templateUrl: './for-delivery.component.html',
  styleUrls: ['./for-delivery.component.css']
})
export class ForDeliveryComponent implements OnInit {

  public userData: {
    typeUser: number,
    idUser: number
  };

  public queryPara: string = '';

  public quoTrigger = new Subject();
  public iOrder: OrderI[] = [];

  public state_quotation: string = '';
  public status_btn: boolean = false;

  public urlImage: string = `${environment.urlImage}`;

  /* Modal Entregado */
  public updateOrder1: FormGroup;
  public closeResult1: string = '';
  public errorState1: boolean = false;
  public message1: object = {};

  // private filesControlSecondPay = new FormControl(null, [FileUploadValidators.filesLimit(1)]);
  private base64textString = [];

  constructor(private orderService: OrdersService,
    private toastrService: ToastrService,
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService) {
      this.updateOrder1 = this.updateStateOrderDelivered();
    }

  updateStateOrderDelivered() {
    return this.formBuilder.group({
      code: [0],
      state: [3, [Validators.required]],
      total: [0],
      first: [0],
      cuotas: [0],
      nameCompany: "",
      secondPay: [0, [Validators.required, Validators.min(1)]],
      // pathSecondPay: this.filesControlSecondPay,
    })
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.queryPara = params['status'];
    });

    this.userData = {
        typeUser: this.authService.getUserAuth().typeUser,
        idUser: this.authService.getUserAuth().code,
    }
    this.getListOrders();
  }

  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.quoTrigger.unsubscribe();
  }

  backClicked() {
    this.router.navigate(['/orders'])
  }

  colorStateFunction(state){
        var span_text;
        switch(state)
        {
          case 1:
            span_text = "bg-warning";
            this.state_quotation = "Comprado";
            this.status_btn = false;
            break;
          case 2:
            span_text = "bg-info";
            this.state_quotation = "En Bodega GT";
            this.status_btn = false;
            break;
          case 3:
              span_text = "bg-primary";
              this.state_quotation = "Entregado";
              this.status_btn = true;
              break;
          case 4:
            span_text = "bg-success";
            this.state_quotation = "Validado";
            this.status_btn = true;
            break;
          default:
            span_text = "bg-danger";
            this.state_quotation = "Rechazada";
            this.status_btn = true;
        }
        return span_text
  }

  /* Carga de imagen para el segundo pago */
  onUploadChange(evt: any) {
    const file = this.updateOrder1.value.pathSecondPay[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = this.handleReaderLoaded.bind(this);
        reader.readAsBinaryString(file);
    }
  }

  handleReaderLoaded(e) {
      this.base64textString.length = 0;
      this.base64textString.push('data:image/png;base64,' + btoa(e.target.result));
  }

  getListOrders() {
    this.orderService.getAllOrdersForDelivery(1,this.userData.typeUser,this.userData.idUser, [2]).subscribe( list => {
      this.iOrder = list;
      console.log(this.iOrder);
      if (this.iOrder.length > 0) {
        $(document).ready(function () {
          $('#list').DataTable({
            "language": {
              "sProcessing": "Procesando...",
              "sLengthMenu": "Mostrar _MENU_ registros",
              "sZeroRecords": "No se encontraron resultados",
              "sEmptyTable": "Ningún dato disponible en esta tabla",
              "sInfo": " _START_ al _END_ de _TOTAL_ registros",
              "sInfoEmpty": "Mostrando registros del 0 al 0 de un total de 0 registros",
              "sInfoFiltered": "(filtrado de un total de _MAX_ registros)",
              "sInfoPostFix": "",
              "sSearch": "Buscar:",
              "sUrl": "",
              "sInfoThousands": ",",
              "sLoadingRecords": "Cargando...",
              "oPaginate": {
                "sFirst": "Primero",
                "sLast": "Último",
                "sNext": "Siguiente",
                "sPrevious": "Anterior"
              },
              "oAria": {
                "sSortAscending": ": Activar para ordenar la columna de manera ascendente",
                "sSortDescending": ": Activar para ordenar la columna de manera descendente"
              }
            },
            retrieve: true,
            data: this.iOrder,
            order: [[0, 'desc']]
          });

        });

      } else {
        this.iOrder = [];
      }

    }, error => {

    });
  }

  getDismissReason(reason: any) {
    this.updateOrder1.reset();
    this.modalService.dismissAll(reason);
  }

  /* Modal Entregado */

  openEntregado(content, data) {
    this.errorState1 = false;
    this.updateOrder1.patchValue({
        state: 3,
        code: data.code,
        total: data.total,
        first: data.firstPay,
        cuotas: data.noCuotas,
        nameCompany: data.nameCompany
    });
    if (data.noCuotas > 0) {
      this.updateOrder1.get('secondPay')?.setValidators([]);
    } else {
      this.updateOrder1.get('secondPay')?.setValidators([Validators.required, Validators.min(1)]);
    }
    this.updateOrder1.get('secondPay')?.updateValueAndValidity();
    this.modalService
        .open(content, { size: "lg", centered: false })
        .result.then(
            (result) => { this.closeResult1 = "Closed with: $result"; },
            (reason) => { this.closeResult1 = "Dismissed $this.getDismissReason(reason)"; }
        );
  }

  getCalculateFinal() {
    return Number(this.updateOrder1.value.total) - Number(this.updateOrder1.value.first) - Number(this.updateOrder1.value.secondPay);
  }

  actionStateOrderDelivered(event: Event) {
    this.errorState1 = false;
    event.preventDefault();
    if (this.updateOrder1.valid) {
        this.updateOrder1.value.second = this.base64textString;
        delete this.updateOrder1.value.nameCompany;
        delete this.updateOrder1.value.cuotas;
        this.orderService.updateOrder(this.updateOrder1.value).subscribe(res => {
            this.getListOrders();
            this.toastrService.success('Cambio de estado correcto...', 'Update state', {
                timeOut: 5000
            })
            this.getDismissReason('Close click');
            this.updateOrder1.reset();
            this.base64textString = [];
            $(document).ready(function () { $('#list').DataTable().destroy(); })
        }, error => {
            let errors: any = error.error;
            this.toastrService.error(errors.error, 'Error update order', {
                timeOut: 10000
            })
        })
    } else {
        this.errorState1 = true;
        this.message1 = { error: 'Debe de ingresar los campos correspondientes, para actualizar el estado...' }
    }
  }

}
