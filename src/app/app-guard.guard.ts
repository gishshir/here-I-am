import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AccountService } from './account/account.service';

@Injectable({
  providedIn: 'root'
})
export class AppGuardGuard implements CanActivate {

  constructor(private accountService: AccountService, private router: Router) { }


  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    console.log("App-Guard#canActivate called")
    let url: string = state.url;
    return this.checkLogin(url);
  }

  checkLogin(url: string): true | UrlTree {

    if (this.accountService.isLoggedIn) { return true; }

    // stockage de l'url pour la redirection avec login
    this.accountService.redirectUrl = url;

    // redirect to the login page
    console.log("redirect to the login page");
    return this.router.parseUrl("/go-login");

  }

}
