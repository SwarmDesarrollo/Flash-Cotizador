import { Component, OnInit } from '@angular/core';
import { UsersService } from '../../services/users/users.service';
import { UsersI } from '../../models/users.interface';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { isObject } from 'util';


@Component({
    selector: 'app-user-profile',
    templateUrl: './user-profile.component.html',
    styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {
    public iUsers: UsersI;
    public codeUsers: number = 0;
    public usersForms: FormGroup;
    public changePassword: FormGroup;
    public closeResult: string = '';
    public userData: {
      typeUser: string | null,
      idUser: string | null
    };
    constructor(private userService: UsersService, private toast: ToastrService, private formBuilder: FormBuilder, private modalService: NgbModal,) {
        this.usersForms = this.usersFormBuilder();
        this.changePassword = this.passwordChangeBuilder();
    }

    usersFormBuilder() {
        return this.formBuilder.group({
            username: ['', Validators.required],
            email: ['', Validators.required],
            name: ['', Validators.required],
            direction: ['', Validators.required],
            phone: ['', Validators.required]
        })
    }

    passwordChangeBuilder() {
        return this.formBuilder.group({
            passwordOld: ['', Validators.required],
            newPassword: ['', Validators.required],
            password: ['', Validators.required]
        })
    }
    ngOnInit() {
      const userData = JSON.parse(window.sessionStorage.getItem('validate') || '{}');
      this.userData = {
        typeUser: userData.typeUser,
        idUser: userData.code,
      }
        this.getUsers()
    }

    getUsers() {
        this.userService.getUser(this.userData.idUser).subscribe(res => {
            this.iUsers = res;
            this.codeUsers = this.iUsers.code;
            this.usersForms.patchValue({
                username: this.iUsers.username,
                email: this.iUsers.email,
                name: this.iUsers.name,
                direction: this.iUsers.direction,
                phone: this.iUsers.phone
            })
        }, error => {
            let errors: any = error.error;
            this.toast.error(`${errors.error}`, 'Error', { timeOut: 10000 })
        })
    }

    /* manager modals */
    open(content) {
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

    updateUsers(event: Event) {
        event.preventDefault();
        if (this.usersForms.valid) {
            this.userService.updateUser(this.codeUsers, this.usersForms.value).subscribe(res => {
                let u: any = res;
                this.toast.success(`${u.user}`, 'Changed users', { timeOut: 5000 });
                this.usersForms.reset();
                this.getUsers();
            }, error => {
                let errors: any = error.error;
                this.toast.error(errors.error, 'Error', { timeOut: 10000 })
            })
        } else {
            this.toast.error('Debe de completar todos los campos para poder modificar la información...', 'Error', { timeOut: 10000 })
        }
    }

    changeNewPasswords(event: Event) {
        event.preventDefault();
        if (this.changePassword.valid) {
            if (this.changePassword.value.newPassword === this.changePassword.value.password) {
                this.userService.changePassword(this.changePassword.value).subscribe(res => {
                    let u: any = res;
                    this.toast.success(`${u.users}`, 'Changed password', { timeOut: 5000 })
                    this.getDismissReason('Close click');
                    this.changePassword.reset();
                }, error => {
                    let errors: any = error;
                    this.toast.error(errors.error, 'Error', { timeOut: 10000 })
                })
            }
        } else {
            this.toast.error('Debe de completar todos campos para realizar el cambio de contraseña...', 'Error', { timeOut: 10000 })
        }
    }

}
