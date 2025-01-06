import { Component, OnInit } from "@angular/core";
import { ProviderI } from "../../../models/provider.interface";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { ProviderService } from '../../../services/provider/provider.service';
import { ToastrService } from 'ngx-toastr';



@Component({
    selector: "app-new-provider",
    templateUrl: "./new-provider.component.html",
    styleUrls: ["./new-provider.component.css"],
})
export class NewProviderComponent implements OnInit {
    public Iprovider: ProviderI;
    public createProvider: FormGroup; /* create form group  */
    public errorValid: boolean = false;
    public message: object = {};
    constructor(private formBuilder: FormBuilder, private providerService: ProviderService,
        private router: Router, private toastrService: ToastrService) {
        this.createProvider = this.formCreateProvider();
    }

    formCreateProvider() {
        return this.formBuilder.group({
            name: ["", [Validators.required]],
            priceWeight: ["", [Validators.required, Validators.min(0)]],
            weightLimit: ["", [Validators.required, Validators.min(0)]],
            safe: ["", [Validators.required, Validators.min(0), Validators.max(100)]],
            customClearence: ["", [Validators.required, Validators.min(0)]],
        });
    }
    /* clear form */
    onResetForm() {
        this.createProvider.reset();
    }

    createNewProvider(event: Event) {
        this.errorValid = false;
        event.preventDefault();
        if (this.createProvider.valid) {
            this.providerService.postProvider(this.createProvider.value).subscribe(provider => {
                let providers: any = provider;
                this.toastrService.success(providers.provider, "Succes provider", {
                    timeOut: 5000
                })
                this.backClicked();
                this.backClicked();
            }, error => {
                this.errorValid = true;
                this.message = error.error;
            })
        } else {
            this.errorValid = true;
            this.message = { error: 'Debe de llenar los campos necesarios para crear un nuevo proveedor...' }
        }
    }
    /* exit from create or update provider */
    backClicked() {
        this.router.navigate(['/provider'])
    }

    ngOnInit(): void {
    }
}
