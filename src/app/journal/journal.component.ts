import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { LoggerService } from '../common/logger.service';
import { NotificationService } from '../common/notification/notification.service';
import { AppStorageService } from '../common/storage.service';
import { ToolsService } from '../common/tools.service';
import { Journal, JournalLevel } from './journal.type';

const LEVEL_PAD = "     ";
const NAME_PAD = "                    ";
@Component({
  selector: 'app-journal',
  templateUrl: './journal.component.html',
  styleUrls: ['./journal.component.scss']
})
export class JournalComponent implements OnInit {

  selectedValue: string;
  listLines: string;
  title: string = "Journal interne";

  selectedLevel: JournalLevel;

  private search: string;
  searchControl: FormControl = new FormControl('');

  get journal_on(): boolean {
    return this.selectedValue == "on";
  }

  levels: Array<JournalItem>;

  constructor(loggerService: LoggerService, private storageService: AppStorageService,
    private tools: ToolsService, private notificationService: NotificationService) {

    let activateJournal = loggerService.isJournalActivated();
    this.selectedValue = activateJournal ? "on" : "off";
    this.selectedLevel = storageService.restoreLogLevel();

    this.buildTitre();

    this.refreshJournal();

    this.searchControl.valueChanges.subscribe(

      (value: string) => this.onChangeSearch(value)
    )

  }

  ngOnInit(): void {

    this.levels = new Array<JournalItem>();
    for (const level in Object.keys(JournalLevel)) {
      if (typeof JournalLevel[level] !== "string") {
        continue;
      }
      let journalItem: JournalItem = { value: Number(level), viewValue: JournalLevel[Number(level)] };
      this.levels.push(journalItem);
    }
  }

  private buildTitre(): void {

    if (this.journal_on) {
      this.title = "Journal interne actif";
    } else {
      this.title = "Journal interne inactif";
    }
  }

  onChangeSearch(value: string): void {

    if (value && value.length >= 3) {
      this.search = value;
      this.refreshJournal();
    } else if (this.search) {
      this.search = null;
      this.refreshJournal();
    }

  }


  onChangeValue(): void {
    this.buildTitre();
    this.notificationService.activateJournal(this.journal_on);
  }

  onChangeLevel(): void {
    this.storageService.storeLogLevel(this.selectedLevel);
    this.refreshJournal();
  }

  clearJournal(): void {
    this.storageService.clearLogs();
    this.listLines = "";
  }

  refreshJournal(): void {

    this.listLines = "";
    let logs: Array<Journal> = this.storageService.restoreLogs();

    logs.filter(journal => journal.level <= this.selectedLevel)
      .filter(journal => this.containsValue(journal, this.search))
      .forEach(
        (j: Journal) => this.listLines += "\n" + this.ecrireLine(j)
      );

  }

  private containsValue(journal: Journal, search?: string): boolean {

    if (search) {

      let result: boolean = journal.message.indexOf(search) > -1;
      if (!result) {
        result = journal.caller.indexOf(search) > -1
      }

      return result;

    } else {
      return true;
    }
  }

  private ecrireLine(journal: Journal): string {

    let level: string = this.tools.pad(LEVEL_PAD, JournalLevel[journal.level], false);
    let date: string = this.tools.formatShortDateAndTime(journal.timestampSec);
    let caller: string = this.tools.pad(NAME_PAD, journal.caller, false);
    return "[" + level + "] " + caller + ": " + date + " - " + journal.message;
  }

}

interface JournalItem {

  value: number;
  viewValue: string;
}

