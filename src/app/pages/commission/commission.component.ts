import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { CommissionService } from './../../services/commission/commission.service';

declare var $;

@Component({
  selector: 'app-commission',
  templateUrl: './commission.component.html',
  styleUrls: ['./commission.component.css']
})
export class CommissionComponent implements OnInit {

  public errorState: boolean = false;
  public closeResult: string = "";
  public iCommissionSettings: Array<any>;
  public iCommissionSetting: any;
  public createCommissionSetting: FormGroup;
  public updateCommissionSetting: FormGroup;
  public codeCommissionSetting: number = 0;

  constructor(private modalService: NgbModal,
    private toast: ToastrService,
    private commissionService: CommissionService,
    private formBuilder: FormBuilder) { 

      this.createCommissionSetting = this.createFormCommissionSetting();
      this.updateCommissionSetting = this.updateFormCommissionSetting();
  }

  ngOnInit(): void {
    this.getAllCommissionSetting();
  }

  createFormCommissionSetting() {
    return this.formBuilder.group({
        description: ['', Validators.required],
        rangeInitial: [0, Validators.required],
        rangeEnd: [0, Validators.required],
        calculate: [1, Validators.required],
        porcentaje: [0, Validators.required],
        moneda: ['Q', Validators.required],
        status: [1, Validators.required],
        type: [0, Validators.required]
    })
  }

  updateFormCommissionSetting() {
    return this.formBuilder.group({
        description: ['', Validators.required],
        rangeInitial: [0, Validators.required],
        rangeEnd: [0, Validators.required],
        calculate: [1, Validators.required],
        porcentaje: [0, Validators.required],
        status: [1, Validators.required],
        type: [0, Validators.required]
    })
  }

  /* manager modals */
  open(content) {
    this.errorState = false;
    this.modalService
        .open(content, { centered: true })
        .result.then(
            (result) => {
                this.closeResult = "Closed with: $result";
            },
            (reason) => {
                this.closeResult = "Dismissed $this.getDismissReason(reason)";
            }
        );
  }

  getDismissReason(reason: any) {
    this.modalService.dismissAll(reason);
  }

  /* CRUD manager Commission Setting */
  getAllCommissionSetting() {

    this.commissionService.getAllCommissions().subscribe(res => {
        if (res.length > 0) {
            this.iCommissionSettings = res;
            $(document).ready(function () {
                $('#commision').DataTable({
                    "language": {
                        "sProcessing": "Procesando...",
                        "sLengthMenu": "Mostrar _MENU_ registros",
                        "sZeroRecords": "No se encontraron resultados",
                        "sEmptyTable": "Ningún dato disponible en esta tabla",
                        "sInfo": "Mostrando registros del _START_ al _END_ de un total de _TOTAL_ registros",
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
                    data: this.iCommissionSettings
                });
            });
        } else {
            this.iCommissionSettings = [];
        }
    }, error => {
        let errors = error.error;
        this.toast.error(errors.error, "Error getting commissions", { timeOut: 10000 })
    })
  }

  getTypeDescription(type){
    if (type == 1) return 'Personal';
    if (type == 2) return 'Productividad';
    if (type == 3) return 'Conjunto';
    if (type == 4) return 'Personal Superior';
  }

  getCommissionUpdate(code) {
    console.log(code)
    let commission = this.iCommissionSettings.find(d => (d.code === code))
    this.codeCommissionSetting = code;

    this.updateCommissionSetting.setValue({
      description: commission?.description,
      rangeInitial: commission?.rangeInitial,
      rangeEnd: commission?.rangeEnd,
      calculate: commission?.calculate,
      porcentaje: commission?.porcentaje,
      type: commission?.type,
      status: commission?.status
    })
  }

  putCommission(event: Event) {
    event.preventDefault();
    if (this.updateCommissionSetting.valid) {
        this.commissionService.updateCommissionSetting(this.codeCommissionSetting, this.updateCommissionSetting.value).subscribe(res => {
            let d: any = res;
            this.toast.success(`${d.commission}`, 'Comisión actualizada', { timeOut: 5000 })
            $(document).ready(function () { $('#commision').DataTable().destroy(); })
            this.getAllCommissionSetting();
            this.getDismissReason('Close click');
            this.updateCommissionSetting.reset();
        }, error => {
            let errors: any = error;
            this.toast.error(`${errors.error}`, 'Error', { timeOut: 10000 })
        })
    } else {
        this.toast.error(`Debe de completar todos los campos...`, 'Error', { timeOut: 10000 })
    }
  }

  postCommission(event: Event) {
    event.preventDefault();
    if (this.createCommissionSetting.valid) {
        this.commissionService.postCommissionSetting(this.createCommissionSetting.value).subscribe(res => {
            let d: any = res;
            this.toast.success(`${d.commission}`, 'Comisión Creada', { timeOut: 5000 })
            $(document).ready(function () { $('#commision').DataTable().destroy(); })
            this.getAllCommissionSetting();
            this.getDismissReason('Close click');
            this.createCommissionSetting.reset();
        }, error => {
            let errors: any = error;
            this.toast.error(`${errors.error}`, 'Error', { timeOut: 10000 })
        })
    } else {
        this.toast.error(`Debe de completar todos los campos...`, 'Error', { timeOut: 10000 })
    }
  }

}
