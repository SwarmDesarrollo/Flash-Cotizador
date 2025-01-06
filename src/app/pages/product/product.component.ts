import { Component, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { CategoryService } from '../../services/category/category.service';
import { SubcategoryService } from '../../services/subcategory/subcategory.service';
import { CategoryI, CategorysI } from '../../models/category.interface';
import { SubcategoryI, SubcategorysI } from '../../models/subcategory.interface';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2'
import { DataTableDirective } from 'angular-datatables';
import * as $ from 'jquery';
@Component({
    selector: "app-product",
    templateUrl: "./product.component.html",
    styleUrls: ["./product.component.css"],
})
export class ProductComponent implements OnDestroy, OnInit {
    @ViewChild(DataTableDirective) dtElement: DataTableDirective;
    public iCategory: Array<CategoryI>;
    public iCategorys: CategorysI
    public iSubcategory: Array<SubcategoryI>;
    public iSubcategorys: SubcategorysI;
    public closeResult: string;
    public createNewCategory: FormGroup;
    public updateCategory: FormGroup;
    public updateSubcategory: FormGroup;
    public createNewSubcategory: FormGroup;
    public errorState: boolean = false;
    public message: object = {};
    public codeCategory: number = 0;
    public codeSubcategory: number = 0;
    public pageActualCategory: number = 1;
    public pageActual: number = 1;
    constructor(private modalService: NgbModal, private formBuilder: FormBuilder, private categoryService: CategoryService, private subcategoryService: SubcategoryService, private toastr: ToastrService) {
        this.createNewCategory = this.createFormCategory();
        this.updateCategory = this.updateFormCategory();
        this.createNewSubcategory = this.createFormSubcategory();
        this.updateSubcategory = this.updateFormSubcategory();
    }

    ngOnInit(): void {
        this.getAllCategory();
        this.getAllSubcategory();
    }

    ngOnDestroy(): void {
        // Do not forget to unsubscribe the event
    }
    createFormCategory() {
        return this.formBuilder.group({
            name: ["", Validators.required],
        });
    }
    updateFormCategory() {
        return this.formBuilder.group({
            name: ["", Validators.required],
            state: [0, Validators.required],
        });
    }

    createFormSubcategory() {
        return this.formBuilder.group({
            codeCategory: ["", Validators.required],
            name: ["", Validators.required],
        });
    }

    updateFormSubcategory() {
        return this.formBuilder.group({
            codeCategory: ["", Validators.required],
            name: ["", Validators.required],
            state: [0, Validators.required],
        });
    }

    /* manager modals */
    open(content, id) {
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
    /* end maganer modals */

    /* init CRUD FROM categorys */
    getAllCategory() {
        this.errorState = false;
        this.categoryService.getAllCategory().subscribe(category => {
            this.iCategorys = category;
            if (this.iCategorys.count > 0) {
                this.iCategory = this.iCategorys.rows;
                $(document).ready(function () {
                    $('#category').DataTable({
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
                        data: this.iCategory
                    });
                });
            } else {
                this.iCategory = null;
            }
        }, error => {
            this.errorState = true;
            this.message = error.error
        })
    }

    saveNewCategory(event: Event) {
        event.preventDefault()
        this.errorState = false;
        if (this.createNewCategory.valid) {
            this.categoryService.postCategory(this.createNewCategory.value).subscribe((categorys) => {
                let category: any;
                category = categorys;
                this.toastr.success(category.category, 'New category!', {
                    timeOut: 5000
                });
                this.getDismissReason('Close click');
                $(document).ready(function () { $('#category').DataTable().destroy(); })
                this.getAllCategory();
                this.createNewCategory.reset();
            }, error => {
                this.errorState = true;
                this.message = error.error
            })
        } else {
            this.errorState = true;
            this.message = { error: 'Debe de ingresar un nombre para crear la categoria' }
        }
    }
    getCategory(code) {
        let category = this.iCategory.filter(c => (c.code == code))
        this.codeCategory = code;
        if (category.length > 0)
            this.updateCategory.setValue({
                name: category[0].name,
                state: category[0].state
            });
    }

    updateCategorys() {

        this.errorState = false;
        if (this.updateCategory.valid) {
            this.categoryService.updateCategory(this.codeCategory, this.updateCategory.value).subscribe((categorys) => {
                let category: any;
                category = categorys;
                this.toastr.success(category.category, 'Update category!', {
                    timeOut: 5000
                });
                this.getDismissReason('Close click');
                $(document).ready(function () { $('#category').DataTable().destroy(); })
                this.getAllCategory();
                this.updateCategory.reset();
            }, error => {
                this.errorState = true;
                this.message = error.error
            })
        } else {
            this.errorState = true;
            this.message = { error: 'Debe de ingresar los campos para modificar la categoria...' }
        }
    }


    deleteCategory(code) {
        Swal.fire({
            title: 'Esta seguro de eliminar esta categoria?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Eliminar'
        }).then((result) => {
            if (result.isConfirmed) {
                this.categoryService.deleteCategory(code).subscribe(category => {
                    this.getAllCategory();
                    let categorys: any = category;
                    this.toastr.success(`${categorys.category}`, 'Delete category successfully')
                }, error => {
                    this.toastr.success(`${error.error}`, 'Delete category successfully')
                })
            }
        })
    }
    /* end cotegory CRUD */


    /* init subcategory CRUD */
    getAllSubcategory() {
        this.errorState = false;
        this.subcategoryService.getAllSubcategory().subscribe(subcategory => {
            this.iSubcategorys = subcategory;
            if (this.iSubcategorys.count > 0) {
                this.iSubcategory = this.iSubcategorys.rows
                $(document).ready(function () {
                    $('#subcategory').DataTable({
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
                        data: this.iSubcategory
                    })
                });
            } else {
                this.iSubcategory = null;
            }
        }, error => {
            this.errorState = true;
            this.message = error.error
        })
    }

    getSubcategory(code) {
        let subcategory = this.iSubcategory.filter(sc => (sc.code == code))
        this.codeSubcategory = code;
        if (subcategory.length > 0)
            this.updateSubcategory.setValue({
                codeCategory: subcategory[0].codeCategory,
                name: subcategory[0].name,
                state: subcategory[0].state
            })
    }

    saveNewSubcategory(event: Event) {
        this.errorState = false;
        event.preventDefault()
        if (this.createNewSubcategory.valid) {
            this.subcategoryService.postSubcategory(this.createNewSubcategory.value).subscribe((Subcategorys) => {
                let category: any;
                category = Subcategorys;
                this.toastr.success(category.subcategory, 'New subcategory!', {
                    timeOut: 5000
                });
                this.getDismissReason('Close click');
                $(document).ready(function () { $('#subcategory').DataTable().destroy(); })
                this.getAllSubcategory();
                this.createNewSubcategory.reset();
            }, error => {
                this.errorState = true;
                this.message = error.error
            })
        } else {
            this.errorState = true;
            this.message = { error: 'Debe de ingresar los items para crear una nueva subcategoria..' }
        }
    }

    updatingSubcategory(event: Event) {
        this.errorState = false;
        event.preventDefault();
        if (this.updateSubcategory.valid) {
            this.subcategoryService.updateSubcategory(this.codeSubcategory, this.updateSubcategory.value).subscribe(subcategorys => {
                let category: any;
                category = subcategorys;
                this.toastr.success(category.subcategory, 'New subcategory!', {
                    timeOut: 5000
                });
                this.getDismissReason('Close click');
                $(document).ready(function () { $('#subcategory').DataTable().destroy(); })
                this.getAllSubcategory();
                this.updateSubcategory.reset();

            }, error => {
                this.errorState = true;
                this.message = error.error
            })
        } else {
            this.errorState = true;
            this.message = { error: 'Debe de ingresar los items para crear una nueva subcategoria..' }
        }
    }

    deleteSubcategory(code) {
        Swal.fire({
            title: 'Esta seguro de eliminar esta subcategoria?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Eliminar'
        }).then((result) => {
            if (result.isConfirmed) {
                this.subcategoryService.deleteSubcategory(code).subscribe(subcategory => {
                    this.getAllSubcategory();
                    let subcategorys: any = subcategory;
                    this.toastr.success(`${subcategorys.subcategory}`, 'Delete subcategory successfully')
                }, error => {
                    this.toastr.success(`${error.error}`, 'Delete subcategory successfully')
                })
            }
        })
    }

}
