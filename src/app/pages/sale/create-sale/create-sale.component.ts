import { FormGroup } from '@angular/forms';
import { FormBuilder } from '@angular/forms';
import { Validators, FormControl } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { Location } from "@angular/common";

import { SaleService } from './../../../services/sale/sale.service';

import { ToastrService } from 'ngx-toastr';
import { FileUploadValidators } from '@iplab/ngx-file-upload';

@Component({
  selector: 'app-create-sale',
  templateUrl: './create-sale.component.html',
  styleUrls: ['./create-sale.component.css']
})
export class CreateSaleComponent implements OnInit {
  private base64textString = [];

  public createSale: FormGroup;

  public animation: boolean = false;
  public multiple: boolean = false;
  private filesControl = new FormControl(null, [Validators.required, FileUploadValidators.filesLimit(1)]);

  constructor(private formBuilder: FormBuilder,
      private toastr: ToastrService,
      private _location: Location,
      private SaleService: SaleService) {

      this.createSale = this.formBuilder.group({
        /* required for creating quotation */
        nameClient: ['', Validators.required],
        monto: [0, [Validators.required, Validators.min(1)]],
        status: [1, Validators.required],
        urlPdf: [''],/* pending */
        urlPay: [''],
        codeUser: [ JSON.parse(window.sessionStorage.getItem('validate')).code , Validators.required],
        /* changes */
        files: this.filesControl
      });

  }

  ngOnInit(): void {
  }


  backClicked() {
    this._location.back();
  }

  onUploadChange(evt: any) {
    const file = this.createSale.value.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = this.handleReaderLoaded.bind(this);
        reader.readAsBinaryString(file);
    }
  }

  handleReaderLoaded(e) {
      this.base64textString.push('data:image/png;base64,' + btoa(e.target.result));
  }

  createNewSale(event: Event) {
    event.preventDefault();
    if (this.createSale.valid) {
        let discount: any = [];

        this.SaleService.postSale(this.createSale.value, this.base64textString).subscribe(product => {
            this.backClicked();
            this.toastr.success('Venta subida correctamente...', 'Venta', {
                timeOut: 5000
            });

        }, error => {
            let errors: any = error.error
            this.toastr.error(errors.error, 'Error creating sale', {
                timeOut: 10000
            })
        })

    } else {
        console.log(this.createSale.value)
        this.toastr.error('You must select all the fields in order to generate a sale....', 'Error creating sale', {
            timeOut: 10000
        })
    }
  }

}
