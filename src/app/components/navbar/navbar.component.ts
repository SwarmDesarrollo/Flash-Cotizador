import { Component, OnInit, ElementRef } from '@angular/core';
import { MenuService } from '../../services/menu/menu.service';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { NgxSpinnerService } from "ngx-spinner";

@Component({
    selector: 'app-navbar',
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
    public focus;
    public listTitles: any[];
    public location: Location;
    public name: string = '';
    public titleHome: string = '';
    constructor(location: Location,
        private element: ElementRef,
        private router: Router,
        private menuService: MenuService,
        private spinner: NgxSpinnerService) {
        this.location = location;
    }

    ngOnInit() {
        // this.menu = JSON.parse(window.sessionStorage.getItem('menu'));
        this.name = JSON.parse(window.sessionStorage.getItem('validate')).user;

    }

    exit() {
        sessionStorage.clear();
        this.router.navigate([''])
    }

}
