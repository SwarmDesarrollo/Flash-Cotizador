import { Injectable } from '@angular/core';
import { CanActivate, CanActivateChild, CanLoad, Route, UrlSegment, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Router } from '@angular/router';

@Injectable({
    providedIn: 'root'
})
export class GuardGuard implements CanActivate, CanActivateChild, CanLoad {
    constructor(private router: Router) { }
    canActivate() {
        if (!sessionStorage.getItem("validate")) {
            this.router.navigate(['/']);
            return false;
        }
        return true;
    }
    canActivateChild() {
        if (!sessionStorage.getItem("validate")) {
            this.router.navigate(['/']);
            return false;
        }
        return true;
    }
    canLoad() {
        if (!sessionStorage.getItem("validate")) {
            this.router.navigate(['/']);
            return false;
        }
        return true;
    }
}
