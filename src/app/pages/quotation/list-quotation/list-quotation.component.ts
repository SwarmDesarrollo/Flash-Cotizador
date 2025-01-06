import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { QuotationService } from '../../../services/quotation/quotation.service';
import { ListQuotationI, PreorderI } from '../../../models/quotation.interface';
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
// import DataTable from 'datatables.net';

// import 'datatables.net';
// import 'datatables.net-dt';
// import * as $ from 'jquery';



@Component({
    selector: 'app-list-quotation',
    templateUrl: './list-quotation.component.html',
    styleUrls: ['./list-quotation.component.css']
})
export class ListQuotationComponent implements OnInit, AfterViewInit, OnDestroy {
    public iListQuotation: ListQuotationI;
    public iPreorder: Array<PreorderI>
    pageActual: number = 0;
    public updateQuotation: FormGroup;
    public closeResult: string = '';
    public message: object = {};
    public errorState: boolean = false;
    public codeClient: number = 0;
    dtOptions: DataTables.Settings = {};
    dtTrigger: Subject<any> = new Subject<any>();
    public userData: {
      typeUser:null,
      idUser:null
    };

    queryPara: string = ''

    public state_quotation: string = '';
    public status_btn: boolean = false;

    public optionCheckBox: any = [
      { id: 'Aceptada', name: 'Aceptada' },
      { id: 'Rechazada', name: 'Rechazada' },
      { id: 'En Progreso', name: 'En Progreso' },
      { id: 'Sin cotizar', name: 'Sin Cotizar' }
    ];

  checkedSearch = [];

  checkedS = '';

  searchGroup = new FormGroup({
      searchData: new FormControl(),
  });
    public dtQuotation: any;
    public quoTrigger = new Subject();
    constructor(private quotationService: QuotationService, private modalService: NgbModal, private formBuilder: FormBuilder, private toastrService: ToastrService) {
        this.updateQuotation = this.updateStateQuotation();
    }

    updateStateQuotation() {
        return this.formBuilder.group({
            code: [0],
            state: ['', [Validators.required]],
            commentary: ['', [Validators.required]]
        })
    }



    ngOnInit(): void {
      this.dtOptions = {
        pagingType: 'full_numbers',
        pageLength: 10,
        language: {
          url: 'https://cdn.datatables.net/plug-ins/1.10.21/i18n/Spanish.json'
        }
      };
        // this.dtQuotation = {
        //     pagingType: 'full_numbers',
        //     pageLength: 10,
        //     language: {
        //         url: 'https://cdn.datatables.net/plug-ins/1.10.21/i18n/Spanish.json'
        //     }
        // }
        this.userData = {
          typeUser: JSON.parse(window.sessionStorage.getItem('validate')).typeUser,
          idUser: JSON.parse(window.sessionStorage.getItem('validate')).code,
        }

        this.getListQuotation();
    }
    ngAfterViewInit(): void {
      const self = this;
      $(document).ready(function () {
        $('.table').DataTable({
          language: {
              processing: "Procesando...",
              lengthMenu: "Mostrar _MENU_ registros",
              zeroRecords: "No se encontraron resultados",
              emptyTable: "Ningún dato disponible en esta tabla",
              info: "Mostrando registros del _START_ al _END_ de un total de _TOTAL_ registros",
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
          data: self.iPreorder,
          // columns: [
          //   { data: '#' },
          //   { data: 'Nombre' },
          //   { data: 'Total' },
          //   { data: 'articulos' },
          //   { data: 'FechaCreacion' },
          //   { data: 'Estado' },
          //   { data: 'Usuario' },
          // ]
      });
      });
      this.dtTrigger.next(null);
    }

    colorStateFunction(state)
    {
        var span_text;
        switch(state)
        {
          case 1:
            span_text = "bg-warning";
            this.state_quotation = "Sin cotizar";
            this.status_btn = false;
            break;
          case 2:
            span_text = "bg-info";
            this.state_quotation = "En Progreso";
            this.status_btn = false;
            break;
          case 3:
            span_text = "bg-success";
            this.state_quotation = "Aceptada";
            this.status_btn = true;
            break;
          default:
            span_text = "bg-danger";
            this.state_quotation = "Rechazada";
            this.status_btn = true;
        }
        return span_text
    }

    ngOnDestroy(): void {
        // Do not forget to unsubscribe the event
        this.quoTrigger.unsubscribe();
    }

    onCheckboxChange(e) {
      if (!this.checkedSearch.includes(e)) {
        this.checkedSearch.push(e);
      } else {
        const index = this.checkedSearch.indexOf(e);
        if (index > -1) {
          this.checkedSearch.splice(index, 1);
        }
      }

      const dataTable = $('.table').DataTable();
      if (this.checkedSearch.length === 0) {
        dataTable.columns(5).search('').draw();
        // dataTable.column(5).search('', true, false).draw();
      } else {
        const searchPattern = this.checkedSearch.join('|');
        console.log(searchPattern);
        dataTable.columns(5).search(searchPattern, true, false).draw();
        // dataTable.column(5).search(searchPattern, true, false).draw();
      }
    }

    getListQuotation() {
        this.quotationService.getListQuotation(1,this.userData.typeUser,this.userData.idUser).subscribe(list => {
            this.iListQuotation = list;
            if (this.iListQuotation.count > 0) {
              this.iPreorder = this.iListQuotation.rows ?? [];
            } else {
              this.iPreorder = [];
            }
        }, error => {
        });
    }

    /* manager modals */
    open(content, code) {
        this.errorState = false;
        this.updateQuotation.patchValue({
            code: code
        })
        this.modalService
            .open(content, { size: "lg", centered: false })
            .result.then(
                (result) => { this.closeResult = "Closed with: $result"; },
                (reason) => { this.closeResult = "Dismissed $this.getDismissReason(reason)"; }
            );
    }
    getDismissReason(reason: any) {
        this.modalService.dismissAll(reason);
    }

    actionStateQuotation(event: Event) {
        this.errorState = false;
        event.preventDefault();
        if (this.updateQuotation.valid) {
            this.quotationService.updateClient(this.updateQuotation.value).subscribe(res => {
                this.getListQuotation();
                this.toastrService.success('Cambio de estado correcto...', 'Update state', {
                    timeOut: 5000
                })
                this.getDismissReason('Close click');
                this.updateQuotation.reset();
                $(document).ready(function () { $('#list').DataTable().destroy(); })
            }, error => {
                let errors: any = error.error;
                this.toastrService.error(errors.error, 'Error creating product', {
                    timeOut: 10000
                })
            })
        } else {
            this.errorState = true;
            this.message = { error: 'Debe de ingresar los campos correspondientes, para actualizar el estado...' }
        }
    }



}
