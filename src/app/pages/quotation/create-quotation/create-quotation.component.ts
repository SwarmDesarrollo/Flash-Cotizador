import { Component, OnInit } from "@angular/core";
import { CreateQuotationI } from "../../../models/create-quotation.interface";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Location } from "@angular/common";

/* services */
import { CategoryService } from '../../../services/category/category.service';
import { SubcategoryService } from '../../../services/subcategory/subcategory.service';
import { ProviderService } from '../../../services/provider/provider.service';
import { SettingsService } from '../../../services/settings/settings.service';
import { ProductService } from '../../../services/product/product.service';
import { QuotationService } from '../../../services/quotation/quotation.service';
import { TariffService } from '../../../services/tariff/tariff.service';
import { CalculateQuotationService } from '../../../services/calculate-quotation/calculate-quotation.service';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2'
import { ActivatedRoute } from '@angular/router';
import { DiscountService } from '../../../services/discount/discount.service';
import { DiscountI } from '../../../models/discount.interface';
import currencyFormatter from 'currency-formatter';

@Component({
    selector: "app-create-quotation",
    templateUrl: "./create-quotation.component.html",
    styleUrls: ["./create-quotation.component.css"],
})
export class CreateQuotationComponent implements OnInit {
    private base64textString = [];
    public category: any;
    public subcategory: any;
    public provider: any;
    public settings: any;
    public tariff: any;
    public iDiscount: Array<DiscountI>
    public ICreateQuotation: CreateQuotationI;
    public createQuotation: FormGroup; /* create form group  */
    public updateLink: FormGroup;
    public quotationFinal: object = {}
    public codeProduct: number = 0;
    /* crate validation */
    constructor(private formBuilder: FormBuilder, private _location: Location,
        private categoryService: CategoryService,
        private subcategoryService: SubcategoryService,
        private providerService: ProviderService,
        private settingsService: SettingsService,
        private productService: ProductService,
        private calculateService: CalculateQuotationService,
        private tariffService: TariffService,
        private toastr: ToastrService,
        private activatedRoute: ActivatedRoute,
        private discountService: DiscountService,
        private quotationService: QuotationService
    ) {
        this.createQuotation = this.formCreateQuotataion();
        this.updateLink = this.formLinksQuotation();
    }
    formCreateQuotataion() {
        return this.formBuilder.group({
            /* required for creating quotation */
            name: ['', Validators.required],
            description: ['', Validators.required],
            price: ['', Validators.required],
            quantity: ['', Validators.required],
            urlImage: ['', Validators.required],/* pending */
            codeCategory: ['', Validators.required],
            codeSubcategory: ['', Validators.required],
            typeWeight: ['', Validators.required],
            tariff: [''],
            shipping: ['', Validators.required],
            individualPoliceValue: [0, Validators.required],
            taxPayment: [0, Validators.required],
            applyDiscount: ['', Validators.required],
            codeDiscount: [''],
            deliveryGuy: ['', Validators.required],
            deliveryTime: ['', Validators.required],
            /* weight */
            pounds: ['', Validators.required],
            tall: [0],
            width: [0],
            long: [0],
            /* weight */
            /* changes */
            surchargeOne: [0],
            descriptionOne: [''],
            surchargeTwo: [0],
            descriptionTwo: [''],
            /* changes */

            codeProvider: ['', Validators.required],
            placeOfDelivery: ['', Validators.required],/* Lugar de entrega */
            cardCharge: ['', Validators.required], /* recargo de tarjeta */
            codeProductQuote: [''], /* asignacion de forma manual */
            subTotal: [''],
            tax: ['', Validators.required]
        });
    }

    formLinksQuotation() {
        return this.formBuilder.group({
            link: ['', Validators.required],
            commentary: ['', Validators.required]
        })
    }

    /* GET ALL METHOD REQUIRED FOR CREATION QUOTATION */
    getAllCategory() {
        this.categoryService.getCategory(1).subscribe(category => {
            this.category = category;
        }, error => {
            let messageError: any = error.error;
            this.toastr.error(messageError.error, 'Error category', {
                timeOut: 5000
            })
        })
    }

