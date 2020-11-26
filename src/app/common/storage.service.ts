import { Inject, Injectable } from '@angular/core';
import { LOCAL_STORAGE, StorageService } from 'ngx-webstorage-service';
import { AppPosition } from '../trajets/position.type';
import { Trajet } from '../trajets/trajet.type';
import { Journal, JournalLevel } from '../journal/journal.type';
import { User } from '../account/user.type';
import { NotificationService } from './notification/notification.service';

// Attention prendre en compte plusieurs utilisateurs différents sur une meme machine...
@Injectable({
  providedIn: 'root'
})
export class AppStorageService {

  private currentUser: User;

  constructor(@Inject(LOCAL_STORAGE) private storage: StorageService,
    private notificationService: NotificationService) {

    this.notificationService.changeUser$.subscribe(
      (user: User | null) => this.currentUser = user
    );


  }

  private prefix(key: string): string {
    return "[key:" + key + "] ";
  }

  //=====================================================
  // JOURNAL
  //=====================================================
  storeLogLevel(level: JournalLevel): void {

    let key = this.buildKeyForJournalLevel();
    this.storage.set(key, JSON.stringify(level));
  }
  restoreLogLevel(): JournalLevel {
    let key = this.buildKeyForJournalLevel();
    if (this.storage.has(key)) {
      return JSON.parse(this.storage.get(key));
    } else {
      return JournalLevel.INFO;
    }
  }
  storeLogLine(journal: Journal): void {

    let listLines: Array<Journal> = this.restoreLogs();
    listLines.push(journal);
    this.storeLogs(listLines);
  }
  private storeLogs(listLines: Array<Journal>): void {

    let key: string = this.buildKeyForJournal();
    this.storage.set(key, JSON.stringify(listLines));
  }
  restoreLogs(): Array<Journal> {

    let key: string = this.buildKeyForJournal();
    let listLines: Array<Journal> = new Array<Journal>();

    if (this.storage.has(key)) {
      listLines = JSON.parse(this.storage.get(key));
    }

    return listLines;
  }

  clearLogs(): void {

    let key: string = this.buildKeyForJournal();
    this.storage.remove(key);
  }

  //=====================================================
  // POSITIONS
  //=====================================================
  restoreCurrentPositions(): Array<AppPosition> {

    let key: string = this.buildKeyForPositions();
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
      let key: string = this.buildKeyForPositions();
      let values = JSON.stringify(listPositions);
      console.log(this.prefix(key) + "storeCurrentPositions(): " + values);
      this.storage.set(key, values);
    }
  }

  restoreCurrentTrajet(): Trajet {

    let key: string = this.buildKeyForTrajet();
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
    let key: string = this.buildKeyForTrajet();
    console.log(this.prefix(key) + "store current trajet... " + trajet.id);

    let values = JSON.stringify(trajet);
    console.log(this.prefix(key) + "storeCurrentTrajet(): " + values);
    this.storage.set(key, values);
  }

  archiveTrajet(trajetToArchive: Trajet): void {
    let key: string = this.buildKeyForListTrajets();

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

    let key = this.buildKeyForListTrajets();
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
    let key = this.buildKeyForPositions();
    console.log(this.prefix(key) + "effacement des positions du trajet courant ");
    this.storage.remove(key);
  }
  clearLocalStorageTrajet(): void {
    let key = this.buildKeyForTrajet();
    console.log(this.prefix(key) + "effacement du trajet courant");
    this.storage.remove(key);
  }
  clearLocalStorageTrajetsArchives(): void {
    let key = this.buildKeyForListTrajets();
    console.log(this.prefix(key) + "effacement de la liste des trajets archives");
    this.storage.remove(key);
  }

  private buildKeyCurrentUser(): string {

    if (this.currentUser) {
      return "USER#" + this.currentUser.login;
    }
    return "USER#xx";
  }

  private buildKeyForJournalLevel() {
    return this.buildKeyCurrentUser() + "#LOG_LEVEL";
  }

  private buildKeyForJournal(): string {
    return this.buildKeyCurrentUser() + "#LOGS#";
  }

  private buildKeyForPositions(): string {
    return this.buildKeyCurrentUser() + "#POS#";
  }
  private buildKeyForTrajet(): string {
    return this.buildKeyCurrentUser() + "#TRAJET#";
  }

  private buildKeyForListTrajets(): string {
    return this.buildKeyCurrentUser() + "#LIST_TRAJET#";
  }
}
