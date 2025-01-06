import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { Component, OnInit } from '@angular/core';

declare var $;

import { OrderI } from './../../../models/order.interface';

import { OrdersService } from './../../../services/orders/orders.service';
import { AuthService } from './../../../services/auth/auth.service';

import { environment } from './../../../../environments/environment';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
// import { FileUploadValidators } from '@iplab/ngx-file-upload';

@Component({
  selector: 'app-list-orders',
  templateUrl: './list-orders.component.html',
  styleUrls: ['./list-orders.component.css']
})
export class ListOrdersComponent implements OnInit {

  public userData: {
    typeUser: number,
    idUser: number
  };

  public queryPara: string = '';

  public quoTrigger = new Subject();
  public iOrder: OrderI[] = [];

  public optionCheckBox: any = [
    { id: 1, name: 'Comprado' },
    /*{ id: 2, name: 'En Bodega' },
     { id: 3, name: 'Entregado' },
    { id: 4, name: 'Validado' } */
  ];

  public checkedSearch = [];

  /* onCheckboxChange(e) {
    const { id, name } = this.optionCheckBox.find( o => o.id == e);
    if (!this.checkedSearch.includes(name))
    {
        this.checkedSearch.push(name);
    }
    else
    {
        var index = this.checkedSearch.indexOf(name);
        if (index > -1)
        {
          this.checkedSearch.splice(index, 1);
        }
    }
    var table = $('#list').DataTable();
    table.columns(5).search(this.checkedSearch.join('|'),true,false).draw();

  } */

  public state_quotation: string = '';
  public status_btn: boolean = false;

  public urlImage: string = `${environment.urlImage}`;

  /* Modal En Bodega */
  public updateOrder: FormGroup;
  public closeResult: string = '';
  public errorState: boolean = false;
  public message: object = {};

  /* Modal Entregado */
  public updateOrder1: FormGroup;
  public closeResult1: string = '';
  public errorState1: boolean = false;
  public message1: object = {};

  /* Modal Finalizacion */
  public updateOrder2: FormGroup;
  public closeResult2: string = '';
  public errorState2: boolean = false;
  public message2: object = {};

  public animation: boolean = false;
  public multiple: boolean = false;
  // private filesControlSecondPay = new FormControl(null, [Validators.required, FileUploadValidators.filesLimit(1)]);
  private base64textString = [];

  constructor(private orderService: OrdersService,
    private toastrService: ToastrService,
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService) {

      this.updateOrder = this.updateStateOrder();
      this.updateOrder1 = this.updateStateOrderDelivered();
      this.updateOrder2 = this.updateStateOrderFinish();
  }

  updateStateOrder() {
    return this.formBuilder.group({
        code: [0],
        state: [2, [Validators.required]],
        cost: [0, [Validators.required, Validators.min(1)]],
        taxes: [0, [Validators.required, Validators.min(1)]],
        duty: [0, [Validators.required]]
    })
  }



  updateStateOrderDelivered() {
    return this.formBuilder.group({
      code: [0],
      state: [3, [Validators.required]],
      total: [0],
      first: [0],
      secondPay: [0, [Validators.required, Validators.min(1)]],
      // pathSecondPay: this.filesControlSecondPay,
    })
  }

  updateStateOrderFinish() {
    return this.formBuilder.group({
      code: [0],
      state: [0, [Validators.required]],
      commentary: ['', [Validators.required]]
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

  colorStateFunction(state)
    {
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
    this.orderService.getAllOrders(1,this.userData.typeUser,this.userData.idUser, [1]).subscribe( list => {
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

          /* if (this.queryPara != undefined) {
            console.log('status:', this.queryPara);
            this.onCheckboxChange(this.queryPara)
          } */
        });

      } else {
        this.iOrder = [];
      }

    }, error => {

    });
  }

  /* manager modals */
  open(content, data) {
    this.errorState = false;
    this.updateOrder.patchValue({
        code: data.code,
        state: 2,
        cost: data.cost
    })
    this.modalService
        .open(content, { size: "lg", centered: false })
        .result.then(
            (result) => { this.closeResult = "Closed with: $result"; },
            (reason) => { this.closeResult = "Dismissed $this.getDismissReason(reason)"; }
        );
  }

  getDismissReason(reason: any) {
      this.updateOrder.reset();
      this.modalService.dismissAll(reason);
  }

  actionStateOrder(event: Event) {
    this.errorState = false;
    event.preventDefault();
    if (this.updateOrder.valid) {
        this.orderService.updateOrder(this.updateOrder.value).subscribe(res => {
            this.getListOrders();
            this.toastrService.success('Cambio de estado correcto...', 'Update state', {
                timeOut: 5000
            })
            this.getDismissReason('Close click');
            this.updateOrder.reset();
            $(document).ready(function () { $('#list').DataTable().destroy(); })
        }, error => {
            let errors: any = error.error;
            this.toastrService.error(errors.error, 'Error update order', {
                timeOut: 10000
            })
        })
    } else {
        this.errorState = true;
        this.message = { error: 'Debe de ingresar los campos correspondientes, para actualizar el estado...' }
    }
  }

  /* Modal Entregado */

  openEntregado(content, data) {
    this.errorState1 = false;
    this.updateOrder1.patchValue({
        code: data.code,
        total: data.total,
        first: data.firstPay,
        cost: data.cost
    })
    this.modalService
        .open(content, { size: "lg", centered: false })
        .result.then(
            (result) => { this.closeResult1 = "Closed with: $result"; },
            (reason) => { this.closeResult1 = "Dismissed $this.getDismissReason(reason)"; }
        );
  }

  /* Modal Finish */
  openFinish(content, data) {
    this.errorState2 = false;
    this.updateOrder2.patchValue({
        code: data.code,
        commentary: data.commentary
    })
    this.modalService
        .open(content, { size: "lg", centered: false })
        .result.then(
            (result) => { this.closeResult2 = "Closed with: $result"; },
            (reason) => { this.closeResult2 = "Dismissed $this.getDismissReason(reason)"; }
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

  /* Modal Estado Final */
  actionStateOrderFinish(event: Event) {
    this.errorState2 = false;
    event.preventDefault();
    if (this.updateOrder2.valid) {
        this.orderService.updateOrder(this.updateOrder2.value).subscribe(res => {
            this.getListOrders();
            this.toastrService.success('Cambio de estado correcto...', 'Update state', {
                timeOut: 5000
            })
            this.getDismissReason('Close click');
            this.updateOrder2.reset();
            $(document).ready(function () { $('#list').DataTable().destroy(); })
        }, error => {
            let errors: any = error.error;
            this.toastrService.error(errors.error, 'Error update order', {
                timeOut: 10000
            })
        })
    } else {
        this.errorState2 = true;
        this.message2 = { error: 'Debe de ingresar los campos correspondientes, para actualizar el estado...' }
    }
  }

}
