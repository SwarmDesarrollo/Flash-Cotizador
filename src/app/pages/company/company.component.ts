import { ToastrService } from 'ngx-toastr';
import { FormGroup } from '@angular/forms';
import { FormBuilder } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';

import { CompanyService } from './../../services/company/company.service';

declare var $;

@Component({
  selector: 'app-company',
  templateUrl: './company.component.html',
  styleUrls: ['./company.component.css']
})
export class CompanyComponent implements OnInit {

  public errorState: boolean = false;
    public closeResult: string = "";
    public iCompanies: Array<any>;
    public iCompany: any;
    public createCompany: FormGroup;
    public updateCompany: FormGroup;
    public codeCompany: number = 0;

    constructor(
        private modalService: NgbModal,
        private toast: ToastrService,
        private companyService: CompanyService,
        private formBuilder: FormBuilder) {
        this.createCompany = this.createFormCompany();
        this.updateCompany = this.updateFormCompany();
    }

    ngOnInit(): void {
        this.getAllCompany();
    }

    ngOnDestroy(): void {
        // Do not forget to unsubscribe the event
    }

    createFormCompany() {
        return this.formBuilder.group({
            name: ['', Validators.required],
            state: [1, Validators.required]
        })
    }

    updateFormCompany() {
        return this.formBuilder.group({
            name: ['', Validators.required],
            state: [0, Validators.required]
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

    /* CRUD manager company */
    getAllCompany() {

        this.companyService.getAllCompany().subscribe(res => {
            if (res.length > 0) {
                this.iCompanies = res;
                $(document).ready(function () {
                    $('#company').DataTable({
                        "language": {
                            "processing": "Procesando...",
                            "lengthMenu": "Mostrar _MENU_ registros",
                            "zeroRecords": "No se encontraron resultados",
                            "emptyTable": "Ningún dato disponible en esta tabla",
                            "info": "Mostrando registros del _START_ al _END_ de un total de _TOTAL_ registros",
                            "infoEmpty": "Mostrando registros del 0 al 0 de un total de 0 registros",
                            "infoFiltered": "(filtrado de un total de _MAX_ registros)",
                            "infoPostFix": "",
                            "search": "Buscar:",
                            "url": "",
                            "infoThousands": ",",
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
                        data: this.iCompanies
                    });
                });
            } else {
                this.iCompanies = [];
            }
        }, error => {
            let errors = error.error;
            this.toast.error(errors.error, "Error getting companies", { timeOut: 10000 })
        })
    }

    getCompanyUpdate(code) {
        console.log(code)
        let company = this.iCompanies.find(d => (d.code === code))
        this.codeCompany = code;

        this.updateCompany.setValue({
          name: company?.name,
          state: company?.state
        })
    }

    putCompany(event: Event) {
        event.preventDefault();
        if (this.updateCompany.valid) {
            this.companyService.updateCompany(this.codeCompany, this.updateCompany.value).subscribe(res => {
                let d: any = res;
                this.toast.success(`${d.company}`, 'Empresa actualizada', { timeOut: 5000 })
                $(document).ready(function () { $('#company').DataTable().destroy(); })
                this.getAllCompany();
                this.getDismissReason('Close click');
                this.updateCompany.reset();
            }, error => {
                let errors: any = error;
                this.toast.error(`${errors.error}`, 'Error', { timeOut: 10000 })
            })
        } else {
            this.toast.error(`Debe de completar todos los campos...`, 'Error', { timeOut: 10000 })
        }
    }

    postCompany(event: Event) {
        event.preventDefault();
        if (this.createCompany.valid) {
            this.companyService.postCompany(this.createCompany.value).subscribe(res => {
                let d: any = res;
                this.toast.success(`${d.company}`, 'Empresa creada', { timeOut: 5000 })
                $(document).ready(function () { $('#company').DataTable().destroy(); })
                this.getAllCompany();
                this.getDismissReason('Close click');
                this.createCompany.reset();
            }, error => {
                let errors: any = error;
                this.toast.error(`${errors.error}`, 'Error', { timeOut: 10000 })
            })
        } else {
            this.toast.error(`Debe de completar todos los campos...`, 'Error', { timeOut: 10000 })
        }
    }

}