    getSubcategoryPerCategory(code) {
        this.subcategoryService.getSubcategoryPerCategory(code).subscribe(subcategory => {
            this.subcategory = subcategory;
        }, error => {
            let messageError: any = error.error;
            this.toastr.error(messageError.error, 'Error subcategory', {
                timeOut: 5000
            })
        })
    }

    getAllProvider() {
        this.providerService.getAllProvider().subscribe(provider => {
            let providers: any = provider;
            this.provider = providers.rows;
        }, error => {
            {
                let messageError: any = error.error;
                this.toastr.error(messageError.error, 'Error provider', {
                    timeOut: 5000
                })
            }
        })
    }

    getSettings() {
        this.settingsService.getAllSettings().subscribe(settings => {
            this.settings = settings;
        }, error => {
            let messageError: any = error.error;
            this.toastr.error(messageError.error, 'Error provider', {
                timeOut: 5000
            })
        })
    }

    getTariff(code) {
        this.tariffService.getTariff(code).subscribe(tariff => {
            let tariffs: any = tariff;
            this.tariff = tariffs.tariff;
            this.createQuotation.patchValue({
                tariff: tariffs.tariff.porcentage
            })
        }, error => {
            let messageError: any = error.error;
            this.toastr.error(messageError.error, 'Error provider', {
                timeOut: 5000
            })
        })
    }

    createNewQuotation(event: Event) {
        event.preventDefault();
        if (this.createQuotation.valid) {
            let calcProvider = this.provider.filter(p => (p.code == this.createQuotation.value.codeProvider))
            let discount: any = [];
            if (this.createQuotation.value.applyDiscount == 1) {
                discount = this.iDiscount.filter(d => (d.code == this.createQuotation.value.codeDiscount))
            }

            this.calculateService.calculateQuotation(this.createQuotation.value, calcProvider[0], this.settings, discount).then(quotation => {
                let quotations: any = quotation;
                this.createQuotation.patchValue({
                    subTotal: quotations.total,
                    codeProductQuote: this.codeProduct
                })
                Swal.fire({
                    title: 'Cotización finalizada',
                    html: `
                    <table>
                        <thead>
                            <tr>
                                <th>Descripción</th>
                                <th> </th>
                                <th>Cantidad</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <th style="text-align: left;">PESO</th>
                                <td>Libras</td>
                                <td style="text-align: right;"> ${quotations.pounds}</td>
                            </tr>
                            <tr>
                                <th style="text-align: left;">Valor FOB</th>
                                <td>$.</td>
                                <td style="text-align: right;">${currencyFormatter.format(quotations.valueFob, { decimal: '.', thousand: ',', precision: 2 })} </td>
                            </tr>
                            <tr>
                                <th style="text-align: left;">Valor CIF</th>
                                <td>$.</td>
                                <td style="text-align: right;" >${currencyFormatter.format(quotations.valueCif, { decimal: '.', thousand: ',', precision: 2 })} </td>
                            </tr>
                            <tr>
                                <th style="text-align: left;">Impuestos</th>
                                <td>$.</td>
                                <td style="text-align: right;">${currencyFormatter.format(quotations.tax, { decimal: '.', thousand: ',', precision: 2 })} </td>
                            </tr>

                            <tr>
                                <th style="text-align: left;">Flete</th>
                                <td>$.</td>
                                <td style="text-align: right;">${currencyFormatter.format(quotations.flete, { decimal: '.', thousand: ',', precision: 2 })} </td>
                            </tr>
                            
                            <tr>
                                <th style="text-align: left;">Costo variable</th>
                                <td>$.</td>
                                <td style="text-align: right;">${currencyFormatter.format(quotations.costoVariable, { decimal: '.', thousand: ',', precision: 2 })} </td>
                            </tr>

                            <tr>
                                <th style="text-align: left;">Costo fijo</th>
                                <td>$.</td>
                                <td style="text-align: right;">${currencyFormatter.format(quotations.envioGt, { decimal: '.', thousand: ',', precision: 2 })} </td>
                            </tr>

                            <tr>
                                <th style="text-align: left;">Costo adicional uno</th>
                                <td>$.</td>
                                <td style="text-align: right;">${currencyFormatter.format(quotations.chargeOne, { decimal: '.', thousand: ',', precision: 2 })} </td>
                            </tr>

                            <tr>
                                <th style="text-align: left;">Costo adicional dos</th>
                                <td>$.</td>
                                <td style="text-align: right;">${currencyFormatter.format(quotations.chargeTwo, { decimal: '.', thousand: ',', precision: 2 })} </td>
                            </tr>

                            <tr>
                                <th style="text-align: left;">Total</th>
                                <td>Q.</td>
                                <td style="text-align: right;">${currencyFormatter.format(quotations.total, { decimal: '.', thousand: ',', precision: 2 })} </td>
                            </tr>
                        </tbody>
                    </table>
            <br><br>
            `,
                    showCancelButton: true,
                    confirmButtonText: `Guardar cotizacion`,
                    cancelButtonColor: '#d33',
                    cancelButtonText: 'Cancelar'
                }).then((result) => {
                    /* Read more about isConfirmed, isDenied below */
                    if (result.isConfirmed) {
                        this.createQuotation.patchValue({
                            pounds: quotations.pounds
                        })
                        this.createQuotation.value.pounds = quotations.pounds;
                        this.productService.postProduct(this.createQuotation.value, this.base64textString).subscribe(product => {
                            this.backClicked();
                            this.toastr.success('Cotización realizada correctamente...', 'Cotización', {
                                timeOut: 5000
                            })
                        }, error => {
                            let errors: any = error.error
                            this.toastr.error(errors.error, 'Error creating product', {
                                timeOut: 10000
                            })
                        })
                    }
                })
            }, error => {
                let errors: any = error.error;
                this.toastr.error(errors.error, 'Error creating product', {
                    timeOut: 10000
                })
            })
        } else {
            console.log(this.createQuotation.value)
            this.toastr.error('You must select all the fields in order to generate a quote....', 'Error creating quote', {
                timeOut: 10000
            })
        }
    }

