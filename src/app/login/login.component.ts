import { Component, OnInit, OnDestroy } from "@angular/core";
import { FormGroup, Validators, FormBuilder } from "@angular/forms";
import { Router } from '@angular/router';
import { AuthService } from "../services/auth/auth.service";

@Component({
    selector: "app-login",
    templateUrl: "./login.component.html",
    styleUrls: ["./login.component.scss"],
})

// export class LoginComponent implements OnInit, OnDestroy {
export class LoginComponent implements OnInit {
    login: FormGroup;
    errorLogin: boolean = false;
    message: Object = {};
    constructor(
        private authService: AuthService,
        private formBuilder: FormBuilder,
        private router: Router
    ) {
        this.buildForm();
    }
    ngOnInit() { }

    private buildForm() {
        this.login = this.formBuilder.group({
            username: ["", [Validators.required]],
            password: ["", [Validators.required]],
        });
    }

    signin(event: Event) {
        this.errorLogin = false;
        event.preventDefault();
        if (this.login.valid) {
            this.authService.signIn(this.login.value).subscribe(
                (user) => {
                    sessionStorage.setItem("validate", JSON.stringify(user));
                    this.router.navigate(['dashboard'])
                },
                (error) => {
                    this.errorLogin = true;
                    this.message = error.error;
                }
            );
        } else {
            this.errorLogin = true;
            this.message = { error: "* Debe de ingresar usuario y contraseña" };
        }
    }
}
