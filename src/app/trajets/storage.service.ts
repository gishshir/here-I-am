import { Inject, Injectable } from '@angular/core';
import { LOCAL_STORAGE, StorageService } from 'ngx-webstorage-service';
import { AccountService } from '../account/account.service';
import { AppPosition } from './position.type';
import { Trajet } from './trajet.type';

// Attention prendre en compte plusieurs utilisateurs différents sur une meme machine...
@Injectable({
  providedIn: 'root'
})
export class AppStorageService {

  constructor(@Inject(LOCAL_STORAGE) private storage: StorageService,
    private accountService: AccountService) { }

  private prefix(key: string): string {
    return "[key:" + key + "] ";
  }
  restoreCurrentPositions(): Array<AppPosition> {

    let key: string = this.buildLocalStorageKeyForPositions();
    console.log(this.prefix(key) + "restoreListePositions...");

    let listPositions = new Array<AppPosition>();


    if (this.storage.has(key)) {
      // on récupère les valeurs stockées sur ce même trajet
      listPositions = JSON.parse(this.storage.get(key));

      //listPositions.forEach(p => console.log("position: [trajetid:" + p.trajetid + " - tmst: " + p.timestamp));
    } else {
      console.log(".. pas de positions stockées!")

    }

    return listPositions;
  }
  storeCurrentPositions(listPositions: Array<AppPosition>): void {

    if (listPositions && listPositions.length > 0) {
      let key: string = this.buildLocalStorageKeyForPositions();
      let values = JSON.stringify(listPositions);
      console.log(this.prefix(key) + "storeCurrentPositions(): " + values);
      this.storage.set(key, values);
    }
  }

  restoreCurrentTrajet(): Trajet {

    let key: string = this.buildLocalStorageKeyForTrajet();
    console.log(this.prefix(key) + "restoreCurrentTrajet...");
    let trajet: Trajet = null;

    if (this.storage.has(key)) {
      // on récupère les valeurs stockées sur ce même trajet
      let value = this.storage.get(key);
      console.log(this.prefix(key) + "Récupération trajet courant: " + value);
      trajet = JSON.parse(value);

    } else {
      console.log(this.prefix(key) + ".. pas de trajet stocké!");
    }
    return trajet;
  }

  storeCurrentTrajet(trajet: Trajet): void {
    let key: string = this.buildLocalStorageKeyForTrajet();
    console.log(this.prefix(key) + "store current trajet... " + trajet.id);

    let values = JSON.stringify(trajet);
    console.log(this.prefix(key) + "storeCurrentTrajet(): " + values);
    this.storage.set(key, values);
  }

  archiveTrajet(trajetToArchive: Trajet): void {
    let key: string = this.buildLocalStorageKeyForListTrajets();

    console.log(this.prefix(key) + "archivage d'un trajet non enregistré en BDD... " + trajetToArchive.id);
    let list: Array<Trajet> = this.restoreListTrajetArchives();
    // on enlève le trajet si déjà archivé
    list = list.filter(t => t.id != trajetToArchive.id);
    list.push(trajetToArchive);

    let listJson = JSON.stringify(list);
    console.log(this.prefix(key) + "archiveTrajet(): " + listJson);
    this.storage.set(key, listJson);
  }
  restoreListTrajetArchives(): Array<Trajet> {

    let key = this.buildLocalStorageKeyForListTrajets();
    if (this.storage.has(key)) {

      let listJson = this.storage.get(key);
      let list: Array<Trajet> = JSON.parse(listJson);
      console.log(this.prefix(key) + "restoreListTrajetArchives(): " + listJson);
      return list;

    } else {
      return new Array<Trajet>();
    }
  }

  clearLocalStorageListPositions(): void {
    let key = this.buildLocalStorageKeyForPositions();
    console.log(this.prefix(key) + "effacement des positions du trajet courant ");
    this.storage.remove(key);
  }
  clearLocalStorageTrajet(): void {
    let key = this.buildLocalStorageKeyForTrajet();
    console.log(this.prefix(key) + "effacement du trajet courant");
    this.storage.remove(key);
  }
  clearLocalStorageTrajetsArchives(): void {
    let key = this.buildLocalStorageKeyForListTrajets();
    console.log(this.prefix(key) + "effacement de la liste des trajets archives");
    this.storage.remove(key);
  }

  private buildKeyCurrentUser(): string {

    let currentUser = this.accountService.getCurrentUser();
    if (currentUser) {
      return "USER#" + currentUser.login;
    }
    return "USER#xx";
  }

  private buildLocalStorageKeyForPositions(): string {
    return this.buildKeyCurrentUser() + "#POS#";
  }
  private buildLocalStorageKeyForTrajet(): string {
    return this.buildKeyCurrentUser() + "#TRAJET#";
  }

  private buildLocalStorageKeyForListTrajets(): string {
    return this.buildKeyCurrentUser() + "#LIST_TRAJET#";
  }
}
