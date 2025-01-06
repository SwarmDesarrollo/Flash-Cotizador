import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from "ngx-spinner";
import { QuotationService } from '../../services/quotation/quotation.service';
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { Router } from '@angular/router'
import Swal from 'sweetalert2';
@Component({
    selector: 'app-request-quotation',
    templateUrl: './request-quotation.component.html',
    styleUrls: ['./request-quotation.component.css']
})
export class RequestQuotationComponent implements OnInit {

    public createQuotation: FormGroup;
    public createLink: FormGroup;
    public productQuotation = [];
    public closeResult: string = '';

    constructor(
        private formBuilder: FormBuilder,
        private toast: ToastrService,
        private spinner: NgxSpinnerService,
        private QuotationService: QuotationService,
        private modalService: NgbModal,
        private router: Router
    ) {
        this.createQuotation = this.createFormQuotation();
        this.createLink = this.createFormLinks();
    }

    ngOnInit(): void {
    }

    createFormQuotation() {
        return this.formBuilder.group({
            correlative: [''],
            name: ['', Validators.required],
            email: ['', [Validators.required, Validators.email]],
            phone: ['', [Validators.required]],
        })
    }

    createFormLinks() {
        return this.formBuilder.group({
            link: ['', Validators.required],
            commentary: ['']
        })
    }

    open(content) {
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

    createNewQuotation(event: Event) {
        event.preventDefault();
        if (this.createQuotation.valid && this.productQuotation.length > 0) {
            this.spinner.show();
            let product = {
                client: this.createQuotation.value,
                productQuotation: this.productQuotation
            }
            this.QuotationService.createQuotation(product).subscribe(res => {
                let p: any = res;
                this.toast.success(p.preorder, 'Quotation created', { timeOut: 5000 })
                this.createQuotation.reset();
                this.productQuotation.length = 0;
                this.spinner.hide();
            }, error => {
                this.spinner.hide();
                let errors: any = error.error;
                this.toast.error(errors.error, 'Error create quotation', { timeOut: 10000 })
            })
        } else {
            if (!this.createQuotation.valid && this.productQuotation.length === 0) {
                this.toast.error('You must enter all the necessary fields', 'Error create quotation', { timeOut: 10000 })
            } else if (!this.createQuotation.valid && this.productQuotation.length > 0) {
                this.toast.error('You must enter the customer information', 'Error create quotation', { timeOut: 10000 })
            } else if (this.createQuotation.valid && this.productQuotation.length === 0) {
                this.toast.error('You must enter at least one link to quote', 'Error add links', { timeOut: 10000 })
            }
        }
    }

    addLink(event: Event) {
        event.preventDefault();
        if (this.createLink.valid) {
            this.productQuotation.push(this.createLink.value)
            this.createLink.reset();
            this.getDismissReason('Close click');
            this.exit();
            this.toast.success('link added successfully', 'add links', { timeOut: 2000 })
        } else {
            this.toast.error('You must enter all the necessary fields', 'Error add links', { timeOut: 10000 })
        }
    }

    deleteLinks(code) {
        Swal.fire({
            title: '¿Esta seguro de eliminar este link?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Eliminar'
        }).then((result) => {
            if (result.isConfirmed) {
                this.productQuotation.splice(code, 1);
            }
        })
    }

    exit() {
        this.router.navigate(['/request-quotation']);
    }

}
