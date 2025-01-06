import { Component, OnInit } from '@angular/core';
import { ProviderI } from "../../../models/provider.interface";
import { FormBuilder, FormGroup, Validators, FormControl } from "@angular/forms";
import { Router } from '@angular/router'
import { ProviderService } from '../../../services/provider/provider.service';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'app-update-provider',
    templateUrl: './update-provider.component.html',
    styleUrls: ['./update-provider.component.css']
})
export class UpdateProviderComponent implements OnInit {
    codeProvider = 0;
    Iprovider: ProviderI;
    public updateProvider: FormGroup; /* create form group  */
    public errorValid: boolean = false;
    public message: object = {};
    constructor(private formBuilder: FormBuilder, private providerService: ProviderService,
        private activateRoute: ActivatedRoute, private router: Router, private toastrService: ToastrService) {
        this.updateProvider = formBuilder.group({
            name: ["", [Validators.required]],
            priceWeight: ["", [Validators.required, Validators.min(0)]],
            weightLimit: ["", [Validators.required, Validators.min(0)]],
            safe: ["", [Validators.required, Validators.min(0), Validators.max(100)]],
            customClearence: ["", [Validators.required, Validators.min(0)]],
        });
    }
    ngOnInit(): void {
        this.activateRoute.params.subscribe(data => {
            this.codeProvider = parseInt(data.code);
            this.providerService.getProvider(this.codeProvider).subscribe(provider => {
                this.Iprovider = provider;
                this.updateProvider.patchValue({
                    name: this.Iprovider.name,
                    priceWeight: this.Iprovider.priceWeight,
                    weightLimit: this.Iprovider.weightLimit,
                    safe: this.Iprovider.safe,
                    customClearence: this.Iprovider.customClearence,
                })
            })
        }, error => {
            this.errorValid = true;
            this.message = error.error;
        })
    }

    /* clear form */
    onResetForm() {
        this.updateProvider.reset();
    }

    updateProviders(event: Event) {
        event.preventDefault();
        if (this.updateProvider.valid) {
            this.providerService.updateProvider(this.codeProvider, this.updateProvider.value).subscribe((provider) => {
                let providers: any = provider;
                this.toastrService.success(providers.provider, "Succes provider", {
                    timeOut: 5000
                })
                this.backClicked();
            }, error => {
                let errors: any = error.error;
                this.toastrService.success(errors.error, "Error update provider", {
                    timeOut: 5000
                })
            })
        } else {
            this.errorValid = true;
            this.message = { error: 'Debe de llenar los campos necesarios para actualizar el proveedor...' }
        }
    }
    /* exit from create or update provider */
    backClicked() {
        this.router.navigate(['/provider'])
    }

    getProvider(code) {

    }

}
