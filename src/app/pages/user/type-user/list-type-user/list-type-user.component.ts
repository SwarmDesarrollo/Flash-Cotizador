import { Component, OnInit } from '@angular/core';
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { TypeUserI } from '../../../../models/type-users.inteface';
import { TypeUsersService } from '../../../../services/type-users/type-users.service';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MenuService } from '../../../../services/menu/menu.service';
import { MenuI, AccessI } from '../../../../models/menu.interface';



@Component({
	selector: 'app-list-type-user',
	templateUrl: './list-type-user.component.html',
	styleUrls: ['./list-type-user.component.css']
})
export class ListTypeUserComponent implements OnInit {
	public fTuserCreate: FormGroup;
	public fTuserUpdate: FormGroup;
	public fNewAccess: FormGroup;
	public typeUser: Array<TypeUserI>
	public typeUserActive: Array<TypeUserI>
	public codeTypeUser: number = 0;
	public closeResult: string = '';
	public codeTypeUserSearch = '';
	public iAccess: Array<AccessI>;
	public listAccess: Array<MenuI>

	constructor(
		private modalService: NgbModal,
		private typeUserService: TypeUsersService,
		private toast: ToastrService,
		private formBuilder: FormBuilder,
		private menuService: MenuService
	) {
		this.fTuserCreate = this.formUserCreate();
		this.fTuserUpdate = this.formTypeUserUpdate();
		this.fNewAccess = this.formCreateAccess();
	}

	ngOnInit(): void {
		this.getAlltypeUser();
		this.getAlltypeUserActive();
	}

	/* manager modals */
	open(content) {
		this.modalService
			.open(content, { size: "lg", centered: false })
			.result.then(
				(result) => { this.closeResult = "Closed with: $result"; },
				(reason) => { this.closeResult = "Dismissed $this.getDismissReason(reason)"; }
			);
	}

	getDismissReason(reason: any) {
		this.modalService.dismissAll(reason);
	}

	formUserCreate() {
		return this.formBuilder.group({
			name: ['', Validators.required]
		})
	}

	formCreateAccess() {
		return this.formBuilder.group({
			codeTypeUser: ['', Validators.required],
			codeAccess: ['', Validators.required]
		})
	}

	formTypeUserUpdate() {
		return this.formBuilder.group({
			name: ['', Validators.required],
			state: ['', Validators.required]
		})
	}



	getAlltypeUser() {
		this.typeUserService.getAllTypeUser().subscribe(res => { this.typeUser = res; })
	}


	getAlltypeUserActive() {
		this.typeUserService.getTypeUser(1).subscribe(res => { this.typeUserActive = res; })
	}

	getTypeUser(code) {
		this.codeTypeUser = this.typeUser[code].code;
		this.fTuserUpdate.patchValue({
			name: this.typeUser[code].name,
			state: this.typeUser[code].state
		})
	}

	createTypeUser(event: Event) {
		event.preventDefault();
		if (this.fTuserCreate.valid) {
			this.typeUserService.postTypeUser(this.fTuserCreate.value).subscribe(res => {
				let tp: any = res;
				this.toast.success(tp.typeUser, 'New type user', { timeOut: 5000 });
				this.fTuserCreate.reset();
				this.getAlltypeUser();
				this.getAlltypeUserActive();
				this.getDismissReason('Close click');
			}, error => {
				let tp: any = error.error;
				this.toast.error(tp.error, 'Error', { timeOut: 10000 })
			})
		} else {
			this.toast.error(`You must complete all the fields...`, 'Error', { timeOut: 10000 })
		}
	}

	updateTypeUser(event: Event) {
		event.preventDefault();
		if (this.fTuserUpdate.valid) {
			this.typeUserService.updateTypeUser(this.codeTypeUser, this.fTuserUpdate.value).subscribe(res => {
				let tp: any = res
				this.toast.success(tp.typeUser, 'Updating', { timeOut: 5000 })
				this.fTuserUpdate.reset();
				this.getAlltypeUser();
				this.getAlltypeUserActive();
				this.getDismissReason('Close click');
			}, error => {
				let tp: any = error.error;
				this.toast.error(tp.error, 'Error', { timeOut: 10000 })
			})
		} else {
			this.toast.error(`You must complete all the fields...`, 'Error', { timeOut: 10000 })
		}
	}





	/* manager for menu */
	getAllAccess(code) {
		this.menuService.getAccess(code).subscribe(res => {
			this.iAccess = res;
		}, error => {
			let errors: any = error.error;
			this.toast.error(`${errors.error}`, 'Error', { timeOut: 10000 })
		})
	}

	updateMenu(codeMenu, state, codeTypeUser: number) {
		let newState = 0;
		if (state == 1)
			newState = 2;

		if (state == 2)
			newState = 1;

		this.menuService.updateMenu(codeMenu, { state: newState }).subscribe(res => {
			let m: any = res;
			this.toast.success(m.menu, 'Update menu', { timeOut: 5000 })
			this.getAllAccess(codeTypeUser);
		}, error => {
			let errors: any = error.error;
			this.toast.warning(errors.error, 'Error updating menu', { timeOut: 10000 })
		})
	}

	getAllAcess() {
		this.menuService.getAllAccess().subscribe(res => {
			this.listAccess = res;
		}, error => {
			let errors: any = error.error;
			this.toast.error(errors.error, 'Error assigment menu', { timeOut: 10000 })
		})
	}

	createNewAccess(event: Event) {
		event.preventDefault();
		if (this.fNewAccess.valid) {
			this.menuService.newAssigmenMenu(this.fNewAccess.value).subscribe(res => {
				let m: any = res;
				this.toast.success(m.menu, 'correct menu assignment', { timeOut: 10000 })
				this.fNewAccess.reset();
				this.getDismissReason('Close click');
			}, error => {
				let errors: any = error.error;
				this.toast.error(errors.error, 'Error assigment menu', { timeOut: 5000 })
			})
		} else {
			this.toast.error('You must select the type of user and access to add...', 'Error assigment menu', { timeOut: 10000 })
		}
	}

}
