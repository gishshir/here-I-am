import { Inject, Injectable } from '@angular/core';
import { LOCAL_STORAGE, StorageService } from 'ngx-webstorage-service';
import { AppPosition } from './position.type';
import { Trajet } from './trajet.type';

@Injectable({
  providedIn: 'root'
})
export class AppStorageService {

  constructor(@Inject(LOCAL_STORAGE) private storage: StorageService) { }

  restoreListePositions(trajetid: number): Array<AppPosition> {

    console.log("restoreListePositions...");

    let listPositions = new Array<AppPosition>();
    if (trajetid > 0) {
      let key: string = this.buildLocalStorageKeyForPositions(trajetid);
      if (this.storage.has(key)) {
        // on récupère les valeurs stockées sur ce même trajet
        listPositions = JSON.parse(this.storage.get(key));

        listPositions.forEach(p => console.log("position: [trajetid:" + p.timestamp + " - tmst: " + p.timestamp));
      } else {
        console.log(".. pas de positions stockées!")

      }
    }
    return listPositions;
  }
  saveListPositions(trajetid: number, listPositions: Array<AppPosition>): void {

    if (trajetid > 0 && listPositions && listPositions.length > 0) {
      let key: string = this.buildLocalStorageKeyForPositions(trajetid);
      let values = JSON.stringify(listPositions);
      console.log("saveListPositions(): " + values);
      this.storage.set(key, values);
    }
  }

  restoreTrajet(trajetid: number): Trajet {

    let key: string = this.buildLocalStorageKeyForTrajet(trajetid);
    let trajet: Trajet = null;
    if (this.storage.has(key)) {
      // on récupère les valeurs stockées sur ce même trajet
      trajet = JSON.parse(this.storage.get(key));

    } else {
      console.log(".. pas de trajet stocké!");
    }
    return trajet;
  }

  saveTrajet(trajet: Trajet): void {

    console.log("sauvegarde du trajet: " + trajet.id);
    let key: string = this.buildLocalStorageKeyForTrajet(trajet.id);
    let values = JSON.stringify(trajet);
    console.log("saveTrajet(): " + values);
    this.storage.set(key, values);
  }

  clearLocalStorageListPositions(trajetid: number): void {
    console.log("effacement des positions du trajet: " + trajetid);
    this.storage.remove(this.buildLocalStorageKeyForPositions(trajetid));
  }
  clearLocalStorageTrajet(trajetid: number): void {
    console.log("effacement du trajet: " + trajetid);
    this.storage.remove(this.buildLocalStorageKeyForTrajet(trajetid));
  }

  private buildLocalStorageKeyForPositions(trajetid: number): string {
    return "POSITIONS#" + trajetid;
  }
  private buildLocalStorageKeyForTrajet(trajetid: number): string {
    return "TRAJET#" + trajetid;
  }
}
