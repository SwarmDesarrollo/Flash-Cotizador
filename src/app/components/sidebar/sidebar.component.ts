import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuService } from '../../services/menu/menu.service';


@Component({
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
    public menuItems: any[];
    public isCollapsed = true;

    constructor(private router: Router, private menuService: MenuService) { }

    ngOnInit() {
        let code = JSON.parse(sessionStorage.getItem('validate')).typeUser;
        this.menuService.getMenu(code).subscribe(res => {
            sessionStorage.setItem('menu', JSON.stringify(res))
            this.menuItems = res.filter(menuItem => menuItem);
            this.router.events.subscribe((event) => {
                this.isCollapsed = true;
            });
        }, error => {
            console.log(error)
        })
    }

    exit() {
        sessionStorage.removeItem('validate');
        this.router.navigate(['']);
    }
}
