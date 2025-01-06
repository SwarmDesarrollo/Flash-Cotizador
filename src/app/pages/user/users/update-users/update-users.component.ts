import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from "@angular/forms";
import { Router } from '@angular/router'
import { TypeUsersService } from '../../../../services/type-users/type-users.service';
import { TypeUserI } from '../../../../models/type-users.inteface';
import { UsersService } from '../../../../services/users/users.service';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'app-update-users',
    templateUrl: './update-users.component.html',
    styleUrls: ['./update-users.component.css']
})
export class UpdateUsersComponent implements OnInit {

    public fUser: FormGroup;
    public codeUser: number = 0;
    public typeUsers: Array<TypeUserI>

    constructor(
        private router: Router,
        private typeUserService: TypeUsersService,
        private userService: UsersService,
        private activateRoute: ActivatedRoute,
        private toast: ToastrService,
        private formBuilder: FormBuilder) {
        this.fUser = this.formUpdateUsers();
    }

    ngOnInit(): void {
        this.activateRoute.params.subscribe(data => {
            this.codeUser = data.code;
            this.getUserUpdate(data.code);
        })

        this.getTypeUsers();
    }

    formUpdateUsers() {
        return this.formBuilder.group({
            name: ['', Validators.required],
            direction: ['', Validators.required],
            phone: ['', Validators.required],
            username: ['', Validators.required],
            password: [''],
            email: ['', Validators.required],
            state: ['', Validators.required],
            codeTypeUser: ['', Validators.required],
        })
    }


    getUserUpdate(code) {
        this.userService.getUser(code).subscribe(res => {
            this.fUser.patchValue({
                name: res.name,
                direction: res.direction,
                phone: res.phone,
                username: res.username,
                email: res.email,
                state: res.state,
                codeTypeUser: res.codeTypeUser
            })
        })
    }

    getTypeUsers() {
        this.typeUserService.getTypeUser(1).subscribe(res => {
            this.typeUsers = res;
        })
    }

    updateUsers(event: Event) {
        event.preventDefault();
        if (this.fUser.valid) {
            if (this.fUser.value.password === '')
                delete this.fUser.value.password;

            this.userService.updateUser(this.codeUser, this.fUser.value).subscribe(res => {
                let u: any = res;
                this.toast.success(u.user, 'Users', { timeOut: 5000 })
                this.fUser.reset();
                this.thisBack();
            }, error => {
                let errors: any = error.error;
                this.toast.error(errors.error, 'Error users', {
                    timeOut: 15000
                })
            })
        } else {
            this.toast.error('You must complete all the fields to update a new user...', 'Users', {
                timeOut: 15000
            })
        }
    }

    thisBack() {
        this.router.navigate(['/list-users'])
    }

}
