import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { Component, OnInit } from '@angular/core';

import * as $ from 'jquery';

import { OrderI } from './../../../models/order.interface';
import { OrdersService } from './../../../services/orders/orders.service';
import { AuthService } from './../../../services/auth/auth.service';
import { environment } from './../../../../environments/environment';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
// import { FileUploadValidators } from '@iplab/ngx-file-upload';

@Component({
  selector: 'app-delivered',
  templateUrl: './delivered.component.html',
  styleUrls: ['./delivered.component.css']
})
export class DeliveredComponent implements OnInit {

  private base64textStringPayOne = [];
  private base64textStringPayTwo = [];

  public userData: {
    typeUser: number,
    idUser: number
  };

  public queryPara: string = '';

  public quoTrigger = new Subject();
  public iOrder: OrderI[] = [];
  public orderTypeVIP: OrderI[] = [];
  public orderTypeOther: OrderI[] = [];

  public optionCheckBox: any = [
    { id: 1, name: 'Comprado' },
    { id: 2, name: 'En Bodega' },
    { id: 3, name: 'Entregado' },
    { id: 4, name: 'Validado' }
  ];

  public checkedSearch = [];
  public checkedSearchTwo = [];

  onCheckboxChange(e, listId) {
    const { id, name } = this.optionCheckBox.find(o => o.id == e);
    const checkedSearch = listId === 'list' ? this.checkedSearch : this.checkedSearchTwo;

    if (!checkedSearch.includes(name)) {
      checkedSearch.push(name);
    } else {
      let index = checkedSearch.indexOf(name);
      if (index > -1) {
        checkedSearch.splice(index, 1);
      }
    }

    let table = $('#' + listId).DataTable();
    table.columns(6).search(checkedSearch.join('|'), true, false).draw();
  }

  public state_quotation: string = '';
  public status_btn: boolean = false;

  public urlImage: string = `${environment.urlImage}`;

  /* Modal Finalizacion */
  public updateOrder2: FormGroup;
  public closeResult2: string = '';
  public errorState2: boolean = false;
  public message2: object = {};

  public animation: boolean = false;
  public multiple: boolean = false;
  // private filesControlPayOne = new FormControl(null, [Validators.required, FileUploadValidators.filesLimit(1)]);
  // private filesControlPayTwo = new FormControl(null, [FileUploadValidators.filesLimit(1)]);

