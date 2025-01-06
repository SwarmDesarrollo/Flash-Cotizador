import { Inject, Component, OnInit, OnDestroy } from "@angular/core";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { TariffService } from '../../services/tariff/tariff.service';
import { CategoryService } from '../../services/category/category.service';
import { SubcategoryService } from '../../services/subcategory/subcategory.service';
import { TariffI, TariffsI } from '../../models/tariff.interface';
import { CategoryI, CategorysI } from '../../models/category.interface';
import { SubcategoryI, SubcategorysI } from '../../models/subcategory.interface';
import { ToastrService } from 'ngx-toastr';

declare var $;

@Component({
    selector: "app-tariff",
    templateUrl: "./tariff.component.html",
    styleUrls: ["./tariff.component.css"],
})
export class TariffComponent implements OnInit, OnDestroy {
    public iTariff: Array<TariffI>;
    public iTariffs: TariffsI;
    public iCategory: Array<CategoryI>;
    public iCategorys: CategorysI;
    public iSubcategory: Array<SubcategoryI>
    public iSubCategorys: SubcategorysI;


    public tariff: FormGroup; /* create form group  */
    public updateTariff: FormGroup;
    public errorState: boolean = false;
    public message: object = {}

    public codeTariff: number = 0;
    pageActual: number = 1;

    closeResult: string;

    constructor(
        private formBuilder: FormBuilder,
        private modalService: NgbModal,
        private tariffService: TariffService,
        private categoryService: CategoryService,
        private subcategoryService: SubcategoryService,
        private toast: ToastrService
    ) {
        this.tariff = this.createFormTariff();
        this.updateTariff = this.updateFormTariff();
    }

    ngOnInit(): void {
        this.getAllTariff();
        this.getAllCategory();
    }

    ngOnDestroy(): void {
        // Do not forget to unsubscribe the event
    }

    createFormTariff() {
        return this.formBuilder.group({
            codeCategory: ["", Validators.required],
            codeSubcategory: ["", Validators.required],
            porcentage: ["", [Validators.required, Validators.min(0), Validators.max(100)]],
        });
    }

    updateFormTariff() {
        return this.formBuilder.group({
            codeCategory: ["", Validators.required],
            codeSubcategory: ["", Validators.required],
            porcentage: ["", [Validators.required, Validators.min(0), Validators.max(100)]],
        });
    }

    open(content, id) {
        this.tariff.patchValue({
            codeCategory: '',
            codeSubcategory: '',
            porcentage: '',
        });
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


    private getDismissReason(reason: any) {
        this.modalService.dismissAll(reason);
    }

    /* clear form */
    onResetForm() {
        this.tariff.reset();
    }

    /* Get all category */
    getAllCategory() {
        this.categoryService.getAllCategory().subscribe(category => {
            this.iCategorys = category;
            this.iCategory = this.iCategorys.rows;
        })
    }

    /* Get all subcategory */
    getAllSubcategory(code) {
        console.log(code)
        this.subcategoryService.getSubcategoryPerCategoryAssigment(code).subscribe(subcategory => {
            this.iSubcategory = subcategory;
        }, error => {
            console.log(error)
        })
    }
    /* function for manager CRUD */
    getAllTariff() {
        this.tariffService.getAllTariff().subscribe(tariff => {
            this.iTariffs = tariff;
            if (this.iTariffs.tariff.count > 0) {
                this.iTariff = this.iTariffs.tariff.rows
                $(document).ready(function () {
                    $('#tariff').DataTable({
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
                      data: this.iTariff
                    });
                  });
            } else {
                this.iTariff = [];
            }
        }, error => {
            this.errorState = true;
            this.message = error.error
        })
    }

    getTariff(codeTariff) {
        this.codeTariff = codeTariff;
        let tariff = this.iTariff.filter(t => (t.code == codeTariff))
        this.getAllSubcategory(tariff[0].codeCategory);

        if (tariff.length > 0) {
            this.updateTariff.setValue({
                codeCategory: tariff[0].codeCategory,
                codeSubcategory: tariff[0].codeSubcategory,
                porcentage: tariff[0].porcentage,
            })
        }



    }

    createTariff(event: Event) {
        this.errorState = false;
        event.preventDefault();
        if (this.tariff.valid) {
            this.tariffService.postTariff(this.tariff.value).subscribe(tariff => {
                let tariffs: any = tariff;
                this.toast.success(`${tariffs.tariff}`, 'Create new tariff', { timeOut: 5000 })
                this.getDismissReason('Close click');
                $(document).ready(function () { $('#tariff').DataTable().destroy(); })
                this.getAllTariff();
                this.tariff.reset();
            }, error => {
                this.errorState = true;
                this.message = error.error
            })
        } else {

            this.errorState = true;
            this.message = { error: 'Debe de ingresar todos los campos para crear un nuevo arancel...' }

        }
    }

    updateFormsTariff(event: Event) {
        this.errorState = false;
        event.preventDefault
        if (this.updateTariff.valid) {
            this.tariffService.updateTariff(this.codeTariff, this.updateTariff.value).subscribe(tariff => {
                let tariffs: any = tariff;
                this.toast.success(`${tariffs.tariff}`, 'Update tariff', { timeOut: 5000 })
                $(document).ready(function () { $('#tariff').DataTable().destroy(); })
                this.getDismissReason('Close click');
                this.getAllTariff();
                this.updateTariff.reset();
            }, error => {
                this.errorState = true;
                this.message = error.error
            })
        } else {
            this.errorState = true;
            this.message = { error: 'Debe de ingresar todos los campos para crear un nuevo arancel...' }
        }
    }


}
