import { Component, OnInit } from '@angular/core';
import { CreateQuotationI } from "../../../models/create-quotation.interface";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Location } from "@angular/common";

/* services */
import { CategoryService } from '../../../services/category/category.service';
import { SubcategoryService } from '../../../services/subcategory/subcategory.service';
import { ProviderService } from '../../../services/provider/provider.service';
import { SettingsService } from '../../../services/settings/settings.service';
import { ProductService } from '../../../services/product/product.service';
import { TariffService } from '../../../services/tariff/tariff.service';
import { CalculateQuotationService } from '../../../services/calculate-quotation/calculate-quotation.service';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2'
import { ActivatedRoute } from '@angular/router';
import { DiscountService } from '../../../services/discount/discount.service';
import { DiscountI } from '../../../models/discount.interface';
import currencyFormatter from 'currency-formatter';


@Component({
    selector: 'app-update-quotation',
    templateUrl: './update-quotation.component.html',
    styleUrls: ['./update-quotation.component.css']
})
export class UpdateQuotationComponent implements OnInit {
    private base64textString = [];
    public category: any;
    public subcategory: any;
    public provider: any;
    public settings: any;
    public tariff: any;
    public image: string = '';
    public ICreateQuotation: CreateQuotationI;
    public updateQuotation: FormGroup; /* create form group  */
    public updateLink: FormGroup; /* create form group  */
    public quotationFinal: object = {}
    public codeProduct: number = 0;
    public codeProductQuote: number = 0;
    public codeUpdateProduct: number = 0;
    public iDiscount: Array<DiscountI>

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
        private discountService: DiscountService) {
        this.updateQuotation = this.formUpdateQuotataion();
        this.updateLink = this.formLinksQuotation();
    }

    ngOnInit(): void {
        this.activatedRoute.params.subscribe(data => {
            this.codeProduct = data.code;
            this.getProduct(this.codeProduct)
        }, error => {
            let errors: any = error.error;
            this.toastr.error(errors.error, 'Error creating product', {
                timeOut: 10000
            })
        })
    }

    formUpdateQuotataion() {
        return this.formBuilder.group({
            /* required for creating quotation */
            name: ['', Validators.required],
            description: ['', Validators.required],
            price: ['', Validators.required],
            quantity: ['', Validators.required],
            urlImage: [''],/* pending */
            codeCategory: ['', Validators.required],
            codeSubcategory: ['', Validators.required],
            typeWeight: [0, Validators.required],
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
            tall: [''],
            width: [''],
            long: [''],
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
        this.updateQuotation.patchValue({
            codeSubcategory: '',
            tariff: ''
        })
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
            this.updateQuotation.patchValue({
                tariff: tariffs.tariff.porcentage
            })
        }, error => {
            let messageError: any = error.error;
            this.toastr.error(messageError.error, 'Error provider', {
                timeOut: 5000
            })
        })
    }

    getProduct(code) {
        this.productService.getProduct(code).subscribe(product => {
            let products: any = product;
            this.codeUpdateProduct = products.code;
            this.getAllCategory();
            this.getSubcategoryPerCategory(products.codeCategory);
            this.getTariff(products.codeSubcategory);
            this.getAllProvider();
            this.getSettings();
            this.image = `http://localhost:3000/${products.urlImage}`;
            this.getAllDiscount(products.applyDiscount);
            this.codeProductQuote = products.productQuote.code;
            this.updateLink.patchValue({
                link: products.productQuote.link,
                commentary: products.productQuote.commentary,
            })
            this.updateQuotation.patchValue({
                /* required for creating quotation */
                name: products.name,
                description: products.description,
                price: products.price,
                quantity: products.quantity,
                codeCategory: products.codeCategory,
                codeSubcategory: products.codeSubcategory,
                typeWeight: products.typeWeight,
                shipping: products.shipping,
                individualPoliceValue: products.individualPoliceValue,
                taxPayment: products.taxPayment,
                applyDiscount: products.applyDiscount,
                codeDiscount: products.codeDiscount,
                deliveryGuy: products.deliveryGuy,
                deliveryTime: products.deliveryTime,
                /* weight */
                pounds: products.weight.pounds,
                tall: products.weight.tall,
                width: products.weight.width,
                long: products.weight.long,
                /* weight */
                surchargeOne: products.surchargeOne,
                descriptionOne: products.descriptionOne,
                surchargeTwo: products.surchargeTwo,
                descriptionTwo: products.descriptionTwo,

                codeProvider: products.codeProvider,
                placeOfDelivery: products.placeOfDelivery,/* Lugar de entrega */
                cardCharge: products.cardCharge, /* recargo de tarjeta */
                codeProductQuote: products.codeProductQuote, /* asignacion de forma manual */
                subTotal: products.subTotal,
                tax: products.tax
            })
        }, error => {
            let errors: any = error.error;
            this.toastr.error(errors.error, 'Error creating product', {
                timeOut: 10000
            })
        })
    }

    updateQuotationTotal(event: Event) {
        event.preventDefault();
        if (this.updateQuotation.valid) {
            let discount: any = [];
            let calcProvider = this.provider.filter(p => (p.code == this.updateQuotation.value.codeProvider))
            if (this.updateQuotation.value.applyDiscount == 1)
                discount = this.iDiscount.filter(d => (d.code == this.updateQuotation.value.codeDiscount))
            if ((this.updateQuotation.value.applyDiscount == 1 && discount.length > 0) || calcProvider.length > 0) {
                this.calculateService.calculateQuotation(this.updateQuotation.value, calcProvider[0], this.settings, discount).then(quotation => {
                    let quotations: any = quotation;
                    this.updateQuotation.patchValue({
                        subTotal: quotations.total,
                    })
                    console.log(quotations)
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
                            this.updateQuotation.patchValue({
                                pounds: quotations.pounds
                            })
                            this.productService.updateProduct(this.codeUpdateProduct, this.updateQuotation.value, this.base64textString).subscribe(res => {
                                this.backClicked();
                                this.toastr.success('Cotización actualizada correctamente', 'Actualizar cotización', {
                                    timeOut: 10000
                                })
                            }, error => {
                                let errors: any = error.error;
                                this.toastr.error(errors.error, 'Error creating product', {
                                    timeOut: 10000
                                })
                            })
                        }
                    })
                }).catch(error => {
                    let errors: any = error.error;
                    this.toastr.error(errors.error, 'Error creating product', {
                        timeOut: 10000
                    })
                })
            } else {
                if (discount.length === 0)
                    this.toastr.error('You must select a discount...', 'Error creating product', { timeOut: 10000 })
                if (calcProvider.length === 0)
                    this.toastr.error('You must select a provider...', 'Error creating product', { timeOut: 10000 })
            }

        } else {
            this.toastr.error('You must enter all the fields', 'Error creating product', {
                timeOut: 10000
            })
        }
    }

    updateLinks(event: Event) {
        if (this.updateLink.valid) {
            this.productService.updateProductQuotation(this.codeProductQuote, this.updateLink.value).subscribe(res => {
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
                let errors = error.error;
                this.toastr.error(errors.error, 'Error get discount', { timeOut: 10000 })
            })
        }
    }


}
