import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { DiscountI } from '../../models/discount.interface';
import { DiscountService } from '../../services/discount/discount.service';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Subject } from 'rxjs';
declare var $;
@Component({
    selector: 'app-discount',
    templateUrl: './discount.component.html',
    styleUrls: ['./discount.component.css']
})
export class DiscountComponent implements OnInit, OnDestroy {
    public errorState: boolean = false;
    public closeResult: string = "";
    public iDiscounts: Array<DiscountI>;
    public iDiscount: DiscountI;
    public createDiscount: FormGroup;
    public updateDiscount: FormGroup;
    public codeDiscount: number = 0;

    constructor(
        private modalService: NgbModal,
        private toast: ToastrService,
        private discountService: DiscountService,
        private formBuilder: FormBuilder) {
        this.createDiscount = this.createFormDiscount();
        this.updateDiscount = this.updateFormDiscount();
    }

    ngOnInit(): void {
        this.getAllDiscount();
    }

    ngOnDestroy(): void {
        // Do not forget to unsubscribe the event
    }

    createFormDiscount() {
        return this.formBuilder.group({
            name: ['', Validators.required],
            typeCharger: ['', Validators.required],
            porcentage: ['', Validators.required]
        })
    }

    updateFormDiscount() {
        return this.formBuilder.group({
            name: ['', Validators.required],
            porcentage: [0, Validators.required],
            typeCharger: [0, Validators.required],
            state: [0, Validators.required]
        })
    }


    /* manager modals */
    open(content) {
        this.errorState = false;
        this.modalService
            .open(content, { size: "lg", centered: false })
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

    /* CRUD manager discount */
    getAllDiscount() {

        this.discountService.getAllDiscount().subscribe(res => {
            if (res.length > 0) {
                this.iDiscounts = res;
                $(document).ready(function () {
                    $('#discount').DataTable({
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
                        data: this.iDiscounts
                    });
                });
            } else {
                this.iDiscounts = [];
            }
        }, error => {
            let errors = error.error;
            this.toast.error(errors.error, "Error getting discount", { timeOut: 10000 })
        })
    }

    getDiscountUpdate(code) {
        console.log(code)
        let discount = this.iDiscounts.filter(d => (d.code === code))
        this.codeDiscount = code;

        if (discount.length > 0) {
            this.updateDiscount.setValue({
                name: discount[0].name,
                porcentage: discount[0].porcentage,
                typeCharger: discount[0].typeCharger,
                state: discount[0].state
            })
        }
    }

    putDiscount(event: Event) {
        event.preventDefault();
        if (this.updateDiscount.valid) {
            this.discountService.updateDiscount(this.codeDiscount, this.updateDiscount.value).subscribe(res => {
                console.log('asdfasdf')
                let d: any = res;
                this.toast.success(`${d.discount}`, 'Descuento actualizado', { timeOut: 5000 })
                $(document).ready(function () { $('#discount').DataTable().destroy(); })
                this.getAllDiscount();
                this.getDismissReason('Close click');
                this.updateDiscount.reset();
            }, error => {
                let errors: any = error;
                this.toast.error(`${errors.error}`, 'Error', { timeOut: 10000 })
            })
        } else {
            this.toast.error(`Debe de completar todos los campos...`, 'Error', { timeOut: 10000 })
        }
    }

    postDiscount(event: Event) {
        event.preventDefault();
        if (this.createDiscount.valid) {
            this.discountService.postDiscount(this.createDiscount.value).subscribe(res => {
                let d: any = res;
                this.toast.success(`${d.discount}`, 'Descuento actualizado', { timeOut: 5000 })
                $(document).ready(function () { $('#discount').DataTable().destroy(); })
                this.getAllDiscount();
                this.getDismissReason('Close click');
                this.createDiscount.reset();
            }, error => {
                let errors: any = error;
                this.toast.error(`${errors.error}`, 'Error', { timeOut: 10000 })
            })
        } else {
            this.toast.error(`Debe de completar todos los campos...`, 'Error', { timeOut: 10000 })
        }
    }

}