  constructor(private orderService: OrdersService,
    private toastrService: ToastrService,
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService) {
      this.updateOrder2 = this.updateStateOrderFinish();
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

  updateStateOrderFinish() {
    return this.formBuilder.group({
      code: [0],
      state: [0, [Validators.required]],
      commentary: ['', [Validators.required]],
      cuotas: [0],
      validate: [""],
      nameCompany: [""],
      // pathPayOne: this.filesControlPayOne,
      // pathPayTwo: this.filesControlPayTwo,
    })
  }

  getListOrders() {
    this.orderService.getAllOrdersForValidate(1,this.userData.typeUser,this.userData.idUser, [1,2,3,4]).subscribe( list => {
      this.iOrder = list;
      this.orderTypeVIP = this.iOrder.filter( o => o.tipo_cliente === 3);
      this.orderTypeOther = this.iOrder.filter( o => o.tipo_cliente !== 3);
      if (this.orderTypeOther.length > 0) {
        $(document).ready(function () {
          $('#list').DataTable({
            language: {
              processing: "Procesando...",
              lengthMenu: "Mostrar _MENU_ registros",
              zeroRecords: "No se encontraron resultados",
              emptyTable: "Ningún dato disponible en esta tabla",
              info: " _START_ al _END_ de _TOTAL_ registros",
              infoEmpty: "Mostrando registros del 0 al 0 de un total de 0 registros",
              infoFiltered: "(filtrado de un total de _MAX_ registros)",
              infoPostFix: "",
              search: "Buscar:",
              url: "",
              thousands: ",",
              loadingRecords: "Cargando...",
              paginate: {
                first: "Primero",
                last: "Último",
                next: "Siguiente",
                previous: "Anterior"
              },
              aria: {
                sortAscending: ": Activar para ordenar la columna de manera ascendente",
                sortDescending: ": Activar para ordenar la columna de manera descendente"
              }
            },
            retrieve: true,
            data: this.orderTypeOther,
            order: [[2, 'desc']]
          });

        });

      } else {
        this.orderTypeOther = [];
      }

      if (this.orderTypeVIP.length > 0) {
        $(document).ready(function () {
          $('#list-vip').DataTable({
            "language": {
              "processing": "Procesando...",
              "lengthMenu": "Mostrar _MENU_ registros",
              "zeroRecords": "No se encontraron resultados",
              "emptyTable": "Ningún dato disponible en esta tabla",
              "info": " _START_ al _END_ de _TOTAL_ registros",
              "infoEmpty": "Mostrando registros del 0 al 0 de un total de 0 registros",
              "infoFiltered": "(filtrado de un total de _MAX_ registros)",
              "infoPostFix": "",
              "search": "Buscar:",
              "url": "",
              "thousands": ",",
              "loadingRecords": "Cargando...",
              "paginate": {
                "first": "Primero",
                "last": "Último",
                "next": "Siguiente",
                "previous": "Anterior"
              },
              "aria": {
                "sortAscending": ": Activar para ordenar la columna de manera ascendente",
                "sortDescending": ": Activar para ordenar la columna de manera descendente"
              }
            },
            retrieve: true,
            data: this.orderTypeVIP,
            order: [[0, 'desc']]
          });

        });

      } else {
        this.orderTypeVIP = [];
      }

    }, error => {

    });
  }

  getDismissReason(reason: any) {
    this.updateOrder2.reset();
    this.modalService.dismissAll(reason);
  }

  /* Modal Finish */
  openFinish(content, data) {
    this.errorState2 = false;
    this.updateOrder2.patchValue({
        code: data.code,
        commentary: data.commentary,
        cuotas: data.noCuotas,
        nameCompany: data.nameCompany
    })
    console.log(this.updateOrder2.get('cuotas').value);
    this.modalService
        .open(content, { size: "lg", centered: false })
        .result.then(
            (result) => { this.closeResult2 = "Closed with: $result"; },
            (reason) => { this.closeResult2 = "Dismissed $this.getDismissReason(reason)"; }
        );
  }

  /* Modal Estado Final */
  actionStateOrderFinish(event: Event) {
    this.errorState2 = false;
    event.preventDefault();
    if (this.updateOrder2.valid) {
        this.updateOrder2.value.one = this.base64textStringPayOne;
        this.updateOrder2.value.two = this.base64textStringPayTwo;
        this.orderService.updateOrder(this.updateOrder2.value).subscribe(res => {
            this.getListOrders();
            this.toastrService.success('Cambio de estado correcto...', 'Update state', {
                timeOut: 5000
            })
            this.getDismissReason('Close click');
            this.updateOrder2.reset();
            this.base64textStringPayOne = [];
            this.base64textStringPayTwo = [];
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

  /* Carga de imagen para la tranferencia 1 o total */
  onUploadChangePayOne(evt: any) {
    const file = this.updateOrder2.value.pathPayOne[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = this.handleReaderLoadedPayOne.bind(this);
        reader.readAsBinaryString(file);
    }
  }

  handleReaderLoadedPayOne(e) {
      this.base64textStringPayOne.push('data:image/png;base64,' + btoa(e.target.result));
  }

  /* Carga de imagen para la tranferencia 2*/
  onUploadChangePayTwo(evt: any) {
    const file = this.updateOrder2.value.pathPayTwo[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = this.handleReaderLoadedPayTwo.bind(this);
        reader.readAsBinaryString(file);
    }
  }

  handleReaderLoadedPayTwo(e) {
      this.base64textStringPayTwo.length = 0;
      this.base64textStringPayTwo.push('data:image/png;base64,' + btoa(e.target.result));
  }

}