    backClicked() {
        this._location.back();
    }

    onUploadChange(evt: any) {
        const file = evt.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = this.handleReaderLoaded.bind(this);
            reader.readAsBinaryString(file);
        }
    }

    handleReaderLoaded(e) {
        this.base64textString.push('data:image/png;base64,' + btoa(e.target.result));
    }

    getAllDiscount(application) {
        if (application == 1) {
            this.discountService.getDiscount(1).subscribe(res => {
                this.iDiscount = res;
            }, error => {
                console.log(error)
            })
        }
    }

    updateLinks(event: Event) {
        event.preventDefault();
        if (this.updateLink.valid) {
            this.productService.updateProductQuotation(this.codeProduct, this.updateLink.value).subscribe(res => {
                let proeorder: any = res;
                this.toastr.success(proeorder.preorder, 'updated product quotation', { timeOut: 5000 })
            }, error => {
                let errors: any = error.error;
                this.toastr.error(errors.error, 'Error updated quotation product.', { timeOut: 10000 })
            })
        } else {
            this.toastr.error('You must enter all the fields', 'Error updated quotation product.', { timeOut: 10000 })
        }
    }
    getLinks(code) {
        this.quotationService.getLinks(code).subscribe(res => {
            let l: any = res;
            this.updateLink.patchValue({
                link: l.link,
                commentary: l.commentary
            })
        }, error => {
            let erros: any = error.error;
            this.toastr.error(erros.error, 'Error getting links', { timeOut: 10000 })
        })
    }

    ngOnInit(): void {
        this.getAllCategory();
        this.getAllProvider();
        this.getSettings();
        this.activatedRoute.params.subscribe(data => {
            this.codeProduct = data.code;
            this.getLinks(data.code);
        }, error => {
            let errors: any = error.error;
            this.toastr.error(errors.error, 'Error creating product', {
                timeOut: 10000
            })
        })
    }



}
