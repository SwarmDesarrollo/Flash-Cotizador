import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from '@angular/router';
import { TypeUserI } from '../../../../models/type-users.inteface';
import { TypeUsersService } from '../../../../services/type-users/type-users.service';
import { UsersService } from '../../../../services/users/users.service';

@Component({
    selector: 'app-create-users',
    templateUrl: './create-users.component.html',
    styleUrls: ['./create-users.component.css']
})
export class CreateUsersComponent implements OnInit {
    public fUsers: FormGroup;
    public typeUser: Array<TypeUserI>

    constructor(
        private toast: ToastrService,
        private formBuilder: FormBuilder,
        private router: Router,
        private typeUserService: TypeUsersService,
        private usersService: UsersService) {
        this.fUsers = this.formsUsers();
    }

    ngOnInit(): void {
        this.getAllTypeUsers();
    }

    formsUsers() {
        return this.formBuilder.group({
            name: ['', Validators.required],
            direction: ['', Validators.required],
            phone: ['', [Validators.required]],
            username: ['', Validators.required],
            password: ['', Validators.required],
            email: ['', [Validators.required, Validators.email]],
            codeTypeUser: ['', Validators.required],
        })
    }

    getAllTypeUsers() {
        this.typeUserService.getTypeUser(1).subscribe(res => { this.typeUser = res; })
    }



    postUsers(event: Event) {
        event.preventDefault();
        if (this.fUsers.valid) {
            this.usersService.postUser(this.fUsers.value).subscribe(res => {
                let u: any = res;
                this.toast.success(u.user, 'Users', { timeOut: 5000 })
                this.fUsers.reset();
                this.thisBack();
            }, error => {
                let errors: any = error.error;
                this.toast.error(errors.error, 'Error users', {
                    timeOut: 15000
                })
            })
        } else {
            this.toast.error('You must complete all the fields to create a new user...', 'Users', {
                timeOut: 15000
            })
        }
    }

    thisBack() {
        this.router.navigate(['/list-users'])
    }



}
