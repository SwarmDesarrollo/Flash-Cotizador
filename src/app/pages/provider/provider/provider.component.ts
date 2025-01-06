import { Component, OnInit, Inject } from "@angular/core";
import { ProviderService } from '../../../services/provider/provider.service'
import { ProviderI, ProvidersI } from '../../../models/provider.interface';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';

import { Router } from '@angular/router';
@Component({
    selector: "app-provider",
    templateUrl: "./provider.component.html",
    styleUrls: ["./provider.component.css"],
})
export class ProviderComponent implements OnInit {
    public providerI: Array<ProviderI>;
    public providersI: ProvidersI;
    public errorLoad: boolean = false
    public message: string = ''
    constructor(@Inject(ProviderService) private providerService: ProviderService, private router: Router, private toastrService: ToastrService) { }

    ngOnInit(): void {
        this.getAllProvider();
    }

    getAllProvider() {
        this.providerService.getAllProvider().subscribe(provider => {
            this.providersI = provider;
            if (this.providersI.count > 0) {
                this.providerI = this.providersI.rows;
            } else {
                this.providerI = null;
            }
        }, error => {
            this.errorLoad = true
            this.message = error.error
        })
    }

    clickMethod(name: string, code) {
        Swal.fire({
            title: '¿Esta seguro de eliminar este proveedor?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Eliminar'
        }).then((result) => {
            if (result.isConfirmed) {
                this.providerService.deleteProvider(code).subscribe(provider => {
                    this.getAllProvider();
                    let providers: any = provider;
                    this.toastrService.success(providers, 'Delete success', {
                        timeOut: 5000
                    })
                }, error => {
                    let errors: any = error.error
                    this.toastrService.error(errors.error, 'Error deleting provider', {
                        timeOut: 5000
                    })
                })
            }
        })
    }
}
