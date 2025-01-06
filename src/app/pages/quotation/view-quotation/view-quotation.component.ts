import { Component, OnInit } from '@angular/core';
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { QuotationService } from '../../../services/quotation/quotation.service';
import { QuotationI, ProductQuotesI } from '../../../models/quotation.interface';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router'
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ToastrService } from 'ngx-toastr';
import { saveAs } from 'file-saver';
import { NgxSpinnerService } from "ngx-spinner";
import { UsersService } from '../../../services/users/users.service';
import Swal from 'sweetalert2'

@Component({
    selector: 'app-view-quotation',
    templateUrl: './view-quotation.component.html',
    styleUrls: ['./view-quotation.component.css']
})
export class ViewQuotationComponent implements OnInit {
    public errorState: boolean = false;
    public closeResult: string = "";
    public iQuotation: QuotationI;
    public iListQuotation: Array<ProductQuotesI>;
    public newLink: FormGroup;
    public message: object = {};
    public updateClient: FormGroup;
    public codeQuotation: number;
    public userAdmin: {};
    public codeAdminAssigment: String = "";

    constructor(private modalService: NgbModal, private quotationService: QuotationService, private activatedRoute: ActivatedRoute,
        private formBuilder: FormBuilder, private toastr: ToastrService, private router: Router, private spinner: NgxSpinnerService, private userService: UsersService) {
        this.newLink = this.formGroupLink();
        this.updateClient = this.formGroupUpdateClient();
    }

    ngOnInit(): void {
        this.activatedRoute.params.subscribe(data => {
            this.codeQuotation = data.code;
            this.getQuotation(this.codeQuotation);
        })
        this.userService.getAdminuser().subscribe(res => {
            this.userAdmin = res;
        }, error => {
            console.log(error)
        })
    }

    formGroupLink() {
        return this.formBuilder.group({
            link: ['', [Validators.required]],
            commentary: ['']
        })
    }

    formGroupUpdateClient() {
        return this.formBuilder.group({
            code: [{ value: 0, disabled: false }],
            correlative: [{ value: '', disabled: false }],
            name: [{ value: '', disabled: false }, [Validators.required]],
            email: [{ value: '', disabled: false }],
            phone: [{ value: '', disabled: false }]
        })
    }


    addNewLink(event: Event) {
        this.errorState = false;
        event.preventDefault();
        if (this.newLink.valid) {
            this.quotationService.createNewLink(this.iQuotation.code, this.newLink.value).subscribe(link => {
                let preorder: any;
                preorder = link;
                this.toastr.success(preorder.preorder, 'Nuevo link!', {
                    timeOut: 5000
                });
                this.getDismissReason('Close click');
                this.getQuotation(this.iQuotation.code);
                this.newLink.reset();
            }, error => {
                let errors: any = error.error;
                this.toastr.error(errors.error, 'Error add link', {
                    timeOut: 10000
                })
            })
        } else {
            this.errorState = true;
            this.message = { error: 'Debe de ingresar un link...' }
        }
    }

    updateDataclient(event: Event) {
        event.preventDefault();
        if (this.updateClient.valid) {
            this.quotationService.updateClient(this.updateClient.value).subscribe(client => {
                let messageUpdate: any = client;
                this.toastr.success(messageUpdate.preorder, 'Update client', {
                    timeOut: 5000
                })
            }, error => {
                let messageError: any = error.error;
                this.toastr.error(messageError.error, 'Error update client', {
                    timeOut: 10000
                })
            })
        }
    }

    /* manager modals */
    open(content) {
        this.errorState = false;
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
    /* end maganer modals */
    showSuccess() {
        this.toastr.success('Hello world!', 'Toastr fun!');
    }
    getQuotation(code) {
        this.spinner.show();
        console.log(code);
        this.quotationService.getQuotation(code).subscribe(quotation => {
            this.iQuotation = quotation;
            console.log(quotation);
            this.iListQuotation = quotation.productQuotes;
            this.updateClient.patchValue({
                code: this.iQuotation.code,
                correlative: this.iQuotation.correlative,
                name: this.iQuotation.name,
                email: this.iQuotation.email,
                phone: this.iQuotation.phone,
            })
            if (this.iQuotation.state === 1) {
                this.workInProgressPreorder(this.codeQuotation)
                this.spinner.hide();
            } else {
                this.spinner.hide();
            }
        }, error => {
            let messageError: any = error.error;
            this.toastr.error(messageError.error, 'Error get quotation', {
                timeOut: 10000
            })
        })
    }

    sendProductQuote(event: Event, code, state) {
        let newState: number;
        if (state == 1)
            newState = 2
        if (state == 2)
            newState = 1
        let send = { 'sendProduct': newState };
        this.quotationService.updateProductQuotation(code, send).subscribe(res => {
            this.getQuotation(this.codeQuotation)
            this.toastr.success('Cambio en el envio de producto', 'Enviar producto', {
                timeOut: 5000
            })
        }, error => {
            let errors: any = error.error;
            this.toastr.error(errors.error, 'Error creating product', {
                timeOut: 10000
            })
        })
    }

    workInProgressPreorder(code) {
        this.quotationService.updateClient({ code: code, state: 2 }).subscribe(res => {
        }, error => { })
    }
    /* exit from create or update provider */
    backClicked() {
        this.router.navigate(['/quotation'])
    }

    generatePDF() {
        this.spinner.show();
        this.quotationService.generatePDF(this.codeQuotation).subscribe(res => {
            saveAs(res, `${this.codeQuotation} - Cotizacion.pdf`);
            this.spinner.hide();
        }, error => {
            let errors: any = error.error;
            this.spinner.hide();
            this.toastr.error(errors.error, 'Error creating product', {
                timeOut: 10000
            })
        })
    }

    generateHTMLPDF() {
        this.router.navigate([`/pdf/${this.codeQuotation}`])
    }

    assigmentToAdmin(codeAdmin) {

        Swal.fire({
            title: 'Esta seguro?',
            text: "De asignar este cotizacion a un adminsitrador",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Asignar',
            cancelButtonText: 'Cancelar',
        }).then((result) => {
            if (result.isConfirmed) {
                let user = {
                    code: this.codeQuotation,
                    codeUser: codeAdmin
                }
                this.quotationService.updateClient(user).subscribe(client => {
                    let messageUpdate: any = client;
                    this.toastr.success(messageUpdate.preorder, 'Update client', {
                        timeOut: 5000
                    })
                    this.backClicked();
                }, error => {
                    let messageError: any = error.error;
                    this.toastr.error(messageError.error, 'Error update client', {
                        timeOut: 10000
                    })
                })
            }
        })


    }

}
