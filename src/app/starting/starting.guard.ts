import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { TrajetService } from '../trajets/trajet.service';
import { TrajetState } from '../trajets/trajet.type';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class StartingGuard implements CanActivate {

  constructor(private trajetService: TrajetService, private router: Router) { }


  // acces à la page starting uniquement si pas de dernier trajet
  // ou bien dernier trajet ended.
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    return this.trajetService.compareEtatDernierTrajet(TrajetState.ended).pipe(
      map((noTrajetOrTrajetEnded: boolean) => {

        if (noTrajetOrTrajetEnded) {
          return true;
        } else {
          return this.router.parseUrl("/go-accueil");
        }

      }));

  }

}
