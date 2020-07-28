import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AccountService } from './account/account.service';
import { map } from 'rxjs/operators';
import { NotificationService } from './common/notification/notification.service';

@Injectable({
  providedIn: 'root'
})
export class AppGuardGuard implements CanActivate {

  constructor(private accountService: AccountService, private notificationService: NotificationService,
    private router: Router) {

    this.notificationService.closedSession$.subscribe({
      next: (value) => {
        this.checkLogin("go-accueil", true).subscribe(
          {
            next: (urlTree: UrlTree) => this.router.navigateByUrl(urlTree)
          }
        );
      }
    });
  }


  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    console.log("App-Guard#canActivate called")
    let url: string = state.url;
    return this.checkLogin(url, false);
  }

  checkLogin(url: string, forceControl: boolean): Observable<boolean | UrlTree> {


    return this.accountService.isUserLoggedIn(forceControl).pipe(

      map((loggedIn: boolean) => {

        if (loggedIn) {
          //(Obsevable<boolean>)
          return true;
        } else {
          // stockage de l'url pour la redirection avec login
          this.accountService.redirectUrl = url;
          // redirect to the login page (Obsevable<UrlTree>)
          console.log("redirect to the login page");
          return this.router.parseUrl("/go-login");
        }
      }
      )

    );

  }

}
